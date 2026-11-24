
const STORAGE_KEY = "tambayanverse_4_progress";

const defaultState = {
  stars: 0,
  achievements: [],
  discoveries: [],
  visited: [],
  completed: [],
  journal: "",
  letter: "",
  mood: "",
  reducedMotion: false
};

let state = loadState();
let currentWorld = "";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...defaultState, ...saved } : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateStats();
}

const worlds = [
  {
    id: "arcade", icon: "🎮", name: "The Chaos Arcade",
    description: "Dito walang boring. Play games, make questionable decisions, and embrace your inner chaos.",
    color: "arcade",
    activities: [
      ["🔮", "Manghuhula ng Kapalaran", "Your future is looking suspiciously dramatic."],
      ["⚖️", "Bading Court", "Let the court decide your very unserious case."],
      ["🎰", "Sampal o Lambing Machine", "Will you receive lambing or emotional damage?"],
      ["🐸", "Palakang Marites", "The frog knows something. Don't ask how."],
      ["🌌", "Ask the Universe", "Ask a question. Receive questionable wisdom."],
      ["💜", "Random Compliment Generator", "You deserve a little appreciation."],
      ["🤡", "Delulu Meter", "Let's measure the level of delusion today."],
      ["😭", "Excuse Generator", "For those moments when words fail you."],
      ["🎭", "Drama Queen Button", "Because sometimes the drama is necessary."],
      ["📋", "Emotional Damage Report", "A highly unofficial assessment."],
      ["💅", "Compliment or Roast", "A surprise is waiting. Choose wisely."],
      ["🚫", "The Forbidden Button", "You were told not to press it."]
    ]
  },
  {
    id: "comfort", icon: "🫂", name: "The Comfort Corner",
    description: "A soft landing place for heavy days. Huminga ka muna. You don't have to figure everything out today.",
    activities: [
      ["🫂", "Virtual Yakap Booth", "A warm virtual hug, just for you."],
      ["💌", "Letters From Your Future Self", "A little message from the you who made it through."],
      ["💜", "Things You Need to Hear", "Sometimes we need a reminder."],
      ["🎧", "Comfort Corner Radio", "A little reminder to slow down."],
      ["🌷", "It's Okay Today", "You are allowed to have an imperfect day."],
      ["🍃", "Let It Go Ritual", "Name something you are ready to release."]
    ]
  },
  {
    id: "lab", icon: "🧪", name: "The Experiment Lab",
    description: "Unscientific experiments. Questionable results. Surprisingly accurate feelings.",
    activities: [
      ["🧪", "Emotional Potion Shop", "Mix a potion for the mood you're in."],
      ["🌀", "Overthink Simulator", "A playful look at your overthinking habits."],
      ["🧠", "Personality Lab", "Discover your current tambayan personality."],
      ["🤡", "Delulu Assessment", "The laboratory needs to know."],
      ["🌈", "Mood Alchemy", "Turn a feeling into a little something else."]
    ]
  },
  {
    id: "library", icon: "🔮", name: "The Mystery Library",
    description: "Secret doors, hidden messages, rare surprises, and things waiting to be discovered.",
    activities: [
      ["📚", "The Forgotten Shelf", "A little reminder is hidden here."],
      ["🗝️", "The Secret Key", "Some doors only open when you look closer."],
      ["🌙", "Midnight Message", "A message from the universe."],
      ["✨", "Hidden Star", "Look for a little sparkle."]
    ]
  },
  {
    id: "confession", icon: "📔", name: "The Confession Room",
    description: "Your private corner. Write your thoughts, save memories, and let your feelings breathe.",
    activities: [
      ["📔", "Marites Diary", "Your thoughts are welcome here."],
      ["💌", "Unsent Letters", "Some words are meant to be written, not sent."],
      ["🫙", "Memory Jar", "Collect the little moments worth keeping."],
      ["🍃", "Let It Go Ritual", "You can put something down without forgetting it."]
    ]
  },
  {
    id: "community", icon: "🌟", name: "The Community Board",
    description: "A cheerful little corner for daily questions, challenges, and positive reminders.",
    activities: [
      ["❓", "Question of the Day", "A little question to think about."],
      ["🎯", "Weekly Challenge", "Try something small and kind."],
      ["💬", "Community Prompt", "A prompt to spark a thought."],
      ["🏅", "Visitor Awards", "Celebrate your own little wins."],
      ["💜", "Wall of Positivity", "Leave yourself a kind reminder."]
    ]
  }
];

const achievements = [
  ["first", "🌱", "First Steps", "You entered the Tambayanverse."],
  ["explorer", "🧭", "Little Explorer", "You visited three different worlds."],
  ["arcade", "🎮", "Certified Chaos", "You played a Chaos Arcade game."],
  ["comfort", "🫂", "Heart of Gold", "You visited the Comfort Corner."],
  ["lab", "🧪", "Mad Scientist", "You explored the Experiment Lab."],
  ["library", "🔮", "Keeper of Secrets", "You entered the Mystery Library."],
  ["confession", "📔", "Dear Diary", "You saved a private journal entry."],
  ["community", "🌟", "Good Vibes Only", "You visited the Community Board."],
  ["five", "✨", "Stardust Collector", "You collected five stars."],
  ["ten", "💫", "Tambayan Legend", "You collected ten stars."],
  ["secret", "🗝️", "Secret Finder", "You discovered a hidden surprise."]
];

const dailyMessages = [
  ["You are doing better than you think.", "Hindi mo kailangang ma-achieve lahat today. Showing up is already something."],
  ["Rest is productive, too.", "You are not a machine. You deserve a break without feeling guilty."],
  ["One step at a time.", "Hindi kailangang sabay-sabay ayusin ang lahat. Dahan-dahan lang."],
  ["You deserve good things.", "Even on the days when you don't feel your best. Especially then."],
  ["Look how far you've come.", "Give yourself a little credit. You've survived every difficult day so far."]
];

const random = arr => arr[Math.floor(Math.random() * arr.length)];
const $ = selector => document.querySelector(selector);

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
}

function awardStars(amount, reason) {
  state.stars += amount;
  saveState();
  toast(`+${amount} ⭐ ${reason}`);
  checkAchievements();
}

function unlockAchievement(id) {
  if (state.achievements.includes(id)) return;
  state.achievements.push(id);
  saveState();
  const item = achievements.find(a => a[0] === id);
  if (item) toast(`${item[1]} Achievement unlocked: ${item[2]}!`);
}

function discover(id, name) {
  if (state.discoveries.includes(id)) return;
  state.discoveries.push(id);
  awardStars(3, "A new discovery!");
  unlockAchievement("secret");
  toast(`🗝️ Discovered: ${name}!`);
  renderCollection();
}

function checkAchievements() {
  if (!state.achievements.includes("first")) unlockAchievement("first");
  if (state.visited.length >= 3) unlockAchievement("explorer");
  if (state.stars >= 5) unlockAchievement("five");
  if (state.stars >= 10) unlockAchievement("ten");
}

function updateStats() {
  ["starCount", "collectionStars"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = state.stars;
  });
  ["achievementCount", "collectionAchievements"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = state.achievements.length;
  });
  ["discoveryCount", "collectionDiscoveries"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = state.discoveries.length;
  });

  const recent = $("#recentAchievements");
  if (recent) {
    if (!state.achievements.length) {
      recent.textContent = "Your adventures will appear here. ✨";
    } else {
      recent.innerHTML = state.achievements.slice(-4).reverse().map(id => {
        const a = achievements.find(item => item[0] === id);
        return a ? `${a[1]} <strong>${a[2]}</strong> — ${a[3]}` : "";
      }).join("<br>");
    }
  }
}

function renderWorlds() {
  $("#worldGrid").innerHTML = worlds.map(world => `
    <article class="world-card">
      <div class="world-glow"></div>
      <span class="world-icon">${world.icon}</span>
      <h3>${world.name}</h3>
      <p>${world.description}</p>
      <button data-world="${world.id}">ENTER WORLD →</button>
    </article>
  `).join("");
}

function showView(name) {
  document.querySelectorAll(".view").forEach(view => view.classList.add("hidden"));
  const target = document.getElementById(name + "View");
  if (target) target.classList.remove("hidden");
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === name);
  });
  $("#mainNav").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "collection") renderCollection();
  if (name === "journal") loadJournal();
  if (name === "settings") $("#motionToggle").checked = state.reducedMotion;
}

function enterWorld(id) {
  const world = worlds.find(item => item.id === id);
  if (!world) return;
  currentWorld = id;

  if (!state.visited.includes(id)) {
    state.visited.push(id);
    awardStars(2, "First visit bonus!");
  }

  if (id === "arcade") unlockAchievement("arcade");
  if (id === "comfort") unlockAchievement("comfort");
  if (id === "lab") unlockAchievement("lab");
  if (id === "library") unlockAchievement("library");
  if (id === "community") unlockAchievement("community");

  $("#worldContent").innerHTML = `
    <section class="world-hero panel">
      <span class="big-icon">${world.icon}</span>
      <p class="eyebrow">WELCOME TO YOUR NEW DESTINATION</p>
      <h1>${world.name}</h1>
      <p>${world.description}</p>
    </section>
    <div class="activity-grid">
      ${world.activities.map((activity, index) => `
        <article class="activity-card">
          <h3>${activity[0]} ${activity[1]}</h3>
          <p>${activity[2]}</p>
          <button class="secondary-btn" data-activity="${index}">LET'S GO ✦</button>
          <div class="activity-result" id="result-${index}"></div>
        </article>
      `).join("")}
    </div>
    ${id === "confession" ? `<p class="muted small">Want to write privately? Open the Journal from the top navigation.</p>` : ""}
    ${id === "library" ? `<div class="panel collection-panel"><h2>🗝️ A little secret...</h2><p class="muted">Tap the button if you're curious. Some things are worth finding.</p><button class="primary-btn" data-action="secret">OPEN THE HIDDEN DOOR</button></div>` : ""}
  `;
  showView("world");
}

const gameResponses = {
  "Manghuhula ng Kapalaran": [
    "May darating na good news. Pero baka parcel lang. 📦",
    "Your future is bright. Mag-charge ka lang muna. 🔋",
    "Someone is thinking about you. Baka delivery rider. 😭",
    "A plot twist is coming. Please read the terms and conditions.",
    "You will make a good decision today. Hopefully."
  ],
  "Bading Court": [
    "GUILTY! Ang sentence: one week of self-love. ⚖️",
    "NOT GUILTY! Kulang ang ebidensya. Next case!",
    "The court finds you too pretty to be stressed. 💅",
    "Case dismissed. Magpahinga ka muna, Your Honor."
  ],
  "Sampal o Lambing Machine": [
    "LAMBING! Sending you a virtual hug. 🫂",
    "SAMPAL! Wake up, bestie. You deserve better. 😭",
    "DOUBLE LAMBING! You are loved. 💜",
    "Unexpected plot twist: self-love ang prize mo."
  ],
  "Palakang Marites": [
    "Sabi ng palaka: may chismis pero wala pang resibo. 🐸",
    "Ribbit! Protect your peace. Hindi lahat kailangan mong malaman.",
    "May nag-view ng story mo. The frog refuses to elaborate.",
    "The frog says: drink water and mind your business."
  ],
  "Ask the Universe": [
    "The universe says: give it time.",
    "Maybe the answer is not yet. And that's okay.",
    "Trust the process, but please use common sense.",
    "Something good can still happen. Stay open."
  ],
  "Random Compliment Generator": [
    "You make ordinary days feel a little brighter. 💜",
    "Your existence is not a burden. Never forget that.",
    "You have made it through so much. Look at you!",
    "You deserve the same kindness you give others.",
    "You are allowed to take up space."
  ],
  "Delulu Meter": [
    "20% delulu. Still within acceptable limits.",
    "50% delulu. Bestie, let's return to reality slowly.",
    "87% delulu. The committee is concerned. 🤡",
    "100% DELULU. We admire your commitment."
  ],
  "Excuse Generator": [
    "Sorry, my brain is currently updating. Please try again later.",
    "I would love to, but my social battery filed for resignation.",
    "Emergency meeting with my pillow. Cannot attend.",
    "I am emotionally unavailable due to scheduled maintenance."
  ],
  "Drama Queen Button": [
    "PAUSE THE WORLD. I NEED A MOMENT. 🎭",
    "This is not a drill. I repeat, this is NOT a drill.",
    "Cue dramatic music. Somebody bring the spotlight.",
    "I have suffered enough. Where is my award?"
  ],
  "Emotional Damage Report": [
    "Status: slightly damaged, still fabulous.",
    "Report: feelings detected. Recommend rest and snacks.",
    "Emotional battery: low. Please recharge with kindness.",
    "Damage: manageable. Main character resilience: high."
  ],
  "Compliment or Roast": [
    "COMPLIMENT: Your vibe is immaculate. ✨",
    "ROAST: Your overthinking deserves its own Netflix series.",
    "COMPLIMENT: You are a whole experience.",
    "ROAST: You say 'last na' then do it five more times."
  ],
  "The Forbidden Button": [
    "You pressed it. The universe noticed. 😭",
    "Achievement unlocked: walang self-control.",
    "The button has filed a complaint against you.",
    "Nothing happened. Or did it?"
  ]
};

function activityResult(world, activity) {
  const responses = {
    "comfort": {
      "Virtual Yakap Booth": ["Sending the warmest virtual hug. 🫂", "Hinga muna. You don't have to be strong every second.", "Imagine a soft blanket and a safe place. You deserve that."],
      "Letters From Your Future Self": ["Dear me, thank you for not giving up. Look how far we've come. 💌", "Future you is proud that you kept going, even when it was hard."],
      "Things You Need to Hear": ["You are not behind in life. Your timeline is your own.", "You don't have to earn rest. You deserve it already.", "You are allowed to change your mind and start again."],
      "Comfort Corner Radio": ["Today's broadcast: you are doing enough. Take a breath. 🎧", "A gentle reminder: not every day has to be productive."],
      "It's Okay Today": ["It's okay to feel tired. It's okay to pause. It's okay to be human. 💜"],
      "Let It Go Ritual": ["Write down what you want to release in your journal. You can begin again whenever you're ready. 🍃"]
    },
    "lab": {
      "Emotional Potion Shop": ["Potion of Calm: 2 drops of patience, 1 cup of rest, and a generous amount of self-kindness. 🧪", "Potion of Courage: a little hope, a little bravery, and one tiny next step."],
      "Overthink Simulator": ["Your brain opened 47 tabs. Time to close 46 and breathe. 🌀", "Not every thought needs an investigation. Some thoughts can simply pass."],
      "Personality Lab": ["Today you're a Soft-Hearted Chaos Fairy. Rare. Powerful. Slightly sleepy. ✨", "Your current type: Professional Survivor with a hint of Main Character."],
      "Delulu Assessment": ["Assessment complete: hopeful, imaginative, and occasionally in need of a reality check. 🤡"],
      "Mood Alchemy": ["Your mood is now: Lavender Thunderstorm. A little heavy, but still beautiful. 🌈"]
    },
    "library": {
      "The Forgotten Shelf": ["A note from the shelf: You are allowed to outgrow places you once wanted to stay."],
      "The Secret Key": ["The key reminds you: not every closed door is a rejection."],
      "Midnight Message": ["Even the longest night eventually makes room for morning. 🌙"],
      "Hidden Star": ["A little star for you. Keep looking for small reasons to smile."]
    },
    "confession": {
      "Marites Diary": ["Your diary is waiting in the Journal section. This space is yours. 📔"],
      "Unsent Letters": ["You don't have to send every feeling to give it a place to exist. 💌"],
      "Memory Jar": ["Think of one small moment you want to keep. Write it down in your journal. 🫙"],
      "Let It Go Ritual": ["You can release the weight without pretending it never mattered. 🍃"]
    },
    "community": {
      "Question of the Day": ["What is one small thing that made you smile recently? 💬"],
      "Weekly Challenge": ["Challenge: do one kind thing for yourself this week. Small counts! 🎯"],
      "Community Prompt": ["Complete this sentence: 'I am proud of myself because...'"],
      "Visitor Awards": ["Today's award goes to YOU: Most Likely to Keep Trying Even When Things Get Hard. 🏅"],
      "Wall of Positivity": ["Leave yourself this reminder: I deserve kindness, including from myself. 💜"]
    }
  };

  if (world === "arcade") {
    const list = gameResponses[activity];
    return list ? random(list) : "Surprise! ✨";
  }
  const list = responses[world]?.[activity];
  return list ? random(list) : "A little surprise for you. ✨";
}

function playActivity(index) {
  const world = worlds.find(item => item.id === currentWorld);
  if (!world || !world.activities[index]) return;
  const activity = world.activities[index];
  const name = activity[1];
  const output = document.getElementById(`result-${index}`);
  if (!output) return;

  output.textContent = activityResult(currentWorld, name);

  const key = `${currentWorld}-${index}`;
  if (!state.completed.includes(key)) {
    state.completed.push(key);
    awardStars(1, "Activity completed!");
  } else {
    toast("You've already collected the star for this activity. ✨");
  }

  if (currentWorld === "comfort") unlockAchievement("comfort");
  if (currentWorld === "lab") unlockAchievement("lab");
  if (currentWorld === "arcade") unlockAchievement("arcade");
}

function renderCollection() {
  updateStats();
  $("#achievementList").innerHTML = achievements.map(a => {
    const unlocked = state.achievements.includes(a[0]);
    return `<div class="achievement ${unlocked ? "unlocked" : ""}">
      <span>${unlocked ? a[1] : "🔒"}</span>
      <strong>${a[2]}</strong>
      <small>${unlocked ? a[3] : "Not unlocked yet. Keep exploring!"}</small>
    </div>`;
  }).join("");

  const discoveryItems = [
    ["secret-door", "The Hidden Door"],
    ["moon-message", "Midnight Message"],
    ["forgotten-shelf", "The Forgotten Shelf"],
    ["star-surprise", "A Rare Star"],
    ["universe-note", "A Note From the Universe"]
  ];
  $("#discoveryList").innerHTML = discoveryItems.map(item => {
    const found = state.discoveries.includes(item[0]);
    return `<div class="discovery-item ${found ? "found" : ""}">${found ? "✨" : "🔒"} ${found ? item[1] : "Undiscovered surprise"}</div>`;
  }).join("");
}

function loadJournal() {
  $("#journalText").value = state.journal || "";
  $("#letterText").value = state.letter || "";
}

function saveJournal() {
  state.journal = $("#journalText").value;
  saveState();
  if (state.journal.trim()) {
    unlockAchievement("confession");
    awardStars(1, "Thought saved!");
  }
  $("#journalStatus").textContent = "Saved privately on this device. 💜";
}

function saveLetter() {
  state.letter = $("#letterText").value;
  saveState();
  $("#letterStatus").textContent = "Your unsent letter has been saved privately. 💌";
  toast("Letter saved.");
}

function chooseDaily() {
  const message = random(dailyMessages);
  $("#dailyTitle").textContent = message[0];
  $("#dailyText").textContent = message[1];
  awardStars(1, "Daily reminder collected!");
}

function revealSecret() {
  const secrets = [
    ["secret-door", "The Hidden Door"],
    ["moon-message", "Midnight Message"],
    ["forgotten-shelf", "The Forgotten Shelf"],
    ["star-surprise", "A Rare Star"],
    ["universe-note", "A Note From the Universe"]
  ];
  const undiscovered = secrets.filter(item => !state.discoveries.includes(item[0]));
  if (!undiscovered.length) {
    toast("You've found every secret! Keeper of the Tambayanverse. 🌟");
    return;
  }
  const item = random(undiscovered);
  discover(item[0], item[1]);
  const box = document.createElement("div");
  box.className = "game-output";
  box.textContent = `✨ ${item[1]}: You found something special. You deserve good things, even on ordinary days. 💜`;
  $("#worldContent").appendChild(box);
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tambayanverse-progress.json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Your progress file is ready!");
}

function resetEverything() {
  if (!confirm("Are you sure? This will erase all saved progress, journal entries, and letters on this device.")) return;
  state = { ...defaultState };
  saveState();
  loadJournal();
  renderCollection();
  toast("A fresh beginning. Welcome back! 💜");
  showView("home");
}

document.addEventListener("click", event => {
  const worldButton = event.target.closest("[data-world]");
  if (worldButton) {
    enterWorld(worldButton.dataset.world);
    return;
  }

  const activityButton = event.target.closest("[data-activity]");
  if (activityButton) {
    playActivity(Number(activityButton.dataset.activity));
    return;
  }

  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    showView(viewButton.dataset.view);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  switch (actionButton.dataset.action) {
    case "home": showView("home"); break;
    case "enter":
      document.querySelector(".section-block").scrollIntoView({ behavior: "smooth" });
      toast("Choose your portal, bestie! ✨");
      break;
    case "daily": chooseDaily(); break;
    case "secret": revealSecret(); break;
    case "saveJournal": saveJournal(); break;
    case "clearJournal":
      if (confirm("Clear this journal entry?")) {
        $("#journalText").value = "";
        state.journal = "";
        saveState();
        $("#journalStatus").textContent = "Entry cleared.";
      }
      break;
    case "saveLetter": saveLetter(); break;
    case "export": exportProgress(); break;
    case "reset": resetEverything(); break;
  }
});

$("#moodSelect").addEventListener("change", event => {
  const mood = event.target.value;
  state.mood = mood;
  saveState();
  const messages = {
    "Happy ✨": "Keep that sparkle, bestie. Share it with yourself, too. 💜",
    "Okay lang 🙂": "Okay is a perfectly valid place to be.",
    "Pagod na 😮‍💨": "Rest muna. You don't need to earn your rest.",
    "Overthinking 🌀": "One thought at a time. You are safe to pause.",
    "Delulu 🤡": "A little imagination never hurt. Stay grounded, though. 😭",
    "Sad but trying 💜": "Trying is enough for today. Sending you a hug.",
    "Chaotic 😭": "Welcome home. Your people are here."
  };
  $("#moodMessage").textContent = messages[mood] || "Your mood, your pace. No pressure.";
});

$("#menuToggle").addEventListener("click", () => {
  $("#mainNav").classList.toggle("open");
});

$("#motionToggle").addEventListener("change", event => {
  state.reducedMotion = event.target.checked;
  document.body.classList.toggle("reduce-motion", state.reducedMotion);
  saveState();
});

function initialize() {
  renderWorlds();
  updateStats();
  if (state.mood) {
    $("#moodSelect").value = state.mood;
    $("#moodSelect").dispatchEvent(new Event("change"));
  }
  document.body.classList.toggle("reduce-motion", state.reducedMotion);
  const daily = random(dailyMessages);
  $("#dailyTitle").textContent = daily[0];
  $("#dailyText").textContent = daily[1];
}

initialize();
