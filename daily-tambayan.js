
(() => {
  "use strict";

  const STORAGE_KEY = "tambayan_daily_dispatch_v1";

  const missions = [
    {
      id: "coinBtn",
      title: "A Flip of Fate",
      description: "Let the universe decide something for you. Flip the Coin of Fate.",
      mystery: "The universe has a tiny answer waiting. But will it be heads or tails?",
      action: "coinBtn"
    },
    {
      id: "frogBtn",
      title: "The Frog Knows",
      description: "Visit Palakang Marites and see what little piece of chika it has for you.",
      mystery: "Ribbit... someone has been keeping a secret. Maybe the frog knows.",
      action: "frogBtn"
    },
    {
      id: "comfortBtn",
      title: "A Little Kindness",
      description: "Visit the Comfort Corner and collect a gentle reminder for today.",
      mystery: "A little note has been left somewhere just for you.",
      action: "comfortBtn"
    },
    {
      id: "fortuneBtn",
      title: "Ask the Universe",
      description: "Visit the Mystery Library and let the fortune teller read your future.",
      mystery: "Something about your future is waiting to be revealed...",
      action: "fortuneBtn"
    },
    {
      id: "dramaBtn",
      title: "Main Character Moment",
      description: "Press the Drama Queen Button. A little drama never hurt anyone.",
      mystery: "The universe senses that today needs a little extra drama.",
      action: "dramaBtn"
    },
    {
      id: "complimentBtn",
      title: "Fate Has Opinions",
      description: "Try the Compliment or Roast machine and accept your fate.",
      mystery: "A mysterious verdict is waiting. Will it be lambing or sampal?",
      action: "complimentBtn"
    }
  ];

  function todayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getTodayMission() {
    const date = todayKey();
    let hash = 0;

    for (let i = 0; i < date.length; i++) {
      hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
    }

    return missions[hash % missions.length];
  }

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn("Daily Tambayan could not save progress:", error);
    }
  }

  function updateDisplay(completed) {
    const title = document.getElementById("dailyMissionTitle");
    const description = document.getElementById("dailyMissionDescription");
    const reward = document.getElementById("dailyMissionReward");
    const status = document.getElementById("dailyMissionStatus");
    const progress = document.getElementById("dailyMissionProgress");
    const bar = document.getElementById("dailyMissionProgressBar");
    const mystery = document.getElementById("dailyMysteryText");

    if (!title || !description) return;

    title.textContent = mission.title;
    description.textContent = mission.description;
    reward.textContent = completed ? "⭐ 15 stars collected" : "⭐ 15 stars";
    status.textContent = completed ? "COMPLETED ✦" : "READY TO EXPLORE";
    progress.textContent = completed
      ? "1 of 1 mission completed"
      : "0 of 1 mission completed";

    if (bar) bar.style.width = completed ? "100%" : "0%";
    if (mystery) mystery.textContent = mission.mystery;
  }

  const mission = getTodayMission();
  const saved = readProgress();
  const date = todayKey();

  let completed = saved.date === date && saved.completed === true;

  updateDisplay(completed);

  document.addEventListener("click", (event) => {
    if (completed) return;

    const button = event.target.closest("button");
    if (!button || button.id !== mission.action) return;

    if (typeof window.tambayanApplyLoungeReward !== "function") {
      console.warn("Daily Tambayan reward system is not ready.");
      return;
    }

    const rewarded = window.tambayanApplyLoungeReward(
      "stars",
      15,
      "Daily Tambayan mission completed!"
    );

    if (!rewarded) return;

        completed = true;
    saveProgress({
      date,
      completed: true,
      mission: mission.id
    });

    const panel = document.getElementById("dailyTambayanPanel");

    if (panel) {
      panel.classList.remove("daily-just-completed");
      void panel.offsetWidth;
      panel.classList.add("daily-just-completed");
    }

    updateDisplay(true);
  }, true);
})();
    
