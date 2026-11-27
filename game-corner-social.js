(() => {
  "use strict";

  const root = document.getElementById("gameCornerSocial");
  if (!root || root.dataset.ready === "true") return;
  root.dataset.ready = "true";


  const style = document.createElement("style");
  style.textContent = `
    #view-community .game-corner-social { display:grid; gap:14px; margin-top:18px; }
    #view-community .gc-intro { color:var(--muted); font-size:13px; line-height:1.65; }
    #view-community .gc-activity-tabs { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; }
    #view-community .gc-tab { min-height:48px; padding:11px 13px; border:1px solid var(--line); border-radius:13px; background:var(--panel); color:var(--text); font:inherit; font-size:12px; font-weight:800; cursor:pointer; }
    #view-community .gc-tab.active { border-color:var(--accent); background:var(--panel2); color:var(--accent); }
    #view-community .gc-game-panel { min-width:0; padding:clamp(16px,3vw,24px); border:1px solid var(--line); border-radius:17px; background:var(--panel); }
    #view-community .gc-game-panel[hidden] { display:none !important; }
    #view-community .gc-game-panel h4 { margin:5px 0 8px; color:var(--text); font-size:clamp(20px,3vw,25px); }
    #view-community .gc-description { max-width:65ch; margin:0 0 16px; color:var(--muted); font-size:13px; line-height:1.7; }
    #view-community .gc-prompt-card { padding:16px; border:1px solid var(--line); border-radius:13px; background:var(--panel2); }
    #view-community .gc-kicker { color:var(--accent); font-size:9px; font-weight:900; letter-spacing:.15em; }
    #view-community .gc-prompt-card > p { margin:9px 0; color:var(--text); font-size:14px; line-height:1.75; font-weight:650; }
    #view-community .gc-case-meta { color:var(--muted); font-size:12px; line-height:1.65; }
    #view-community .gc-actions { display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:12px; }
    #view-community .gc-actions button { min-height:42px; padding:9px 13px; border:1px solid var(--line); border-radius:10px; background:var(--panel2); color:var(--text); font:inherit; font-size:11px; font-weight:800; cursor:pointer; }
    #view-community .gc-actions button.gc-primary { border-color:var(--accent); background:var(--accent); color:#fff; }
    #view-community .gc-actions button:disabled { opacity:.45; cursor:not-allowed; }
    #view-community .gc-secret { margin-top:12px; padding:13px; border:1px dashed var(--accent); border-radius:11px; background:var(--panel2); color:var(--text); font-size:12px; line-height:1.7; }
    #view-community .gc-label { display:block; margin:16px 0 7px; color:var(--text); font-size:12px; font-weight:800; }
    #view-community .gc-game-panel textarea { display:block; width:100%; min-height:94px; padding:12px; border:1px solid var(--line); border-radius:11px; background:var(--bg, var(--panel2)); color:var(--text); font:inherit; font-size:13px; line-height:1.6; resize:vertical; }
    #view-community .gc-game-panel textarea:focus { outline:2px solid var(--accent); outline-offset:2px; }
    #view-community .gc-footnote { margin:12px 0 0; color:var(--muted); font-size:11px; line-height:1.65; }
    #view-community .gc-char-count { margin-left:auto; color:var(--muted); font-size:10px; }
    @media(max-width:560px) {
      #view-community .gc-activity-tabs { grid-template-columns:1fr; }
      #view-community .gc-actions button { flex:1 1 auto; }
      #view-community .gc-game-panel { padding:15px; }
    }
  `;
  document.head.appendChild(style);

  const cases = [
    { title: "The Great Midnight Snack Disappearance", scene: "At 12:17 AM, the last slice of cake vanished from the shared fridge. Four people were awake, and someone left a suspiciously clean plate in the sink.", evidence: "Clue: A tiny frosting mark was found on the TV remote.", role: "You are the cake culprit. You claim you were asleep, but you accidentally know the cake flavor." },
    { title: "Who Changed the Group Chat Name?", scene: "The group chat name changed to “Definitely Not A Secret Society” at 3:06 AM. Nobody is admitting to it.", evidence: "Clue: The name was changed from a device logged in near the kitchen.", role: "You changed the name because you were bored. Your alibi: you were making instant noodles." },
    { title: "The Missing Left Slipper", scene: "A single left slipper disappeared during movie night. The right slipper was found sitting neatly on the sofa like it knew something.", evidence: "Clue: Someone heard a dramatic squeak near the front door.", role: "You hid the slipper to prank everyone. You insist you spent the whole night on the sofa." },
    { title: "The Case of the Vanishing Plant", scene: "The lounge plant was moved from the sunny window to the bathroom. It now has a tiny paper crown.", evidence: "Clue: A trail of soil leads to the snack shelf.", role: "You relocated the plant because you thought it looked lonely. You deny giving it the crown." },
    { title: "The Suspiciously Early Goodbye", scene: "Someone said “I'm going to sleep” at 9 PM, but was spotted online at 2:43 AM. The group demands an explanation.", evidence: "Clue: Their status changed twice, but no message was sent.", role: "You were secretly binge-watching a show. Your alibi is that you were doing a very long meditation." },
    { title: "Operation: Stolen Fries", scene: "A plate of fries was left unattended for exactly two minutes. When the owner returned, only one fry remained—and it had been cut in half.", evidence: "Clue: There is ketchup on a notebook belonging to someone nearby.", role: "You took the fries to “quality check” them. You claim you were nowhere near the plate." }
  ];

  const products = [
    { item: "A self-stirring mug that only works when you compliment it", audience: "people who are emotionally attached to their coffee", rule: "You cannot use the words “coffee”, “mug”, or “drink”." },
    { item: "A tiny umbrella for one single grape", audience: "very wealthy fruit enthusiasts", rule: "Your entire pitch must sound like a luxury perfume advertisement." },
    { item: "A pillow that gives unsolicited life advice", audience: "people who keep making questionable decisions", rule: "You must include a completely unnecessary warranty." },
    { item: "A portable doorbell for people who arrive dramatically", audience: "theatre kids and main characters", rule: "You have only three sentences to close the sale." },
    { item: "A calendar that marks every minor inconvenience as a holiday", audience: "people who need more reasons to celebrate", rule: "You must make it sound like an essential productivity tool." },
    { item: "An invisible hat with a very visible attitude", audience: "fashion icons who are already difficult to impress", rule: "You cannot describe what it looks like." },
    { item: "A spoon that judges your food choices", audience: "people who claim they are starting a healthy lifestyle on Monday", rule: "Your pitch must include one fake customer testimonial." },
    { item: "A subscription box containing one mysterious button", audience: "curious people with absolutely no self-control", rule: "Do not explain what the button does." }
  ];

  let activeCase = null;
  let activeProduct = null;

  const $ = id => document.getElementById(id);
  const choose = list => list[Math.floor(Math.random() * list.length)];

  async function copyText(text, button) {
    if (!text || !button) return;
    const original = button.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const field = document.createElement("textarea");
        field.value = text;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("Copy unavailable");
      }
      button.textContent = "Copied ✓";
    } catch (_) {
      button.textContent = "Couldn't copy";
    }
    window.setTimeout(() => { button.textContent = original; }, 1500);
  }

  root.querySelectorAll("[data-gc-tab]").forEach(button => {
    button.addEventListener("click", () => {
      const tab = button.dataset.gcTab;
      root.querySelectorAll("[data-gc-tab]").forEach(item => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      root.querySelectorAll("[data-gc-panel]").forEach(panel => {
        panel.hidden = panel.dataset.gcPanel !== tab;
      });
    });
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  $("gcDealCase")?.addEventListener("click", () => {
    activeCase = choose(cases);
    $("gcAlibiCase").textContent = activeCase.title + " — " + activeCase.scene;
    $("gcAlibiEvidence").textContent = activeCase.evidence;
    $("gcSecretRole").hidden = true;
    $("gcSecretRole").textContent = "HOST ONLY · " + activeCase.role;
    $("gcCopyCase").disabled = false;
    $("gcRevealRole").disabled = false;
    $("gcAlibiNotes").value = "";
  });

  $("gcCopyCase")?.addEventListener("click", event => {
    if (!activeCase) return;
    copyText("🕵️ THE ALIBI ROOM\n" + activeCase.title + "\n" + activeCase.scene + "\n" + activeCase.evidence + "\n\nEveryone: give your alibi. Ask questions and decide who seems suspicious!", event.currentTarget);
  });

  $("gcRevealRole")?.addEventListener("click", event => {
    if (!activeCase) return;
    const secret = $("gcSecretRole");
    secret.hidden = !secret.hidden;
    event.currentTarget.textContent = secret.hidden ? "Reveal host-only role" : "Hide host-only role";
  });

  $("gcDrawProduct")?.addEventListener("click", () => {
    activeProduct = choose(products);
    $("gcSellProduct").textContent = activeProduct.item;
    $("gcSellConstraint").textContent = "AUDIENCE: " + activeProduct.audience + " · SALES RULE: " + activeProduct.rule;
    $("gcCopyChallenge").disabled = false;
    $("gcCopyPitch").disabled = !$("gcSellPitch").value.trim();
  });

  $("gcCopyChallenge")?.addEventListener("click", event => {
    if (!activeProduct) return;
    copyText("📣 SELL ME THIS\nProduct: " + activeProduct.item + "\nAudience: " + activeProduct.audience + "\nYour sales rule: " + activeProduct.rule + "\n\nMake your pitch. The group decides who sold it best!", event.currentTarget);
  });

  $("gcSellPitch")?.addEventListener("input", event => {
    const value = event.currentTarget.value;
    $("gcPitchCount").textContent = value.length + " / 700";
    $("gcCopyPitch").disabled = !value.trim();
  });

  $("gcCopyPitch")?.addEventListener("click", event => {
    const pitch = $("gcSellPitch").value.trim();
    if (pitch) copyText("📣 MY SELL ME THIS PITCH\n" + (activeProduct ? activeProduct.item + "\n\n" : "") + pitch, event.currentTarget);
  });
})();
