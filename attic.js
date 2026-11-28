(() => {
  "use strict";

  const result = document.getElementById("attic-result");
  const drawers = document.querySelectorAll(".attic-drawer");
  if (!result || !drawers.length) return;

  const photoImage = document.getElementById("attic-photo-image");
  const photoDetail = document.getElementById("attic-photo-detail");
  const photoCaption = document.getElementById("attic-photo-caption");
  const photoSecret = document.getElementById("attic-photo-secret");
  const photoClueLink = document.querySelector(".attic-photo-clue-link");
  const photoNumber = document.getElementById("attic-photo-number");

  const musicButton = document.getElementById("attic-music-open");
  const musicMessage = document.getElementById("attic-music-message");
  const musicArchive = document.getElementById("attic-music-archive");
  const cabinetCode = document.getElementById("attic-cabinet-code");
  const cabinetButton = document.getElementById("attic-cabinet-unlock");
  const cabinetFeedback = document.getElementById("attic-cabinet-feedback");
  const cabinetPrize = document.getElementById("attic-cabinet-prize");
  const keepsakeShelf = document.getElementById("attic-keepsake-shelf");
  const keepsakeCount = document.getElementById("attic-keepsake-count");

  const today = new Date();
  const dateKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);

  const musicRecordings = [
    "A soft voice counts: “Two knocks. One pause. One final knock.” Then the recording ends.",
    "A music-box melody plays backwards. At the end, someone whispers: “The quietest drawer is not empty.”",
    "Three notes ring out, then a voice says: “Keep the little things. They remember more than we do.”",
    "A distant clock ticks eleven times. A note follows: “Time leaves fingerprints.”",
    "Someone hums a tune and stops just before the last note. “You can finish it tomorrow,” they whisper.",
    "A paper rustle, a small laugh, then: “If you found this, you were meant to look closer.”",
    "The recording is almost silent. Just before it ends, a voice says: “The attic is only the beginning.”"
  ];
  const musicMessageToday = musicRecordings[((dayNumber % musicRecordings.length) + musicRecordings.length) % musicRecordings.length];
  const musicDateKey = dateKey;

  // Original synthesized music-box audio; no external tracks or paid assets.
  let atticAudioContext = null;
  let atticAudioNodes = [];
  let atticAudioTimers = [];

  function stopAtticMusic() {
    atticAudioTimers.forEach(clearTimeout);
    atticAudioTimers = [];
    atticAudioNodes.forEach(node => { try { node.stop(); } catch (error) {} });
    atticAudioNodes = [];
    if (musicStopButton) musicStopButton.hidden = true;
    if (musicButton) musicButton.textContent = "Play today's melody again";
  }

  function playAtticMusic() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      if (musicMessage) musicMessage.textContent += " This browser does not support in-page audio.";
      return;
    }
    stopAtticMusic();
    try {
      atticAudioContext = atticAudioContext || new AudioContextClass();
      const ctx = atticAudioContext;
      const begin = () => {
        if (ctx.state !== "running") return;
        if (musicStopButton) musicStopButton.hidden = false;
        if (musicButton) musicButton.textContent = "Play today's melody again";
        const master = ctx.createGain();
        master.gain.value = 0.24;
        master.connect(ctx.destination);
        const patterns = [
          [659.25,783.99,987.77,783.99,587.33,659.25,523.25,587.33],
          [523.25,659.25,783.99,1046.5,783.99,659.25,587.33,523.25],
          [587.33,698.46,880,698.46,659.25,783.99,987.77,880],
          [440,554.37,659.25,880,659.25,554.37,493.88,440],
          [659.25,880,783.99,659.25,587.33,783.99,698.46,587.33],
          [523.25,587.33,698.46,783.99,698.46,587.33,523.25,392],
          [783.99,698.46,659.25,523.25,587.33,659.25,523.25,392]
        ];
        const melody = patterns[((dayNumber % patterns.length) + patterns.length) % patterns.length];
        const start = ctx.currentTime + 0.08;
        melody.concat(melody.slice(0,4)).forEach((frequency,index) => {
          const at = start + index * 0.48;
          const osc = ctx.createOscillator();
          const overtone = ctx.createOscillator();
          const tone = ctx.createGain();
          const shimmer = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(frequency,at);
          overtone.type = "triangle";
          overtone.frequency.setValueAtTime(frequency * 2.003,at);
          tone.gain.setValueAtTime(0.0001,at);
          tone.gain.exponentialRampToValueAtTime(0.55,at+0.018);
          tone.gain.exponentialRampToValueAtTime(0.0001,at+0.42);
          shimmer.gain.setValueAtTime(0.0001,at);
          shimmer.gain.exponentialRampToValueAtTime(0.12,at+0.012);
          shimmer.gain.exponentialRampToValueAtTime(0.0001,at+0.25);
          osc.connect(tone); tone.connect(master);
          overtone.connect(shimmer); shimmer.connect(master);
          osc.start(at); overtone.start(at);
          osc.stop(at+0.45); overtone.stop(at+0.28);
          atticAudioNodes.push(osc,overtone);
        });
        // Three soft clock-like knocks echo the cabinet clue.
        for (let i=0;i<3;i++) {
          const at=start+0.15+i*1.05+(i===2?0.42:0);
          const tick=ctx.createOscillator();
          const gain=ctx.createGain();
          tick.type="sine";
          tick.frequency.value=i===2?180:240;
          gain.gain.setValueAtTime(0.0001,at);
          gain.gain.exponentialRampToValueAtTime(0.08,at+0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001,at+0.09);
          tick.connect(gain); gain.connect(master);
          tick.start(at); tick.stop(at+0.1);
          atticAudioNodes.push(tick);
        }
        const duration=melody.length*0.48+4*0.48+0.8;
        atticAudioTimers.push(setTimeout(stopAtticMusic,duration*1000+250));
      };
      if(ctx.state==="suspended") ctx.resume().then(begin).catch(()=>{
        if(musicMessage) musicMessage.textContent += " Tap play again to enable sound.";
      });
      else begin();
    } catch(error) {
      if(musicMessage) musicMessage.textContent += " Audio couldn't start on this device. Please try again.";
    }
  }

  let musicStopButton = null;
  if (musicButton) {
    musicStopButton=document.createElement("button");
    musicStopButton.type="button";
    musicStopButton.className=musicButton.className;
    musicStopButton.textContent="Stop audio";
    musicStopButton.hidden=true;
    musicStopButton.style.marginLeft="8px";
    musicButton.insertAdjacentElement("afterend",musicStopButton);
    musicStopButton.addEventListener("click",stopAtticMusic);
  }

  function getAtticProgress() {
    try {
      return window.tambayanProgress?.getDailyDispatch?.() || {};
    } catch (error) {
      return {};
    }
  }

  function saveAtticProgress(progress) {
    try {
      if (window.tambayanProgress?.setDailyDispatch) {
        window.tambayanProgress.setDailyDispatch(progress);
        return;
      }
    } catch (error) {}
    try { localStorage.setItem("tambayan_attic_adventure_fallback", JSON.stringify(progress)); } catch (error) {}
  }

  function getKeepsakes() {
    const progress = getAtticProgress();
    return Array.isArray(progress.atticKeepsakes) ? progress.atticKeepsakes : [];
  }

  function addKeepsake(id) {
    const progress = getAtticProgress();
    const items = Array.isArray(progress.atticKeepsakes) ? progress.atticKeepsakes : [];
    if (!items.includes(id)) {
      items.push(id);
      progress.atticKeepsakes = items;
      saveAtticProgress(progress);
    }
    renderKeepsakes();
  }

  const keepsakeDetails = [
    { id: "music-recording", icon: "🎼", name: "A recorded whisper", note: "The Music Box's first message." },
    { id: "cabinet-pin", icon: "🧷", name: "Brass music pin", note: "Found beneath the Locked Cabinet's lining." },
    { id: "photo-message", icon: "📷", name: "Words on a photograph", note: "A message revealed on the back of the daily photograph." }
  ];

  function renderKeepsakes() {
    if (!keepsakeShelf || !keepsakeCount) return;
    const foundItems = getKeepsakes();
    keepsakeCount.textContent = foundItems.length + " / " + keepsakeDetails.length;
    keepsakeShelf.replaceChildren();
    keepsakeDetails.forEach(item => {
      const card = document.createElement("div");
      card.className = "attic-keepsake" + (foundItems.includes(item.id) ? " is-found" : " is-hidden");
      const icon = document.createElement("span");
      icon.className = "attic-keepsake-icon";
      icon.textContent = foundItems.includes(item.id) ? item.icon : "？";
      const copy = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = foundItems.includes(item.id) ? item.name : "Not found yet";
      const note = document.createElement("small");
      note.textContent = foundItems.includes(item.id) ? item.note : "Keep exploring the attic.";
      copy.append(name, note);
      card.append(icon, copy);
      keepsakeShelf.append(card);
    });
  }

  if (musicButton && musicMessage) {
    musicButton.addEventListener("click", () => {
      musicMessage.hidden = false;
      musicMessage.textContent = "“" + musicMessageToday + "”  ♪ Today's original melody is playing below. Use Stop audio whenever you like.";
      playAtticMusic();
      const progress = getAtticProgress();
      if (progress.atticMusicDate !== musicDateKey) {
        progress.atticMusicDate = musicDateKey;
        progress.atticMusicDays = (Number(progress.atticMusicDays) || 0) + 1;
        saveAtticProgress(progress);
      }
      if (!progress.atticMusicKeepsake) {
        progress.atticMusicKeepsake = true;
        progress.atticKeepsakes = Array.isArray(progress.atticKeepsakes) ? progress.atticKeepsakes : [];
        if (!progress.atticKeepsakes.includes("music-recording")) progress.atticKeepsakes.push("music-recording");
        saveAtticProgress(progress);
      }
      if (musicArchive) musicArchive.textContent = "Recordings heard: " + (Number(progress.atticMusicDays) || 1);
      renderKeepsakes();
    });
    const saved = getAtticProgress();
    if (musicArchive) musicArchive.textContent = "Recordings heard: " + (Number(saved.atticMusicDays) || 0);
  }

  function tryCabinetCode() {
    if (!cabinetCode || !cabinetFeedback) return;
    const progress = getAtticProgress();
    if (progress.atticCabinetSolved) {
      cabinetFeedback.textContent = "Already open. The little pin is yours to keep.";
      if (cabinetPrize) cabinetPrize.hidden = false;
      return;
    }
    if (cabinetCode.value.trim() === "211") {
      progress.atticCabinetSolved = true;
      progress.atticKeepsakes = Array.isArray(progress.atticKeepsakes) ? progress.atticKeepsakes : [];
      if (!progress.atticKeepsakes.includes("cabinet-pin")) progress.atticKeepsakes.push("cabinet-pin");
      saveAtticProgress(progress);
      cabinetFeedback.textContent = "Click. The cabinet opens. You found something tucked beneath the lining.";
      if (cabinetPrize) cabinetPrize.hidden = false;
      cabinetButton.disabled = true;
      cabinetButton.textContent = "Cabinet unlocked";
      if (typeof window.tambayanApplyLoungeReward === "function") {
        window.tambayanApplyLoungeReward("stars", 10, "Locked Cabinet opened!");
      }
      renderKeepsakes();
    } else {
      cabinetFeedback.textContent = "No click yet. Listen to the rhythm: two knocks, one pause, one final knock.";
      cabinetCode.value = "";
      cabinetCode.focus();
    }
  }

  if (cabinetButton) cabinetButton.addEventListener("click", tryCabinetCode);
  if (cabinetCode) cabinetCode.addEventListener("keydown", event => {
    if (event.key === "Enter") tryCabinetCode();
  });
  if (getAtticProgress().atticCabinetSolved) {
    if (cabinetPrize) cabinetPrize.hidden = false;
    if (cabinetFeedback) cabinetFeedback.textContent = "Already open. The little pin is yours to keep.";
    if (cabinetButton) { cabinetButton.disabled = true; cabinetButton.textContent = "Cabinet unlocked"; }
  }
  renderKeepsakes();


  // The photograph changes every day for everyone.
  const dailyPhotoClues = [
    { image: "🖼️", detail: "A second shadow appears behind the person. But there is no one standing there.", secret: "The shadow is holding up two fingers. Look for the number 2 in the library." },
    { image: "🌙", detail: "A tiny crescent moon has appeared in the upper corner of the photograph.", secret: "Someone wrote: “When the moon is missing, count the stars that remain.”" },
    { image: "🗝️", detail: "A brass key is visible beside the frame. Its teeth form a strange pattern.", secret: "The note says: “The key opens no door. It opens a memory.”" },
    { image: "👁️", detail: "The person's eyes seem to be looking directly at something outside the frame.", secret: "On the back: “The answer was never in the picture. It was behind you.”" },
    { image: "✧", detail: "A small symbol has appeared on the back of the photograph.", secret: "The symbol matches a mark in the restricted collection. The library keeps what the attic forgets." },
    { image: "🕰️", detail: "The clock in the background shows 11:11, although the photograph is dated at noon.", secret: "A pencilled message reads: “Meet me when the hands agree.”" },
    { image: "📜", detail: "A folded note is tucked behind the photograph. Only one word is visible.", secret: "The word is “RETURN.” Beneath it: “Some stories are waiting for their reader.”" },
    { image: "🦋", detail: "A paper butterfly has appeared near the person's shoulder.", secret: "Its wings carry two letters: M and L. Perhaps the Mystery Library knows more." },
    { image: "🪞", detail: "The mirror in the background reflects a room that is not in the photograph.", secret: "The reflection contains a door. The message says: “Find the room that isn't on the map.”" },
    { image: "🧵", detail: "A red thread now runs from the frame to the edge of the photograph.", secret: "The thread is tied around a tiny tag: “Follow what connects the forgotten things.”" },
    { image: "🕊️", detail: "A pale feather rests on the windowsill. It wasn't there yesterday.", secret: "A faint line reads: “Not every message needs a voice.”" },
    { image: "🔔", detail: "A little bell hangs from the frame, but the photograph is completely silent.", secret: "The final note says: “When you hear nothing, listen closer.”" }
  ];

  const clue = dailyPhotoClues[((dayNumber % dailyPhotoClues.length) + dailyPhotoClues.length) % dailyPhotoClues.length];

  if (photoNumber) photoNumber.textContent = "NO. " + String((dayNumber % dailyPhotoClues.length) + 1).padStart(3, "0");

  if (photoImage && photoDetail && photoCaption) {
    photoImage.textContent = clue.image;
    photoDetail.textContent = clue.detail;
    photoCaption.textContent = "TODAY'S PHOTO · A new detail appears every day. Tap the photograph to investigate.";
  }

  if (photoImage && photoSecret) {
    photoImage.style.cursor = "pointer";
    photoImage.setAttribute("role", "button");
    photoImage.setAttribute("tabindex", "0");
    photoImage.setAttribute("aria-label", "Investigate today's mysterious photograph");
    photoSecret.textContent = "✧ " + clue.secret;

    const reveal = () => {
      const opening = photoSecret.hidden;
      photoSecret.hidden = !opening;
      if (photoClueLink) photoClueLink.hidden = !opening;

      if (opening) {
        addKeepsake("photo-message");
        let daily = {};
        try {
          daily = window.tambayanProgress?.getDailyDispatch?.() || {};
        } catch (error) {
          daily = {};
        }
        if (daily.atticPhotoDate !== dateKey) {
          daily.atticPhotoDate = dateKey;
          if (window.tambayanProgress?.setDailyDispatch) {
            window.tambayanProgress.setDailyDispatch(daily);
          } else {
            localStorage.setItem("tambayan_attic_photo_date", dateKey);
          }
          if (typeof window.tambayanApplyLoungeReward === "function") {
            window.tambayanApplyLoungeReward("stars", 5, "Daily photograph discovered!");
          }
        }
      }
    };
    photoImage.addEventListener("click", reveal);
    photoImage.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        reveal();
      }
    });
  }

  const KEY = "tambayan_attic_discoveries_v1";
  const stories = {
    box: { title: "THE DUSTY BOX", message: "Inside is a tiny music player. It has one recording. A voice whispers: “If you're hearing this, the attic remembers you.”", extra: "There is a date written underneath. Tomorrow's date.", reward: "A curious little discovery. +5 ⭐" },
    photo: { title: "THE OLD PHOTOGRAPH", message: "You wipe away the dust. The scratched-out face is no longer hidden. Someone has written beneath it: “You already know who this is.”", extra: "Strangely, the handwriting looks familiar.", reward: "A forgotten memory found. +5 ⭐" },
    letter: { title: "THE UNSENT LETTER", message: "The letter reads: “Dear stranger, if you found this, please leave the little brass key where you found it. Some doors are better left curious.”", extra: "The letter is signed with a single symbol: ✧", reward: "A secret message uncovered. +5 ⭐" }
  };

  function getFound() {
    try { const saved = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(saved) ? saved : []; }
    catch { return []; }
  }
  let found = getFound();

  drawers.forEach(button => {
    button.addEventListener("click", () => {
      const story = stories[button.dataset.attic];
      if (!story) return;
      const isNew = !found.includes(button.dataset.attic);
      if (isNew) {
        found.push(button.dataset.attic);
        localStorage.setItem(KEY, JSON.stringify(found));
        if (typeof window.tambayanApplyLoungeReward === "function") {
          window.tambayanApplyLoungeReward("stars", 5, "Attic discovery!");
        }
      }
      result.innerHTML = "";
      const heading = document.createElement("p"); heading.textContent = story.title;
      const message = document.createElement("span"); message.textContent = story.message;
      const extra = document.createElement("p"); extra.className = "attic-story-extra"; extra.textContent = story.extra;
      const reward = document.createElement("span"); reward.className = "attic-story-reward";
      reward.textContent = isNew ? story.reward : "You've already discovered this one. But the attic still has its secrets.";
      result.append(heading, message, extra, reward);
    });
  });
})();
