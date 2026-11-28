/* Mystery Library — four independent interactive rooms.
   Uses its own local key; never touches account progress, stars, or collectibles. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const KEY = "bt_mystery_library_wing_v1";
  const defaults = { solvedCases: [], openedCiphers: [], examinedArtifacts: [], endings: [], storyPath: [] };
  let state = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") {
      state = {
        solvedCases: Array.isArray(saved.solvedCases) ? saved.solvedCases : [],
        openedCiphers: Array.isArray(saved.openedCiphers) ? saved.openedCiphers : [],
        examinedArtifacts: Array.isArray(saved.examinedArtifacts) ? saved.examinedArtifacts : [],
        endings: Array.isArray(saved.endings) ? saved.endings : [],
        storyPath: Array.isArray(saved.storyPath) ? saved.storyPath.slice(0, 2) : []
      };
    }
  } catch (_) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} };
  const text = (id, value) => { const el = $(id); if (el) el.textContent = value; };

  // THE UNSOLVED FILES
  const cases = {
    bell: {
      title: "FILE 01 · THE 9:17 BELL",
      evidence: "At exactly 9:17, the reading-room bell rang although the corridor was empty.\n\n• Mara left the building at 9:10.\n• Ivo signed out the bell-room key at 9:05 and returned it at 9:22.\n• Pip's delivery arrived at 9:30.\n• A short strand of blue thread was caught beneath the bell clapper. Ivo's repair apron is stitched with blue thread.",
      suspects: [{ id:"mara",name:"Mara" },{ id:"ivo",name:"Ivo" },{ id:"pip",name:"Pip" }],
      answer:"ivo",
      reveal:"Ivo is the strongest match. The key log places him in the bell room, and the blue thread links his repair apron to the clapper."
    },
    bookmark: {
      title: "FILE 02 · THE MISSING BOOKMARK",
      evidence: "A silver bookmark vanished from the archive desk. It was later found tucked inside an atlas.\n\n• Mina borrowed the atlas that morning.\n• Theo borrowed a poetry collection, not the atlas.\n• Jules catalogued the atlas after Mina returned it.\n• The desk record shows the bookmark was last seen before Mina's borrowing slip was stamped.",
      suspects: [{ id:"mina",name:"Mina" },{ id:"theo",name:"Theo" },{ id:"jules",name:"Jules" }],
      answer:"mina",
      reveal:"Mina is the only person recorded with the atlas before the bookmark disappeared. The evidence points to the borrowing window, not the later cataloguing."
    },
    window: {
      title: "FILE 03 · THE SEALED WINDOW",
      evidence: "A wet footprint appeared beneath a window sealed from the inside. No rain entered the room.\n\n• Ada had been arranging flowers in the east hall.\n• Bo came from the greenhouse carrying a watering can.\n• Neri was working in the dry basement.\n• A trail of greenhouse soil runs from the door to the footprint. Bo's boots have the same ridged sole pattern.",
      suspects: [{ id:"ada",name:"Ada" },{ id:"bo",name:"Bo" },{ id:"neri",name:"Neri" }],
      answer:"bo",
      reveal:"Bo is the best-supported explanation. The soil trail and matching boot pattern connect the footprint to the greenhouse."
    }
  };
  let currentCase = "bell";
  function renderCase() {
    const item = cases[currentCase];
    text("mysteryCaseEvidence", item.title + "\n\n" + item.evidence);
    const tabs = document.querySelectorAll("[data-case]");
    tabs.forEach(btn => btn.classList.toggle("active", btn.dataset.case === currentCase));
    const root = $("mysteryCaseAnswers");
    if (root) root.replaceChildren(...item.suspects.map(person => {
      const button = document.createElement("button");
      button.type = "button"; button.dataset.caseAnswer = person.id; button.textContent = person.name;
      if (state.solvedCases.includes(currentCase)) button.disabled = true;
      return button;
    }));
    text("mysteryCaseFeedback", state.solvedCases.includes(currentCase) ? "✦ FILE SOLVED · " + item.reveal : "Choose the person whose details best match the evidence.");
    text("mysteryCasesSolved", state.solvedCases.length + " of 3 files solved");
  }
  document.querySelectorAll("[data-case]").forEach(btn => btn.addEventListener("click", () => { currentCase = btn.dataset.case; renderCase(); }));
  $("mysteryCaseAnswers")?.addEventListener("click", event => {
    const btn = event.target.closest("[data-case-answer]");
    if (!btn || state.solvedCases.includes(currentCase)) return;
    const item = cases[currentCase];
    if (btn.dataset.caseAnswer === item.answer) {
      state.solvedCases.push(currentCase); save();
      text("mysteryCaseFeedback", "✦ CASE CLOSED · " + item.reveal);
      renderCase();
    } else {
      text("mysteryCaseFeedback", "Not quite. Re-read the timeline and look for a detail that connects a person to the room.");
    }
  });
  $("mysteryCaseReset")?.addEventListener("click", () => {
    if (state.solvedCases.includes(currentCase)) text("mysteryCaseFeedback", "This file is already closed. You can still review all its evidence.");
    else text("mysteryCaseFeedback", "Take another look at the times, objects, and details. The answer is in the file.");
  });
  renderCase();

  // THE CIPHER CABINET
  const ciphers = [
    { label:"ENVELOPE 01 · SHIFT CIPHER", code:"Uif lfz jt voefs uif cppl", answer:"THE KEY IS UNDER THE BOOK", hints:["Each letter moved one place forward. Move it one place back.","For example, U becomes T. Apply the same move to every letter."] },
    { label:"ENVELOPE 02 · REVERSED WORDS", code:"EMOCLEW OT EHT YRARBIL", answer:"WELCOME TO THE LIBRARY", hints:["Read each word from right to left.","The spaces are already in the correct places."] },
    { label:"ENVELOPE 03 · NUMBER CODE", code:"2 - 5 - 12 - 12 / 13 - 15 - 15 - 14", answer:"BELL MOON", hints:["Use A=1, B=2, C=3, and so on.","Each number stands for one letter of the alphabet."] }
  ];
  let cipherIndex = state.openedCiphers.length < ciphers.length ? state.openedCiphers.length : ciphers.length - 1;
  let hintIndex = 0;
  function renderCipher() {
    const item = ciphers[cipherIndex];
    text("mysteryCipherLabel", item.label);
    text("mysteryCipherCode", item.code);
    text("mysteryCipherHint", "Hint: " + item.hints[Math.min(hintIndex, item.hints.length - 1)]);
    text("mysteryCipherProgress", state.openedCiphers.length + " of 3 envelopes opened");
    const input = $("mysteryCipherAnswer");
    const form = $("mysteryCipherForm");
    if (input) { input.value = ""; input.disabled = state.openedCiphers.length === ciphers.length; input.placeholder = state.openedCiphers.length === ciphers.length ? "Every envelope is open." : "Type what you think it says..."; }
    if (form) form.querySelector("button").disabled = state.openedCiphers.length === ciphers.length;
    text("mysteryCipherFeedback", state.openedCiphers.length === ciphers.length ? "✦ All three envelopes opened. The cabinet has nothing more to hide—for now." : "The cabinet is listening.");
  }
  $("mysteryCipherForm")?.addEventListener("submit", event => {
    event.preventDefault();
    if (state.openedCiphers.length === ciphers.length) return;
    const input = $("mysteryCipherAnswer");
    const answer = (input?.value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const expected = ciphers[cipherIndex].answer.replace(/[^A-Z0-9]/g, "");
    if (answer === expected) {
      state.openedCiphers.push(cipherIndex); save();
      text("mysteryCipherFeedback", "✦ LOCK OPENED · " + ciphers[cipherIndex].answer + " · A new envelope slides forward.");
      if (state.openedCiphers.length < ciphers.length) cipherIndex = state.openedCiphers.length;
      hintIndex = 0; renderCipher();
      if (state.openedCiphers.length > 0) text("mysteryCipherFeedback", "✦ Correct. The next envelope is ready.");
    } else {
      text("mysteryCipherFeedback", "That doesn't fit the code yet. Check the hint and try again.");
    }
  });
  $("mysteryCipherHintButton")?.addEventListener("click", () => {
    if (state.openedCiphers.length === ciphers.length) return;
    hintIndex = Math.min(hintIndex + 1, ciphers[cipherIndex].hints.length - 1);
    text("mysteryCipherHint", "Hint: " + ciphers[cipherIndex].hints[hintIndex]);
  });
  renderCipher();

  // MUSEUM OF IMPOSSIBLE THINGS
  const artifacts = {
    compass:{ icon:"🧭",name:"The Untrue Compass",description:"Its needle trembles whenever someone remembers a promise they made to themselves.",action:"Inspect the compass",result:"You hold it still and think of a promise you postponed. The needle turns—not north, but toward the thing you meant to begin. The label reads: “It points to what still matters.”" },
    jar:{ icon:"🌧️",name:"The Pocket Rainstorm",description:"A whole rainy afternoon is sealed inside this small glass jar. Tiny drops gather on the inside.",action:"Listen to the jar",result:"A soft patter rises from the glass. Beneath it, you hear the distant sound of a familiar afternoon. The label reads: “Weather remembers where it fell.”" },
    clock:{ icon:"⌛",name:"The Borrowed Minute",description:"Its hands move only when someone nearby gives another person their full attention.",action:"Wind the clock",result:"You sit quietly and give it a minute. The hands move once, then stop. A note appears: “Time feels longer when it is shared.”" }
  };
  let currentArtifact = "compass";
  function renderArtifact() {
    const item = artifacts[currentArtifact];
    const root = $("mysteryArtifactDisplay");
    if (root) {
      root.replaceChildren();
      const icon = document.createElement("span"); icon.className = "mystery-artifact-display-icon"; icon.textContent = item.icon;
      const title = document.createElement("b"); title.textContent = item.name;
      const desc = document.createElement("p"); desc.textContent = item.description;
      const action = document.createElement("button"); action.type = "button"; action.className = "mystery-action-button"; action.id = "mysteryArtifactAction"; action.textContent = state.examinedArtifacts.includes(currentArtifact) ? "Examine again" : item.action;
      root.append(icon,title,desc,action);
    }
    document.querySelectorAll("[data-artifact]").forEach(btn => btn.classList.toggle("active", btn.dataset.artifact === currentArtifact));
    text("mysteryArtifactsSeen", state.examinedArtifacts.length + " of 3 artifacts examined");
    text("mysteryArtifactFeedback", state.examinedArtifacts.includes(currentArtifact) ? "This artifact has already shared its secret. You may inspect it again." : "Choose an artifact, then examine it.");
  }
  document.querySelectorAll("[data-artifact]").forEach(btn => btn.addEventListener("click", () => { currentArtifact = btn.dataset.artifact; renderArtifact(); }));
  $("mysteryArtifactDisplay")?.addEventListener("click", event => {
    if (!event.target.closest("#mysteryArtifactAction")) return;
    const item = artifacts[currentArtifact];
    if (!state.examinedArtifacts.includes(currentArtifact)) { state.examinedArtifacts.push(currentArtifact); save(); }
    text("mysteryArtifactFeedback", item.result);
    text("mysteryArtifactsSeen", state.examinedArtifacts.length + " of 3 artifacts examined");
  });
  renderArtifact();

  // THE UNWRITTEN CHAPTER
  const story = [
    { chapter:"CHAPTER 01 · THE ARRIVAL",title:"The Door That Borrowed Your Name",body:"At the end of a quiet hallway, you find a door with your name written on a paper label. You are certain it wasn't there yesterday. From the other side comes a gentle tapping.",choices:[["knock","Knock three times."],["listen","Listen at the keyhole."]] },
    { knock:{ chapter:"CHAPTER 02 · THE QUESTION",title:"A Voice in the Hall",body:"The tapping stops. A voice asks, “Who are you when no one is watching?” The hallway seems to wait for your answer.",choices:[["truth","Tell the truth, even if it is unfinished."],["label","Give the name written on the door."]] },
      listen:{ chapter:"CHAPTER 02 · THE WHISPER",title:"Someone Remembers",body:"Through the keyhole, you hear: “Please don't let this hallway forget me.” The voice sounds almost like a memory.",choices:[["promise","Promise to remember."],["ask","Ask who is speaking."]] } }
  ];
  const endings = {
    "knock:truth":{title:"The Room of Beginnings",body:"The door opens into a sunlit room filled with blank notebooks. Your name fades from the label and appears on the first page. You weren't being tested. You were being invited to begin again."},
    "knock:label":{title:"The Borrowed Name",body:"The door opens, but the room is empty. On the floor rests a second label with someone else's name. You understand: the hallway lends names to anyone who has forgotten their own."},
    "listen:promise":{title:"The Keeper of Small Things",body:"A tiny lantern glows behind the door. Inside is a quiet room where forgotten moments are kept safe. The voice thanks you, and the hallway grows a little warmer."},
    "listen:ask":{title:"The Hallway's Secret",body:"The voice answers, “I am the part of every story that almost got told.” The keyhole closes like an eye. Somewhere far away, a new door begins to appear."}
  };
  function renderStory() {
    const path = state.storyPath;
    const chapter = path.length === 0 ? story[0] : story[1][path[0]];
    if (path.length < 2) {
      text("mysteryStoryChapter", chapter.chapter); text("mysteryStoryTitle", chapter.title); text("mysteryStoryText", chapter.body);
      const root = $("mysteryStoryChoices");
      if (root) root.replaceChildren(...chapter.choices.map(([id,label]) => {
        const button = document.createElement("button"); button.type="button"; button.className="mystery-story-choice"; button.dataset.storyChoice=id; button.textContent=label; return button;
      }));
      if ($("mysteryStoryRestart")) $("mysteryStoryRestart").hidden = true;
      text("mysteryStoryFeedback", "Your choices shape this chapter.");
    } else {
      const ending = endings[path[0] + ":" + path[1]];
      text("mysteryStoryChapter", "AN ENDING · " + (state.endings.indexOf(path.join(":")) + 1));
      text("mysteryStoryTitle", ending.title); text("mysteryStoryText", ending.body);
      const root = $("mysteryStoryChoices");
      if (root) root.replaceChildren();
      if ($("mysteryStoryRestart")) $("mysteryStoryRestart").hidden = false;
      text("mysteryStoryFeedback", "✦ Chapter complete. Your path has been recorded on this device.");
    }
    text("mysteryStoryEndings", state.endings.length + " endings found");
  }
  $("mysteryStoryChoices")?.addEventListener("click", event => {
    const btn = event.target.closest("[data-story-choice]");
    if (!btn || state.storyPath.length >= 2) return;
    state.storyPath.push(btn.dataset.storyChoice);
    if (state.storyPath.length === 2) {
      const key = state.storyPath.join(":");
      if (!state.endings.includes(key)) state.endings.push(key);
    }
    save(); renderStory();
  });
  $("mysteryStoryRestart")?.addEventListener("click", () => { state.storyPath = []; save(); renderStory(); });
  renderStory();
})();