
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

  // DAILY PHOTOGRAPH CLUES
  const dailyPhotoClues = [
    { image: "🖼️", detail: "A shadow appears behind the person in the photograph." },
    { image: "🌙", detail: "Someone has drawn a tiny moon in the upper corner." },
    { image: "🗝️", detail: "A small brass key is visible beside the frame." },
    { image: "👁️", detail: "The person's eyes seem to be looking somewhere else." },
    { image: "✧", detail: "A mysterious symbol has appeared on the back." },
    { image: "🕰️", detail: "The clock in the background shows a different time." },
    { image: "📜", detail: "A folded note is tucked behind the photograph." }
  ];

  const today = new Date();
  const dayNumber = Math.floor(Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ) / 86400000);

  const todaysClue = dailyPhotoClues[
    dayNumber % dailyPhotoClues.length
  ];

  if (photoImage && photoDetail && photoCaption) {
    photoImage.textContent = todaysClue.image;
    photoDetail.textContent = todaysClue.detail;
    photoCaption.textContent =
      "The photograph has changed today. Come back tomorrow to discover what appears next.";
  }

  // PHOTOGRAPH SECRET REVEAL
  if (photoImage && photoSecret) {
    photoImage.style.cursor = "pointer";
    photoImage.setAttribute("role", "button");
    photoImage.setAttribute("tabindex", "0");
    photoImage.setAttribute("aria-label", "Reveal the hidden message");

    const revealPhotoSecret = () => {
      photoSecret.hidden = !photoSecret.hidden;

      if (photoClueLink) {
        photoClueLink.hidden = photoSecret.hidden;
      }
    };

    photoImage.addEventListener("click", revealPhotoSecret);

    photoImage.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        revealPhotoSecret();
      }
    });
  }

  // DRAWER DISCOVERIES AND REWARDS
  const KEY = "tambayan_attic_discoveries_v1";

  const stories = {
    box: {
      title: "THE DUSTY BOX",
      message: "Inside is a tiny music player. It has one recording. A voice whispers: “If you're hearing this, the attic remembers you.”",
      extra: "There is a date written underneath. Tomorrow's date.",
      reward: "A curious little discovery. +5 ⭐"
    },
    photo: {
      title: "THE OLD PHOTOGRAPH",
      message: "You wipe away the dust. The scratched-out face is no longer hidden. Someone has written beneath it: “You already know who this is.”",
      extra: "Strangely, the handwriting looks familiar.",
      reward: "A forgotten memory found. +5 ⭐"
    },
    letter: {
      title: "THE UNSENT LETTER",
      message: "The letter reads: “Dear stranger, if you found this, please leave the little brass key where you found it. Some doors are better left curious.”",
      extra: "The letter is signed with a single symbol: ✧",
      reward: "A secret message uncovered. +5 ⭐"
    }
  };

  function getFound() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
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
          window.tambayanApplyLoungeReward(
            "stars",
            5,
            "Attic discovery!"
          );
        }
      }

      result.innerHTML = "";

      const heading = document.createElement("p");
      heading.textContent = story.title;

      const message = document.createElement("span");
      message.textContent = story.message;

      const extra = document.createElement("p");
      extra.className = "attic-story-extra";
      extra.textContent = story.extra;

      const reward = document.createElement("span");
      reward.className = "attic-story-reward";
      reward.textContent = isNew
        ? story.reward
        : "You've already discovered this one. But the attic still has its secrets.";

      result.append(heading, message, extra, reward);
    });
  });
})();
        
