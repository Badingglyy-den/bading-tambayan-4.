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

  const today = new Date();
  const dateKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  const clue = dailyPhotoClues[((dayNumber % dailyPhotoClues.length) + dailyPhotoClues.length) % dailyPhotoClues.length];

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
