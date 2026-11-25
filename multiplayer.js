
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

    /* ONLINE TAMBAYAN — VISUAL REFRESH */

    #onlineTambayan {
      margin: 34px 0 48px;
    }

    #onlineTambayan .section-heading {
      margin-bottom: 16px;
    }

    #onlineTambayan .online-panel {
      background:
        radial-gradient(ellipse at top left, rgba(151,105,255,.16), transparent 48%),
        linear-gradient(145deg, #211735, #171126);
      border: 1px solid rgba(194,158,255,.28);
      border-radius: 25px;
      padding: 24px;
      box-shadow: 0 18px 45px rgba(0,0,0,.2);
    }

    #onlineTambayan .online-grid > div,
    #onlineTambayan .online-box {
      background: rgba(255,255,255,.035);
      border: 1px solid rgba(194,158,255,.17);
      border-radius: 19px;
      padding: 17px;
      min-width: 0;
    }

    #onlineTambayan h3 {
      color: #eadcff;
      letter-spacing: .01em;
    }

    #onlineTambayan label {
      display: block;
      margin-top: 10px;
      color: #cbb9e9;
      font-size: .88rem;
      font-weight: 700;
    }

    #onlineTambayan input {
      min-height: 46px;
      border-radius: 13px;
      border: 1px solid rgba(194,158,255,.25);
      background: rgba(12,8,25,.55);
      color: #fff;
      padding: 12px 14px;
      outline: none;
    }

    #onlineTambayan input:focus {
      border-color: #c6a5ff;
      box-shadow: 0 0 0 3px rgba(169,139,255,.13);
    }

    #onlineTambayan input::placeholder {
      color: #9385aa;
    }

    #onlineTambayan button {
      min-height: 42px;
      border-radius: 13px;
      background: linear-gradient(135deg, #c3a2ff, #9872ed);
      color: #211432;
      box-shadow: 0 5px 16px rgba(137,96,220,.18);
      transition: transform .18s ease, filter .18s ease;
    }

    #onlineTambayan button:hover {
      filter: brightness(1.09);
      transform: translateY(-1px);
    }

    #onlineTambayan button:active {
      transform: scale(.97);
    }

    #onlineTambayan .online-status {
      padding: 11px 14px;
      border-radius: 12px;
      background: rgba(169,139,255,.09);
      border: 1px solid rgba(194,158,255,.15);
    }

    #onlineTambayan .online-room-card {
      min-height: 62px;
      padding: 13px 15px;
      border-radius: 14px;
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(194,158,255,.17);
    }

    #onlineTambayan .online-room-card.active {
      background: rgba(169,139,255,.16);
      border-color: #b99aff;
      box-shadow: 0 0 18px rgba(169,139,255,.12);
    }

    #onlineTambayan .online-room {
      border-top: 1px solid rgba(194,158,255,.2);
      margin-top: 22px;
      padding-top: 22px;
    }

    #onlineTambayan .online-code {
      display: inline-block;
      margin-top: 5px;
      padding: 8px 13px;
      border-radius: 10px;
      background: rgba(169,139,255,.13);
      border: 1px dashed rgba(194,158,255,.4);
      letter-spacing: .22em;
    }

    #onlineTambayan .online-columns {
      gap: 16px;
    }

    #onlineTambayan .online-messages {
      height: 320px;
      padding: 12px;
      border-radius: 14px;
      background: rgba(9,6,19,.35);
      border: 1px solid rgba(194,158,255,.12);
    }

    #onlineTambayan .online-message {
      max-width: 90%;
      padding: 12px 14px;
      border-radius: 15px;
      background: rgba(169,139,255,.12);
      border: 1px solid rgba(194,158,255,.12);
      line-height: 1.5;
    }

    #onlineTambayan .online-message strong {
      color: #e0caff;
    }

    #onlineTambayan .online-message-receipt {
      color: #cbb2ff;
    }

    #onlineTambayan .online-member {
      padding: 11px 13px;
      border: 1px solid rgba(194,158,255,.12);
      border-radius: 12px;
      background: rgba(169,139,255,.08);
    }

    #onlineTambayan .online-compose {
      gap: 9px;
      margin-top: 10px;
    }

    #onlineTambayan .online-compose input {
      margin: 0;
      min-width: 0;
    }

    #onlineTambayan .online-compose button {
      flex-shrink: 0;
      margin: 0;
    }

    #onlineTambayan .online-reactions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 10px;
    }

    #onlineTambayan .online-reactions button {
      min-width: 43px;
      margin: 0;
      background: rgba(169,139,255,.13);
      color: #f0e5ff;
      border: 1px solid rgba(194,158,255,.2);
      box-shadow: none;
    }

    #onlineTambayan .online-danger-button {
      background: linear-gradient(135deg, #a94f70, #78334f);
      color: #fff;
    }

    @media(max-width:620px) {
      #onlineTambayan {
        margin: 24px 0 35px;
      }

      #onlineTambayan .online-panel {
        padding: 13px;
        border-radius: 19px;
      }

      #onlineTambayan .online-grid {
        grid-template-columns: 1fr;
      }

      #onlineTambayan .online-grid > div,
      #onlineTambayan .online-box {
        padding: 13px;
      }

      #onlineTambayan .online-columns {
        grid-template-columns: 1fr;
      }

      #onlineTambayan .online-messages {
        height: 280px;
      }

      #onlineTambayan .online-room-top {
        align-items: flex-start;
      }

      #onlineTambayan .online-room-actions {
        width: 100%;
      }

      #onlineTambayan .online-room-actions button {
        flex: 1;
      }

      #onlineTambayan .online-message {
        max-width: 96%;
      }
    }

    @media(prefers-reduced-motion: reduce) {
      #onlineTambayan button {
        transition: none;
      }
    }
  `;
  document.head.appendChild(style);
  
  // ONLINE TAMBAYAN — CHATROOM REDESIGN
  const layoutStyle = document.createElement("style");
  layoutStyle.textContent = `
    #onlineTambayan {
      margin: 30px 0 45px;
    }

    #onlineTambayan .section-heading {
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    #onlineTambayan .online-panel {
      padding: 20px;
      border-radius: 24px;
      background:
        radial-gradient(ellipse at 10% 0%, rgba(174,130,255,.15), transparent 42%),
        linear-gradient(145deg, #211735, #151020);
    }

    /* Compact setup area */
    #onlineTambayan .online-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin: 16px 0;
    }

    #onlineTambayan .online-grid > div {
      padding: 16px;
      border-radius: 17px;
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(194,158,255,.16);
    }

    #onlineTambayan .online-grid h3 {
      font-size: 1rem;
      margin-bottom: 10px;
    }

    #onlineTambayan .online-grid button {
      width: 100%;
      margin: 7px 0 0;
    }

    /* Status and room list */
    #onlineTambayan .online-status {
      margin: 12px 0;
      font-size: .88rem;
    }

    #onlineTambayan #onlineMyRoomsBox {
      margin-top: 14px;
      padding: 17px;
      background: rgba(255,255,255,.035);
    }

    #onlineTambayan #onlineMyRoomsBox h3 {
      margin-bottom: 4px;
    }

    #onlineTambayan .online-room-list {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 9px;
    }

    #onlineTambayan .online-room-card {
      min-width: 0;
      min-height: 64px;
      padding: 12px;
      overflow-wrap: anywhere;
    }

    #onlineTambayan .online-room-card span {
      min-width: 0;
    }

    /* Active room */
    #onlineTambayan .online-room {
      margin-top: 18px;
      padding-top: 18px;
    }

    #onlineTambayan .online-room-top {
      padding: 15px;
      border: 1px solid rgba(194,158,255,.18);
      border-radius: 17px;
      background: rgba(169,139,255,.07);
    }

    #onlineTambayan .online-room-top h3 {
      font-size: 1.2rem;
      margin: 3px 0 8px;
    }

    #onlineTambayan .online-columns {
      grid-template-columns: minmax(0, 1fr) 220px;
      align-items: start;
      gap: 13px;
    }

    #onlineTambayan .online-columns > .online-box {
      padding: 15px;
      border-radius: 18px;
      background: rgba(255,255,255,.035);
    }

    #onlineTambayan .online-columns > .online-box:first-child {
      min-width: 0;
    }

    #onlineTambayan .online-messages {
      height: 360px;
      padding: 13px;
      gap: 11px;
      border-radius: 15px;
      background: rgba(8,5,18,.42);
    }

    #onlineTambayan .online-message {
      width: fit-content;
      max-width: 88%;
      border-radius: 15px 15px 15px 5px;
    }

    #onlineTambayan .online-compose {
      margin-top: 12px;
    }

    #onlineTambayan .online-compose input {
      min-height: 48px;
    }

    #onlineTambayan .online-compose button {
      min-width: 70px;
      min-height: 48px;
    }

    #onlineTambayan .online-members {
      gap: 9px;
    }

    #onlineTambayan .online-member {
      overflow-wrap: anywhere;
    }

    #onlineTambayan .online-reactions {
      padding-top: 3px;
    }

    /* Phone layout */
    @media (max-width: 620px) {
      #onlineTambayan {
        margin: 22px 0 32px;
      }

      #onlineTambayan .online-panel {
        padding: 12px;
        border-radius: 19px;
      }

      #onlineTambayan .online-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      #onlineTambayan .online-grid > div {
        padding: 14px;
      }

      #onlineTambayan #onlineMyRoomsBox {
        padding: 13px;
      }

      #onlineTambayan .online-room-list {
        grid-template-columns: 1fr;
      }

      #onlineTambayan .online-room-top {
        padding: 13px;
      }

      #onlineTambayan .online-room-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 7px;
      }

      #onlineTambayan .online-room-actions button {
        min-width: 0;
        margin: 0;
        padding: 10px 7px;
        font-size: .82rem;
      }

      #onlineTambayan .online-columns {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      #onlineTambayan .online-columns > .online-box {
        padding: 12px;
      }

      #onlineTambayan .online-messages {
        height: 310px;
      }

      #onlineTambayan .online-message {
        max-width: 94%;
      }

      #onlineTambayan .online-compose {
        gap: 6px;
      }

      #onlineTambayan .online-compose button {
        min-width: 62px;
        padding: 9px;
      }

      #onlineTambayan .online-reactions {
        gap: 6px;
      }
    }

    @media (max-width: 360px) {
      #onlineTambayan .online-room-actions {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(layoutStyle);
  
  // ONLINE TAMBAYAN — SEPARATE SECTION CARDS
  const sectionStyle = document.createElement("style");
  sectionStyle.textContent = `
    #onlineTambayan .online-panel {
      padding: 0;
      background: transparent;
      border: 0;
      box-shadow: none;
    }

    #onlineTambayan .online-panel > .online-muted:first-child {
      padding: 15px 18px;
      margin-bottom: 16px;
      border-radius: 16px;
      background: rgba(169,139,255,.09);
      border: 1px solid rgba(194,158,255,.17);
    }

    #onlineTambayan .online-grid {
      margin: 0 0 16px;
      padding: 16px;
      border-radius: 21px;
      background: linear-gradient(145deg, #211735, #171122);
      border: 1px solid rgba(194,158,255,.2);
    }

    #onlineTambayan .online-status {
      padding: 12px 15px;
      border-radius: 13px;
      background: rgba(169,139,255,.08);
      border: 1px solid rgba(194,158,255,.14);
    }

    #onlineTambayan #onlineMyRoomsBox {
      margin: 16px 0;
      padding: 18px;
      border-radius: 21px;
      background: linear-gradient(145deg, #211735, #171122);
      border: 1px solid rgba(194,158,255,.2);
    }

    #onlineTambayan .online-room {
      margin-top: 18px;
      padding: 18px;
      border-radius: 22px;
      background: linear-gradient(145deg, #211735, #171122);
      border: 1px solid rgba(194,158,255,.22);
    }

    #onlineTambayan .online-room-top {
      margin-bottom: 14px;
    }

    #onlineTambayan .online-columns > .online-box {
      background: rgba(10,7,20,.45);
      border: 1px solid rgba(194,158,255,.14);
    }

    @media (max-width: 620px) {
      #onlineTambayan .online-grid {
        padding: 12px;
      }

      #onlineTambayan #onlineMyRoomsBox {
        padding: 14px;
      }

      #onlineTambayan .online-room {
        padding: 12px;
      }
    }
  `;
  document.head.appendChild(sectionStyle);
    
  

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

  // Place Online Tambayan inside the Lounge instead of after it.
  const anchor = document.querySelector(".hangout-layout");
  if (anchor) {
    anchor.appendChild(section);
  } else {
    document.querySelector("main")?.appendChild(section);
  }

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
      window.tambayanSupabaseClient = client;
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
