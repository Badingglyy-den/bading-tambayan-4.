
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
    .online-photo-button {
  cursor: pointer;
  padding: 8px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.online-chat-photo {
  display: block;
  max-width: 220px;
  max-height: 220px;
  width: auto;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 6px;
  cursor: zoom-in;
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
  
  // ONLINE TAMBAYAN — CHAT BUBBLE POLISH
  const chatStyle = document.createElement("style");
  chatStyle.textContent = `
    #onlineTambayan .online-messages {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 13px;
      scroll-behavior: smooth;
    }

    #onlineTambayan .online-message {
      width: fit-content;
      max-width: 82%;
      padding: 12px 15px;
      border-radius: 17px 17px 17px 5px;
      background: rgba(169,139,255,.13);
      border: 1px solid rgba(194,158,255,.2);
      box-shadow: 0 3px 12px rgba(0,0,0,.12);
    }

    #onlineTambayan .online-message.is-mine {
      align-self: flex-end;
      border-radius: 17px 17px 5px 17px;
      background: linear-gradient(135deg, #7655ae, #594080);
      border-color: rgba(220,195,255,.28);
    }

    #onlineTambayan .online-message.is-other {
      align-self: flex-start;
    }

    #onlineTambayan .online-message small {
      font-size: .78rem;
      opacity: .85;
    }

    #onlineTambayan .online-message-receipt {
      font-size: .72rem;
      opacity: .85;
    }

    #onlineTambayan .online-members {
      gap: 10px;
    }

    #onlineTambayan .online-member {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 11px 13px;
      border-radius: 13px;
      background: rgba(169,139,255,.1);
      border: 1px solid rgba(194,158,255,.16);
    }

    #onlineTambayan .online-member small {
      margin-left: auto;
      opacity: .7;
    }

    @media (max-width: 620px) {
      #onlineTambayan .online-message {
        max-width: 91%;
      }
    }
  `;
  document.head.appendChild(chatStyle);
  
  // ONLINE TAMBAYAN — MESSAGE COMPOSER POLISH
  const composerStyle = document.createElement("style");
  composerStyle.textContent = `
    #onlineTambayan .online-compose {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
      padding: 7px;
      border-radius: 17px;
      background: rgba(169,139,255,.09);
      border: 1px solid rgba(194,158,255,.2);
    }

    #onlineTambayan .online-compose input {
      flex: 1;
      min-width: 0;
      min-height: 46px;
      margin: 0;
      padding: 11px 14px;
      border: 0;
      border-radius: 12px;
      background: transparent;
      box-shadow: none;
    }

    #onlineTambayan .online-compose input:focus {
      border: 0;
      box-shadow: none;
      outline: 2px solid rgba(194,158,255,.3);
    }

    #onlineTambayan .online-compose button {
      flex-shrink: 0;
      min-width: 76px;
      min-height: 44px;
      margin: 0;
      border-radius: 12px;
      background: linear-gradient(135deg, #d2b5ff, #a17bea);
      color: #211432;
      font-weight: 800;
    }

    #onlineTambayan .online-reactions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 13px;
    }

    #onlineTambayan .online-reactions button {
      min-width: 43px;
      min-height: 40px;
      margin: 0;
      padding: 7px 11px;
      border-radius: 13px;
      background: rgba(169,139,255,.1);
      border: 1px solid rgba(194,158,255,.2);
      box-shadow: none;
      font-size: 1.15rem;
      transition: background .18s ease, transform .18s ease;
    }

    #onlineTambayan .online-reactions button:hover {
      background: rgba(169,139,255,.25);
      transform: translateY(-2px);
    }

    @media (max-width: 620px) {
      #onlineTambayan .online-compose {
        gap: 6px;
        padding: 5px;
      }

      #onlineTambayan .online-compose button {
        min-width: 62px;
        padding: 9px;
      }

      #onlineTambayan .online-reactions {
        gap: 6px;
      }
    }
  `;
  document.head.appendChild(composerStyle);
  
  // ONLINE TAMBAYAN — STRONGER COMPOSER DESIGN
  const composerHighlightStyle = document.createElement("style");
  composerHighlightStyle.textContent = `
    #onlineTambayan .online-compose {
      margin-top: 18px;
      padding: 10px;
      border-radius: 19px;
      background: rgba(169,139,255,.19);
      border: 1px solid rgba(205,177,255,.42);
      box-shadow: 0 0 18px rgba(169,139,255,.09);
    }

    #onlineTambayan .online-compose input {
      min-height: 48px;
      background: rgba(255,255,255,.09);
      border: 1px solid rgba(220,200,255,.25);
      border-radius: 13px;
      color: #fff;
    }

    #onlineTambayan .online-compose input:focus {
      border: 1px solid #d7baff;
      box-shadow: 0 0 0 3px rgba(190,150,255,.18);
    }

    #onlineTambayan .online-compose button {
      min-width: 82px;
      background: linear-gradient(135deg, #e0caff, #b18aff);
      color: #24143d;
      box-shadow: 0 4px 14px rgba(177,138,255,.3);
      font-weight: 800;
    }

    #onlineTambayan .online-compose button:hover {
      filter: brightness(1.12);
      box-shadow: 0 5px 18px rgba(177,138,255,.4);
    }

    #onlineTambayan .online-reactions {
      padding-top: 14px;
      border-top: 1px solid rgba(194,158,255,.2);
    }

    #onlineTambayan .online-reactions button {
      min-width: 46px;
      min-height: 43px;
      background: rgba(169,139,255,.17);
      border: 1px solid rgba(205,177,255,.3);
      box-shadow: 0 3px 9px rgba(0,0,0,.12);
    }

    #onlineTambayan .online-reactions button:active {
      transform: scale(.92);
      background: rgba(190,150,255,.35);
    }

    @media (max-width: 620px) {
      #onlineTambayan .online-compose {
        padding: 7px;
      }

      #onlineTambayan .online-compose button {
        min-width: 68px;
      }
    }
  `;
  document.head.appendChild(composerHighlightStyle);
  
  // ONLINE TAMBAYAN — ROOM LIST & HEADER POLISH
  const roomPolishStyle = document.createElement("style");
  roomPolishStyle.textContent = `
    /* My Chatrooms */
    #onlineTambayan #onlineMyRoomsBox h3 {
      color: #eadcff;
      font-size: 1.12rem;
      margin-bottom: 6px;
    }

    #onlineTambayan #onlineMyRoomsBox > .online-muted {
      display: block;
      line-height: 1.5;
      margin-bottom: 14px;
    }

    #onlineTambayan .online-room-list {
      gap: 10px;
    }

    #onlineTambayan .online-room-card {
      min-height: 72px;
      padding: 14px 16px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(169,139,255,.12), rgba(255,255,255,.035));
      border: 1px solid rgba(194,158,255,.2);
      transition: background .2s ease, border-color .2s ease, transform .2s ease;
    }

    #onlineTambayan .online-room-card span:first-child {
      line-height: 1.5;
    }

    #onlineTambayan .online-room-card strong {
      color: #f0e5ff;
      font-size: .98rem;
    }

    #onlineTambayan .online-room-card small {
      display: block;
      margin-top: 4px;
      color: #cbbaff;
      font-size: .78rem;
      letter-spacing: .04em;
    }

    #onlineTambayan .online-room-card.active {
      background: linear-gradient(135deg, rgba(169,139,255,.27), rgba(116,83,170,.18));
      border-color: #c5a7ff;
      box-shadow: 0 0 16px rgba(169,139,255,.13);
    }

    #onlineTambayan .online-room-card:hover {
      transform: translateY(-2px);
      border-color: rgba(205,177,255,.55);
    }

    /* Active room header */
    #onlineTambayan .online-room-top {
      padding: 18px;
      border-radius: 19px;
      background:
        radial-gradient(ellipse at top left, rgba(190,150,255,.2), transparent 65%),
        linear-gradient(135deg, rgba(169,139,255,.13), rgba(255,255,255,.035));
      border: 1px solid rgba(205,177,255,.28);
      gap: 14px;
    }

    #onlineTambayan .online-room-top .online-muted {
      margin: 0 0 5px;
      color: #cbbaff;
      font-size: .76rem;
      font-weight: 800;
      letter-spacing: .12em;
    }

    #onlineTambayan .online-room-top h3 {
      color: #f1e5ff;
      font-size: 1.3rem;
      overflow-wrap: anywhere;
    }

    #onlineTambayan .online-code {
      margin-top: 8px;
      padding: 8px 13px;
      border-radius: 11px;
      background: rgba(10,7,20,.4);
      border: 1px dashed rgba(205,177,255,.4);
      color: #e0caff;
    }

    @media (max-width: 620px) {
      #onlineTambayan .online-room-card {
        min-height: 68px;
        padding: 12px 13px;
      }

      #onlineTambayan .online-room-top {
        padding: 14px;
      }

      #onlineTambayan .online-room-top h3 {
        font-size: 1.15rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #onlineTambayan .online-room-card {
        transition: none;
      }
    }
  `;
  document.head.appendChild(roomPolishStyle);
  
  // ONLINE TAMBAYAN — FINAL RESPONSIVE POLISH
  const responsiveStyle = document.createElement("style");
  responsiveStyle.textContent = `
    #onlineTambayan,
    #onlineTambayan * {
      box-sizing: border-box;
    }

    #onlineTambayan .online-columns,
    #onlineTambayan .online-box {
      min-width: 0;
    }

    /* Tablet layout */
    @media (max-width: 820px) {
      #onlineTambayan .online-columns {
        grid-template-columns: 1fr;
      }

      #onlineTambayan .online-members {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      }
    }

    /* Phone layout */
    @media (max-width: 620px) {
      #onlineTambayan .online-messages {
        height: 300px;
        padding: 10px;
      }

      #onlineTambayan .online-compose {
        width: 100%;
        gap: 7px;
      }

      #onlineTambayan .online-compose input {
        font-size: 16px;
        min-width: 0;
      }

      #onlineTambayan .online-compose button {
        min-width: 65px;
        padding-left: 10px;
        padding-right: 10px;
      }

      #onlineTambayan .online-members {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      #onlineTambayan .online-member {
        min-width: 0;
        overflow-wrap: anywhere;
      }

      #onlineTambayan .online-reactions button {
        min-width: 42px;
      }
    }

    /* Very narrow phones */
    @media (max-width: 380px) {
      #onlineTambayan .online-members {
        grid-template-columns: 1fr;
      }

      #onlineTambayan .online-compose {
        gap: 5px;
        padding: 6px;
      }

      #onlineTambayan .online-compose button {
        min-width: 58px;
        font-size: .82rem;
      }
    }
  `;
  document.head.appendChild(responsiveStyle);
    // ONLINE TAMBAYAN — NOTIFICATION CONTROL
  const notificationStyle = document.createElement("style");
  notificationStyle.textContent = `
    #onlineTambayan .online-notification-settings {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin: 10px 0 18px;
      padding: 12px 15px;
      border-radius: 14px;
      background: rgba(169,139,255,.08);
      border: 1px solid rgba(194,158,255,.18);
    }

    #onlineTambayan .online-notification-settings button {
      margin: 0;
    }

    #onlineTambayan #onlineNotificationStatus {
      color: #cbbaff;
      font-size: .85rem;
    }

    @media (max-width: 480px) {
      #onlineTambayan .online-notification-settings {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `;
  document.head.appendChild(notificationStyle);


  // ONLINE TAMBAYAN — WIDE DESKTOP LAYOUT
  const desktopChatStyle = document.createElement("style");
  desktopChatStyle.textContent = `
    @media (min-width: 1000px) {
      #onlineTambayan {
        width: 100%;
        max-width: none;
        margin: 30px auto 44px;
      }

      #onlineTambayan .online-panel {
        width: 100%;
        max-width: none;
      }

      #onlineTambayan .online-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      #onlineTambayan .online-room {
        width: 100%;
        padding: 26px;
      }

      #onlineTambayan .online-room-top {
        padding: 24px;
      }

      #onlineTambayan .online-columns {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
        gap: 22px;
        align-items: stretch;
      }

      #onlineTambayan .online-columns > .online-box {
        min-width: 0;
        padding: 24px;
      }

      #onlineTambayan .online-messages {
        height: clamp(480px, 62vh, 760px);
        padding: 20px;
        gap: 16px;
      }

      #onlineTambayan .online-message {
        max-width: min(76%, 780px);
        padding: 15px 19px;
        font-size: 1rem;
        line-height: 1.6;
      }

      #onlineTambayan .online-message small {
        font-size: .82rem;
      }

      #onlineTambayan .online-compose {
        gap: 12px;
        padding: 12px;
      }

      #onlineTambayan .online-compose input {
        min-height: 56px;
        font-size: 1rem;
      }

      #onlineTambayan .online-compose button {
        min-width: 100px;
        min-height: 52px;
        font-size: 1rem;
      }

      #onlineTambayan .online-reactions button {
        min-width: 48px;
        min-height: 46px;
      }
    }

    @media (min-width: 1500px) {
      #onlineTambayan .online-columns {
        grid-template-columns: minmax(0, 1fr) 380px;
        gap: 26px;
      }

      #onlineTambayan .online-messages {
        height: min(68vh, 820px);
      }
    }
  `;
  document.head.appendChild(desktopChatStyle);

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
            <div class="online-box" id="onlineAccountBox">
  <h3>💜 My Tambayan Account</h3>
  <p class="online-muted">Your account is connected to Bading Tambayan.</p>

  <p class="online-muted">Signed in as:</p>
  <strong id="onlineAccountEmailDisplay">Loading account...</strong>

  <button type="button" id="onlineManageAccount">
    Manage account & security
  </button>

  <p class="online-muted">
    Manage your login details or log out securely.
  </p>
</div>
      <p class="online-status" id="onlineStatus" role="status" aria-live="polite">Connecting to the online tambayan…</p>
      <div class="online-notification-settings">
  <button type="button" id="onlineNotificationButton">
    🔔 Enable notifications
  </button>
  <span id="onlineNotificationStatus" role="status">
    Get alerts when new messages arrive
  </span>
</div>
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
            <p id="onlineOlderMessagesStatus" class="online-muted" style="display:none;text-align:center;margin:8px 0;">
  Loading older messages...
</p>
<div class="online-messages" id="onlineMessages" aria-live="polite"></div>
            <p class="online-typing" id="onlineTypingIndicator" aria-live="polite"></p>
            <form class="online-compose" id="onlineMessageForm">
  <label for="onlinePhotoInput" class="online-photo-button" title="Send a photo">
    📷
  </label>
  <input
    id="onlinePhotoInput"
    type="file"
    accept="image/jpeg,image/png,image/webp,image/gif"
    hidden
  >
  <input id="onlineMessageInput" maxlength="1000" placeholder="Say something...">
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

  function showWelcomeUniverse() {
    const screen = $("welcomeUniverse");
    if (!screen) return;
    try {
      if (sessionStorage.getItem("tambayanWelcomeShown") === "yes") return;
      sessionStorage.setItem("tambayanWelcomeShown", "yes");
    } catch (_) {}
    screen.hidden = false;
    document.documentElement.classList.add("welcome-open");
    const enter = $("enterUniverseButton");
    if (enter) enter.onclick = () => {
      screen.classList.add("is-entering");
      window.setTimeout(() => {
        screen.hidden = true;
        screen.classList.remove("is-entering");
        document.documentElement.classList.remove("welcome-open");
        window.scrollTo(0, 0);
      }, 560);
    };
  }
  let client = null;
  let currentUser = null;
  let currentRoom = null;
  let roomChannel = null;
  let profile = { display_name: "Tambay", avatar: "💜" };
  let messageIds = new Set();
  let oldestMessageCursor = null;
let hasMoreMessages = true;
let loadingOlderMessages = false;
  const profileCache = new Map();
  const typingUsers = new Map();
  const seenMessageIds = new Set();
  const receiptMessageIds = new Set();
  let typingTimer = null;
  let isTyping = false;
  let joinedRooms = [];
  const backgroundRoomChannels = new Map();
  const roomUnreadCounts = new Map();
const backgroundNotificationCounts = new Map();
let pushSubscriptionActive = false;
  let backgroundNotificationCount = 0;
let notificationQueue = Promise.resolve();

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    backgroundNotificationCount = 0;
    backgroundNotificationCounts.clear();

    if (client && currentUser) {
      refreshUnreadCounts().then(() => renderRoomList());
    }
  }
});

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
  let progressSyncTimer = null;
let progressSyncReady = false;

async function savePlayerProgress(progress) {
  if (!client || !currentUser || !progress || typeof progress !== "object") return;

  const { error } = await client.from("player_progress").upsert({
    user_id: currentUser.id,
    progress,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id" });

  if (error) throw error;
}

async function syncPlayerProgress() {
  if (!client || !currentUser || !window.tambayanProgress) return;

  // Switch the game to this user's private local save before reading cloud data.
  window.tambayanProgress.useAccount(currentUser.id);

  const { data: cloudRow, error } = await client
    .from("player_progress")
    .select("progress,updated_at")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (error) throw error;

  let mergedProgress = window.tambayanProgress.getState();

  if (
    cloudRow?.progress &&
    typeof cloudRow.progress === "object" &&
    !Array.isArray(cloudRow.progress)
  ) {
    mergedProgress = window.tambayanProgress.applyCloudProgress(cloudRow.progress);
  }

  // Persist even a new account's initial state to its own cloud row.
  await savePlayerProgress(mergedProgress);

  window.removeEventListener("tambayan:progress-saved", handleProgressSaved);
  window.addEventListener("tambayan:progress-saved", handleProgressSaved);
  progressSyncReady = true;
}

function handleProgressSaved(event) {
  if (!progressSyncReady || !client || !currentUser) return;

  const progress = event.detail?.progress;
  if (!progress || typeof progress !== "object") return;

  clearTimeout(progressSyncTimer);

  progressSyncTimer = setTimeout(async () => {
    try {
      await savePlayerProgress(progress);
    } catch (error) {
      console.error("Could not sync player progress:", error);
      status("Your progress is saved on this device, but cloud sync failed. 💜", true);
    }
  }, 800);
}

  async function initialize() {
    try {
      await loadSupabase();
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      window.tambayanSupabaseClient = client;
      const { data: sessionData, error: sessionError } = await client.auth.getSession();

if (sessionError) throw sessionError;

currentUser = sessionData.session?.user || null;

if (!currentUser || currentUser.is_anonymous) {
  document.documentElement.classList.remove("auth-checking");
  document.documentElement.classList.add("auth-locked");

  // Visitors go straight to the actual email/password form.
  const gate = $("authGate");
  if (gate) gate.style.display = "none";
  const dialog = $("accountDialog");
  if (dialog && !dialog.open) {
    $("accountTitle").textContent = "Welcome back! 💜";
    $("accountDescription").textContent = "Log in to continue your Bading Tambayan journey.";
    $("accountEmail").style.display = "";
    $("accountPassword").style.display = "";
    $("accountLogin").style.display = "";
    $("accountSignup").style.display = "";
    $("accountForgot").style.display = "";
    $("accountNewPasswordLabel").style.display = "none";
    $("accountNewPassword").style.display = "none";
    $("accountChangePassword").style.display = "none";
    $("accountStatus").textContent = "";
    dialog.showModal();
  }
  return;
}

// A valid session is enough to reveal the site. Do not keep the login gate
// visible while the slower profile/progress synchronization runs.
document.documentElement.classList.remove("auth-checking", "auth-locked");

try {
  await syncPlayerProgress();
} catch (progressError) {
  console.error("Player progress sync failed:", progressError);
  status("Cloud sync couldn't load. Your local progress is safe. 💜", true);
}
document.documentElement.classList.remove("auth-checking");
document.documentElement.classList.remove("auth-locked");

const accountButton = $("accountOpen");
if (accountButton) {
  const accountName = accountButton.querySelector(".account-chip-name");
  if (accountName) {
    accountName.textContent = "Tambay";
  }
}
      const accountEmailDisplay = $("onlineAccountEmailDisplay");
if (accountEmailDisplay) {
  accountEmailDisplay.textContent =
    currentUser.email || "Email not available";
}

      const savedProgress = window.tambayanProgress?.getState?.();
      const localName = savedProgress?.profile?.name ||
        document.getElementById("welcomeName")?.textContent ||
        "Tambay";
      const localAvatar = savedProgress?.profile?.avatar || "💜";

      const { data: savedProfile, error: profileError } = await client
        .from("chat_profiles").select("display_name,avatar")
        .eq("user_id", currentUser.id).maybeSingle();
      if (profileError) throw profileError;

      // Existing cloud profiles are authoritative; never replace them on login.
      profile = savedProfile
        ? {
            display_name: (savedProfile.display_name || localName).trim().slice(0, 24) || "Tambay",
            avatar: savedProfile.avatar || localAvatar
          }
        : {
            display_name: localName.trim().slice(0, 24) || "Tambay",
            avatar: localAvatar
          };

      $("onlineName").value = profile.display_name;
      $("onlineAvatar").value = profile.avatar;

      // Only create a profile when this account does not already have one.
      if (!savedProfile) await saveProfile(false);

      const accountName = $("accountOpen")?.querySelector(".account-chip-name");
      if (accountName) accountName.textContent = profile.display_name || "Tambay";
      await refreshRoomList();
      const notificationRoomId = new URLSearchParams(window.location.search).get("openRoom");

      if (notificationRoomId) {
        // Only open rooms this signed-in account is already a member of.
        const notificationRoom = joinedRooms.find(room => String(room.id) === String(notificationRoomId));
        window.history.replaceState({}, "", window.location.pathname + window.location.hash);

        if (notificationRoom) {
          await enterRoom(notificationRoom.id, notificationRoom.room_code, notificationRoom.room_name);
        } else {
          saveActiveRoom(null);
          $("onlineRoom").style.display = "none";
          renderRoomList();
          showWelcomeUniverse();
          status("That chatroom isn't available on this account.", true);
        }
      } else {
        status("You're connected! Create a room or join with a code. 💜");
        // Normal visits continue to show the chatroom list.
        saveActiveRoom(null);
        $("onlineRoom").style.display = "none";
        renderRoomList();
        showWelcomeUniverse();
      }
    } catch (error) {
      console.error("Online Tambayan initialization failed:", error);
      const message = error.message || "Could not connect to Online Tambayan. Please refresh.";
      status(message, true);
      // Never leave the visitor on an endless session-restoration screen.
      document.documentElement.classList.remove("auth-checking");
      if (document.documentElement.classList.contains("auth-locked")) {
        const gateMessage = $("authGate")?.querySelector(".auth-gate-description");
        if (gateMessage) gateMessage.textContent = "We couldn't connect just yet. Check your internet connection and try logging in again.";
      }
    }
  }

  async function saveProfile(showNotice = true) {
    if (!client || !currentUser) return;
    const name = $("onlineName").value.trim().slice(0, 24) || "Tambay";
    const avatar = $("onlineAvatar").value.trim().slice(0, 8) || "💜";
    const { error } = await client.from("chat_profiles").upsert({
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

  // Avatar Studio updates the main Tambayan identity only.
  // The chatroom nickname/avatar remain independently stored in chat_profiles.
  window.tambayanSyncPublicProfile = async function (details) {
    if (!client || !currentUser) throw new Error("Account connection is not ready.");
    const name = String(details?.name || "Tambay").trim().slice(0, 24) || "Tambay";
    const avatar = String(details?.avatar || "💜").slice(0, 8) || "💜";
    const { error } = await client.from("profiles").upsert({
      user_id: currentUser.id,
      display_name: name,
      avatar
    }, { onConflict: "user_id" });
    if (error) throw error;
    const accountName = $("accountOpen")?.querySelector(".account-chip-name");
    if (accountName) accountName.textContent = name;
    return true;
  };

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
      roomUnreadCounts.clear();
      joinedRooms = [];
      syncBackgroundRoomListeners();
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
await refreshUnreadCounts();
syncBackgroundRoomListeners();
renderRoomList();
  }

  async function refreshUnreadCounts() {
    const { data, error } = await client.rpc("get_my_room_unread_counts");

    if (error) {
      console.warn("Could not load unread counts:", error);
      return;
    }

    roomUnreadCounts.clear();

    const counts = data && typeof data === "object" ? data : {};

    Object.entries(counts).forEach(([roomId, count]) => {
      const unread = Number(count);
      if (unread > 0) roomUnreadCounts.set(String(roomId), unread);
    });
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
          ${(roomUnreadCounts.get(String(room.id)) || 0) > 0
            ? '<span style="display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 6px;margin-left:6px;border-radius:20px;background:#e85d91;color:white;font-size:11px;font-weight:800;">' +
              Math.min(roomUnreadCounts.get(String(room.id)), 99) +
              (roomUnreadCounts.get(String(room.id)) > 99 ? "+" : "") +
              '</span>'
            : ""}
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
    function syncBackgroundRoomListeners() {
    if (!client || !currentUser) return;

    const joinedIds = new Set(joinedRooms.map(room => String(room.id)));

    for (const [roomId, channel] of backgroundRoomChannels) {
      if (!joinedIds.has(roomId)) {
        client.removeChannel(channel);
        backgroundRoomChannels.delete(roomId);
        backgroundNotificationCounts.delete(roomId);
      }
    }

    for (const room of joinedRooms) {
      const roomId = String(room.id);
      if (backgroundRoomChannels.has(roomId)) continue;

      const channel = client.channel("background-room-" + roomId);

      channel
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: "room_id=eq." + room.id
        }, async payload => {
          const message = payload.new;
if (!message || message.user_id === currentUser.id) return;

if (currentRoom?.id !== roomId) {
  const unread = (roomUnreadCounts.get(roomId) || 0) + 1;
  roomUnreadCounts.set(roomId, unread);
  renderRoomList();
}

if (!document.hidden && currentRoom?.id === roomId) return;
if (pushSubscriptionActive) return;
if (!("Notification" in window) || Notification.permission !== "granted") return;

          const count = (backgroundNotificationCounts.get(roomId) || 0) + 1;
          backgroundNotificationCounts.set(roomId, count);

          let senderName = "Someone";
          try {
            const { data } = await client.from("chat_profiles")
              .select("display_name")
              .eq("user_id", message.user_id)
              .maybeSingle();
            if (data?.display_name) senderName = data.display_name;
          } catch (error) {
            console.warn("Could not load notification sender:", error);
          }

          const preview = String(message.content || "").slice(0, 160);
          const roomName = room.room_name || "Online Tambayan";

          notificationQueue = notificationQueue.then(async () => {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(roomName, {
              body: count === 1
                ? senderName + ": " + preview
                : count + " new messages · Latest: " + senderName + ": " + preview,
              tag: "tambayan-room-" + roomId,
              renotify: true,
              timestamp: Date.now(),
              data: { roomId }
            });
          }).catch(error => {
            console.warn("Could not show background room notification:", error);
          });
        })
        .subscribe(state => {
          if (state === "CHANNEL_ERROR") {
            console.warn("Background listener connection error for room:", roomId);
          }
        });

      backgroundRoomChannels.set(roomId, channel);
    }
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
roomUnreadCounts.delete(String(roomId));
$("onlineRoom").style.display = "block";
renderRoomList();
    $("onlineRoomTitle").textContent = roomName;
    $("onlineRoomCode").textContent = code;
    $("onlineTypingIndicator").textContent = "";
    messageIds = new Set();
    oldestMessageCursor = null;
    hasMoreMessages = true;
    loadingOlderMessages = false;
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

          await catchUpRoomMessages();

          status("You're in " + roomName + ". Share code " + code + " with friends!");
        } else if (state === "CHANNEL_ERROR") {
          status("Room connection error. Please rejoin.", true);
        }
      });
  }
  async function prepareMessageReceipts(messages) {
    const ownMessageIds = messages
      .filter(message => message.user_id === currentUser.id)
      .map(message => message.id);
    const incomingMessages = messages.filter(message => message.user_id !== currentUser.id);
    const senderIds = [...new Set(incomingMessages.map(message => message.user_id).filter(Boolean))]
      .filter(userId => !profileCache.has(userId));

    const tasks = [];

    if (senderIds.length) {
      tasks.push((async () => {
        const { data, error } = await client.from("chat_profiles")
          .select("user_id,display_name,avatar")
          .in("user_id", senderIds);
        if (error) {
          console.warn("Could not preload chat profiles:", error);
          return;
        }
        for (const senderId of senderIds) {
          const found = (data || []).find(row => row.user_id === senderId);
          profileCache.set(senderId, found
            ? { display_name: found.display_name || "Tambay", avatar: found.avatar || "💜" }
            : { display_name: "Tambay", avatar: "💜" });
        }
      })());
    }

    if (ownMessageIds.length) {
      tasks.push((async () => {
        const { data, error } = await client.from("message_reads")
          .select("message_id,user_id")
          .in("message_id", ownMessageIds);
        if (error) {
          console.warn("Could not load read receipts:", error);
          return;
        }
        for (const read of data || []) {
          if (read.user_id !== currentUser.id) {
            receiptMessageIds.add(String(read.message_id));
          }
        }
      })());
    }

    if (incomingMessages.length) {
      const rows = incomingMessages.map(message => ({
        message_id: message.id,
        user_id: currentUser.id
      }));
      for (const message of incomingMessages) seenMessageIds.add(String(message.id));
      tasks.push((async () => {
        const { error } = await client.from("message_reads")
          .upsert(rows, { onConflict: "message_id,user_id", ignoreDuplicates: true });
        if (error) {
          for (const message of incomingMessages) seenMessageIds.delete(String(message.id));
          console.warn("Could not mark loaded messages as seen:", error);
        }
      })());
    }

    await Promise.all(tasks);
  }

  async function loadMessages() {
    const messagesBox = $("onlineMessages");
    const roomId = currentRoom.id;

    messagesBox.innerHTML = '<span class="online-muted">Loading chat…</span>';
    oldestMessageCursor = null;
    hasMoreMessages = true;
    loadingOlderMessages = false;
    messageIds = new Set();

    const olderStatus = $("onlineOlderMessagesStatus");
    if (olderStatus) olderStatus.style.display = "none";

    const { data, error } = await client.from("messages")
      .select("id,user_id,content,created_at")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(50);

    if (error) throw error;
    if (!currentRoom || currentRoom.id !== roomId) return;

    const messages = (data || []).reverse();
    messagesBox.innerHTML = "";
    hasMoreMessages = messages.length === 50;

    if (messages.length) {
      const oldest = messages[0];
      oldestMessageCursor = { created_at: oldest.created_at, id: oldest.id };
    }

    await prepareMessageReceipts(messages);
    for (const message of messages) {
      await appendMessage(message, false, false);
    }

    // Always open a room at its newest message.
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }
  async function catchUpRoomMessages() {
    if (!currentRoom) return;

    const roomId = currentRoom.id;
    try {
      const { data, error } = await client.from("messages")
        .select("id,user_id,content,created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(100);

      if (error) throw error;
      if (!currentRoom || currentRoom.id !== roomId) return;

      const messages = (data || []).reverse();
      await prepareMessageReceipts(messages);

      for (const message of messages) {
        await appendMessage(message, false, false);
      }

      // Catch-up can add messages received during connection; stay at the bottom.
      $("onlineMessages").scrollTop = $("onlineMessages").scrollHeight;
    } catch (error) {
      console.warn("Could not catch up on room messages:", error);
    }
  }
      async function loadOlderMessages() {
  if (
    !currentRoom ||
    !oldestMessageCursor ||
    !hasMoreMessages ||
    loadingOlderMessages
  ) return;

  loadingOlderMessages = true;

  const messagesBox = $("onlineMessages");
  const olderStatus = $("onlineOlderMessagesStatus");

  const roomId = currentRoom.id;
  const oldScrollHeight = messagesBox.scrollHeight;
  const oldScrollTop = messagesBox.scrollTop;

  if (olderStatus) {
    olderStatus.textContent = "Loading older messages...";
    olderStatus.style.display = "block";
  }

  try {
    const cursor = oldestMessageCursor;

    const { data, error } = await client.from("messages")
      .select("id,user_id,content,created_at")
      .eq("room_id", roomId)
      .or(
        `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
      )
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(50);

    if (error) throw error;

    if (!currentRoom || currentRoom.id !== roomId) return;

    const messages = (data || []).reverse();

    if (!messages.length) {
      hasMoreMessages = false;
      return;
    }

    hasMoreMessages = messages.length === 50;

    const oldest = messages[0];

    oldestMessageCursor = {
      created_at: oldest.created_at,
      id: oldest.id
    };

    await prepareMessageReceipts(messages);
    for (const message of messages) {
      await appendMessage(message, false, false);
    }

    const newScrollHeight = messagesBox.scrollHeight;

    messagesBox.scrollTop =
      oldScrollTop + (newScrollHeight - oldScrollHeight);

  } catch (error) {
    console.warn("Could not load older messages:", error);
  } finally {
    loadingOlderMessages = false;

    if (olderStatus) {
      olderStatus.style.display = "none";
    }
  }
    }

  async function getMessageProfile(userId) {
    if (!userId) return { display_name: "Tambay", avatar: "💜" };
    if (userId === currentUser.id) return profile;
    if (profileCache.has(userId)) return profileCache.get(userId);
    const fallback = { display_name: "Tambay", avatar: "💜" };
    const { data, error } = await client.from("chat_profiles")
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
  function showPhotoPreview(url) {
  let preview = document.getElementById("onlinePhotoPreview");

  if (!preview) {
    preview = document.createElement("div");
    preview.id = "onlinePhotoPreview";
    preview.style.cssText = `
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.9);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:99999;
      padding:20px;
      cursor:pointer;
    `;

    preview.innerHTML = `
      <img style="max-width:100%;max-height:90vh;object-fit:contain;border-radius:12px;">
      <span style="position:absolute;top:20px;right:24px;color:white;font-size:32px;">×</span>
    `;

    preview.addEventListener("click", () => {
      preview.style.display = "none";
    });

    document.body.appendChild(preview);
  }

  preview.querySelector("img").src = url;
  preview.style.display = "flex";
      }
  async function appendMessage(message, notify = false, markRead = true) {
    if (!message) return;
    const id = String(message.id);
    if (messageIds.has(id)) return;
    messageIds.add(id);

    const mine = message.user_id === currentUser.id;

    if (
      notify &&
      !mine &&
      document.hidden &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      backgroundNotificationCount++;

      const cachedSender = profileCache.get(message.user_id);
      const notificationName = cachedSender?.display_name || "New message";
      const messagePreview = String(message.content || "").slice(0, 180);
      const count = backgroundNotificationCount;

      notificationQueue = notificationQueue
        .then(async () => {
          const registration = await navigator.serviceWorker.ready;

          await registration.showNotification(
            currentRoom?.name || "Online Tambayan",
            {
              body: count === 1
                ? `${notificationName}: ${messagePreview}`
                : `${count} new messages · Latest: ${notificationName}: ${messagePreview}`,
              tag: "tambayan-room-" + (currentRoom?.id || "chat"),
              renotify: true,
              timestamp: Date.now()
            }
          );
        })
        .catch(error => {
          console.warn("Could not show notification:", error);
        });
    }

    const sender = await getMessageProfile(message.user_id);
    const who = mine ? profile.display_name : sender.display_name;
    const avatar = mine ? profile.avatar : sender.avatar;

    const item = document.createElement("div");
    item.className = "online-message" + (mine ? " is-mine" : " is-other");
    item.dataset.messageId = id;
    item.dataset.createdAt = message.created_at || "";

    const time = message.created_at ? new Date(message.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }) : "";

    item.innerHTML = `
      <small>
        <span aria-hidden="true">${safeText(avatar || "💜")}</span>
        <strong>${safeText(who || "Tambay")}</strong>
        · ${safeText(time)}
      </small>
      <div class="online-message-content">${safeText(message.content)}</div>
      ${mine ? `<span class="online-message-receipt">${receiptMessageIds.has(id) ? "✓✓ Seen" : "✓ Sent"}</span>` : ""}
    `;
    const contentEl = item.querySelector(".online-message-content");

if (String(message.content || "").startsWith("[[PHOTO]]")) {
  const path = message.content.slice(9);

  const { data, error } = await client.storage
    .from("chat-photos")
    .createSignedUrl(path, 3600);

  contentEl.textContent = "";

  if (!error && data?.signedUrl) {
    const img = document.createElement("img");
    img.src = data.signedUrl;
    img.alt = "Chat photo";
    img.className = "online-chat-photo";
    img.onclick = () => showPhotoPreview(data.signedUrl);
    contentEl.appendChild(img);
  } else {
    contentEl.textContent = "📷 Photo unavailable";
  }
}
        const messageList = $("onlineMessages");
    const wasNearBottom =
      messageList.scrollHeight - messageList.scrollTop - messageList.clientHeight < 80;

    const incomingTime = Date.parse(message.created_at || "");
    const existingItems = Array.from(messageList.querySelectorAll(".online-message"));
    const insertBefore = existingItems.find(existing => {
      const existingTime = Date.parse(existing.dataset.createdAt || "");
      if (Number.isFinite(incomingTime) && Number.isFinite(existingTime) && incomingTime !== existingTime) {
        return existingTime > incomingTime;
      }
      return String(existing.dataset.messageId || "").localeCompare(id) > 0;
    });

    if (insertBefore) messageList.insertBefore(item, insertBefore);
    else messageList.appendChild(item);

    if (wasNearBottom) {
      messageList.scrollTop = messageList.scrollHeight;
    }
    if (!mine && markRead) await markMessageRead(message);
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
  async function sendPhoto(file) {
  if (!client || !currentRoom || !currentUser) return;

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Photo must be 5MB or smaller.");
  }

  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${currentRoom.id}/${currentUser.id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await client.storage
    .from("chat-photos")
    .upload(path, file, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data: insertedPhoto, error } = await client.from("messages").insert({
    room_id: currentRoom.id,
    user_id: currentUser.id,
    content: `[[PHOTO]]${path}`
  }).select("id").single();

  if (error) throw error;
  notifyRoomMembers(currentRoom.id, insertedPhoto.id);
      }

  async function notifyRoomMembers(roomId, messageId) {
    if (!client || !roomId || !messageId) return;
    try {
      const { error } = await client.functions.invoke("send-chat-push", {
        body: { room_id: roomId, message_id: messageId }
      });
      if (error) console.warn("Chat push delivery could not be requested:", error);
    } catch (error) {
      console.warn("Chat push delivery could not be requested:", error);
    }
  }

  async function sendMessage(content) {
    if (!client || !currentRoom) return;
    const text = String(content || "").trim().slice(0, 1000);
    if (!text) return;
    const roomId = currentRoom.id;
    const { data: insertedMessage, error } = await client.from("messages").insert({
      room_id: roomId, user_id: currentUser.id, content: text
    }).select("id").single();
    if (error) throw error;
    notifyRoomMembers(roomId, insertedMessage.id);
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
    catch (error) { status(error.message || "Profile couldn't be saved.", true); }
  };

$("onlineManageAccount").onclick = () => {
  $("accountOpen").click();
};
    
    // BADING TAMBAYAN — OPEN MAIN ACCOUNT WINDOW
  $("accountOpen").onclick = () => {
  const message = $("accountStatus");

  if (currentUser && !currentUser.is_anonymous) {
    const email = currentUser.email || "No email available";

    $("accountTitle").textContent = "My Account 💜";
    $("accountDescription").textContent = "You're logged in as " + email;

    $("accountEmail").style.display = "none";
    $("accountPassword").style.display = "none";
    $("accountLogin").style.display = "none";
    $("accountSignup").style.display = "none";
    $("accountForgot").style.display = "none";
    $("accountNewPasswordLabel").style.display = "";
    $("accountNewPassword").style.display = "";
    $("accountChangePassword").style.display = "";
    $("accountNewPassword").value = "";

    message.innerHTML = '<button class="danger-btn full-btn" id="accountLogout" type="button">Log out</button>';

    $("accountDialog").showModal();

    $("accountLogout").onclick = async () => {
      message.textContent = "Logging out...";
      const { error } = await client.auth.signOut();

      if (error) {
        message.textContent = error.message;
        return;
      }

      try { sessionStorage.removeItem("tambayanWelcomeShown"); } catch (_) {}
      window.location.reload();
    };

  } else {
    $("accountTitle").textContent = "Welcome back! 💜";
    $("accountDescription").textContent = "Log in to continue your Bading Tambayan journey.";

    $("accountEmail").style.display = "";
    $("accountPassword").style.display = "";
    $("accountLogin").style.display = "";
    $("accountSignup").style.display = "";
    $("accountForgot").style.display = "";
    $("accountNewPasswordLabel").style.display = "none";
    $("accountNewPassword").style.display = "none";
    $("accountChangePassword").style.display = "none";

    message.textContent = "";
    $("accountDialog").showModal();
  }
};
  $("accountChangePassword").onclick = async () => {
  const password = $("accountNewPassword").value;
  const message = $("accountStatus");

  if (!password || password.length < 8) {
    message.textContent = "Your new password must be at least 8 characters.";
    return;
  }

  try {
    message.textContent = "Updating password...";
    const { error } = await client.auth.updateUser({ password });
    if (error) throw error;

    $("accountNewPassword").value = "";
    message.textContent = "Password updated successfully! 💜";
  } catch (error) {
    message.textContent = error.message;
  }
};
  // LOGIN GATE BUTTONS
$("gateLogin").onclick = () => {
  $("accountOpen").click();
  $("accountTitle").textContent = "Welcome back! 💜";
  $("accountDescription").textContent = "Log in to continue your Bading Tambayan journey.";
};

$("gateSignup").onclick = () => {
  $("accountOpen").click();
  $("accountTitle").textContent = "Join Bading Tambayan! 💜";
  $("accountDescription").textContent = "Create your account and come on in.";
};
  
    // BADING TAMBAYAN — MAIN ACCOUNT LOGIN
  $("accountLogin").onclick = async () => {
  const email = $("accountEmail").value.trim();
  const password = $("accountPassword").value;
  const message = $("accountStatus");

  if (!email || !password) {
    message.textContent = "Please enter your email and password.";
    return;
  }

  try {
    message.textContent = "Logging in...";

    const { error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    message.textContent = "Welcome back! Reconnecting... 💜";
    try { sessionStorage.removeItem("tambayanWelcomeShown"); } catch (_) {}
    window.location.reload();
  } catch (error) {
    message.textContent = error.message;
  }
};
  $("accountSignup").onclick = async () => {
  const email = $("accountEmail").value.trim();
  const password = $("accountPassword").value;
  const message = $("accountStatus");

  if (!email || !password) {
    message.textContent = "Please enter your email and password.";
    return;
  }

  if (password.length < 8) {
    message.textContent = "Password must be at least 8 characters.";
    return;
  }

  try {
    message.textContent = "Creating your account...";

    // A signup must create a separate Supabase user.
    // Sign out any current guest/account first so its identity and progress
    // are never converted into, or carried into, the new email account.
    const { error: signOutError } = await client.auth.signOut();
    if (signOutError) throw signOutError;
    currentUser = null;

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://badingglyy-den.github.io/bading-tambayan-4./"
      }
    });

    if (error) throw error;

    if (data.session) {
      message.textContent = "Account created! Welcome to Bading Tambayan! 💜";
      try { sessionStorage.removeItem("tambayanWelcomeShown"); } catch (_) {}
      window.location.reload();
    } else {
      message.textContent =
        "Verification email sent! Please confirm your email before logging in. 💜";
    }
  } catch (error) {
    message.textContent = error.message;
  }
};
    

    // BADING TAMBAYAN — PASSWORD RECOVERY
  $("accountForgot").onclick = async () => {
    const email = $("accountEmail").value.trim();
    const message = $("accountStatus");

    if (!email) {
      message.textContent = "Enter your email address first.";
      return;
    }

    try {
      message.textContent = "Sending password reset email...";

      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: "https://badingglyy-den.github.io/bading-tambayan-4./"
      });

      if (error) throw error;

      message.textContent =
        "Password reset instructions have been sent to your email. 💜";
    } catch (error) {
      message.textContent = error.message;
    }
  };
    // ONLINE TAMBAYAN — BROWSER NOTIFICATION PERMISSION
  const PUSH_VAPID_PUBLIC_KEY = "BLYoZPrXQiPTJClseK0NsuZItBrIRkDtwgcEBg_wRnyigV1eE7YWMP0GPy0NvLotC4Zj4c6aTDhi0RpOxPgR2_s";

  function base64UrlToBytes(value) {
    const padding = "=".repeat((4 - value.length % 4) % 4);
    const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    return Uint8Array.from(raw, char => char.charCodeAt(0));
  }

  function updateNotificationControl() {
    const button = $("onlineNotificationButton");
    const label = $("onlineNotificationStatus");
    if (!button || !label) return;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;

    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      button.disabled = true;
      button.textContent = "Notifications unavailable";
      label.textContent = isIOS && !isStandalone
        ? "On iPhone, add Bading Tambayan to your Home Screen first, then open the app."
        : "This browser doesn't support web push notifications.";
      return;
    }

    if (Notification.permission === "denied") {
      button.disabled = true;
      button.textContent = "🔕 Notifications blocked";
      label.textContent = "Allow notifications in your browser or device settings.";
      return;
    }

    button.disabled = false;
    button.textContent = Notification.permission === "granted"
      ? "🔔 Finish enabling notifications"
      : "🔔 Enable chat notifications";
    label.textContent = isIOS && !isStandalone
      ? "On iPhone, install the Home Screen app first to enable push notifications."
      : "Get chat alerts even when Bading Tambayan is closed.";
  }

  async function enableChatPushNotifications() {
    const button = $("onlineNotificationButton");
    const label = $("onlineNotificationStatus");
    if (!client || !currentUser) throw new Error("Please sign in to your Bading Tambayan account first.");

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;
    if (isIOS && !isStandalone) {
      label.textContent = "First tap Share in Safari → Add to Home Screen. Then open the installed app and enable notifications here.";
      return;
    }

    if (!("Notification" in window) || !("PushManager" in window) || !("serviceWorker" in navigator)) {
      throw new Error("This browser does not support web push. On iPhone, use the installed Home Screen app.");
    }

    button.disabled = true;
    label.textContent = "Requesting notification permission…";
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      updateNotificationControl();
      if (permission === "default") label.textContent = "Permission wasn't granted. Tap Enable when you're ready.";
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToBytes(PUSH_VAPID_PUBLIC_KEY)
      });
    }

    const json = subscription.toJSON();
    const { error } = await client.from("push_subscriptions").upsert({
      user_id: currentUser.id,
      endpoint: subscription.endpoint,
      subscription: json,
      updated_at: new Date().toISOString()
    }, { onConflict: "endpoint" });
    if (error) throw error;

    pushSubscriptionActive = true;
    button.textContent = "🔔 Chat notifications enabled";
    button.disabled = true;
    label.textContent = "You're all set! New chat messages can reach this device when the app is closed. 💜";
  }

  $("onlineNotificationButton").onclick = async () => {
    try {
      await enableChatPushNotifications();
    } catch (error) {
      console.error("Could not enable chat push notifications:", error);
      $("onlineNotificationStatus").textContent = error.message || "Couldn't enable notifications. Please try again.";
      $("onlineNotificationButton").disabled = false;
    }
  };

  updateNotificationControl();
  if ("serviceWorker" in navigator && "PushManager" in window && "Notification" in window) {
    navigator.serviceWorker.ready.then(async registration => {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription && Notification.permission === "granted") {
        pushSubscriptionActive = true;
        const button = $("onlineNotificationButton");
        const label = $("onlineNotificationStatus");
        if (button && label) {
          button.textContent = "🔔 Chat notifications enabled";
          button.disabled = true;
          label.textContent = "This device is registered for chat push notifications.";
        }
      }
    }).catch(error => console.warn("Could not check push subscription:", error));
  }



  $("onlineCreateRoom").onclick = createRoom;
  $("onlineJoinRoom").onclick = joinRoom;
  $("onlineLeaveRoom").onclick = () => leaveRoom();

  $("onlineJoinCode").oninput = event => {
    event.target.value = event.target.value.toUpperCase()
      .replace(/[^A-Z0-9]/g, "").slice(0, 6);
  };
  $("onlineMessages").addEventListener("scroll", () => {
  if ($("onlineMessages").scrollTop <= 40) {
    loadOlderMessages();
  }
});
$("onlinePhotoInput").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    await sendPhoto(file);
    status("Photo sent!");
  } catch (error) {
    status(error.message || "Photo couldn't be sent.", true);
  }

  event.target.value = "";
});
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
    // ONLINE TAMBAYAN — FINAL VISUAL UPGRADE
  const chatroomFinalStyle = document.createElement("style");
  chatroomFinalStyle.textContent = `
    #onlineTambayan {
      color: #f5edff;
    }

    #onlineTambayan .section-heading h2 {
      letter-spacing: -.5px;
      text-shadow: 0 3px 20px rgba(190,145,255,.2);
    }

    #onlineTambayan .section-note {
      color: #c8addf;
    }

    #onlineTambayan .online-panel {
      border: 1px solid rgba(203,169,255,.2);
      box-shadow: 0 18px 45px rgba(8,3,20,.28);
    }

    #onlineTambayan .online-muted {
      color: #b9a9ca;
      line-height: 1.55;
    }

    #onlineTambayan .online-grid > div,
    #onlineTambayan #onlineMyRoomsBox,
    #onlineTambayan .online-columns > .online-box {
      border: 1px solid rgba(204,174,255,.13);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.035);
    }

    #onlineTambayan .online-grid > div {
      background: linear-gradient(145deg, rgba(158,111,220,.12), rgba(255,255,255,.025));
    }

    #onlineTambayan h3 {
      color: #f1e4ff;
    }

    #onlineTambayan input {
      color: #fff;
      background: rgba(9,5,19,.55);
      border: 1px solid rgba(198,164,255,.24);
      border-radius: 11px;
      padding: 11px 12px;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }

    #onlineTambayan input:focus {
      border-color: #bd91ff;
      box-shadow: 0 0 0 3px rgba(189,145,255,.13);
    }

    #onlineTambayan input::placeholder {
      color: #88799b;
    }

    #onlineTambayan button {
      border-radius: 11px;
      transition: transform .18s, filter .18s, box-shadow .18s;
    }

    #onlineTambayan button:hover {
      filter: brightness(1.12);
      box-shadow: 0 5px 18px rgba(170,112,255,.15);
    }

    #onlineTambayan button:active {
      transform: scale(.97);
    }

    #onlineTambayan .online-status {
      padding: 11px 13px;
      border-radius: 12px;
      background: rgba(173,130,255,.08);
      border: 1px solid rgba(190,155,255,.13);
    }

    #onlineTambayan .online-notification-settings {
      padding: 12px;
      border-radius: 13px;
      background: rgba(255,255,255,.035);
      border: 1px solid rgba(200,170,255,.12);
    }

    #onlineTambayan #onlineMyRoomsBox {
      background: linear-gradient(145deg, rgba(153,111,205,.09), rgba(255,255,255,.025));
    }

    #onlineTambayan .online-room-card {
      border: 1px solid rgba(194,158,255,.17);
      border-radius: 13px;
      background: rgba(158,119,211,.09);
      transition: background .2s, border-color .2s, transform .2s;
    }

    #onlineTambayan .online-room-card:hover {
      background: rgba(158,119,211,.17);
      border-color: rgba(207,174,255,.4);
      transform: translateY(-2px);
    }

    #onlineTambayan .online-room-top {
      background:
        radial-gradient(ellipse at top left, rgba(180,133,255,.15), transparent 65%),
        rgba(150,108,205,.07);
      border-color: rgba(205,170,255,.2);
    }

    #onlineTambayan .online-code {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 8px;
      background: rgba(184,140,255,.14);
      border: 1px solid rgba(204,171,255,.22);
      letter-spacing: 2px;
    }

    #onlineTambayan .online-messages {
      background:
        radial-gradient(ellipse at top right, rgba(151,105,208,.09), transparent 55%),
        rgba(7,4,15,.58);
      border: 1px solid rgba(190,155,255,.12);
    }

    #onlineTambayan .online-message {
      padding: 10px 13px;
      border: 1px solid rgba(207,177,255,.12);
      box-shadow: 0 4px 12px rgba(0,0,0,.12);
      line-height: 1.5;
    }

    #onlineTambayan .online-compose {
      gap: 8px;
    }

    #onlineTambayan .online-compose input {
      min-width: 0;
      background: rgba(255,255,255,.055);
    }

    #onlineTambayan .online-members {
      padding-top: 5px;
    }

    #onlineTambayan .online-member {
      padding: 9px 10px;
      border-radius: 10px;
      background: rgba(174,133,226,.07);
      border: 1px solid rgba(194,158,255,.1);
    }

    #onlineTambayan .online-typing {
      color: #c7a6ee;
      font-size: .82rem;
    }

    @media (max-width: 620px) {
      #onlineTambayan .online-panel {
        padding: 13px;
      }

      #onlineTambayan .online-grid > div {
        border-radius: 15px;
      }

      #onlineTambayan .online-messages {
        min-height: 260px;
        border-radius: 13px;
      }

      #onlineTambayan .online-compose input {
        font-size: 16px;
      }

            #onlineTambayan .online-room-top {
        gap: 12px;
      }

      /* Bigger mobile chatroom */
      #onlineTambayan .online-panel {
        padding: 8px;
      }

      #onlineTambayan .online-room {
        padding-left: 0;
        padding-right: 0;
      }

      #onlineTambayan .online-columns > .online-box {
        padding: 10px;
      }

      #onlineTambayan .online-messages {
        height: min(48vh, 480px);
        min-height: 340px;
        max-height: 480px;
      }

      #onlineTambayan .online-compose input {
        flex: 1;
        width: 100%;
      }
    }
  `;
  document.head.appendChild(chatroomFinalStyle);
  


  // ONLINE TAMBAYAN — CONSOLIDATED LAYOUT POLISH
  const organizedChatStyle = document.createElement("style");
  organizedChatStyle.textContent = `
    #onlineTambayan { margin: 26px 0 42px; }
    #onlineTambayan .section-heading { margin-bottom: 13px; }
    #onlineTambayan .online-panel {
      display: grid;
      grid-template-columns: repeat(12,minmax(0,1fr));
      gap: 14px;
      padding: clamp(14px,2.5vw,24px);
      background: linear-gradient(155deg,#201832 0%,#171222 70%,#1c1729 100%);
      border: 1px solid rgba(203,177,235,.2);
      border-radius: 22px;
    }
    #onlineTambayan .online-panel > .online-muted { grid-column: 1/-1; margin: 0; }
    #onlineTambayan .online-grid {
      grid-column: span 7;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 12px;
      margin: 0;
    }
    #onlineTambayan .online-grid > div,
    #onlineTambayan #onlineAccountBox,
    #onlineTambayan #onlineMyRoomsBox,
    #onlineTambayan .online-columns > .online-box {
      min-width: 0;
      padding: 16px;
      border: 1px solid rgba(203,177,235,.15);
      border-radius: 15px;
      background: rgba(255,255,255,.035);
      box-shadow: none;
    }
    #onlineTambayan .online-grid h3,
    #onlineTambayan #onlineAccountBox h3,
    #onlineTambayan #onlineMyRoomsBox h3,
    #onlineTambayan .online-columns h3 {
      margin: 0 0 9px;
      font-size: 1rem;
      color: #f1e9fa;
    }
    #onlineTambayan #onlineAccountBox {
      grid-column: span 5;
      align-self: stretch;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 7px;
    }
    #onlineTambayan #onlineAccountEmailDisplay {
      max-width: 100%;
      overflow-wrap: anywhere;
      color: #eee0ff;
      font-size: .9rem;
    }
    #onlineTambayan .online-status { grid-column: 1/-1; margin: 0; }
    #onlineTambayan .online-notification-settings {
      grid-column: 1/-1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
      padding: 10px 13px;
      border: 1px solid rgba(203,177,235,.13);
      border-radius: 13px;
      background: rgba(255,255,255,.025);
    }
    #onlineTambayan .online-notification-settings button { margin: 0; }
    #onlineTambayan #onlineMyRoomsBox { grid-column: 1/-1; margin: 0; }
    #onlineTambayan .online-room-list {
      grid-template-columns: repeat(auto-fill,minmax(min(100%,205px),1fr));
      margin: 12px 0 0;
    }
    #onlineTambayan .online-room { grid-column: 1/-1; min-width: 0; margin-top: 0; padding-top: 16px; }
    #onlineTambayan .online-room-top { align-items: center; }
    #onlineTambayan .online-columns {
      grid-template-columns: minmax(0,1fr) 235px;
      align-items: stretch;
      gap: 13px;
    }
    #onlineTambayan .online-columns > .online-box { min-width: 0; }
    #onlineTambayan .online-messages {
      height: clamp(340px,52vh,570px);
      min-height: 340px;
      max-height: 570px;
      padding: 13px;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
    }
    #onlineTambayan .online-message { max-width: min(88%,560px); }
    #onlineTambayan .online-members { max-height: 440px; overflow-y: auto; }
    #onlineTambayan .online-compose {
      position: sticky;
      bottom: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: #282039;
      border: 1px solid rgba(203,177,235,.22);
      border-radius: 14px;
    }
    #onlineTambayan .online-compose input { flex: 1; min-width: 0; margin: 0; }
    #onlineTambayan .online-compose button { margin: 0; }
    #onlineTambayan .online-photo-button { flex: 0 0 42px; margin: 0; }
    #onlineTambayan .online-reactions { padding-top: 10px; }
    #onlineTambayan :is(input,button):focus-visible {
      outline: 2px solid #d6baff;
      outline-offset: 2px;
    }
    @media(max-width:760px) {
      #onlineTambayan .online-panel { gap: 11px; padding: 12px; }
      #onlineTambayan .online-grid { grid-column: 1/-1; grid-template-columns: 1fr; }
      #onlineTambayan #onlineAccountBox { grid-column: 1/-1; }
      #onlineTambayan .online-columns { grid-template-columns: 1fr; }
      #onlineTambayan .online-columns > .online-box { padding: 12px; }
      #onlineTambayan .online-messages {
        height: min(55vh,500px);
        min-height: 320px;
        max-height: 500px;
      }
      #onlineTambayan .online-members { max-height: 230px; }
      #onlineTambayan .online-room-top { align-items: flex-start; }
      #onlineTambayan .online-room-actions { width: 100%; }
      #onlineTambayan .online-room-actions button { flex: 1 1 auto; }
      #onlineTambayan .online-message { max-width: 96%; }
    }
    @media(max-width:390px) {
      #onlineTambayan .online-compose { gap: 5px; padding: 6px; }
      #onlineTambayan .online-photo-button { flex-basis: 34px; padding: 6px; }
      #onlineTambayan .online-compose button { min-width: 58px; padding: 9px; }
      #onlineTambayan .online-reactions button { min-width: 39px; }
    }
    @media(prefers-reduced-motion:reduce) {
      #onlineTambayan .online-room-card,
      #onlineTambayan button { transition: none!important; }
    }
  `;
  document.head.appendChild(organizedChatStyle);

})();
