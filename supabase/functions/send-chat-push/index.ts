import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: cors });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const publicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const privateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;
    const subject = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@badingtambayan.invalid";
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });

    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user || authData.user.is_anonymous) {
      return new Response(JSON.stringify({ error: "A signed-in account is required" }), { status: 401, headers: cors });
    }

    const { room_id, message_id } = await request.json();
    if (!room_id || !message_id) return new Response(JSON.stringify({ error: "Missing room_id or message_id" }), { status: 400, headers: cors });

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: message, error: messageError } = await admin
      .from("messages").select("id,room_id,user_id,content")
      .eq("id", message_id).eq("room_id", room_id).single();
    if (messageError || !message || message.user_id !== authData.user.id) {
      return new Response(JSON.stringify({ error: "Message not found or sender mismatch" }), { status: 403, headers: cors });
    }

    const { data: membership } = await admin.from("room_members")
      .select("user_id").eq("room_id", room_id).eq("user_id", authData.user.id).maybeSingle();
    if (!membership) return new Response(JSON.stringify({ error: "Not a member of this room" }), { status: 403, headers: cors });

    const { data: room } = await admin.from("rooms").select("room_name").eq("id", room_id).single();
    const { data: sender } = await admin.from("profiles").select("display_name").eq("user_id", authData.user.id).maybeSingle();
    const { data: members, error: membersError } = await admin.from("room_members")
      .select("user_id").eq("room_id", room_id).neq("user_id", authData.user.id);
    if (membersError) throw membersError;

    const recipientIds = (members || []).map((row) => row.user_id);
    if (!recipientIds.length) return new Response(JSON.stringify({ sent: 0 }), { headers: cors });

    const { data: subscriptions, error: subscriptionsError } = await admin
      .from("push_subscriptions").select("user_id,endpoint,subscription")
      .in("user_id", recipientIds);
    if (subscriptionsError) throw subscriptionsError;

    webpush.setVapidDetails(subject, publicKey, privateKey);
    const rawContent = String(message.content || "");
    const preview = rawContent.startsWith("[[PHOTO]]") ? "sent a photo 📷" : rawContent.slice(0, 110);
    const payload = JSON.stringify({
      title: room?.room_name || "Bading Tambayan",
      body: (sender?.display_name || "A tambay friend") + ": " + preview,
      roomId: String(room_id),
      url: "./"
    });

    let sent = 0;
    await Promise.all((subscriptions || []).map(async (row) => {
      try {
        await webpush.sendNotification(row.subscription, payload, { TTL: 60, urgency: "normal" });
        sent += 1;
      } catch (error) {
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await admin.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
        } else {
          console.warn("Push delivery failed:", error?.statusCode || error?.message);
        }
      }
    }));

    return new Response(JSON.stringify({ sent }), { headers: cors });
  } catch (error) {
    console.error("send-chat-push failed:", error);
    return new Response(JSON.stringify({ error: "Push delivery failed" }), { status: 500, headers: cors });
  }
});
