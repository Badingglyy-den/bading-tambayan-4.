(() => {
"use strict";

const KEY = "tambayanverse_42_progress";
const LEGACY_KEYS = [
  "tambayanverse_41_progress",
  "tambayanverse_4_progress"
];

const $ = id => document.getElementById(id);

const defaultState = () => ({
  version: 42,
  profile: { name: "Sis", avatar: "💜" },
  xp: 0,
  stars: 20,
  gamesPlayed: 0,
  entries: [],
  discoveries: [],
  badges: [],
  completedMissions: [],
  lastMissionDate: "",
  lastDailyMessage: "A little progress is still progress.",
  createdAt: new Date().toISOString(),
  achievements: [],
  visited: [],
  completed: [],
  journalEntries: [],
  letters: [],
  memories: [],
  mood: "",
  reducedMotion: false,
  theme: "violet",
  ownedItems: [],
  hangoutPosts: [],
  kindPosts: [],
  lastHangoutQuestion: ""
});

let state = loadState();
let toastTimer = null;
let reactionTimer = null;
let reactionStart = 0;
let reactionMode = "idle";
let memoryCards = [];
let memoryOpen = [];
let memoryMatches = 0;

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function loadState() {
  let current = safeParse(localStorage.getItem(KEY));

  if (current?.data) current = current.data;

  if (current && typeof current === "object") {
    return normalize(current);
  }

  for (const k of LEGACY_KEYS) {
    let old = safeParse(localStorage.getItem(k));

    if (old?.data) old = old.data;

    if (old && typeof old === "object") {
      const migrated = normalize(old);
      localStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    }
  }

  return defaultState();
}

function normalize(x) {
  const d = defaultState();

  return {
    ...d,
    ...x,
    version: 42,
    profile: { ...d.profile, ...(x.profile || {}) },
    entries: Array.isArray(x.entries) ? x.entries : [],
    discoveries: Array.isArray(x.discoveries) ? x.discoveries : [],
    badges: Array.isArray(x.badges) ? x.badges : [],
    completedMissions: Array.isArray(x.completedMissions) ? x.completedMissions : [],
    achievements: Array.isArray(x.achievements) ? x.achievements : [],
    visited: Array.isArray(x.visited) ? x.visited : [],
    completed: Array.isArray(x.completed) ? x.completed : [],
    ownedItems: Array.isArray(x.ownedItems) ? x.ownedItems : [],
    hangoutPosts: Array.isArray(x.hangoutPosts) ? x.hangoutPosts : [],
    kindPosts: Array.isArray(x.kindPosts) ? x.kindPosts : []
  };
}

function save() {
  state.version = 42;
  localStorage.setItem(KEY, JSON.stringify(state));
  render();
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    t.classList.remove("show");
  }, 2500);
}

function awardXP(n, reason = "") {
  const previousXP = state.xp;
  state.xp += n;

  // Award 1 Star for every new 10-XP milestone reached.
  const bonus =
    Math.floor(state.xp / 10) -
    Math.floor(previousXP / 10);

  state.stars += bonus;

  const before = Math.floor(previousXP / 100) + 1;
  const after = Math.floor(state.xp / 100) + 1;

  if (after > before) {
    toast(
      `LEVEL UP! You're now level ${after} ✨` +
      (bonus ? ` +${bonus} ⭐` : "")
    );
  } else {
    toast(
      `${reason || "Nice!"} +${n} XP` +
      (bonus ? ` and ${bonus} ⭐` : "")
    );
  }

  save();
}

// Public reward bridge for Lounge add-ons.
// Keeps all XP, Star milestones, saving, and rendering in this file.
window.tambayanAwardXP = function (amount, reason = "Lounge reward!") {
  const n = Number(amount);

  if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
    console.warn("Ignored invalid Tambayan XP reward:", amount);
    return false;
  }

  awardXP(n, String(reason || "Lounge reward!"));
  return true;
};

// Shared reward bridge for Lounge add-ons.
// XP uses the normal milestone system; direct Stars are added separately.
window.tambayanApplyLoungeReward = function (rewardType, amount, reason = "Lounge reward!") {
  const n = Number(amount);

  if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
    console.warn("Ignored invalid Tambayan Lounge reward:", rewardType, amount);
    return false;
  }

  if (rewardType === "xp") {
    awardXP(n, String(reason || "Lounge reward!"));
    return true;
  }

  if (rewardType === "star" || rewardType === "stars") {
    state.stars += n;
    toast((reason || "Lounge reward!") + " +" + n + " ⭐");
    save();
    return true;
  }

  console.warn("Unsupported Tambayan Lounge reward type:", rewardType);
  return false;
};

// Allowlisted collectibles earned from Lounge rewards.
// These are inventory items, not purchasable shop items.
const loungeCollectibles = {
  rare_collectible_01: {
    icon: "💎",
    name: "Rare Tambayan Gem"
  },
  epic_collectible_01: {
    icon: "🔮",
    name: "Epic Tambayan Relic"
  },
  legendary_collectible_01: {
    icon: "👑",
    name: "Legendary Tambayan Treasure"
  }
};

// Add a collectible to the player's inventory.
// Unknown keys are rejected, and duplicate items are not added.
window.tambayanAddLoungeCollectible = function (
  key,
  reason = "Lounge collectible!"
) {
  const item = loungeCollectibles[key];

  if (!item) {
    console.warn("Unknown Lounge collectible:", key);
    return false;
  }

  if (!Array.isArray(state.ownedItems)) {
    state.ownedItems = [];
  }

  if (state.ownedItems.includes(key)) {
    return true;
  }

  state.ownedItems.push(key);
  toast(reason + " " + item.icon + " " + item.name);
  save();

  return true;
};

function level() {
  return Math.floor(state.xp / 100) + 1;
}

function addBadge(id) {
  if (!state.badges.includes(id)) {
    state.badges.push(id);
    toast("New badge unlocked! 🏅");
  }
}

function visit(id) {
  if (!state.visited.includes(id)) {
    state.visited.push(id);
    state.discoveries.push(id);

    if (state.visited.length === 1) {
      addBadge("first_world");
    }

    awardXP(5, "World discovered!");
  } else {
    save();
  }
}

function render() {
  $("starCount").textContent = state.stars;
  $("shopStars").textContent = state.stars;
  $("welcomeName").textContent = state.profile.name || "Sis";

  $("levelValue").textContent = level();

  $("titleValue").textContent =
    level() >= 10
      ? "Tambayan Legend"
      : level() >= 5
      ? "Certified Main Character"
      : "Certified Tambay";

  $("xpValue").textContent = state.xp + " XP";

$("xpBar").style.width = (state.xp % 100) + "%";
$("xpNext").textContent =
  (state.xp % 100) + " / 100 XP to next level";

  $("discoveryValue").textContent = state.discoveries.length;
  $("badgeValue").textContent = state.badges.length;

  renderDiary();
  renderHangout();
  renderShop();
  renderAchievements();

  document.body.dataset.theme = state.theme || "violet";

  document.querySelectorAll(".theme-choice").forEach(b => {
    b.classList.toggle("active", b.dataset.theme === state.theme);
  });
}

function renderDiary() {
  const q = $("diarySearch").value.toLowerCase();
  const list = $("diaryList");

  const entries = [...state.entries]
    .reverse()
    .filter(e =>
      (e.title + " " + e.body + " " + e.mood)
        .toLowerCase()
        .includes(q)
    );

  if (!entries.length) {
    list.innerHTML =
      '<p class="empty-state">No entries found. Your page is waiting for its next story.</p>';
    return;
  }

  list.innerHTML = entries.map(e => `
    <article class="diary-entry">
      <div class="entry-meta">
        ${escapeHTML(e.type || "journal")} ·
        ${new Date(e.date || Date.now()).toLocaleString()} ·
        ${escapeHTML(e.mood || "")}
      </div>

      <h4>${e.favorite ? "💜 " : ""}${escapeHTML(e.title)}</h4>

      <p>${escapeHTML(e.body)}</p>

      <div class="entry-actions">
        <button data-entry="fav" data-id="${e.id}">
          ${e.favorite ? "Unfavorite" : "Favorite"}
        </button>

        <button data-entry="edit" data-id="${e.id}">Edit</button>
        <button data-entry="delete" data-id="${e.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

function escapeHTML(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

/* Safe during the transition away from the old Hangout layout. */
function renderHangout() {
  const feed = $("hangoutFeed");

  if (feed) {
    feed.innerHTML = state.hangoutPosts.length
      ? state.hangoutPosts.slice().reverse().map(p => `
        <div class="feed-item">
          <b>${escapeHTML(p.name)}</b> · ${escapeHTML(p.message)}
          <small>${new Date(p.date).toLocaleString()}</small>
        </div>
      `).join("")
      : '<p class="empty-state">Wala pang nag-post. Be the first, sis.</p>';
  }

  const kindnessFeed = $("kindFeed");

  if (kindnessFeed) {
    kindnessFeed.innerHTML = state.kindPosts
      .slice()
      .reverse()
      .map(p => `<div class="kind-item">💌 ${escapeHTML(p)}</div>`)
      .join("");
  }
}

const shopItems = [
  {
    id: "title_star",
    icon: "🌟",
    name: "Star Child title",
    desc: "A tiny celestial flex.",
    cost: 25
  },
  {
    id: "title_delulu",
    icon: "🤡",
    name: "Delulu Royalty title",
    desc: "Delusion with distinction.",
    cost: 30
  },
  {
    id: "badge_frog",
    icon: "🐸",
    name: "Frog Bestie badge",
    desc: "Official frog confidante.",
    cost: 35
  },
  {
    id: "badge_chaos",
    icon: "🪩",
    name: "Chaos Icon badge",
    desc: "You are the plot twist.",
    cost: 40
  },
  {
    id: "avatar_crown",
    icon: "👑",
    name: "Golden crown",
    desc: "A royal profile collectible.",
    cost: 50
  },
  {
    id: "title_soft",
    icon: "🧸",
    name: "Softie Supreme title",
    desc: "Gentle but iconic.",
    cost: 30
  }
];

function renderShop() {
  $("shopGrid").innerHTML = shopItems.map(i => {
    let owned = state.ownedItems.includes(i.id);

    return `
      <article class="shop-item">
        <span>${i.icon}</span>
        <h4>${i.name}</h4>
        <p>${i.desc}</p>

        <button
          class="small-btn"
          data-buy="${i.id}"
          ${owned || state.stars < i.cost ? "disabled" : ""}
        >
          ${owned ? "Owned" : `⭐ ${i.cost} · Unlock`}
        </button>
      </article>
    `;
  }).join("");

  // Show both shop purchases and Lounge-earned collectibles.
  // Lounge collectibles remain separate from the purchasable shop.
  $("collectionList").innerHTML = state.ownedItems.length
    ? state.ownedItems.map(id => {
        const shopItem = shopItems.find(x => x.id === id);
        const loungeItem = Object.prototype.hasOwnProperty.call(
          loungeCollectibles,
          id
        )
          ? loungeCollectibles[id]
          : null;

        const item = shopItem || loungeItem;

        return item
          ? `<span class="collection-pill">${item.icon} ${item.name}</span>`
          : "";
      }).join("")
    : '<span class="empty-state">Your collection starts here.</span>';
}

function renderAchievements() {
  const ach = [
    ["first", "First steps"],
    ["arcade", "Arcade rookie"],
    ["comfort", "Comfort seeker"],
    ["lab", "Lab rat"],
    ["library", "Mystery hunter"],
    ["confession", "Open book"],
    ["community", "Community spirit"],
    ["five", "Five entries"],
    ["ten", "Ten games"],
    ["explorer", "World explorer"]
  ];

  $("achievementList").innerHTML = ach.map(([id, n]) => `
    <span class="chip ${state.achievements.includes(id) ? "" : "locked"}">
      ${state.achievements.includes(id) ? "🏆" : "🔒"} ${n}
    </span>
  `).join("");

  const disc = [
    "arcade",
    "comfort",
    "lab",
    "library",
    "confession",
    "community",
    "moon-message",
    "star-surprise"
  ];

  $("discoveryList").innerHTML = disc.map(id => `
    <span class="chip ${state.discoveries.includes(id) ? "" : "locked"}">
      ${state.discoveries.includes(id) ? "✦" : "🔒"}
      ${id.replaceAll("-", " ")}
    </span>
  `).join("");
}

function played() {
  state.gamesPlayed++;

  if (state.gamesPlayed >= 1) {
    state.achievements.push("arcade");
  }

  if (state.gamesPlayed >= 10) {
    state.achievements.push("ten");
  }

  awardXP(8, "Game played!");
}

function random(a) {
  return a[Math.floor(Math.random() * a.length)];
}

$("profileOpen").onclick = () =>
  $("profileDialog").showModal();

$("settingsOpen").onclick = () =>
  $("settingsDialog").showModal();

$("backupOpen").onclick = () =>
  $("settingsDialog").showModal();

$("saveProfile").onclick = () => {
  state.profile.name = $("profileName").value.trim() || "Sis";
  state.profile.avatar = $("profileAvatar").value;

  save();

  $("profileDialog").close();
  toast("Profile updated! 💜");
};


function updateAvatarSelection(avatar) {
  $("profileAvatar").value = avatar;
  $("avatarPreview").textContent = avatar;

  document.querySelectorAll(".avatar-choice").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.avatar === avatar
    );
  });
}

$("profileOpen").addEventListener("click", () => {
  $("profileName").value = state.profile.name;
  updateAvatarSelection(state.profile.avatar);
});

document.querySelectorAll(".avatar-choice").forEach(button => {
  button.addEventListener("click", () => {
    updateAvatarSelection(button.dataset.avatar);
  });
});


$("dailyMessage").onclick = () => {
  const m = random([
    "You are allowed to outgrow places you once begged to belong in.",
    "Hindi ka late. You are living at your own pace.",
    "You can be a work in progress and still be worthy of love.",
    "Rest. Hindi ka robot, kahit minsan ikaw ang taga-ayos ng lahat.",
    "A little progress is still progress. Keep going, sis."
  ]);

  state.lastDailyMessage = m;
  toast(m);
  save();
};

document.querySelectorAll(".world-card").forEach(a => {
  a.addEventListener("click", () => {
    visit(a.getAttribute("href").replace("#", ""));
  });
});

$("guessBtn").onclick = () => {
  const n = Number($("guessInput").value);
  const target = Number(
    $("guessInput").dataset.target || Math.ceil(Math.random() * 10)
  );

  $("guessInput").dataset.target = target;

  if (!n || n < 1 || n > 10) {
    $("guessResult").textContent = "Pick a number from 1 to 10, sis.";
    return;
  }

  if (n === target) {
    $("guessResult").textContent =
      "Correct! The universe chose you. 🎉";

    $("guessInput").dataset.target = "";
    played();
  } else {
    $("guessResult").textContent =
      n < target ? "Higher! Try again." : "Lower! Try again.";
  }
};

$("reactionBtn").onclick = () => {
  if (reactionMode === "waiting") {
    clearTimeout(reactionTimer);
    reactionMode = "idle";

    $("reactionBtn").textContent = "Start reaction test";
    $("reactionResult").textContent = "Too early! Hala, excited?";

    return;
  }

  if (reactionMode === "ready") {
    const ms = Date.now() - reactionStart;

    reactionMode = "idle";
    $("reactionBtn").textContent = "Start reaction test";
    $("reactionResult").textContent =
      `${ms} ms! ${ms < 300 ? "Ang bilis!" : "Not bad, sis."}`;

    played();
    return;
  }

  reactionMode = "waiting";
  $("reactionBtn").textContent = "Wait for green...";
  $("reactionResult").textContent = "Don't tap yet!";
  $("reactionBtn").style.background = "#e5a0a0";

  reactionTimer = setTimeout(() => {
    reactionMode = "ready";
    reactionStart = Date.now();

    $("reactionBtn").textContent = "TAP NOW!";
    $("reactionBtn").style.background = "#75d7a0";
  }, 1000 + Math.random() * 2500);
};

function setupMemory() {
  const icons = [
    "🌙", "💜", "🐸", "⭐",
    "🦋", "🍓", "🪩", "🌷"
  ];

  memoryCards = [...icons, ...icons].sort(() => Math.random() - 0.5);
  memoryOpen = [];
  memoryMatches = 0;

  $("memoryBoard").innerHTML = memoryCards.map((_, i) => `
    <button class="memory-card" data-card="${i}">?</button>
  `).join("");

  $("memoryResult").textContent = "Find the pairs!";
}

$("memoryBoard").onclick = e => {
  const b = e.target.closest("[data-card]");

  if (!b || b.disabled || memoryOpen.length === 2) return;

  const i = Number(b.dataset.card);

  b.textContent = memoryCards[i];
  b.disabled = true;

  memoryOpen.push({ i, b });

  if (memoryOpen.length === 2) {
    if (
      memoryCards[memoryOpen[0].i] ===
      memoryCards[memoryOpen[1].i]
    ) {
      memoryOpen.forEach(x => x.b.classList.add("matched"));
      memoryMatches++;
      memoryOpen = [];

      if (memoryMatches === 8) {
        $("memoryResult").textContent =
          "All pairs found! Memory queen!";

        played();
      }
    } else {
      setTimeout(() => {
        memoryOpen.forEach(x => {
          x.b.textContent = "?";
          x.b.disabled = false;
        });

        memoryOpen = [];
      }, 700);
    }
  }
};

$("memoryReset").onclick = setupMemory;
setupMemory();

const wyr = [
  [
    "Would you rather read minds or see the future?",
    "Read minds",
    "See the future"
  ],
  [
    "Would you rather have unlimited snacks or unlimited naps?",
    "Unlimited snacks",
    "Unlimited naps"
  ],
  [
    "Would you rather be famous or peacefully rich?",
    "Famous",
    "Peacefully rich"
  ],
  [
    "Would you rather relive your best day or skip your worst day?",
    "Relive the best",
    "Skip the worst"
  ]
];

function newWyr() {
  let x = random(wyr);

  $("wyrQuestion").textContent = x[0];
  $("wyrA").textContent = x[1];
  $("wyrB").textContent = x[2];
  $("wyrResult").textContent =
    "Walang wrong answer. May judgment lang.";
}

["wyrA", "wyrB"].forEach(id => {
  $(id).onclick = () => {
    $("wyrResult").textContent =
      "Choice locked in. Panindigan mo 'yan, sis. 💅";

    played();
    newWyr();
  };
});

$("promptBtn").onclick = () => {
  $("promptResult").textContent = random([
    "Truth: What's a tiny thing you pretend doesn't bother you?",
    "Dare: Give yourself one genuine compliment.",
    "Truth: What's your most harmless delusion?",
    "Dare: Drink some water. Yes, that's the dare."
  ]);

  played();
};

$("coinBtn").onclick = () => {
  $("coinResult").textContent = random([
    "HEADS! Take the chance. 🪙",
    "TAILS! Maybe rest first. 🪙"
  ]);

  played();
};

/* NEW ARCADE GAMES: 7–12 */

const rpsChoices = ["rock", "paper", "scissors"];

document.querySelector(".game-grid").addEventListener("click", e => {
  const button = e.target.closest("[data-rps]");
  if (!button) return;

  const player = button.dataset.rps;
  if (!rpsChoices.includes(player)) return;

  const computer = random(rpsChoices);
  let result;

  if (player === computer) {
    result = `It's a draw! You both chose ${player}.`;
  } else if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    result = `You win! ${player} beats ${computer}. 🎉`;
  } else {
    result = `Computer wins! ${computer} beats ${player}. Try again!`;
  }

  $("rpsResult").textContent = result;
  played();
});

let mathAnswer = 0;

function newMathQuestion() {
  const operations = ["+", "-", "×"];
  const operation = random(operations);
  let a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;

  if (operation === "-" && b > a) {
    [a, b] = [b, a];
  }

  if (operation === "+") mathAnswer = a + b;
  if (operation === "-") mathAnswer = a - b;
  if (operation === "×") mathAnswer = a * b;

  $("mathQuestion").textContent = `${a} ${operation} ${b} = ?`;
  $("mathInput").value = "";
  $("mathResult").textContent = "Solve it to earn your XP!";
}

$("mathCheck").onclick = () => {
  const value = $("mathInput").value.trim();

  if (value === "") {
    $("mathResult").textContent = "Enter your answer first, sis.";
    return;
  }

  if (Number(value) === mathAnswer) {
    $("mathResult").textContent = "Correct! Math genius era. 🧠✨";
    played();
    newMathQuestion();
  } else {
    $("mathResult").textContent = "Not quite! Try again. You got this.";
  }
};

$("mathNew").onclick = newMathQuestion;

const scrambleWords = [
  "RAINBOW",
  "TAMBAYAN",
  "BUTTERFLY",
  "MIDNIGHT",
  "PINEAPPLE",
  "GALAXY",
  "KARAOKE",
  "SUNSHINE"
];

let scrambleAnswer = "";

function shuffleWord(word) {
  let shuffled = word.split("");

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  if (shuffled.join("") === word) {
    shuffled.reverse();
  }

  return shuffled.join(" ");
}

function newScramble() {
  scrambleAnswer = random(scrambleWords);
  $("scrambleWord").textContent = shuffleWord(scrambleAnswer);
  $("scrambleInput").value = "";
  $("scrambleResult").textContent = "Unscramble the word!";
}

$("scrambleCheck").onclick = () => {
  const guess = $("scrambleInput").value.trim().toUpperCase();

  if (!guess) {
    $("scrambleResult").textContent = "Type your answer first!";
    return;
  }

  if (guess === scrambleAnswer) {
    $("scrambleResult").textContent = "You got it! Word wizard! 🔤";
    played();
    newScramble();
  } else {
    $("scrambleResult").textContent = "Not that one. Keep trying!";
  }
};

$("scrambleNew").onclick = newScramble;

const emojiPuzzles = [
  { clue: "🌧️ + 🐱 + 🐶", answer: "raining cats and dogs" },
  { clue: "🧊 + ☕", answer: "iced coffee" },
  { clue: "⭐ + 🐟", answer: "starfish" },
  { clue: "🌞 + 🌻", answer: "sunflower" },
  { clue: "🍯 + 🌙", answer: "honeymoon" },
  { clue: "🔥 + 🪰", answer: "firefly" }
];

let emojiAnswer = "";

function newEmojiPuzzle() {
  const puzzle = random(emojiPuzzles);
  emojiAnswer = puzzle.answer;
  $("emojiClue").textContent = puzzle.clue;
  $("emojiInput").value = "";
  $("emojiResult").textContent = "What phrase do these emojis make?";
}

$("emojiCheck").onclick = () => {
  const guess = $("emojiInput").value
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const answer = emojiAnswer.replace(/[^a-z]/g, "");

  if (!guess) {
    $("emojiResult").textContent = "Enter your guess first!";
    return;
  }

  if (guess === answer) {
    $("emojiResult").textContent = "Decoded! You're an emoji expert. 🧩";
    played();
    newEmojiPuzzle();
  } else {
    $("emojiResult").textContent = "Nope, decode those emojis again!";
  }
};

$("emojiNew").onclick = newEmojiPuzzle;

let higherAnswer = 0;
let higherFinished = false;

function newHigherNumber() {
  higherAnswer = Math.floor(Math.random() * 20) + 1;
  higherFinished = false;
  $("higherInput").value = "";
  $("higherResult").textContent = "I'm thinking of a number from 1 to 20...";
}

$("higherCheck").onclick = () => {
  if (higherFinished) {
    $("higherResult").textContent = "Start a new round to play again.";
    return;
  }

  const value = Number($("higherInput").value);

  if (
    $("higherInput").value.trim() === "" ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 20
  ) {
    $("higherResult").textContent = "Enter a whole number from 1 to 20.";
    return;
  }

  if (value === higherAnswer) {
    higherFinished = true;
    $("higherResult").textContent = `Correct! It was ${higherAnswer}! 🎉`;
    played();
  } else if (value < higherAnswer) {
    $("higherResult").textContent = "Higher! Guess again.";
  } else {
    $("higherResult").textContent = "Lower! Guess again.";
  }
};

$("higherNew").onclick = newHigherNumber;

const colorSets = [
  ["red", "yellow", "blue"],
  ["green", "purple", "orange", "red"],
  ["blue", "blue", "yellow", "green"],
  ["purple", "orange", "red", "yellow", "blue"]
];

const colorEmojis = {
  red: "🔴",
  yellow: "🟡",
  blue: "🔵",
  green: "🟢",
  purple: "🟣",
  orange: "🟠"
};

let colorAnswer = [];

function newColorSequence() {
  colorAnswer = random(colorSets).slice();
  $("colorSequence").textContent =
    colorAnswer.map(color => colorEmojis[color]).join(" ");
  $("colorInput").value = "";
  $("colorResult").textContent =
    "Memorize the sequence, then type the color names in order.";
}

$("colorCheck").onclick = () => {
  const guess = $("colorInput").value
    .trim()
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

  if (!guess.length) {
    $("colorResult").textContent = "Type the colors in order first!";
    return;
  }

  if (guess.join(" ") === colorAnswer.join(" ")) {
    $("colorResult").textContent = "Perfect memory! Color champion! 🎨";
    played();
    newColorSequence();
  } else {
    $("colorResult").textContent =
      "Not quite! Check the order and try again.";
  }
};

$("colorNew").onclick = newColorSequence;

/* Prepare one question for each new game when the page loads. */
newMathQuestion();
newScramble();
newEmojiPuzzle();
newHigherNumber();
newColorSequence();

$("comfortBtn").onclick = () => {
  $("comfortText").textContent = random([
    "You don't have to earn rest.",
    "You can start again without hating who you were yesterday.",
    "Your feelings deserve space, even when they are messy.",
    "You are allowed to choose peace without explaining yourself.",
    "You are doing better than your anxious thoughts say."
  ]);

  visit("comfort");
  state.achievements.push("comfort");
  save();
};

$("deluluRange").oninput = () => {
  const n = Number($("deluluRange").value);

  $("deluluValue").textContent =
    n < 25
      ? `${n}% — grounded queen`
      : n < 50
      ? `${n}% — hopeful but aware`
      : n < 75
      ? `${n}% — cautiously delusional`
      : `${n}% — delulu is the solulu`;
};

$("deluluRange").onchange = () => {
  visit("lab");
  state.achievements.push("lab");
  save();
};

$("excuseBtn").onclick = () => {
  $("excuseText").textContent = random([
    "My social battery filed for bankruptcy.",
    "I was emotionally buffering.",
    " Mercury is in Gatorade. I cannot explain.",
    "My bed and I had an important meeting.",
    "I had to protect my peace and my snacks."
  ]);

  visit("lab");
};

$("dramaBtn").onclick = () => {
  $("dramaText").textContent = random([
    "THIS IS A HISTORICAL EVENT. CALL THE ARCHIVES.",
    "I need a fainting couch and a glass of water.",
    "The audacity has entered the building.",
    "Cue the rain, the violin, and my slow-motion exit."
  ]);

  visit("lab");
};

$("complimentBtn").onclick = () => {
  $("complimentText").textContent = random([
    "Compliment: Your presence is a whole comfort playlist. 💜",
    "Roast: You overthink like it's a full-time job. 🤡",
    "Compliment: You make ordinary moments feel special. ✨",
    "Roast: Your delulu has its own postal address."
  ]);

  visit("lab");
};

$("fortuneBtn").onclick = () => {
  $("fortuneText").textContent = random([
        "Someone's silence is about to tell you everything you need to know.",
    "An unexpected invitation may lead to a story worth remembering. Don't dismiss it too quickly.",
    "The thing you've been waiting for is taking its time. Thankfully, so are you.",
    "A familiar name may cross your path again. This time, you'll see things differently."
  ]);
    $("fortuneText").classList.remove("revealed");
  void $("fortuneText").offsetWidth;
  $("fortuneText").classList.add("revealed");

  visit("library");
  state.achievements.push("library");
  save();
};

$("courtBtn").onclick = () => {
  const verdict = $("courtText");

  verdict.classList.remove("revealed");
  void verdict.offsetWidth;

  verdict.textContent = random([
    "VERDICT: Not guilty. You were just being iconic.",
    "VERDICT: Guilty of entertaining nonsense. Sentence: log off.",
    "The court finds you innocent, but your screenshots are suspicious.",
    "Case dismissed. The judge needs a snack break."
  ]);

  verdict.classList.add("revealed");

  visit("library");
};

$("frogBtn").onclick = () => {
  $("frogText").textContent = random([
    "RIBBIT. The tea is hot but your peace is hotter.",
    "The frog says: don't text them. Text your bestie.",
    "Ribbit: someone is watching your stories. Let them.",
    "The frog has no advice. Just vibes and damp skin."
  ]);

  visit("library");
};

$("universeBtn").onclick = () => {
  $("universeText").textContent = random([
    "YES. But use your brain too.",
    "NO. Protect your peace.",
    "THE SIGNS ARE UNCLEAR. Ask again after a snack.",
    "MOST LIKELY. Stop asking the universe and take a step."
  ]);

  visit("library");
};

$("machineBtn").onclick = () => {
  $("machineText").textContent = random([
    "🫶 LAMBING! You deserve softness today.",
    "👋 SAMPAL! Wake up, the standards are on the floor.",
    "💜 LAMBING! Virtual hug, no explanation needed.",
    "🎰 JACKPOT: Both. Sampal sa delusion, lambing sa sarili."
  ]);

  visit("library");
};

$("forbiddenBtn").onclick = () => {
  const lines = [
    "You pressed it. The frog has filed a complaint.",
    "The forbidden button has chosen you. Unfortunately.",
    "Achievement unlocked: Walang self-control. 💀",
    "The universe said 'behave' and you said 'no'."
  ];

  $("forbiddenText").textContent = random(lines);

  addBadge("forbidden");
  awardXP(5, "Forbidden discovery!");

  if (!state.discoveries.includes("star-surprise")) {
    state.discoveries.push("star-surprise");
  }

  save();
};

$("excuseBtn").addEventListener("click", () =>
  state.achievements.push("lab")
);

$("fortuneBtn").addEventListener("click", () =>
  state.achievements.push("library")
);

$("diaryForm").onsubmit = e => {
  e.preventDefault();

  const entry = {
    id: "entry_" + Date.now() + "_" +
      Math.random().toString(36).slice(2, 7),
    title: $("entryTitle").value.trim(),
    body: $("entryBody").value.trim(),
    mood: $("entryMood").value,
    type: $("entryType").value,
    favorite: false,
    date: new Date().toISOString()
  };

  if (!entry.title || !entry.body) return;

  state.entries.push(entry);

  state.journalEntries =
    state.entries.filter(x => x.type === "journal");

  state.letters =
    state.entries.filter(x => x.type === "letter");

  state.memories =
    state.entries.filter(x => x.type === "memory");

  addBadge("first_entry");

  if (state.entries.length >= 5) {
    state.achievements.push("five");
  }

  $("diaryForm").reset();

  awardXP(10, "Thought saved!");
};

$("diarySearch").oninput = renderDiary;

$("diaryList").onclick = e => {
  const b = e.target.closest("[data-entry]");

  if (!b) return;

  const item = state.entries.find(x => x.id === b.dataset.id);

  if (!item) return;

  if (b.dataset.entry === "delete") {
    if (confirm("Delete this entry?")) {
      state.entries = state.entries.filter(x => x.id !== item.id);
    }
  }

  if (b.dataset.entry === "fav") {
    item.favorite = !item.favorite;

    if (item.favorite) {
      addBadge("first_favorite");
    }
  }

  if (b.dataset.entry === "edit") {
    const title = prompt("Edit title:", item.title);

    if (title === null) return;

    const body = prompt("Edit your thoughts:", item.body);

    if (body === null) return;

    item.title = title;
    item.body = body;
  }

  state.journalEntries =
    state.entries.filter(x => x.type === "journal");

  state.letters =
    state.entries.filter(x => x.type === "letter");

  state.memories =
    state.entries.filter(x => x.type === "memory");

  save();
};

/* The old local-only Hangout form and daily-question handlers are retired.
   The shared Kindness Wall is managed by kindness.js, so script.js must not
   attach a competing local-only handler to its button. */

$("shopGrid").onclick = e => {
  const b = e.target.closest("[data-buy]");

  if (!b) return;

  const item = shopItems.find(x => x.id === b.dataset.buy);

  if (
    !item ||
    state.ownedItems.includes(item.id) ||
    state.stars < item.cost
  ) {
    return;
  }

  state.stars -= item.cost;
  state.ownedItems.push(item.id);

  addBadge("shopper");

  save();
  toast(`${item.name} unlocked! ✨`);
};

$("themeOptions").onclick = e => {
  const b = e.target.closest("[data-theme]");

  if (!b) return;

  state.theme = b.dataset.theme;

  save();
  toast("Theme updated! 💜");
};

$("exportBtn").onclick = () => {
  const payload = {
    app: "Bading Tambayan 4.2",
    exportedAt: new Date().toISOString(),
    data: state
  };

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download =
    `bading-tambayan-backup-${new Date().toISOString().slice(0, 10)}.json`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);

  $("backupStatus").textContent =
    "Backup exported! Keep the .json file somewhere safe.";

  toast("Your backup is ready! 💾");
};

$("importFile").onchange = async e => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const parsed = safeParse(await file.text());
    const data = parsed?.data || parsed;

    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray(data.entries)
    ) {
      throw new Error("Invalid backup");
    }

    if (!confirm(
      "Importing will replace the current local save. Continue?"
    )) {
      return;
    }

    state = normalize(data);

    save();

    $("backupStatus").textContent =
      "Backup imported successfully!";

    toast("Progress restored! 💜");

  } catch (err) {
    $("backupStatus").textContent =
      "That file doesn't look like a valid Bading Tambayan backup.";

    toast("Import failed. Please choose a valid JSON backup.");
  }

  e.target.value = "";
};

$("resetBtn").onclick = () => {
  if (!confirm(
    "This will erase local progress on this device. Export a backup first. Continue?"
  )) {
    return;
  }

  state = defaultState();

  save();

  $("backupStatus").textContent = "Local progress reset.";

  toast("Fresh start. Ingat, sis.");
};

function initialMigrate() {
  if (!state.visited.length && state.discoveries.length) {
    state.visited = state.discoveries.filter(x =>
      [
        "arcade",
        "comfort",
        "lab",
        "library",
        "confession",
        "community"
      ].includes(x)
    );
  }
}

initialMigrate();
render();
newWyr();
setupMemory();

})();
