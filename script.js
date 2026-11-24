
"use strict";

/* ==========================================
   BADING TAMBAYAN 4.1 — THE TAMBAYANVERSE
   Complete game, profile, diary and save system
========================================== */

const SAVE_KEY = "tambayanverse_41_progress";
const LEGACY_KEY = "tambayanverse_4_progress";

const $ = (selector) => document.querySelector(selector);

const defaultState = {
  version: 41,
  profile: {
    name: "Little Chaos",
    avatar: "💜"
  },
  xp: 0,
  stars: 0,
  gamesPlayed: 0,
  entries: [],
  discoveries: [],
  badges: [],
  completedMissions: [],
  lastMissionDate: "",
  lastDailyMessage: "",
  createdAt: new Date().toISOString()
};

let state = loadState();
let editingEntryId = null;
let toastTimer = null;
let guessSecret = randomNumber();
let guessAttempts = 5;
let reactionState = "idle";
let reactionStart = 0;
let reactionTimer = null;
let memoryCards = [];
let memoryOpen = [];
let memoryMoves = 0;
let memoryLocked = false;

const worlds = {
  arcade: {
    title: "🎮 The Chaos Arcade",
    description: "Welcome to the place where common sense takes a vacation.",
    eyebrow: "WORLD 01 · ENTERTAINMENT",
    activities: [
      ["🔮", "Manghuhula ng Kapalaran", "Let the universe give you a questionable prediction.", "fortune"],
      ["⚖️", "Bading Court", "Present your case. The court is always dramatic.", "court"],
      ["🎰", "Sampal o Lambing Machine", "Let fate decide whether you need a hug or a reality check.", "sampal"],
      ["🐸", "Palakang Marites", "Ask the frog for a little gossip from the universe.", "frog"],
      ["🤡", "Delulu Meter", "Measure your current level of delusion.", "delulu"],
      ["😭", "Excuse Generator", "Need an excuse? We have absolutely no standards.", "excuse"],
      ["🎭", "Drama Queen Button", "Activate your daily dose of unnecessary drama.", "drama"],
      ["💅", "Compliment or Roast", "Let the machine decide your fate.", "roast"]
    ]
  },
  comfort: {
    title: "🫂 The Comfort Corner",
    description: "A soft little corner for days when the world feels too loud.",
    eyebrow: "WORLD 02 · SOFT LANDING",
    activities: [
      ["💜", "Virtual Hug", "You deserve a little warmth.", "hug"],
      ["🌷", "Gentle Reminder", "A small reminder for your heart.", "reminder"],
      ["✨", "Random Compliment", "Receive a little kindness.", "compliment"],
      ["🕯️", "Permission to Rest", "You don't have to earn your rest.", "rest"],
      ["💌", "Letter to Yourself", "A reminder that you are worth showing up for.", "selfletter"],
      ["🌙", "Midnight Comfort", "A soft message for your tired mind.", "midnight"]
    ]
  },
  lab: {
    title: "🧪 The Experiment Lab",
    description: "Research, questionable science, and highly unqualified personality tests.",
    eyebrow: "WORLD 03 · EXPERIMENTATION",
    activities: [
      ["🧠", "Chaos Personality Test", "Discover your current chaos category.", "personality"],
      ["🌈", "Mood Detector", "Find a name for your current vibe.", "mood"],
      ["💥", "Emotional Damage Report", "Generate your official emotional report.", "damage"],
      ["🪞", "Main Character Energy", "Check your current main character status.", "maincharacter"],
      ["🧬", "Bading Species", "Discover your fictional tambayan species.", "species"]
    ]
  },
  library: {
    title: "🔮 The Mystery Library",
    description: "The shelves are full of secrets, signs, and questionable prophecies.",
    eyebrow: "WORLD 04 · MYSTERY",
    activities: [
      ["🌌", "Ask the Universe", "Ask a question. Receive a mysterious answer.", "universe"],
      ["🔮", "Tarot of the Tambayan", "Draw a completely unofficial card.", "tarot"],
      ["📜", "Secret Prophecy", "Read your prophecy for today.", "prophecy"],
      ["⭐", "Lucky Number", "Find your random lucky number.", "lucky"],
      ["🚪", "The Forbidden Button", "You were told not to press it.", "forbidden"]
    ]
  },
  confession: {
    title: "📔 The Confession Room",
    description: "No judgment. No pressure. Just a place to put your thoughts.",
    eyebrow: "WORLD 05 · MEMORIES",
    activities: [
      ["📖", "Write a Journal", "Save a thought in your personal diary.", "journal"],
      ["💌", "Write a Letter", "Write a letter you may or may not send.", "letter"],
      ["🫙", "Memory Jar", "Save a little moment worth remembering.", "memory"],
      ["💭", "Brain Dump", "Let your thoughts out without organizing them.", "braindump"]
    ]
  },
  community: {
    title: "🌟 The Community Board",
    description: "Announcements, compliments, and public displays of unseriousness.",
    eyebrow: "WORLD 06 · COMMUNITY",
    activities: [
      ["📢", "Tambayan Announcement", "A very important and totally unnecessary announcement.", "announcement"],
      ["💜", "Compliment Generator", "You deserve to hear something nice.", "compliment"],
      ["🔥", "Friendly Roast", "A little playful teasing, nothing too serious.", "friendlyroast"],
      ["📋", "Daily Bulletin", "Today's official report from the universe.", "bulletin"],
      ["🎤", "Confession Booth", "Send yourself a prompt for a confession.", "prompt"]
    ]
  }
};

const responses = {
  fortune: [
    "A plot twist is approaching. Please prepare snacks.",
    "Your next chapter involves peace, better decisions, and possibly food.",
    "The universe says: stop overthinking that one message.",
    "Something good is coming. It may arrive disguised as a random Tuesday.",
    "Your future is bright. Your sleep schedule, however, needs help."
  ],
  court: [
    "VERDICT: Not guilty. The defendant was simply being iconic.",
    "VERDICT: Guilty of overthinking in the first degree.",
    "VERDICT: Case dismissed. Everybody go drink water.",
    "VERDICT: The court finds you innocent but dramatic.",
    "VERDICT: You deserve compensation in the form of snacks."
  ],
  sampal: [
    "LAMBING! You deserve a hug. Come here. 🫂",
    "SAMPAL! A gentle reminder to stop entertaining nonsense. 😭",
    "LAMBING! Be kind to yourself today. 💜",
    "SAMPAL! Stand up, drink water, and reclaim your dignity.",
    "LAMBING! You are doing better than you think."
  ],
  frog: [
    "RIBBIT. Someone is thinking about you. Or maybe they're just hungry.",
    "RIBBIT. The tea is hot, but so is your potential.",
    "RIBBIT. Stop checking something that is not checking on you.",
    "RIBBIT. Your peace is more important than the latest chismis.",
    "RIBBIT. The frog knows everything. The frog says take a nap."
  ],
  delulu: [
    "Mildly delusional. Still within acceptable limits.",
    "Delulu level: 87%. Reality has filed a complaint.",
    "You are not delusional. You are simply exploring alternative realities.",
    "Critical delulu. Please reconnect with the real world.",
    "Delulu but self-aware. A rare and powerful species."
  ],
  excuse: [
    "Sorry, I was busy being a functioning member of society. Temporarily.",
    "My brain has entered airplane mode.",
    "I would love to, but my social battery has submitted a resignation letter.",
    "I was going to, but the universe had other plans.",
    "Please understand. I am currently buffering."
  ],
  drama: [
    "EVERYBODY STOP. I HAVE AN ANNOUNCEMENT.",
    "This is not a drill. I need attention immediately.",
    "Cue the dramatic background music.",
    "I have suffered enough. Bring me a snack.",
    "A moment of silence for my patience. It has left the group chat."
  ],
  roast: [
    "You're the plot twist nobody asked for, but everybody remembers.",
    "Your confidence is impressive. Your decision-making is a separate discussion.",
    "You have the energy of a group chat notification at 3 AM.",
    "You're not a red flag. You're the entire parade.",
    "Respectfully, please sit down and think about your choices."
  ],
  hug: [
    "Sending you the biggest virtual hug. You don't have to explain anything. 🫂",
    "You are allowed to have difficult days. It doesn't make you any less wonderful.",
    "Take a breath. You are here. That's enough for this moment.",
    "Imagine a warm blanket, a quiet room, and absolutely no responsibilities for five minutes.",
    "You deserve gentleness, including from yourself."
  ],
  reminder: [
    "You don't have to figure everything out today.",
    "Rest is not a reward. It is a human need.",
    "You can care about people without carrying everything for them.",
    "Your worth is not measured by how useful you are to others.",
    "You are allowed to change your mind and choose a different path."
  ],
  compliment: [
    "You have a way of making ordinary things feel a little more special.",
    "You are more capable than your doubts let you believe.",
    "Your presence matters, even on days when you feel invisible.",
    "You deserve the same patience you give to other people.",
    "There is something lovely about the way you keep going."
  ],
  rest: [
    "Permission granted. Close the tabs in your brain for a moment.",
    "You can pause. The world can wait a little.",
    "You do not need to turn every free moment into a productive one.",
    "Take your break. No explanation required.",
    "Rest first. Figure things out later."
  ],
  selfletter: [
    "Dear self, I hope you remember that you are a person too. You deserve care, patience, and a life that feels like your own.",
    "Dear self, thank you for making it through the days you never thought you could handle. I am proud of you.",
    "Dear self, you do not need to be perfect to be worthy of love and respect."
  ],
  midnight: [
    "If today was heavy, let tonight be gentle.",
    "You can put down the things you cannot solve right now.",
    "Not every thought deserves an answer tonight.",
    "Tomorrow is another page. You don't have to write it all before sleeping."
  ],
  personality: [
    "The Responsible Chaos: somehow organized, somehow a disaster.",
    "The Silent Observer: knows everything, says very little.",
    "The Soft Menace: sweet intentions, questionable execution.",
    "The Main Character: dramatic soundtrack included.",
    "The Professional Overthinker: has 37 possible scenarios ready."
  ],
  mood: [
    "Your vibe is lavender skies after a long day.",
    "Your mood is a sleepy cat pretending to be productive.",
    "Your current energy is rainy afternoon with a little hope.",
    "Your aura is chaotic but healing.",
    "You are giving quiet comeback energy."
  ],
  damage: [
    "REPORT: Emotional battery at 42%. Recommended treatment: rest and snacks.",
    "REPORT: Too many tabs open in your mind. Close three of them.",
    "REPORT: Current status: surviving with style.",
    "REPORT: You have been through a lot. Please schedule a little joy.",
    "REPORT: No further questions. You deserve a peaceful day."
  ],
  maincharacter: [
    "Main character energy: 94%. The soundtrack is excellent.",
    "Side quest energy today. Go collect a little joy.",
    "Character development is happening. Please be patient with the storyline.",
    "You are the main character. Stop giving every random extra a speaking role.",
    "Your season finale is not today. Keep going."
  ],
  species: [
    "Moonlight Frog: mysterious, sleepy, and full of opinions.",
    "Lavender Dragon: protective, soft-hearted, and occasionally dramatic.",
    "Chaos Fairy: small wings, big problems, excellent intentions.",
    "Cosmic Cat: independent, observant, and selectively affectionate.",
    "Stardust Goblin: collects little joys and random screenshots."
  ],
  universe: [
    "The universe says: give yourself more time.",
    "A closed door is not always a punishment. Sometimes it is direction.",
    "You do not need to chase what is meant to meet you halfway.",
    "Your next step does not need to be impressive. It only needs to be yours.",
    "Something can be meaningful even if it does not last forever."
  ],
  tarot: [
    "THE STAR ✨ — Hope, renewal, and remembering what makes you feel alive.",
    "THE MOON 🌙 — Uncertainty. Trust yourself, but check the facts.",
    "THE SUN ☀️ — Joy, clarity, and a reason to celebrate.",
    "THE HERMIT 🕯️ — Quiet time. You might need a little space.",
    "THE FOOL 🪄 — A fresh start. Be curious, not reckless."
  ],
  prophecy: [
    "A small decision will make your day unexpectedly better.",
    "You will soon laugh about something that once stressed you out.",
    "An opportunity may appear when you stop forcing the timeline.",
    "Your next adventure begins with one brave little step.",
    "A peaceful chapter is worth choosing."
  ],
  lucky: [
    "Your lucky number is 7. Use it wisely.",
    "Your lucky number is 13. Be a little mysterious.",
    "Your lucky number is 24. Something lovely is possible.",
    "Your lucky number is 8. Keep your balance.",
    "Your lucky number is 3. Make room for fun."
  ],
  forbidden: [
    "You pressed it. The frog has been notified.",
    "The button did absolutely nothing. Suspicious.",
    "A tiny portal opened. You are now legally responsible for the moon.",
    "The universe is disappointed. The universe is also laughing.",
    "Achievement unlocked: Cannot Follow Instructions."
  ],
  announcement: [
    "ATTENTION TAMBAYANVERSE: Hydrate, stretch, and mind your business.",
    "PUBLIC SERVICE ANNOUNCEMENT: You are allowed to log off.",
    "Important notice: Being kind to yourself is now mandatory.",
    "The management would like to remind everyone that snacks are important.",
    "Please remain calm. The chaos is under control. Probably."
  ],
  friendlyroast: [
    "You have 47 open tabs in your brain and none of them are loading.",
    "Your plans have plans, but somehow nothing gets done.",
    "You are a limited edition. The instruction manual is missing.",
    "Your talent for making things complicated deserves an award.",
    "You say 'one last thing' like it is not a whole new season."
  ],
  bulletin: [
    "TODAY: 60% chance of overthinking, 100% chance of needing a snack.",
    "UNIVERSE UPDATE: Your peace is still the priority.",
    "BREAKING: You are allowed to have a good day without earning it.",
    "WEATHER: A little chaos, followed by a chance of calm.",
    "HEADLINES: Main character refuses to give up."
  ],
  prompt: [
    "What is one thing you wish people understood about you?",
    "What is something you are proud of but rarely mention?",
    "What memory would you like to revisit for five minutes?",
    "What do you need more of in your life?",
    "What is one thing you are ready to let go of?"
  ]
};

const dailyMissions = [
  { title: "Visit a new world", description: "Explore a world you haven't visited before.", reward: 25, stars: 5, type: "world" },
  { title: "Play a little game", description: "Try one of the games in the Chaos Arcade.", reward: 25, stars: 5, type: "game" },
  { title: "Write something down", description: "Save a thought, letter, or memory in your diary.", reward: 25, stars: 5, type: "entry" },
  { title: "Discover your fortune", description: "Visit the Mystery Library and reveal a message.", reward: 25, stars: 5, type: "library" },
  { title: "Give yourself kindness", description: "Visit the Comfort Corner and receive a reminder.", reward: 25, stars: 5, type: "comfort" },
  { title: "Explore the universe", description: "Visit two different worlds today.", reward: 30, stars: 6, type: "twoWorlds" },
  { title: "Collect a little joy", description: "Play a game and save a diary entry.", reward: 35, stars: 7, type: "gameEntry" }
];

const badges = [
  { id: "first_world", icon: "🪐", name: "First Steps", description: "Visit your first world." },
  { id: "all_worlds", icon: "🌌", name: "Universe Explorer", description: "Discover all six worlds." },
  { id: "first_game", icon: "🎮", name: "Player One", description: "Play your first game." },
  { id: "game_five", icon: "🕹️", name: "Arcade Regular", description: "Play five games." },
  { id: "first_entry", icon: "📔", name: "Dear Diary", description: "Save your first diary entry." },
  { id: "entry_five", icon: "📚", name: "Memory Keeper", description: "Save five entries." },
  { id: "first_favorite", icon: "💜", name: "Treasured", description: "Favorite an entry." },
  { id: "level_five", icon: "👑", name: "Rising Star", description: "Reach level five." },
  { id: "mission", icon: "🎯", name: "Mission Accomplished", description: "Complete a daily mission." },
  { id: "secret", icon: "🔐", name: "Secret Finder", description: "Discover the hidden portal." }
];

const discoveries = [
  ["arcade", "🎮", "Chaos Arcade"],
  ["comfort", "🫂", "Comfort Corner"],
  ["lab", "🧪", "Experiment Lab"],
  ["library", "🔮", "Mystery Library"],
  ["confession", "📔", "Confession Room"],
  ["community", "🌟", "Community Board"]
];

const titles = [
  { level: 1, title: "New Arrival" },
  { level: 2, title: "Little Explorer" },
  { level: 3, title: "Certified Tambay" },
  { level: 5, title: "Chaos Enthusiast" },
  { level: 8, title: "Keeper of the Stars" },
  { level: 10, title: "Tambayan Royalty" },
  { level: 15, title: "Guardian of the Universe" },
  { level: 20, title: "Legend of the Tambayanverse" }
];

const dailyMessages = [
  "You are not behind. Your life is not a race.",
  "May today surprise you in the gentlest way.",
  "You deserve a life that feels good, not just one that looks good.",
  "Some days are for growing. Some days are for resting.",
  "A little progress is still progress.",
  "You can begin again without explaining why.",
  "May you find something to smile about today."
];

/* ---------- STORAGE AND MIGRATION ---------- */

function loadState() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) return normalizeState(JSON.parse(saved));

    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const old = JSON.parse(legacy);
      const migrated = { ...defaultState, ...old };
      migrated.entries = Array.isArray(old.entries) ? old.entries : [];

      if (Array.isArray(old.journal)) {
        old.journal.forEach(item => migrated.entries.push({
          id: makeId(),
          title: item.title || "Old journal entry",
          body: item.body || item.text || "",
          mood: item.mood || "😶 Numb",
          type: "journal",
          favorite: false,
          date: item.date || new Date().toISOString()
        }));
      }

      if (Array.isArray(old.letters)) {
        old.letters.forEach(item => migrated.entries.push({
          id: makeId(),
          title: item.title || "Old letter",
          body: item.body || item.text || "",
          mood: "💌 Letter",
          type: "letter",
          favorite: false,
          date: item.date || new Date().toISOString()
        }));
      }

      return normalizeState(migrated);
    }
  } catch (error) {
    console.warn("Could not read saved progress:", error);
  }
  return structuredCloneSafe(defaultState);
}

function normalizeState(data) {
  const base = structuredCloneSafe(defaultState);
  const merged = { ...base, ...data };
  merged.profile = { ...base.profile, ...(data.profile || {}) };
  merged.entries = Array.isArray(data.entries) ? data.entries : [];
  merged.discoveries = Array.isArray(data.discoveries) ? data.discoveries : [];
  merged.badges = Array.isArray(data.badges) ? data.badges : [];
  merged.completedMissions = Array.isArray(data.completedMissions) ? data.completedMissions : [];
  merged.xp = Number(merged.xp) || 0;
  merged.stars = Number(merged.stars) || 0;
  merged.gamesPlayed = Number(merged.gamesPlayed) || 0;
  return merged;
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    updateInterface();
  } catch (error) {
    console.error("Saving failed:", error);
    showToast("Could not save. Your browser storage may be full.");
  }
}

function makeId() {
  return "entry_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------- GENERAL HELPERS ---------- */

function randomNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function getLevel() {
  return Math.floor(state.xp / 100) + 1;
}

function getLevelProgress() {
  return state.xp % 100;
}

function getPlayerTitle() {
  const level = getLevel();
  let current = titles[0].title;
  titles.forEach(item => {
    if (level >= item.level) current = item.title;
  });
  return current;
}

function addXP(amount, message = "") {
  const previousLevel = getLevel();
  state.xp += amount;
  state.stars += Math.max(1, Math.floor(amount / 10));
  const newLevel = getLevel();

  if (newLevel > previousLevel) {
    showToast(`🎉 LEVEL UP! You are now level ${newLevel}!`);
  } else {
    showToast(message || `+${amount} XP and some stars! ⭐`);
  }

  checkBadges();
  saveState();
}

function addGameXP(amount = 15) {
  state.gamesPlayed++;
  addXP(amount, `Game complete! +${amount} XP 🎮`);
}

function discoverWorld(worldId) {
  if (!worlds[worldId]) return;
  if (!state.discoveries.includes(worldId)) {
    state.discoveries.push(worldId);
    state.stars += 3;
    showToast("New world discovered! +3 stars 🌟");
    checkBadges();
    saveState();
  }
}

function checkBadges() {
  const conditions = {
    first_world: state.discoveries.length >= 1,
    all_worlds: state.discoveries.length >= 6,
    first_game: state.gamesPlayed >= 1,
    game_five: state.gamesPlayed >= 5,
    first_entry: state.entries.length >= 1,
    entry_five: state.entries.length >= 5,
    first_favorite: state.entries.some(entry => entry.favorite),
    level_five: getLevel() >= 5,
    mission: state.completedMissions.length >= 1,
    secret: state.badges.includes("secret")
  };

  badges.forEach(badge => {
    if (conditions[badge.id] && !state.badges.includes(badge.id)) {
      state.badges.push(badge.id);
      state.stars += 5;
      showToast(`🏆 Badge unlocked: ${badge.name}! +5 stars`);
    }
  });
}

/* ---------- NAVIGATION ---------- */

function showView(viewId) {
  const target = document.getElementById(viewId);
  if (!target) return;

  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  target.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.view === viewId);
  });

  $("#mainNav").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (viewId === "diary") renderArchive();
  if (viewId === "collection") renderCollection();
  if (viewId === "profile") renderProfile();
}

function enterWorld(worldId) {
  const world = worlds[worldId];
  if (!world) return;

  discoverWorld(worldId);
  $("#worldEyebrow").textContent = world.eyebrow;
  $("#worldTitle").textContent = world.title;
  $("#worldDescription").textContent = world.description;
  $("#worldResult").classList.add("hidden");
  $("#worldResult").textContent = "";

  $("#worldContent").innerHTML = world.activities.map(activity => `
    <article class="activity-card">
      <div class="activity-icon">${activity[0]}</div>
      <h3>${escapeHTML(activity[1])}</h3>
      <p>${escapeHTML(activity[2])}</p>
      <button class="secondary-btn" data-action="${escapeHTML(activity[3])}">Try it ✨</button>
    </article>
  `).join("");

  showView("worldDetail");
}

/* ---------- WORLD ACTIVITIES ---------- */

function runActivity(action) {
  const result = $("#worldResult");
  if (!result) return;

  if (action === "journal" || action === "letter" || action === "memory" || action === "braindump") {
    showView("diary");
    const type = action === "braindump" ? "journal" : action;
    $("#entryType").value = type;
    $("#entryTitle").focus();
    showToast("Your diary is ready. Write whatever you need. 💜");
    return;
  }

  const message = randomItem(responses[action] || ["The universe is thinking. Try again."]);
  result.textContent = message;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  addXP(5, "+5 XP for exploring!");
}

/* ---------- DAILY MISSION ---------- */

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getTodayMission() {
  const dayNumber = Math.floor(Date.now() / 86400000);
  return dailyMissions[dayNumber % dailyMissions.length];
}

function renderMission() {
  const mission = getTodayMission();
  const completed = state.lastMissionDate === todayKey();

  $("#missionTitle").textContent = mission.title;
  $("#missionDescription").textContent = mission.description;
  $("#missionReward").textContent = `${mission.reward} XP + ${mission.stars} stars`;
  $("#completeMission").disabled = completed;
  $("#completeMission").textContent = completed ? "Mission completed ✓" : "Complete mission";
  $("#missionStatus").textContent = completed ? "You've completed today's mission. Come back tomorrow!" : "Your daily challenge is waiting.";
}

function completeMission() {
  if (state.lastMissionDate === todayKey()) {
    showToast("Today's mission is already complete. 💜");
    return;
  }

  const mission = getTodayMission();
  let eligible = false;

  switch (mission.type) {
    case "world":
      eligible = state.discoveries.length >= 1;
      break;
    case "game":
      eligible = state.gamesPlayed >= 1;
      break;
    case "entry":
      eligible = state.entries.length >= 1;
      break;
    case "library":
      eligible = state.discoveries.includes("library");
      break;
    case "comfort":
      eligible = state.discoveries.includes("comfort");
      break;
    case "twoWorlds":
      eligible = state.discoveries.length >= 2;
      break;
    case "gameEntry":
      eligible = state.gamesPlayed >= 1 && state.entries.length >= 1;
      break;
  }

  if (!eligible) {
    showToast("Not quite yet! Complete the mission activity first. ✨");
    return;
  }

  state.lastMissionDate = todayKey();
  state.completedMissions.push(todayKey());
  state.xp += mission.reward;
  state.stars += mission.stars;
  checkBadges();
  saveState();
  showToast(`Mission complete! +${mission.reward} XP and +${mission.stars} stars!`);
}

/* ---------- DAILY MESSAGE ---------- */

function newDailyMessage() {
  let message = randomItem(dailyMessages);
  if (dailyMessages.length > 1) {
    while (message === state.lastDailyMessage) message = randomItem(dailyMessages);
  }
  state.lastDailyMessage = message;
  $("#dailyMessage").textContent = message;
  saveState();
}

/* ---------- GUESS THE NUMBER ---------- */

function resetGuessGame() {
  guessSecret = randomNumber();
  guessAttempts = 5;
  $("#guessInput").value = "";
  $("#guessInput").disabled = false;
  $("#guessButton").disabled = false;
  $("#guessFeedback").textContent = "You have 5 attempts. Good luck!";
}

function makeGuess() {
  const input = $("#guessInput");
  const guess = Number(input.value);

  if (!input.value || !Number.isInteger(guess) || guess < 1 || guess > 20) {
    $("#guessFeedback").textContent = "Enter a whole number from 1 to 20.";
    return;
  }

  guessAttempts--;

  if (guess === guessSecret) {
    $("#guessFeedback").textContent = `🎉 Correct! The number was ${guessSecret}. You did it!`;
    $("#guessInput").disabled = true;
    $("#guessButton").disabled = true;
    addGameXP(25);
    return;
  }

  if (guessAttempts <= 0) {
    $("#guessFeedback").textContent = `Game over! The number was ${guessSecret}. Try again!`;
    $("#guessInput").disabled = true;
    $("#guessButton").disabled = true;
    addGameXP(5);
    return;
  }

  $("#guessFeedback").textContent = `${guess < guessSecret ? "Too low!" : "Too high!"} ${guessAttempts} attempts left.`;
  input.value = "";
  input.focus();
}

/* ---------- REACTION TEST ---------- */

function startReaction() {
  if (reactionState === "waiting" || reactionState === "ready") return;

  reactionState = "waiting";
  const box = $("#reactionBox");
  box.className = "reaction-box waiting";
  box.textContent = "Wait for green...";
  $("#reactionFeedback").textContent = "Don't tap too early!";

  const delay = 1500 + Math.random() * 3500;
  reactionTimer = setTimeout(() => {
    reactionState = "ready";
    reactionStart = performance.now();
    box.className = "reaction-box ready";
    box.textContent = "TAP NOW!";
  }, delay);
}

function reactionClick() {
  const box = $("#reactionBox");

  if (reactionState === "idle") {
    startReaction();
    return;
  }

  if (reactionState === "waiting") {
    clearTimeout(reactionTimer);
    reactionState = "idle";
    box.className = "reaction-box";
    box.textContent = "Too early! Try again";
    $("#reactionFeedback").textContent = "Patience, superstar. Tap to restart.";
    return;
  }

  if (reactionState === "ready") {
    const time = Math.round(performance.now() - reactionStart);
    reactionState = "idle";
    box.className = "reaction-box";
    box.textContent = "Press to play again";
    $("#reactionFeedback").textContent = `Your reaction time: ${time} ms! ${time < 250 ? "Lightning fast!" : time < 400 ? "Not bad!" : "We need coffee."}`;
    addGameXP(time < 300 ? 25 : 15);
  }
}

/* ---------- MEMORY MATCH ---------- */

function createMemoryGame() {
  const symbols = ["🌙", "💜", "🐸", "⭐", "🦋", "🍓", "🪐", "🧸"];
  memoryCards = [...symbols, ...symbols].sort(() => Math.random() - .5).map((symbol, index) => ({
    id: index,
    symbol,
    flipped: false,
    matched: false
  }));
  memoryOpen = [];
  memoryMoves = 0;
  memoryLocked = false;
  renderMemoryGame();
}

function renderMemoryGame() {
  $("#memoryGrid").innerHTML = memoryCards.map(card => `
    <button class="memory-card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}"
      data-memory="${card.id}" aria-label="Memory card">
      ${card.flipped || card.matched ? card.symbol : "❔"}
    </button>
  `).join("");
  $("#memoryFeedback").textContent = `Moves: ${memoryMoves}`;
}

function flipMemoryCard(id) {
  if (memoryLocked) return;
  const card = memoryCards.find(item => item.id === id);
  if (!card || card.flipped || card.matched) return;

  card.flipped = true;
  memoryOpen.push(card);
  renderMemoryGame();

  if (memoryOpen.length === 2) {
    memoryMoves++;
    memoryLocked = true;
    const [first, second] = memoryOpen;

    if (first.symbol === second.symbol) {
      first.matched = true;
      second.matched = true;
      memoryOpen = [];
      memoryLocked = false;
      renderMemoryGame();

      if (memoryCards.every(item => item.matched)) {
        $("#memoryFeedback").textContent = `You matched everything in ${memoryMoves} moves! 🎉`;
        addGameXP(Math.max(15, 45 - memoryMoves));
      }
    } else {
      setTimeout(() => {
        first.flipped = false;
        second.flipped = false;
        memoryOpen = [];
        memoryLocked = false;
        renderMemoryGame();
      }, 750);
    }
  }
}

/* ---------- WOULD YOU RATHER ---------- */

const wouldYouRather = [
  ["Have unlimited snacks 🍟", "Have unlimited vacations 🏝️"],
  ["Read minds for one day 🧠", "Be invisible for one day 👻"],
  ["Never overthink again 🕊️", "Never feel awkward again 😭"],
  ["Live in a magical library 📚", "Live in a cozy cottage 🌷"],
  ["Always be 10 minutes early ⏰", "Always have perfect timing ✨"],
  ["Know every language 🌎", "Play every instrument 🎹"]
];

let wyrIndex = 0;

function nextWYR() {
  wyrIndex = (wyrIndex + 1) % wouldYouRather.length;
  $("#wyrQuestion").textContent = "Choose your fate:";
  $("#wyrA").textContent = wouldYouRather[wyrIndex][0];
  $("#wyrB").textContent = wouldYouRather[wyrIndex][1];
  $("#wyrFeedback").textContent = "There are no correct answers. Only consequences.";
}

function chooseWYR(choice) {
  $("#wyrFeedback").textContent = `You chose: ${choice}. The universe respects your questionable decision.`;
  addGameXP(10);
}

/* ---------- DIARY ---------- */

function saveEntry(event) {
  event.preventDefault();

  const title = $("#entryTitle").value.trim();
  const body = $("#entryBody").value.trim();

  if (!title || !body) {
    showToast("Please add a title and your thoughts first.");
    return;
  }

  const entryData = {
    title,
    body,
    mood: $("#entryMood").value,
    type: $("#entryType").value,
    favorite: $("#entryFavorite").checked
  };

  if (editingEntryId) {
    const entry = state.entries.find(item => item.id === editingEntryId);
    if (entry) Object.assign(entry, entryData);
    showToast("Your entry has been updated. 💜");
  } else {
    state.entries.unshift({
      id: makeId(),
      ...entryData,
      date: new Date().toISOString()
    });
    state.xp += 10;
    state.stars += 2;
    showToast("Memory saved! +10 XP and +2 stars. 📔");
  }

  cancelEdit();
  checkBadges();
  saveState();
  renderArchive();
}

function cancelEdit() {
  editingEntryId = null;
  $("#diaryForm").reset();
  $("#formHeading").textContent = "Dear diary...";
  $("#saveEntry").textContent = "Save entry ✨";
  $("#cancelEdit").classList.add("hidden");
}

function editEntry(id) {
  const entry = state.entries.find(item => item.id === id);
  if (!entry) return;

  editingEntryId = id;
  $("#entryTitle").value = entry.title;
  $("#entryBody").value = entry.body;
  $("#entryMood").value = entry.mood;
  $("#entryType").value = entry.type;
  $("#entryFavorite").checked = !!entry.favorite;
  $("#formHeading").textContent = "Edit your entry";
  $("#saveEntry").textContent = "Update entry";
  $("#cancelEdit").classList.remove("hidden");
  $("#diaryForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteEntry(id) {
  const entry = state.entries.find(item => item.id === id);
  if (!entry) return;

  if (!confirm(`Delete "${entry.title}"? This cannot be undone unless you have a backup.`)) return;

  state.entries = state.entries.filter(item => item.id !== id);
  if (editingEntryId === id) cancelEdit();
  saveState();
  renderArchive();
  showToast("Entry deleted.");
}

function toggleFavorite(id) {
  const entry = state.entries.find(item => item.id === id);
  if (!entry) return;
  entry.favorite = !entry.favorite;
  checkBadges();
  saveState();
  renderArchive();
  showToast(entry.favorite ? "Added to favorites 💜" : "Removed from favorites.");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderArchive() {
  const search = ($("#archiveSearch")?.value || "").toLowerCase().trim();
  const filter = $("#archiveFilter")?.value || "all";

  let entries = [...state.entries];

  if (filter === "favorites") {
    entries = entries.filter(entry => entry.favorite);
  } else if (filter !== "all") {
    entries = entries.filter(entry => entry.type === filter);
  }

  if (search) {
    entries = entries.filter(entry =>
      `${entry.title} ${entry.body} ${entry.mood}`.toLowerCase().includes(search)
    );
  }

  $("#entryCount").textContent = `${state.entries.length} entries`;

  if (!entries.length) {
    $("#archiveList").innerHTML = `<div class="empty-state">${state.entries.length ? "No entries match your search." : "Your archive is waiting for its first memory. 💜"}</div>`;
    return;
  }

  const labels = { journal: "📔 Journal", letter: "💌 Letter", memory: "🫙 Memory Jar" };

  $("#archiveList").innerHTML = entries.map(entry => `
    <article class="archive-entry">
      <div class="archive-meta">
        <span>${escapeHTML(labels[entry.type] || "📔 Entry")}</span>
        <span>${escapeHTML(entry.mood || "")}</span>
        <span>${escapeHTML(formatDate(entry.date))}</span>
        ${entry.favorite ? "<span>💜 Favorite</span>" : ""}
      </div>
      <h4>${escapeHTML(entry.title)}</h4>
      <p>${escapeHTML(entry.body)}</p>
      <div class="archive-actions">
        <button data-edit="${escapeHTML(entry.id)}">✏️ Edit</button>
        <button data-favorite="${escapeHTML(entry.id)}">${entry.favorite ? "💜 Unfavorite" : "♡ Favorite"}</button>
        <button class="delete-entry" data-delete="${escapeHTML(entry.id)}">🗑 Delete</button>
      </div>
    </article>
  `).join("");
}

/* ---------- COLLECTION ---------- */

function renderCollection() {
  $("#collectionBadgeCount").textContent = state.badges.length;
  $("#collectionStarCount").textContent = state.stars;
  $("#collectionDiscoveryCount").textContent = state.discoveries.length;
  $("#collectionTitle").textContent = getPlayerTitle();

  $("#badgeGrid").innerHTML = badges.map(badge => {
    const unlocked = state.badges.includes(badge.id);
    return `
      <article class="badge-card ${unlocked ? "" : "locked"}">
        <span>${unlocked ? badge.icon : "🔒"}</span>
        <b>${escapeHTML(badge.name)}</b>
        <small>${escapeHTML(badge.description)}</small>
        <small>${unlocked ? "UNLOCKED ✓" : "NOT YET UNLOCKED"}</small>
      </article>
    `;
  }).join("");

  $("#discoveryGrid").innerHTML = discoveries.map(item => {
    const unlocked = state.discoveries.includes(item[0]);
    return `
      <article class="discovery-card ${unlocked ? "" : "locked"}">
        <span>${unlocked ? item[1] : "🔒"}</span>
        <b>${escapeHTML(item[2])}</b>
        <small>${unlocked ? "Discovered ✓" : "Undiscovered"}</small>
      </article>
    `;
  }).join("");
}

/* ---------- PROFILE ---------- */

function renderProfile() {
  $("#playerName").value = state.profile.name;
  $("#profileAvatar").textContent = state.profile.avatar;
  $("#profileLevel").textContent = getLevel();
  $("#profileXp").textContent = state.xp;
  $("#profileStars").textContent = state.stars;
  $("#profileGames").textContent = state.gamesPlayed;
  $("#profileEntries").textContent = state.entries.length;
  $("#profileWorlds").textContent = `${state.discoveries.length} / 6`;
  $("#profileTitle").textContent = getPlayerTitle();

  document.querySelectorAll("[data-avatar]").forEach(button => {
    button.classList.toggle("selected", button.dataset.avatar === state.profile.avatar);
  });
}

function saveProfile(event) {
  event.preventDefault();
  const name = $("#playerName").value.trim().slice(0, 24);

  if (!name) {
    showToast("Please choose a nickname.");
    return;
  }

  state.profile.name = name;
  saveState();
  showToast("Profile saved! 💜");
}

/* ---------- SECRET PORTAL ---------- */

function checkSecretPortal() {
  const unlocked = state.discoveries.length >= 3 || state.gamesPlayed >= 3;

  if (!unlocked) {
    $("#secretText").textContent = "The portal is still sleeping. Discover three worlds or play three games to wake it up.";
    showToast("The portal is still locked. Keep exploring! 🔐");
    return;
  }

  if (!state.badges.includes("secret")) {
    state.badges.push("secret");
    state.stars += 10;
    state.xp += 30;
    saveState();
  }

  $("#secretText").textContent = "YOU FOUND THE SECRET DIMENSION! 🌠 The universe has chosen you as its official agent of chaos. Your reward: 30 XP and 10 stars.";
  $("#secretButton").textContent = "Portal discovered ✓";
  $("#secretButton").disabled = true;
  showToast("Secret Finder badge unlocked! +30 XP and +10 stars!");
}

/* ---------- BACKUP AND RESTORE ---------- */

function exportProgress() {
  const backup = {
    app: "Bading Tambayan 4.1",
    exportedAt: new Date().toISOString(),
    data: state
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bading-tambayan-backup-${todayKey()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Your backup is ready. Keep it somewhere safe! 💜");
}

function importProgress(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const imported = parsed.data || parsed;

      if (!imported || !Array.isArray(imported.entries) || !imported.profile) {
        throw new Error("Invalid backup format");
      }

      if (!confirm("Import this backup? Your current saved progress will be replaced.")) {
        event.target.value = "";
        return;
      }

      state = normalizeState(imported);
      saveState();
      renderArchive();
      renderCollection();
      renderProfile();
      showToast("Backup restored successfully! 💜");
    } catch (error) {
      console.error(error);
      showToast("That file doesn't look like a valid Tambayanverse backup.");
    }
    event.target.value = "";
  };

  reader.readAsText(file);
}

function resetProgress() {
  const confirmed = confirm("Are you sure you want to reset ALL your progress, stars, achievements, profile, and diary entries? Export a backup first if you want to keep them.");
  if (!confirmed) return;

  const doubleCheck = confirm("Last chance! This cannot be undone without a backup. Reset everything?");
  if (!doubleCheck) return;

  state = structuredCloneSafe(defaultState);
  localStorage.removeItem(SAVE_KEY);
  cancelEdit();
  saveState();
  renderArchive();
  renderCollection();
  renderProfile();
  $("#secretText").textContent = "Keep exploring. Some things reveal themselves when you least expect them.";
  $("#secretButton").textContent = "Check the portal";
  $("#secretButton").disabled = false;
  showToast("Your Tambayanverse has been reset.");
  showView("home");
}

/* ---------- DASHBOARD REFRESH ---------- */

function updateInterface() {
  const level = getLevel();
  const progress = getLevelProgress();
  const title = getPlayerTitle();

  $("#homeName").textContent = state.profile.name;
  $("#homeAvatar").textContent = state.profile.avatar;
  $("#homeTitle").textContent = title;
  $("#homeLevel").textContent = `LVL ${level}`;
  $("#homeXpBar").style.width = `${progress}%`;
  $("#homeXpText").textContent = `${progress} / 100 XP`;

  $("#statStars").textContent = state.stars;
  $("#statBadges").textContent = state.badges.length;
  $("#statGames").textContent = state.gamesPlayed;
  $("#statEntries").textContent = state.entries.length;

  $("#todayLabel").textContent = new Date().toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  renderMission();
}

function initialize() {
  // Migrate older 4.0 diary fields if present.
  if (!Array.isArray(state.entries)) state.entries = [];
  if (!Array.isArray(state.discoveries)) state.discoveries = [];
  if (!Array.isArray(state.badges)) state.badges = [];

  checkBadges();
  updateInterface();
  renderArchive();
  renderCollection();
  renderProfile();
  createMemoryGame();

  $("#dailyMessage").textContent = state.lastDailyMessage || randomItem(dailyMessages);
  if (!state.lastDailyMessage) {
    state.lastDailyMessage = $("#dailyMessage").textContent;
    saveState();
  }
}

/* ---------- EVENT LISTENERS ---------- */

document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    showView(viewButton.dataset.view);
    return;
  }

  const worldButton = event.target.closest("[data-world]");
  if (worldButton) {
    enterWorld(worldButton.dataset.world);
    return;
  }

  const activityButton = event.target.closest("[data-action]");
  if (activityButton) {
    runActivity(activityButton.dataset.action);
    return;
  }

  const editButton = event.target.closest("[data-edit]");
  if (editButton) {
    editEntry(editButton.dataset.edit);
    return;
  }

  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) {
    deleteEntry(deleteButton.dataset.delete);
    return;
  }

  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.favorite);
    return;
  }

  const avatarButton = event.target.closest("[data-avatar]");
  if (avatarButton) {
    state.profile.avatar = avatarButton.dataset.avatar;
    renderProfile();
    $("#profileAvatar").textContent = state.profile.avatar;
  }

  const memoryButton = event.target.closest("[data-memory]");
  if (memoryButton) {
    flipMemoryCard(Number(memoryButton.dataset.memory));
  }
});

$("#menuToggle").addEventListener("click", () => {
  $("#mainNav").classList.toggle("open");
});

$("#completeMission").addEventListener("click", completeMission);
$("#newMessage").addEventListener("click", newDailyMessage);
$("#secretButton").addEventListener("click", checkSecretPortal);

$("#diaryForm").addEventListener("submit", saveEntry);
$("#cancelEdit").addEventListener("click", cancelEdit);
$("#archiveSearch").addEventListener("input", renderArchive);
$("#archiveFilter").addEventListener("change", renderArchive);

$("#profileForm").addEventListener("submit", saveProfile);

$("#guessButton").addEventListener("click", makeGuess);
$("#guessInput").addEventListener("keydown", event => {
  if (event.key === "Enter") makeGuess();
});
$("#resetGuess").addEventListener("click", resetGuessGame);

$("#reactionBox").addEventListener("click", reactionClick);
$("#restartMemory").addEventListener("click", createMemoryGame);

$("#nextWyr").addEventListener("click", nextWYR);
$("#wyrA").addEventListener("click", () => chooseWYR($("#wyrA").textContent));
$("#wyrB").addEventListener("click", () => chooseWYR($("#wyrB").textContent));

$("#exportButton").addEventListener("click", exportProgress);
$("#importFile").addEventListener("change", importProgress);
$("#resetButton").addEventListener("click", resetProgress);

/* ---------- START ---------- */

initialize();
