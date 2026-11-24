(() => {
  "use strict";

  const SUPABASE_URL = "https://lieisalrqexbqvgjwekv.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sDPQI0S05ykOaMye6_CrzA_zMOskR0P";

  const style = document.createElement("style");
  style.textContent = `
    #onlineTambayan { margin: 28px 0 42px; }
    #onlineTambayan .online-panel {
      background: var(--panel, #21183b);
      border: 1px solid rgba(190,160,255,.22);
      border-radius: 22px;
      padding: 22px;
      color: var(--text, #fff);
    }
    #onlineTambayan h3 { margin: 0 0 8px; }
    #onlineTambayan p { line-height: 1.55; }
    #onlineTambayan .online-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
      gap: 12px;
      margin: 16px 0;
    }
    #onlineTambayan input, #onlineTambayan button { font: inherit; }
    #onlineTambayan input {
      width: 100%; box-sizing: border-box; border-radius: 12px;
      border: 1px solid rgba(190,160,255,.3); padding: 12px;
      background: rgba(255,255,255,.07); color: inherit; margin: 5px 0;
    }
    #onlineTambayan button {
      cursor: pointer; border: 0; border-radius: 12px;
      padding: 11px 15px; margin: 5px 5px 5px 0;
      background: #a98bff; color: #1b1231; font-weight: 700;
    }
    #onlineTambayan button:disabled { opacity: .5; cursor: not-allowed; }
    #onlineTambayan .online-muted { opacity: .75; font-size: .92rem; }
    #onlineTambayan .online-status {
      min-height: 1.4em; color: #cbbaff; font-size: .92rem;
    }
    #onlineTambayan .online-room-list {
      display: grid; gap: 8px; margin: 12px 0 18px;
    }
    #onlineTambayan .online-room-card {
      display: flex; align-items: center; justify-content: space-between;
      gap: 10px; width: 100%; text-align: left; margin: 0;
      background: rgba(255,255,255,.06); color: inherit;
      border: 1px solid rgba(190,160,255,.2);
    }
    #onlineTambayan .online-room-card.active {
      border-color: #a98bff; background: rgba(169,139,255,.16);
    }
    #onlineTambayan .online-room-card span { display: block; }
    #onlineTambayan .online-room-card small { opacity: .7; font-weight: 400; }
    #onlineTambayan .online-room {
      display: none; margin-top: 18px;
      border-top: 1px solid rgba(190,160,255,.2); padding-top: 18px;
    }
    #onlineTambayan .online-room-top {
      display: flex; flex-wrap: wrap; align-items: center;
      justify-content: space-between; gap: 10px;
    }
    #onlineTambayan .online-room-actions {
      display: flex; flex-wrap: wrap; gap: 6px;
    }
    #onlineTambayan .online-danger-button {
      background: #7f354e; color: #fff;
      border: 1px solid rgba(255,180,200,.35);
    }
    #onlineTambayan .online-code {
      font-size: 1.2rem; letter-spacing: .18em;
      font-weight: 800; color: #d9c9ff;
    }
    #onlineTambayan .online-columns {
      display: grid; grid-template-columns: minmax(0,2fr) minmax(180px,1fr);
      gap: 14px; margin-top: 14px;
    }
    #onlineTambayan .online-box {
      border: 1px solid rgba(190,160,255,.2);
      border-radius: 16px; padding: 14px; min-width: 0;
    }
    #onlineTambayan .online-messages {
      height: 270px; overflow: auto; display: flex;
      flex-direction: column; gap: 9px; padding: 5px 0;
    }
    #onlineTambayan .online-message {
      background: rgba(255,255,255,.07); padding: 9px 11px;
      border-radius: 12px; overflow-wrap: anywhere;
    }
    #onlineTambayan .online-message small {
      display: block; opacity: .85; margin-bottom: 5px;
    }
    #onlineTambayan .online-message strong { color: #d9c9ff; }
    #onlineTambayan .online-message-receipt {
      display: block; text-align: right; margin-top: 5px;
      color: #cbbaff; font-size: .78rem; opacity: .9;
    }
    #onlineTambayan .online-members {
      display: flex; flex-direction: column; gap: 8px;
    }
    #onlineTambayan .online-member {
      padding: 8px; border-radius: 10px;
      background: rgba(255,255,255,.06);
    }
    #onlineTambayan .online-compose {
      display: flex; gap: 6px; align-items: center;
    }
    #onlineTambayan .online-compose input { flex: 1; }
    #onlineTambayan .online-reactions button { font-size: 1.15rem; padding: 7px 10px; }
    #onlineTambayan .online-typing {
      min-height: 22px; font-size: .86rem; color: #cbbaff;
      font-style: italic; margin: 3px 0 8px;
    }
    @media(max-width:620px) {
      #onlineTambayan .online-columns { grid-template-columns: 1fr; }
      #onlineTambayan .online-panel { padding: 16px; }
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement("section");
  section.id = "onlineTambayan";
  section.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">WORLD 06 · REAL-TIME ONLINE</p>
        <h2>Online Tambayan</h2>
      </div>
      <span class="section-note">Meet your fellow tambays</span>
    </div>
    <div class="online-panel">
      <p class="online-muted">Create a private room, share its six-character code, and chat live with friends.</p>
      <div class="online-grid">
        <div>
          <h3>🪩 Your online profile</h3>
          <label for="onlineName">Nickname</label>
          <input id="onlineName" maxlength="24" placeholder="Your tambayan nickname">
          <label for="onlineAvatar">Avatar (emoji)</label>
          <input id="onlineAvatar" maxlength="8" value="💜">
          <button id="onlineSaveProfile">Save profile</button>
        </div>
        <div>
          <h3>✨ Create a room</h3>
          <input id="onlineRoomName" maxlength="40" placeholder="Give your room a name">
          <button id="onlineCreateRoom">Create private room</button>
          <h3 style="margin-top:14px">🔑 Join with a code</h3>
          <input id="onlineJoinCode" maxlength="6" placeholder="Six-character code">
          <button id="onlineJoinRoom">Join room</button>
        </div>
      </div>
      <p class="online-status" id="onlineStatus" role="status" aria-live="polite">Connecting to the online tambayan…</p>
      <div class="online-box" id="onlineMyRoomsBox">
        <h3>🗂️ My Chatrooms</h3>
        <p class="online-muted">Your joined rooms are saved here. Choose one to switch conversations.</p>
        <div class="online-room-list" id="onlineRoomList"><span class="online-muted">Loading your rooms…</span></div>
      </div>
      <div class="online-room" id="onlineRoom">
        <div class="online-room-top">
          <div>
            <p class="online-muted">YOU'RE IN</p>
            <h3 id="onlineRoomTitle">Room</h3>
            <div class="online-code" id="onlineRoomCode"></div>
          </div>
          <div class="online-room-actions">
            <button type="button" id="onlineLeaveRoom">Back to room list</button>
            <button type="button" id="onlineLeaveMembership" class="online-danger-button">Leave chatroom</button>
          </div>
        </div>
        <div class="online-columns">
          <div class="online-box">
            <h3>💬 Live chat</h3>
            <div class="online-messages" id="onlineMessages" aria-live="polite"></div>
            <p class="online-typing" id="onlineTypingIndicator" aria-live="polite"></p>
            <form class="online-compose" id="onlineMessageForm">
              <input id="onlineMessageInput" maxlength="1000" placeholder="Say something..." required>
              <button type="submit">Send</button>
            </form>
            <div class="online-reactions">
              <button type="button" data-reaction="💜">💜</button>
              <button type="button" data-reaction="😂">😂</button>
              <button type="button" data-reaction="😭">😭</button>
              <button type="button" data-reaction="🫶">🫶</button>
              <button type="button" data-reaction="✨">✨</button>
            </div>
          </div>
          <div class="online-box">
            <h3>🟢 Online members</h3>
            <div class="online-members" id="onlineMembers"><span class="online-muted">Waiting for members…</span></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const anchor = document.querySelector(".hangout-layout");
  if (anchor) anchor.insertAdjacentElement("afterend", section);
  else document.querySelector("main")?.appendChild(section);

  const $ = id => document.getElementById(id);
  let client = null;
  let currentUser = null;
  let currentRoom = null;
  let roomChannel = null;
  let profile = { display_name: "Tambay", avatar: "💜" };
  let messageIds = new Set();
  const profileCache = new Map();
  const typingUsers = new Map();
  const seenMessageIds = new Set();
  const receiptMessageIds = new Set();
  let typingTimer = null;
  let isTyping = false;
  let joinedRooms = [];

  // Keep the last active room per anonymous Supabase account on this device.
  const ACTIVE_ROOM_KEY = () => "tambayan_active_room_" + (currentUser?.id || "guest");

  function saveActiveRoom(room) {
    try {
      if (room) localStorage.setItem(ACTIVE_ROOM_KEY(), JSON.stringify({ id: room.id }));
      else localStorage.removeItem(ACTIVE_ROOM_KEY());
    } catch (error) {
      console.warn("Could not save active room:", error);
    }
  }

  function getSavedActiveRoom() {
    try {
      return JSON.parse(localStorage.getItem(ACTIVE_ROOM_KEY()) || "null");
    } catch (_) {
      return null;
    }
  }

  function status(message, error = false) {
    $("onlineStatus").textContent = message;
    $("onlineStatus").style.color = error ? "#ffaaaa" : "#cbbaff";
  }

  function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function loadSupabase() {
    return new Promise((resolve, reject) => {
      if (window.supabase?.createClient) return resolve();
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Could not load Supabase."));
      document.head.appendChild(script);
    });
  }

  async function initialize() {
    try {
      await loadSupabase();
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      if (sessionData.session) currentUser = sessionData.session.user;
      else {
        const { data, error } = await client.auth.signInAnonymously();
        if (error) throw error;
        currentUser = data.user;
      }

      const localName = document.getElementById("welcomeName")?.textContent || "Tambay";
      profile = {
        display_name: localName.trim().slice(0, 24) || "Tambay",
        avatar: "💜"
      };

      const { data: savedProfile, error: profileError } = await client
        .from("profiles").select("display_name,avatar")
        .eq("user_id", currentUser.id).maybeSingle();
      if (profileError) throw profileError;
      if (savedProfile) profile = savedProfile;
      $("onlineName").value = profile.display_name;
      $("onlineAvatar").value = profile.avatar;
      await saveProfile(false);
      await refreshRoomList();
      status("You're connected! Create a room or join with a code. 💜");

      // Restore the last room only if this account is still a member.
      const savedRoom = getSavedActiveRoom();
      if (savedRoom?.id) {
        const room = joinedRooms.find(item => item.id === savedRoom.id);
        if (room) {
          try {
            await enterRoom(room.id, room.room_code, room.room_name);
          } catch (restoreError) {
            console.warn("Could not restore previous room:", restoreError);
            status("Connected! Choose a room from My Chatrooms to continue.");
          }
        } else {
          saveActiveRoom(null);
        }
      }
    } catch (error) {
      console.error(error);
      status(error.message || "Connection failed.", true);
    }
  }

  async function saveProfile(showNotice = true) {
    if (!client || !currentUser) return;
    const name = $("onlineName").value.trim().slice(0, 24) || "Tambay";
    const avatar = $("onlineAvatar").value.trim().slice(0, 8) || "💜";
    const { error } = await client.from("profiles").upsert({
      user_id: currentUser.id, display_name: name, avatar
    }, { onConflict: "user_id" });
    if (error) throw error;
    profile = { display_name: name, avatar };
    profileCache.clear();
    if (roomChannel && currentRoom) {
      await roomChannel.track({
        user_id: currentUser.id, display_name: profile.display_name,
        avatar: profile.avatar, online_at: new Date().toISOString()
      });
      renderMembers();
    }
    if (showNotice) status("Online profile saved! ✨");
  }

  async function refreshRoomList() {
    if (!client || !currentUser) return;

    const list = $("onlineRoomList");
    list.innerHTML = '<span class="online-muted">Loading your rooms…</span>';

    const { data: memberships, error: memberError } = await client
      .from("room_members")
      .select("room_id")
      .eq("user_id", currentUser.id);

    if (memberError) {
      console.warn("Could not load joined rooms:", memberError);
      list.innerHTML = '<span class="online-muted">Could not load your rooms. You can still join with a code.</span>';
      return;
    }

    const ids = [...new Set((memberships || []).map(row => row.room_id).filter(Boolean))];
    if (!ids.length) {
      joinedRooms = [];
      renderRoomList();
      return;
    }

    const { data: rooms, error: roomsError } = await client
      .from("rooms")
      .select("id,room_code,room_name")
      .in("id", ids);

    if (roomsError) {
      console.warn("Could not load room details:", roomsError);
      list.innerHTML = '<span class="online-muted">Could not load room details. Please refresh.</span>';
      return;
    }

    joinedRooms = rooms || [];
    renderRoomList();
  }

  function renderRoomList() {
    const list = $("onlineRoomList");
    if (!list) return;

    if (!joinedRooms.length) {
      list.innerHTML = '<span class="online-muted">No chatrooms yet. Create one or join using a code!</span>';
      return;
    }

    list.innerHTML = joinedRooms.map(room => `
      <button type="button"
        class="online-room-card ${currentRoom?.id === room.id ? "active" : ""}"
        data-open-room="${safeText(room.id)}">
        <span>💬 <strong>${safeText(room.room_name || "Tambayan Room")}</strong>
          <small>Code: ${safeText(room.room_code || "")}</small>
        </span>
        <span aria-hidden="true">›</span>
      </button>
    `).join("");

    list.querySelectorAll("[data-open-room]").forEach(button => {
      button.onclick = async () => {
        const room = joinedRooms.find(item => item.id === button.dataset.openRoom);
        if (!room) return;
        try {
          await enterRoom(room.id, room.room_code, room.room_name);
        } catch (error) {
          console.error(error);
          status(error.message || "Couldn't open room.", true);
        }
      };
    });
  }

  async function createRoom() {
    if (!client) return status("Still connecting. Please wait.", true);
    const name = $("onlineRoomName").value.trim() || "Tambayan Room";
    try {
      await saveProfile(false);
      const { data, error } = await client.rpc("create_room", { p_name: name });
      if (error) throw error;
      const result = Array.isArray(data) ? data[0] : data;
      if (!result?.room_id || !result?.room_code) throw new Error("Unexpected room response.");
      await enterRoom(result.room_id, result.room_code, name);
    } catch (error) {
      console.error(error);
      status(error.message || "Couldn't create room.", true);
    }
  }

  async function joinRoom() {
    if (!client) return status("Still connecting. Please wait.", true);
    const code = $("onlineJoinCode").value.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) return status("Enter the six-character room code.", true);
    try {
      await saveProfile(false);
      const { data, error } = await client.rpc("join_room", { p_code: code });
      if (error) throw error;
      const roomId = typeof data === "string" ? data :
        Array.isArray(data) ? data[0] : data?.room_id;
      if (!roomId) throw new Error("Couldn't read room ID.");
      const { data: room, error: roomError } = await client
        .from("rooms").select("id,room_code,room_name").eq("id", roomId).single();
      if (roomError) throw roomError;
      await enterRoom(room.id, room.room_code, room.room_name);
    } catch (error) {
      console.error(error);
      status(error.message || "Couldn't join room.", true);
    }
  }

  async function enterRoom(roomId, code, roomName) {
    await leaveRoom(false);
    currentRoom = { id: roomId, code, name: roomName };
    saveActiveRoom(currentRoom);
    $("onlineRoom").style.display = "block";
    renderRoomList();
    $("onlineRoomTitle").textContent = roomName;
    $("onlineRoomCode").textContent = code;
    $("onlineTypingIndicator").textContent = "";
    messageIds = new Set();
    seenMessageIds.clear();
    receiptMessageIds.clear();
    profileCache.clear();
    typingUsers.clear();

    await loadMessages();
    await refreshRoomList();
    renderRoomList();

    roomChannel = client.channel("online-room-" + roomId, {
      config: { presence: { key: currentUser.id }, broadcast: { self: false, ack: true } }
    });

    roomChannel
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: "room_id=eq." + roomId
      }, async payload => { await appendMessage(payload.new); })
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "message_reads"
      }, payload => { handleReadReceipt(payload.new); })
      .on("presence", { event: "sync" }, renderMembers)
      .on("broadcast", { event: "typing" }, event => { handleTyping(event?.payload); })
      .subscribe(async state => {
        if (state === "SUBSCRIBED") {
          await roomChannel.track({
            user_id: currentUser.id, display_name: profile.display_name,
            avatar: profile.avatar, online_at: new Date().toISOString()
          });
          status("You're in " + roomName + ". Share code " + code + " with friends!");
        } else if (state === "CHANNEL_ERROR") {
          status("Room connection error. Please rejoin.", true);
        }
      });
  }

  async function loadMessages() {
    $("onlineMessages").innerHTML = '<span class="online-muted">Loading chat…</span>';
    const { data, error } = await client.from("messages")
      .select("id,user_id,content,created_at")
      .eq("room_id", currentRoom.id)
      .order("created_at", { ascending: true }).limit(100);
    if (error) throw error;

    $("onlineMessages").innerHTML = "";
    const messages = data || [];
    for (const message of messages) {
      if (message.user_id !== currentUser.id) continue;
      const { data: reads, error: readsError } = await client
        .from("message_reads").select("message_id,user_id")
        .eq("message_id", message.id);
      if (readsError) console.warn("Could not load read receipts:", readsError);
      if ((reads || []).some(read => read.user_id !== currentUser.id)) {
        receiptMessageIds.add(String(message.id));
      }
    }
    for (const message of messages) await appendMessage(message);
  }

  async function getMessageProfile(userId) {
    if (!userId) return { display_name: "Tambay", avatar: "💜" };
    if (userId === currentUser.id) return profile;
    if (profileCache.has(userId)) return profileCache.get(userId);
    const fallback = { display_name: "Tambay", avatar: "💜" };
    const { data, error } = await client.from("profiles")
      .select("display_name,avatar").eq("user_id", userId).maybeSingle();
    const result = !error && data ? data : fallback;
    profileCache.set(userId, result);
    return result;
  }

  function updateReceiptDisplay(messageId) {
    const item = $("onlineMessages").querySelector(
      '[data-message-id="' + CSS.escape(String(messageId)) + '"]'
    );
    if (!item) return;
    const receipt = item.querySelector(".online-message-receipt");
    if (!receipt) return;
    receipt.textContent = receiptMessageIds.has(String(messageId)) ? "✓✓ Seen" : "✓ Sent";
  }

  function handleReadReceipt(read) {
    if (!read || !read.message_id || read.user_id === currentUser.id) return;
    const id = String(read.message_id);
    receiptMessageIds.add(id);
    updateReceiptDisplay(id);
  }

  async function markMessageRead(message) {
    if (!message || message.user_id === currentUser.id) return;
    const id = String(message.id);
    if (seenMessageIds.has(id)) return;
    seenMessageIds.add(id);
    const { error } = await client.from("message_reads").upsert({
      message_id: message.id,
      user_id: currentUser.id
    }, { onConflict: "message_id,user_id", ignoreDuplicates: true });
    if (error) {
      seenMessageIds.delete(id);
      console.warn("Could not mark message as seen:", error);
    }
  }

  async function appendMessage(message) {
    if (!message) return;
    const id = String(message.id);
    if (messageIds.has(id)) return;
    messageIds.add(id);

    const mine = message.user_id === currentUser.id;
    const sender = await getMessageProfile(message.user_id);
    const who = mine ? profile.display_name : sender.display_name;
    const avatar = mine ? profile.avatar : sender.avatar;
    const item = document.createElement("div");
    item.className = "online-message";
    item.dataset.messageId = id;

    const time = message.created_at ? new Date(message.created_at).toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit"
    }) : "";

    item.innerHTML = `
      <small>
        <span aria-hidden="true">${safeText(avatar || "💜")}</span>
        <strong>${safeText(who || "Tambay")}</strong>
        · ${safeText(time)}
      </small>
      <div>${safeText(message.content)}</div>
      ${mine ? `<span class="online-message-receipt">${receiptMessageIds.has(id) ? "✓✓ Seen" : "✓ Sent"}</span>` : ""}
    `;
    $("onlineMessages").appendChild(item);
    $("onlineMessages").scrollTop = $("onlineMessages").scrollHeight;
    if (!mine) await markMessageRead(message);
  }

  function renderMembers() {
    if (!roomChannel) return;
    const state = roomChannel.presenceState();
    const people = Object.values(state).flat().filter((person, index, all) =>
      all.findIndex(other => other.user_id === person.user_id) === index
    );
    $("onlineMembers").innerHTML = people.length ? people.map(person => `
      <div class="online-member">
        ${safeText(person.avatar || "💜")}
        ${safeText(person.display_name || "Tambay")}
        ${person.user_id === currentUser.id ? "<small>(you)</small>" : ""}
      </div>
    `).join("") : '<span class="online-muted">You\'re the first one here. Invite a friend!</span>';
  }

  function normalizeTypingName(value) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (value && typeof value === "object") {
      const names = [
        value.display_name, value.name, value.nickname, value.username,
        value.user?.display_name, value.profile?.display_name
      ];
      for (const name of names) if (typeof name === "string" && name.trim()) return name.trim();
    }
    return "Someone";
  }

  function updateTypingDisplay() {
    const people = Array.from(typingUsers.values())
      .map(person => normalizeTypingName(person?.name)).filter(Boolean);
    const indicator = $("onlineTypingIndicator");
    if (!indicator) return;
    if (!people.length) indicator.textContent = "";
    else if (people.length === 1) indicator.textContent = "✨ " + people[0] + " is typing...";
    else if (people.length === 2) indicator.textContent = "✨ " + people[0] + " and " + people[1] + " are typing...";
    else indicator.textContent = "✨ Several people are typing...";
  }

  function handleTyping(payload) {
    const data = payload?.payload || payload;
    if (!data || typeof data !== "object" || !data.user_id) return;
    if (data.user_id === currentUser.id) return;
    const userId = data.user_id;
    if (typingUsers.has(userId)) {
      clearTimeout(typingUsers.get(userId).timer);
      typingUsers.delete(userId);
    }
    if (data.is_typing) {
      const timer = setTimeout(() => {
        typingUsers.delete(userId);
        updateTypingDisplay();
      }, 2500);
      typingUsers.set(userId, { name: normalizeTypingName(data.display_name), timer });
    }
    updateTypingDisplay();
  }

  async function broadcastTyping(typing) {
    if (!roomChannel || !currentRoom) return;
    try {
      const result = await roomChannel.send({
        type: "broadcast", event: "typing",
        payload: {
          user_id: currentUser.id,
          display_name: profile.display_name,
          is_typing: typing
        }
      });
      if (result !== "ok") console.warn("Typing broadcast result:", result);
    } catch (error) {
      console.error("Typing broadcast failed:", error);
    }
  }

  function handleMessageTyping() {
    const input = $("onlineMessageInput");
    if (!input.value.trim()) {
      clearTimeout(typingTimer);
      typingTimer = null;
      if (isTyping) {
        isTyping = false;
        broadcastTyping(false);
      }
      return;
    }
    isTyping = true;
    broadcastTyping(true);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      isTyping = false;
      broadcastTyping(false);
    }, 1800);
  }

  async function sendMessage(content) {
    if (!client || !currentRoom) return;
    const text = String(content || "").trim().slice(0, 1000);
    if (!text) return;
    const { error } = await client.from("messages").insert({
      room_id: currentRoom.id, user_id: currentUser.id, content: text
    });
    if (error) throw error;
  }

  async function leaveRoom(updateStatus = true) {
    clearTimeout(typingTimer);
    typingTimer = null;
    if (isTyping) {
      isTyping = false;
      await broadcastTyping(false);
    }
    if (roomChannel && client) {
      await client.removeChannel(roomChannel);
      roomChannel = null;
    }
    typingUsers.forEach(person => clearTimeout(person.timer));
    typingUsers.clear();
    if ($("onlineTypingIndicator")) $("onlineTypingIndicator").textContent = "";
    currentRoom = null;
    if (updateStatus) saveActiveRoom(null);
    $("onlineRoom").style.display = "none";
    renderRoomList();
    if (updateStatus && client) status("Back to your chatroom list. Your room membership is saved.");
  }

  async function leaveChatroom() {
    if (!client || !currentUser || !currentRoom) return;
    const room = { ...currentRoom };
    const confirmed = window.confirm(
      "Leave '" + (room.name || "this chatroom") + "'? It will disappear from My Chatrooms. Your messages will remain in the room for its other members."
    );
    if (!confirmed) return;

    try {
      const { error } = await client.from("room_members")
        .delete()
        .eq("room_id", room.id)
        .eq("user_id", currentUser.id);
      if (error) throw error;

      await leaveRoom(true);
      await refreshRoomList();
      status("You left " + (room.name || "the chatroom") + ". It was removed from My Chatrooms.");
    } catch (error) {
      console.error("Could not leave chatroom:", error);
      status(error.message || "Couldn't leave this chatroom. Please try again.", true);
    }
  }

  $("onlineSaveProfile").onclick = async () => {
    try { await saveProfile(true); }
    catch (error) { status(error.message, true); }
  };
  $("onlineCreateRoom").onclick = createRoom;
  $("onlineJoinRoom").onclick = joinRoom;
  $("onlineLeaveRoom").onclick = () => leaveRoom();
  $("onlineLeaveMembership").onclick = leaveChatroom;

  $("onlineJoinCode").oninput = event => {
    event.target.value = event.target.value.toUpperCase()
      .replace(/[^A-Z0-9]/g, "").slice(0, 6);
  };

  $("onlineMessageInput").addEventListener("input", handleMessageTyping);
  $("onlineMessageForm").onsubmit = async event => {
    event.preventDefault();
    const input = $("onlineMessageInput");
    const value = input.value.trim();
    if (!value) return;
    clearTimeout(typingTimer);
    typingTimer = null;
    if (isTyping) {
      isTyping = false;
      await broadcastTyping(false);
    }
    input.value = "";
    try { await sendMessage(value); }
    catch (error) {
      input.value = value;
      status(error.message || "Message couldn't be sent.", true);
    }
  };

  section.querySelectorAll("[data-reaction]").forEach(button => {
    button.onclick = async () => {
      try { await sendMessage(button.dataset.reaction); }
      catch (error) { status(error.message || "Reaction couldn't be sent.", true); }
    };
  });

  initialize();
})();
