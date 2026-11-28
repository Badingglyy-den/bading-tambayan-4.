import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5.9.6";

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
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const publicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const privateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;
    const subject = Deno.env.get("VAPID_SUBJECT") || "https://badingglyy-den.github.io/bading-tambayan-4./";
    const admin = createClient(supabaseUrl, serviceKey);
    const authHeader = request.headers.get("Authorization") || "";
    const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });

    const jwks = createRemoteJWKSet(new URL(supabaseUrl + "/auth/v1/.well-known/jwks.json"));
    const { payload } = await jwtVerify(tokenMatch[1], jwks, {
      issuer: supabaseUrl + "/auth/v1",
      audience: "authenticated"
    });
    if (typeof payload.sub !== "string") throw new Error("JWT subject is missing");
    const { data: userResult, error: userError } = await admin.auth.admin.getUserById(payload.sub);
    if (userError || !userResult.user || userResult.user.is_anonymous) {
      return new Response(JSON.stringify({ error: "A signed-in account is required" }), { status: 401, headers: cors });
    }
    const senderId = userResult.user.id;
    const { dm_message_id, sender_endpoint } = await request.json();
    if (!dm_message_id) return new Response(JSON.stringify({ error: "Missing dm_message_id" }), { status: 400, headers: cors });

    const { data: message, error: messageError } = await admin.from("dm_messages")
      .select("id,conversation_id,sender_id,content")
      .eq("id", dm_message_id).single();
    if (messageError || !message || message.sender_id !== senderId) {
      return new Response(JSON.stringify({ error: "Message not found or sender mismatch" }), { status: 403, headers: cors });
    }

    const { data: participants, error: participantError } = await admin.from("dm_participants")
      .select("user_id").eq("conversation_id", message.conversation_id);
    if (participantError) throw participantError;
    const participantIds = (participants || []).map(row => row.user_id);
    if (!participantIds.includes(senderId)) {
      return new Response(JSON.stringify({ error: "Not a participant in this conversation" }), { status: 403, headers: cors });
    }
    const recipientIds = participantIds.filter(id => id !== senderId);
    if (!recipientIds.length) return new Response(JSON.stringify({ sent: 0 }), { headers: cors });

    const [{ data: subscriptions, error: subscriptionsError }, { data: sender }] = await Promise.all([
      admin.from("push_subscriptions").select("user_id,endpoint,subscription").in("user_id", recipientIds),
      admin.from("chat_profiles").select("display_name").eq("user_id", senderId).maybeSingle()
    ]);
    if (subscriptionsError) throw subscriptionsError;

    const senderEndpoint = typeof sender_endpoint === "string" ? sender_endpoint : "";
    const recipientSubscriptions = (subscriptions || []).filter(row => !senderEndpoint || row.endpoint !== senderEndpoint);
    webpush.setVapidDetails(subject, publicKey, privateKey);
    const rawContent = String(message.content || "");
    const preview = rawContent.startsWith("[[PHOTO]]") ? "sent a photo 📷" : rawContent.slice(0, 110);
    const payloadJson = JSON.stringify({
      title: "Private message from " + (sender?.display_name || "A tambay friend"),
      body: preview || "You received a private message.",
      messageId: String(message.id),
      conversationId: String(message.conversation_id),
      url: "https://badingglyy-den.github.io/bading-tambayan-4./"
    });

    let sent = 0;
    await Promise.all(recipientSubscriptions.map(async row => {
      try {
        await webpush.sendNotification(row.subscription, payloadJson, { TTL: 60, urgency: "high" });
        sent += 1;
      } catch (error) {
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await admin.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
        } else {
          console.warn("Private-message push failed:", error?.statusCode || error?.message);
        }
      }
    }));
    return new Response(JSON.stringify({ sent }), { headers: cors });
  } catch (error) {
    console.error("send-dm-push failed:", error);
    return new Response(JSON.stringify({ error: "Private-message push delivery failed" }), { status: 500, headers: cors });
  }
});
