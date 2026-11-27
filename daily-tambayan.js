(() => {
  "use strict";

  // These five activities are available to every player each day.
  // Completion is stored inside the account's cloud-synced player progress.
  const challenges = [
    { id: "coin", title: "A Flip of Fate", icon: "🪙", description: "Flip the Coin of Fate and let the universe decide.", action: "coinBtn", reward: 5 },
    { id: "frog", title: "The Frog Knows", icon: "🐸", description: "Ask Palakang Marites for today's little piece of chika.", action: "frogBtn", reward: 5 },
    { id: "comfort", title: "A Little Kindness", icon: "🫂", description: "Collect a gentle reminder from the Comfort Corner.", action: "comfortBtn", reward: 5 },
    { id: "fortune", title: "Ask the Universe", icon: "🔮", description: "Visit the fortune teller and reveal your daily fortune.", action: "fortuneBtn", reward: 5 },
    { id: "drama", title: "Main Character Moment", icon: "🎭", description: "Activate the Drama Queen Button. Be dramatic, respectfully.", action: "dramaBtn", reward: 5 }
  ];

  const $ = id => document.getElementById(id);
  const dateKey = () => {
    const now = new Date();
    return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
  };
  const addDays = (value, amount) => {
    const d = new Date(value + "T12:00:00");
    d.setDate(d.getDate() + amount);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
  };

  let date = dateKey();
  let saved = window.tambayanProgress?.getDailyDispatch?.() || {};
  if (saved.date !== date) {
    saved = {
      date,
      completed: [],
      streak: Number(saved.streak) || 0,
      lastCompletedDate: saved.lastCompletedDate || "",
      claimedMilestones: Array.isArray(saved.claimedMilestones) ? saved.claimedMilestones : []
    };
  }
  if (!Array.isArray(saved.completed)) saved.completed = [];
  let completed = new Set(saved.completed);
  let streak = Number(saved.streak) || 0;
  let lastCompletedDate = saved.lastCompletedDate || "";
  let claimedMilestones = Array.isArray(saved.claimedMilestones) ? saved.claimedMilestones : [];

  function persist() {
    const next = { date, completed: [...completed], streak, lastCompletedDate, claimedMilestones };
    if (window.tambayanProgress?.setDailyDispatch) {
      window.tambayanProgress.setDailyDispatch(next);
    } else {
      try { localStorage.setItem("tambayan_daily_dispatch_v2", JSON.stringify(next)); } catch (_) {}
    }
  }

  function render() {
    const list = $("dailyMissionList");
    if (!list) return;
    list.innerHTML = challenges.map((item, index) => {
      const done = completed.has(item.id);
      return `
        <article class="daily-challenge-card ${done ? "is-complete" : ""}">
          <div class="daily-challenge-icon">${item.icon}</div>
          <div class="daily-challenge-copy">
            <span class="eyebrow">CHALLENGE 0${index + 1}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <span class="daily-challenge-reward">⭐ ${done ? "5 stars collected" : "5 stars"}</span>
          </div>
          <div class="daily-challenge-action">
            <span class="daily-challenge-status">${done ? "✓ DONE" : "READY"}</span>
            <button type="button" class="small-btn daily-go-button" data-scroll-to="${item.action}" ${done ? "disabled" : ""}>${done ? "Completed" : "Go explore"}</button>
          </div>
        </article>`;
    }).join("");

    const count = completed.size;
    const progress = $("dailyMissionProgress");
    const bar = $("dailyMissionProgressBar");
    const reward = $("dailyMissionReward");
    const status = $("dailyMissionStatus");
    if (progress) progress.textContent = count + " of 5 challenges completed";
    if (bar) bar.style.width = (count / 5 * 100) + "%";
    if (reward) reward.textContent = count === 5 ? "⭐ 40 stars earned today!" : "⭐ " + (count * 5) + " / 40 stars";
    if (status) status.textContent = count === 5 ? "ALL COMPLETED ✦" : " " + (5 - count) + " LEFT TO EXPLORE";
    const streakCount = $("dailyStreakCount");
    const streakHint = $("dailyStreakHint");
    if (streakCount) streakCount.textContent = streak + (streak === 1 ? " day streak" : " days streak");
    if (streakHint) {
      streakHint.textContent = count === 5
        ? "Today's dispatch is complete. See you tomorrow!"
        : "Finish all five challenges to complete today's dispatch.";
    }
    const mystery = $("dailyMysteryText");
    if (mystery) mystery.textContent = count === 5
      ? "You did it! All five little adventures are complete. Come back tomorrow for a fresh dispatch."
      : "Five little adventures are waiting. Explore each one and collect your stars.";
    const tomorrowTitle = $("dailyTomorrowTitle");
    const tomorrowDescription = $("dailyTomorrowDescription");
    if (tomorrowTitle) tomorrowTitle.textContent = "A fresh dispatch is on its way";
    if (tomorrowDescription) tomorrowDescription.textContent = "Your five daily challenges refresh tomorrow.";
  }

  function completeChallenge(id) {
    if (completed.has(id)) return;
    const challenge = challenges.find(item => item.id === id);
    if (!challenge || typeof window.tambayanApplyLoungeReward !== "function") return;
    if (!window.tambayanApplyLoungeReward("stars", challenge.reward, "Daily Dispatch: " + challenge.title + "!")) return;

    completed.add(id);
    if (completed.size === 5) {
      streak = lastCompletedDate === addDays(date, -1) ? streak + 1 : 1;
      lastCompletedDate = date;
      const milestones = { 3: 15, 7: 35, 14: 75, 30: 150 };
      const bonus = milestones[streak];
      if (bonus && !claimedMilestones.includes(streak)) {
        if (window.tambayanApplyLoungeReward("stars", bonus, streak + "-day Daily Dispatch streak! 🎉")) {
          claimedMilestones.push(streak);
        }
      }
    }
    persist();
    render();
  }

  const panel = $("dailyTambayanPanel");
  if (!panel) return;

  panel.addEventListener("click", event => {
    const go = event.target.closest("[data-scroll-to]");
    if (go) {
      const target = $(go.dataset.scrollTo);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.focus?.({ preventScroll: true });
      }
    }
  });

  document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const challenge = challenges.find(item => item.action === button.id);
    if (challenge) completeChallenge(challenge.id);
  }, true);

  render();
})();