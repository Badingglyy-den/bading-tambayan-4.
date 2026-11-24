
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
    #onlineTambayan input,
    #onlineTambayan button { font: inherit; }
    #onlineTambayan input {
      width: 100%;
      box-sizing: border-box;
      border-radius: 12px;
      border: 1px solid rgba(190,160,255,.3);
      padding: 12px;
      background: rgba(255,255,255,.07);
      color: inherit;
      margin: 5px 0;
    }
    #onlineTambayan button {
      cursor: pointer;
      border: 0;
      border-radius: 12px;
      padding: 11px 15px;
      margin: 5px 5px 5px 0;
      background: #a98bff;
      color: #1b1231;
      font-weight: 700;
    }
    #onlineTambayan button:disabled {
      opacity: .5;
      cursor: not-allowed;
    }
    #onlineTambayan .online-muted {
      opacity: .75;
      font-size: .92rem;
    }
    #onlineTambayan .online-status {
      min-height: 1.4em;
      color: #cbbaff;
      font-size: .92rem;
    }
    #onlineTambayan .online-room {
      display: none;
      margin-top: 18px;
      border-top: 1px solid rgba(190,160,255,.2);
      padding-top: 18px;
    }
    #onlineTambayan .online-room-top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    #onlineTambayan .online-code {
      font-size: 1.2rem;
      letter-spacing: .18em;
      font-weight: 800;
      color: #d9c9ff;
    }
    #onlineTambayan .online-columns {
      display: grid;
      grid-template-columns: minmax(0,2fr) minmax(180px,1fr);
      gap: 14px;
      margin-top: 14px;
    }
    #onlineTambayan .online-box {
      border: 1px solid rgba(190,160,255,.2);
      border-radius: 16px;
      padding: 14px;
      min-width: 0;
    }
    #onlineTambayan .online-messages {
      height: 270px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 9px;
      padding: 5px 0;
    }
    #onlineTambayan .online-message {
      background: rgba(255,255,255,.07);
      padding: 9px 11px;
      border-radius: 12px;
      overflow-wrap: anywhere;
    }
    #onlineTambayan .online-message small {
      display: block;
      opacity: .85;
      margin-bottom: 5px;
    }
    #onlineTambayan .online-message strong {
      color: #d9c9ff;
    }
    #onlineTambayan .online-members {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    #onlineTambayan .online-member {
      padding: 8px;
      border-radius: 10px;
      background: rgba(255,255,255,.06);
    }
    #onlineTambayan .online-compose {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    #onlineTambayan .online-compose input { flex: 1; }
    #onlineTambayan .online-reactions button {
      font-size: 1.15rem;
      padding: 7px 10px;
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
      <p class="online-muted">
        Create a private room, share its six-character
        code, and chat live with friends.
      </p>

      <div class="online-grid">
        <div>
          <h3>🪩 Your online profile</h3>
          <label for="onlineName">Nickname</label>
          <input id="onlineName" maxlength="24"
            placeholder="Your tambayan nickname">

          <label for="onlineAvatar">Avatar (emoji)</label>
          <input id="onlineAvatar" maxlength="8" value="💜">

          <button id="onlineSaveProfile">Save profile</button>
        </div>

        <div>
          <h3>✨ Create a room</h3>
          <input id="onlineRoomName" maxlength="40"
            placeholder="Give your room a name">

          <button id="onlineCreateRoom">Create private room</button>

          <h3 style="margin-top:14px">🔑 Join with a code</h3>
          <input id="onlineJoinCode" maxlength="6"
            placeholder="Six-character code">

          <button id="onlineJoinRoom">Join room</button>
        </div>
      </div>

      <p class="online-status" id="onlineStatus"
        role="status" aria-live="polite">
        Connecting to the online tambayan…
      </p>

      <div class="online-room" id="onlineRoom">
        <div class="online-room-top">
          <div>
            <p class="online-muted">YOU'RE IN</p>
            <h3 id="onlineRoomTitle">Room</h3>
            <div class="online-code" id="onlineRoomCode"></div>
          </div>
          <button id="onlineLeaveRoom">Leave room</button>
        </div>

        <div class="online-columns">
          <div class="online-box">
            <h3>💬 Live chat</h3>
            <div class="online-messages" id="onlineMessages"
              aria-live="polite"></div>

            <form class="online-compose" id="onlineMessageForm">
              <input id="onlineMessageInput" maxlength="1000"
                placeholder="Say something..." required>
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
            <div class="online-members" id="onlineMembers">
              <span class="online-muted">Waiting for members…</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const anchor = document.querySelector(".hangout-layout");

  if (anchor) {
    anchor.insertAdjacentElement("afterend", section);
  } else {
    document.querySelector("main")?.appendChild(section);
  }

  const $ = id => document.getElementById(id);

  let client = null;
  let currentUser = null;
  let currentRoom = null;
  let roomChannel = null;

  let profile = {
    display_name: "Tambay",
    avatar: "💜"
  };

  let messageIds = new Set();
  const profileCache = new Map();

  function status(message, error = false) {
    $("onlineStatus").textContent = message;
    $("onlineStatus").style.color =
      error ? "#ffaaaa" : "#cbbaff";
  }

  function safeText(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );
  }

  function loadSupabase() {
    return new Promise((resolve, reject) => {
      if (window.supabase?.createClient) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error("Could not load Supabase."));
      document.head.appendChild(script);
    });
  }

  async function initialize() {
    try {
      await loadSupabase();

      client = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

      const { data: sessionData, error: sessionError } =
        await client.auth.getSession();

      if (sessionError) throw sessionError;

      if (sessionData.session) {
        currentUser = sessionData.session.user;
      } else {
        const { data, error } =
          await client.auth.signInAnonymously();

        if (error) throw error;
        currentUser = data.user;
      }

      const localName =
        document.getElementById("welcomeName")?.textContent ||
        "Tambay";

      profile = {
        display_name: localName.trim().slice(0, 24) || "Tambay",
        avatar: "💜"
      };

      const { data: savedProfile, error: profileError } =
        await client
          .from("profiles")
          .select("display_name,avatar")
          .eq("user_id", currentUser.id)
          .maybeSingle();

      if (profileError) throw profileError;
      if (savedProfile) profile = savedProfile;

      $("onlineName").value = profile.display_name;
      $("onlineAvatar").value = profile.avatar;

      await saveProfile(false);

      status("You're connected! Create a room or join with a code. 💜");
    } catch (error) {
      console.error(error);
      status(error.message || "Connection failed.", true);
    }
  }

  async function saveProfile(showNotice = true) {
    if (!client || !currentUser) return;

    const name =
      $("onlineName").value.trim().slice(0, 24) || "Tambay";

    const avatar =
      $("onlineAvatar").value.trim().slice(0, 8) || "💜";

    const { error } = await client
      .from("profiles")
      .upsert({
        user_id: currentUser.id,
        display_name: name,
        avatar: avatar
      }, {
        onConflict: "user_id"
      });

    if (error) throw error;

    profile = {
      display_name: name,
      avatar: avatar
    };

    profileCache.clear();

    if (roomChannel && currentRoom) {
      await roomChannel.track({
        user_id: currentUser.id,
        display_name: profile.display_name,
        avatar: profile.avatar,
        online_at: new Date().toISOString()
      });

      renderMembers();
    }

    if (showNotice) {
      status("Online profile saved! ✨");
    }
  }

  async function createRoom() {
    if (!client) {
      status("Still connecting. Please wait.", true);
      return;
    }

    const name =
      $("onlineRoomName").value.trim() || "Tambayan Room";

    try {
      await saveProfile(false);

      const { data, error } = await client.rpc(
        "create_room",
        { p_name: name }
      );

      if (error) throw error;

      const result = Array.isArray(data) ? data[0] : data;

      if (!result?.room_id || !result?.room_code) {
        throw new Error("Unexpected room response.");
      }

      await enterRoom(result.room_id, result.room_code, name);
    } catch (error) {
      console.error(error);
      status(error.message || "Couldn't create room.", true);
    }
  }

  async function joinRoom() {
    if (!client) {
      status("Still connecting. Please wait.", true);
      return;
    }

    const code =
      $("onlineJoinCode").value.trim().toUpperCase();

    if (!/^[A-Z0-9]{6}$/.test(code)) {
      status("Enter the six-character room code.", true);
      return;
    }

    try {
      await saveProfile(false);

      const { data, error } = await client.rpc(
        "join_room",
        { p_code: code }
      );

      if (error) throw error;

      const roomId =
        typeof data === "string"
          ? data
          : Array.isArray(data)
            ? data[0]
            : data?.room_id;

      if (!roomId) {
        throw new Error("Couldn't read room ID.");
      }

      const { data: room, error: roomError } =
        await client
          .from("rooms")
          .select("id,room_code,room_name")
          .eq("id", roomId)
          .single();

      if (roomError) throw roomError;

      await enterRoom(room.id, room.room_code, room.room_name);
    } catch (error) {
      console.error(error);
      status(error.message || "Couldn't join room.", true);
    }
  }

  async function enterRoom(roomId, code, roomName) {
    await leaveRoom(false);

    currentRoom = {
      id: roomId,
      code: code,
      name: roomName
    };

    $("onlineRoom").style.display = "block";
    $("onlineRoomTitle").textContent = roomName;
    $("onlineRoomCode").textContent = code;

    messageIds = new Set();
    profileCache.clear();

    await loadMessages();

    roomChannel = client.channel(
      "online-room-" + roomId,
      {
        config: {
          presence: {
            key: currentUser.id
          }
        }
      }
    );

    roomChannel
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: "room_id=eq." + roomId
      }, async payload => {
        await appendMessage(payload.new);
      })
      .on("presence", {
        event: "sync"
      }, renderMembers)
      .subscribe(async state => {
        if (state === "SUBSCRIBED") {
          await roomChannel.track({
            user_id: currentUser.id,
            display_name: profile.display_name,
            avatar: profile.avatar,
            online_at: new Date().toISOString()
          });

          status(
            "You're in " + roomName +
            ". Share code " + code + " with friends!"
          );
        }
      });
  }

  async function loadMessages() {
    $("onlineMessages").innerHTML =
      '<span class="online-muted">Loading chat…</span>';

    const { data, error } = await client
      .from("messages")
      .select("id,user_id,content,created_at")
      .eq("room_id", currentRoom.id)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) throw error;

    $("onlineMessages").innerHTML = "";

    for (const message of (data || [])) {
      await appendMessage(message);
    }
  }

  async function getMessageProfile(userId) {
    if (!userId) {
      return { display_name: "Tambay", avatar: "💜" };
    }

    if (userId === currentUser.id) {
      return profile;
    }

    if (profileCache.has(userId)) {
      return profileCache.get(userId);
    }

    const fallback = {
      display_name: "Tambay",
      avatar: "💜"
    };

    const { data, error } = await client
      .from("profiles")
      .select("display_name,avatar")
      .eq("user_id", userId)
      .maybeSingle();

    const result = !error && data ? data : fallback;

    profileCache.set(userId, result);
    return result;
  }

  async function appendMessage(message) {
    if (!message) return;

    const id = String(message.id);

    if (messageIds.has(id)) return;
    messageIds.add(id);

    const mine = message.user_id === currentUser.id;
    const sender = await getMessageProfile(message.user_id);

    const who = mine
      ? profile.display_name
      : sender.display_name;

    const avatar = mine
      ? profile.avatar
      : sender.avatar;

    const item = document.createElement("div");
    item.className = "online-message";

    const time = message.created_at
      ? new Date(message.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      : "";

    item.innerHTML = `
      <small>
        <span aria-hidden="true">${safeText(avatar || "💜")}</span>
        <strong>${safeText(who || "Tambay")}</strong>
        · ${safeText(time)}
      </small>
      <div>${safeText(message.content)}</div>
    `;

    $("onlineMessages").appendChild(item);
    $("onlineMessages").scrollTop =
      $("onlineMessages").scrollHeight;
  }

  function renderMembers() {
    if (!roomChannel) return;

    const state = roomChannel.presenceState();

    const people = Object.values(state)
      .flat()
      .filter((person, index, all) =>
        all.findIndex(
          other => other.user_id === person.user_id
        ) === index
      );

    $("onlineMembers").innerHTML = people.length
      ? people.map(person => `
          <div class="online-member">
            ${safeText(person.avatar || "💜")}
            ${safeText(person.display_name || "Tambay")}
            ${person.user_id === currentUser.id
              ? "<small>(you)</small>"
              : ""}
          </div>
        `).join("")
      : `
          <span class="online-muted">
            You're the first one here. Invite a friend!
          </span>
        `;
  }

  async function sendMessage(content) {
    if (!client || !currentRoom) return;

    const text = String(content || "")
      .trim()
      .slice(0, 1000);

    if (!text) return;

    const { error } = await client
      .from("messages")
      .insert({
        room_id: currentRoom.id,
        user_id: currentUser.id,
        content: text
      });

    if (error) throw error;
  }

  async function leaveRoom(updateStatus = true) {
    if (roomChannel && client) {
      await client.removeChannel(roomChannel);
      roomChannel = null;
    }

    currentRoom = null;
    $("onlineRoom").style.display = "none";

    if (updateStatus && client) {
      status("You left the room.");
    }
  }

  $("onlineSaveProfile").onclick = async () => {
    try {
      await saveProfile(true);
    } catch (error) {
      status(error.message, true);
    }
  };

  $("onlineCreateRoom").onclick = createRoom;
  $("onlineJoinRoom").onclick = joinRoom;
  $("onlineLeaveRoom").onclick = () => leaveRoom();

  $("onlineJoinCode").oninput = event => {
    event.target.value = event.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
  };

  $("onlineMessageForm").onsubmit = async event => {
    event.preventDefault();

    const input = $("onlineMessageInput");
    const value = input.value.trim();

    if (!value) return;

    input.value = "";

    try {
      await sendMessage(value);
    } catch (error) {
      input.value = value;
      status(error.message || "Message couldn't be sent.", true);
    }
  };

  section.querySelectorAll("[data-reaction]").forEach(button => {
    button.onclick = async () => {
      try {
        await sendMessage(button.dataset.reaction);
      } catch (error) {
        status(error.message || "Reaction couldn't be sent.", true);
      }
    };
  });

  initialize();
})();
    
