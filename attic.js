
(() => {
  "use strict";

  const result = document.getElementById("attic-result");
  const drawers = document.querySelectorAll(".attic-drawer");

  if (!result || !drawers.length) return;

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
        
