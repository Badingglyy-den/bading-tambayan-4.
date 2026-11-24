
const STORAGE_KEY = "badingTambayan4";

const defaultData = {
  stars: 0,
  worlds: [],
  achievements: [],
  discoveries: [],
  visited: false
};

let data = loadData();

const worlds = {
  arcade: {
    emoji: "🎮",
    number: "WORLD 01",
    title: "The Chaos Arcade",
    description: "Games, chaos, and questionable decisions."
  },
  comfort: {
    emoji: "🫂",
    number: "WORLD 02",
    title: "The Comfort Corner",
    description: "A little warmth for your tired heart."
  },
  lab: {
    emoji: "🧪",
    number: "WORLD 03",
    title: "The Experiment Lab",
    description: "Curiosity, potions, and delulu science."
  },
  mystery: {
    emoji: "🔮",
    number: "WORLD 04",
    title: "The Mystery Library",
    description: "Secrets are waiting to be discovered."
  },
  confession: {
    emoji: "📔",
    number: "WORLD 05",
    title: "The Confession Room",
    description: "Some thoughts need somewhere to go."
  },
  community: {
    emoji: "🌟",
    number: "WORLD 06",
    title: "The Community Board",
    description: "Little challenges and good energy."
  }
};

const achievements = [
  {
    id: "first-steps",
    emoji: "🌱",
    name: "First Steps",
    description: "Visit your first world.",
    condition: () => data.worlds.length >= 1
  },
  {
    id: "world-explorer",
    emoji: "🗺️",
    name: "World Explorer",
    description: "Explore all six worlds.",
    condition: () => data.worlds.length >= 6
  },
  {
    id: "star-collector",
    emoji: "✨",
    name: "Star Collector",
    description: "Collect 10 stars.",
    condition: () => data.stars >= 10
  },
  {
    id: "little-legend",
    emoji: "👑",
    name: "Little Legend",
    description: "Collect 25 stars.",
    condition: () => data.stars >= 25
  }
];

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...defaultData, ...JSON.parse(saved) }
      : { ...defaultData };
  } catch (error) {
    console.warn("Could not load saved progress.", error);
    return { ...defaultData };
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Could not save progress.", error);
  }
}

function createStars() {
  const layer = document.getElementById("starLayer");

  for (let i = 0; i < 65; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = Math.random() > 0.5 ? "✦" : "·";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.fontSize = (Math.random() * 12 + 5) + "px";
    star.style.animationDelay = Math.random() * 4 + "s";
    layer.appendChild(star);
  }
}

function enterTambayan() {
  data.visited = true;
  saveData();

  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  showDashboard();
}

function hidePages() {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });
}

function showDashboard() {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  hidePages();
  document.getElementById("dashboard").classList.add("active");

  closeMenu();
  updateDashboard();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openWorld(id) {
  const world = worlds[id];

  if (!world) return;

  const firstVisit = !data.worlds.includes(id);

  if (firstVisit) {
    data.worlds.push(id);
    data.stars += 2;
    data.discoveries.push(id);
    saveData();
    checkAchievements();
  }

  document.getElementById("worldEmoji").textContent = world.emoji;
  document.getElementById("worldNumber").textContent = world.number;
  document.getElementById("worldTitle").textContent = world.title;
  document.getElementById("worldDescription").textContent = world.description;

  hidePages();
  document.getElementById("worldPage").classList.add("active");

  closeMenu();
  updateDashboard();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCollection() {
  hidePages();
  document.getElementById("collectionPage").classList.add("active");

  closeMenu();
  updateCollection();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showSettings() {
  hidePages();
  document.getElementById("settingsPage").classList.add("active");

  closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateDashboard() {
  document.getElementById("starCount").textContent = data.stars;
  document.getElementById("achievementCount").textContent =
    data.achievements.length;
  document.getElementById("discoveryCount").textContent =
    data.discoveries.length;
}

function updateCollection() {
  document.getElementById("collectionStars").textContent = data.stars;

  const progress = Math.min((data.stars / 100) * 100, 100);

  document.getElementById("starProgress").style.width = progress + "%";

  document.getElementById("collectionMessage").textContent =
    data.stars >= 100
      ? "Tambayan Legend! You've collected 100 stars!"
      : `${100 - data.stars} more stars until your 100-star milestone!`;

  document.getElementById("discoverySummary").textContent =
    `${data.worlds.length} of 6 worlds explored.`;

  const list = document.getElementById("achievementList");
  list.innerHTML = "";

  achievements.forEach(item => {
    const unlocked = data.achievements.includes(item.id);

    const card = document.createElement("div");
    card.className = "achievement-card" +
      (unlocked ? "" : " locked");

    const emoji = document.createElement("span");
    emoji.textContent = unlocked ? item.emoji : "🔒";

    const info = document.createElement("div");
    const name = document.createElement("strong");
    const description = document.createElement("small");

    name.textContent = item.name;
    description.textContent = item.description;

    info.append(name, description);
    card.append(emoji, info);
    list.appendChild(card);
  });
}

function checkAchievements() {
  achievements.forEach(item => {
    if (
      item.condition() &&
      !data.achievements.includes(item.id)
    ) {
      data.achievements.push(item.id);
      showAchievement(item);
    }
  });

  saveData();
}

function showAchievement(item) {
  alert(
    "🏆 ACHIEVEMENT UNLOCKED!\n\n" +
    item.emoji + " " + item.name +
    "\n" + item.description
  );
}

function exportProgress() {
  const backup = {
    app: "Bading Tambayan 4.0",
    exportedAt: new Date().toISOString(),
    data: data
  };

  const file = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "bading-tambayan-backup.json";
  link.click();

  URL.revokeObjectURL(url);
}

function resetProgress() {
  const confirmed = confirm(
    "Sis, sure ka ba?\n\nThis will reset your stars, discoveries, and achievements."
  );

  if (!confirmed) return;

  data = { ...defaultData };
  saveData();

  updateDashboard();
  updateCollection();

  alert("Your progress has been reset. Fresh start, sis! 💜");

  showDashboard();
}

function closeMenu() {
  document.getElementById("mainNav").classList.remove("open");
}

document.getElementById("menuButton").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

createStars();
updateDashboard();

