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
  completedCollections: [],
  equippedItems: {},
  hangoutPosts: [],
  kindPosts: [],
  labWorkshop: { creatures: [] },
  npcWorkshop: { priorities: [], habits: [], notes: [], goals: [], organizer: [], quizScore: 0, completedChallenges: [] },
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
    completedCollections: Array.isArray(x.completedCollections) ? x.completedCollections : [],
    equippedItems: x.equippedItems && typeof x.equippedItems === "object" && !Array.isArray(x.equippedItems) ? x.equippedItems : {},
    hangoutPosts: Array.isArray(x.hangoutPosts) ? x.hangoutPosts : [],
    kindPosts: Array.isArray(x.kindPosts) ? x.kindPosts : [],
    labWorkshop: x.labWorkshop && typeof x.labWorkshop === "object" && !Array.isArray(x.labWorkshop)
      ? { creatures: Array.isArray(x.labWorkshop.creatures) ? x.labWorkshop.creatures.slice(0, 24) : [] }
      : { creatures: [] },
    npcWorkshop: x.npcWorkshop && typeof x.npcWorkshop === "object" && !Array.isArray(x.npcWorkshop)
      ? {
          priorities: Array.isArray(x.npcWorkshop.priorities) ? x.npcWorkshop.priorities.slice(0, 3) : [],
          habits: Array.isArray(x.npcWorkshop.habits) ? x.npcWorkshop.habits.slice(0, 30) : [],
          notes: Array.isArray(x.npcWorkshop.notes) ? x.npcWorkshop.notes.slice(0, 50) : [],
          goals: Array.isArray(x.npcWorkshop.goals) ? x.npcWorkshop.goals.slice(0, 30) : [],
          organizer: Array.isArray(x.npcWorkshop.organizer) ? x.npcWorkshop.organizer.slice(0, 50) : [],
          quizScore: Math.max(0, Number(x.npcWorkshop.quizScore) || 0),
          completedChallenges: Array.isArray(x.npcWorkshop.completedChallenges) ? x.npcWorkshop.completedChallenges.slice(0, 100) : []
        }
      : { priorities: [], habits: [], notes: [], goals: [], organizer: [], quizScore: 0, completedChallenges: [] }
  };
}

let activeStorageKey = KEY;
let localSaveExists = Boolean(localStorage.getItem(KEY));
const ACCOUNT_OWNER_KEY = "tambayanverse_42_account_owner";

function save() {
  state.version = 42;
  localStorage.setItem(activeStorageKey, JSON.stringify(state));
  localSaveExists = true;
  render();

  window.dispatchEvent(new CustomEvent("tambayan:progress-saved", {
    detail: { progress: JSON.parse(JSON.stringify(state)) }
  }));
}
function mergeProgress(local, cloud) {
  // Combine arrays without duplicating identical entries.
  if (Array.isArray(local) || Array.isArray(cloud)) {
    const combined = [
      ...(Array.isArray(local) ? local : []),
      ...(Array.isArray(cloud) ? cloud : [])
    ];
    const seen = new Set();

    return combined.filter(item => {
      const key = JSON.stringify(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Merge objects recursively.
  if (
    local && cloud &&
    typeof local === "object" &&
    typeof cloud === "object"
  ) {
    const merged = { ...local, ...cloud };
    const keys = new Set([
      ...Object.keys(local),
      ...Object.keys(cloud)
    ]);

    for (const key of keys) {
      if (!(key in local) || !(key in cloud)) continue;

      if (
        key === "profile" &&
        local[key] && cloud[key] &&
        typeof local[key] === "object" &&
        typeof cloud[key] === "object"
      ) {
        merged[key] = { ...local[key], ...cloud[key] };
      } else {
        merged[key] = mergeProgress(local[key], cloud[key]);
      }
    }

    return merged;
  }

  // Keep the highest numeric progress.
  if (typeof local === "number" && typeof cloud === "number") {
    return Math.max(local, cloud);
  }

  // Preserve useful local values if cloud data is empty.
  if (local !== undefined && local !== null && local !== "") {
    return local;
  }

  return cloud !== undefined ? cloud : local;
        }

// Account-aware progress bridge used by multiplayer.js.
// Each authenticated account gets a separate localStorage save.
window.tambayanProgress = {
  useAccount(userId) {
    if (!userId || typeof userId !== "string") {
      throw new Error("A valid account ID is required to load progress.");
    }

    const accountKey = KEY + "_user_" + encodeURIComponent(userId);
    const accountSave = safeParse(localStorage.getItem(accountKey));

    activeStorageKey = accountKey;

    if (accountSave && typeof accountSave === "object") {
      state = normalize(accountSave?.data || accountSave);
      localSaveExists = true;
    } else {
      // Never assign an old shared/device save to a newly seen account.
      // Existing accounts restore their own account-specific or cloud save.
      state = defaultState();
      localSaveExists = false;
    }

    render();
    return JSON.parse(JSON.stringify(state));
  },

  hasLocalSave() {
    return localSaveExists && Boolean(localStorage.getItem(activeStorageKey));
  },

  getState() {
    return JSON.parse(JSON.stringify(state));
  },

  getDailyDispatch() {
    return JSON.parse(JSON.stringify(state.dailyDispatch || {}));
  },

  getLabWorkshop() {
    return JSON.parse(JSON.stringify(state.labWorkshop || { creatures: [] }));
  },

  getNPCWorkshop() {
    return JSON.parse(JSON.stringify(state.npcWorkshop || { priorities: [], habits: [], notes: [], goals: [], organizer: [], quizScore: 0, completedChallenges: [] }));
  },

  setNPCWorkshop(progress) {
    if (!progress || typeof progress !== "object" || Array.isArray(progress)) return this.getNPCWorkshop();
    const current = this.getNPCWorkshop();
    state.npcWorkshop = {
      priorities: Array.isArray(progress.priorities) ? progress.priorities.slice(0, 3) : current.priorities,
      habits: Array.isArray(progress.habits) ? progress.habits.slice(0, 30) : current.habits,
      notes: Array.isArray(progress.notes) ? progress.notes.slice(0, 50) : current.notes,
      goals: Array.isArray(progress.goals) ? progress.goals.slice(0, 30) : current.goals,
      organizer: Array.isArray(progress.organizer) ? progress.organizer.slice(0, 50) : current.organizer,
      quizScore: Number.isFinite(Number(progress.quizScore)) ? Math.max(0, Number(progress.quizScore)) : current.quizScore,
      completedChallenges: Array.isArray(progress.completedChallenges) ? progress.completedChallenges.slice(0, 100) : current.completedChallenges
    };
    save();
    return this.getNPCWorkshop();
  },

  setLabWorkshop(progress) {
    if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
      return this.getLabWorkshop();
    }
    state.labWorkshop = {
      creatures: Array.isArray(progress.creatures) ? progress.creatures.slice(0, 24) : []
    };
    save();
    return this.getLabWorkshop();
  },

  setDailyDispatch(progress) {
    if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
      return this.getDailyDispatch();
    }
    state.dailyDispatch = progress;
    save();
    return this.getDailyDispatch();
  },

  setProfile(profile) {
    if (!profile || typeof profile !== "object") return this.getState();
    state.profile = {
      ...state.profile,
      name: String(profile.display_name || state.profile.name || "Tambay").trim().slice(0, 24),
      avatar: String(profile.avatar || state.profile.avatar || "💜").slice(0, 8)
    };
    save();
    return this.getState();
  },

  applyCloudProgress(cloudProgress) {
    if (!cloudProgress || typeof cloudProgress !== "object" || Array.isArray(cloudProgress)) {
      return this.getState();
    }

    state = localSaveExists
      ? normalize(mergeProgress(state, cloudProgress))
      : normalize(cloudProgress);

    localStorage.setItem(activeStorageKey, JSON.stringify(state));
    localSaveExists = true;
    render();
    return this.getState();
  }
};

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
  const profileName = state.profile.name || "Sis";
  const headerName = $("accountOpen")?.querySelector(".account-chip-name");
  if (headerName) headerName.textContent = profileName;
  const welcomeNameEl = $("welcomeName");
  if (welcomeNameEl) welcomeNameEl.textContent = profileName;
  const heroName = $("profileHeroName"); if (heroName) heroName.textContent = profileName;
  const heroBio = $("profileHeroBio"); if (heroBio) heroBio.textContent = (state.profile.bio || "").trim() || "Your introduction will live here. Tell the tambayan a little about yourself.";
  const heroAvatar = $("profileHeroAvatar");
  if (heroAvatar) {
    heroAvatar.dataset.frame = (state.equippedItems || {}).frame || "";
    heroAvatar.dataset.aura = (state.equippedItems || {}).aura || "";
    heroAvatar.dataset.decoration = (state.equippedItems || {}).avatar || "";
    renderAvatarDisplay(heroAvatar);
  }
  const heroEquipped = $("profileHeroEquipped");
  if (heroEquipped) {
    heroEquipped.replaceChildren();
    ["title", "badge"].forEach(slot => {
      const item = shopItems.find(x => x.id === (state.equippedItems || {})[slot]);
      if (!item) return;
      const chip = document.createElement("span"); chip.className = "profile-hero-chip";
      chip.textContent = item.icon + " " + item.name; heroEquipped.appendChild(chip);
    });
    if (!heroEquipped.childElementCount) {
      const hint = document.createElement("span"); hint.className = "profile-hero-chip profile-hero-chip-empty";
      hint.textContent = "Your titles and badges will appear here"; heroEquipped.appendChild(hint);
    }
  }
  const heroLevel = $("profileHeroLevel"); if (heroLevel) heroLevel.textContent = level();
  const heroStars = $("profileHeroStars"); if (heroStars) heroStars.textContent = state.stars;
  const heroBadges = $("profileHeroBadges"); if (heroBadges) heroBadges.textContent = state.badges.length;
  const equipped = state.equippedItems || {};
  const titleItem = shopItems.find(item => item.id === equipped.title);
  const profileTitle = $("equippedProfileTitle");
  if (profileTitle) profileTitle.textContent = titleItem ? titleItem.name : "";
  const headerAvatar = $("headerAvatar");
  const preview = $("avatarPreview");
  [headerAvatar, preview].forEach(el => {
    if (!el) return;
    el.dataset.frame = equipped.frame || "";
    el.dataset.aura = equipped.aura || "";
    el.dataset.decoration = equipped.avatar || "";
    renderAvatarDisplay(el);
  });
  const badgeItem = shopItems.find(item => item.id === equipped.badge);
  const badgeLabel = $("equippedProfileBadge");
  if (badgeLabel) badgeLabel.textContent = badgeItem ? badgeItem.icon + " " + badgeItem.name : "";
  const showcase = $("equippedShowcase");
  if (showcase) {
    const slots = ["title","avatar","frame","aura","badge"];
    showcase.innerHTML = slots.map(slot => {
      const item = shopItems.find(x => x.id === equipped[slot]);
      return item ? `<span class="equipped-chip">${item.icon} ${item.name}</span>` : "";
    }).filter(Boolean).join("") || '<span class="empty-state">No treasures equipped yet.</span>';
  }
  renderEquipmentOptions();
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
  { id:"title_star", icon:"🌟", name:"Star Child Title", desc:"A tiny celestial flex beside your name.", cost:60, rarity:"Common", category:"Titles" },
  { id:"title_delulu", icon:"🤡", name:"Delulu Royalty Title", desc:"For the proudly unserious and beautifully delusional.", cost:60, rarity:"Common", category:"Titles" },
  { id:"title_soft", icon:"🧸", name:"Softie Supreme Title", desc:"Gentle heart, legendary presence.", cost:60, rarity:"Common", category:"Titles" },
  { id:"badge_frog", icon:"🐸", name:"Frog Bestie Badge", desc:"Official confidante of the pond.", cost:100, rarity:"Rare", category:"Badges" },
  { id:"badge_chaos", icon:"🪩", name:"Chaos Icon Badge", desc:"Proof that you are the plot twist.", cost:120, rarity:"Rare", category:"Badges" },
  { id:"charm_lucky", icon:"🍀", name:"Lucky Little Charm", desc:"A pocket-sized reminder that luck finds you.", cost:90, rarity:"Rare", category:"Charms" },
  { id:"key_mystery", icon:"🗝️", name:"Mystery Library Key", desc:"A keepsake from the shelves that whisper.", cost:120, rarity:"Rare", category:"Charms" },
  { id:"avatar_aurora", icon:"🦋", name:"Aurora Butterfly", desc:"A dreamy profile collectible in shifting colors.", cost:130, rarity:"Rare", category:"Avatars" },
  { id:"avatar_moonhalo", icon:"🌙", name:"Moon Halo", desc:"A moonlit halo for your profile showcase.", cost:190, rarity:"Epic", category:"Avatars" },
  { id:"frame_cloud", icon:"☁️", name:"Cloud Nine Frame", desc:"A soft, floating frame for your profile.", cost:220, rarity:"Epic", category:"Frames" },
  { id:"aura_nebula", icon:"🌌", name:"Nebula Aura", desc:"A cosmic glow for your collection showcase.", cost:260, rarity:"Epic", category:"Auras" },
  { id:"avatar_crown", icon:"👑", name:"Golden Crown", desc:"A royal profile collectible fit for a legend.", cost:400, rarity:"Legendary", category:"Avatars" },
  { id:"wings_phoenix", icon:"🔥", name:"Phoenix Wings", desc:"A once-in-a-universe treasure. Rise iconic.", cost:480, rarity:"Legendary", category:"Auras" },
  { id:"frame_galaxy", icon:"💫", name:"Galaxy Frame", desc:"A whole little universe around your profile.", cost:500, rarity:"Legendary", category:"Frames" }
];

const shopSets = [
  { id:"celestial", name:"Celestial Dreamer Set", icon:"🌙", items:["title_star","avatar_moonhalo","frame_galaxy"], reward:"A complete moon-to-stars collection." },
  { id:"chaos", name:"Certified Chaos Set", icon:"🪩", items:["title_delulu","badge_frog","badge_chaos"], reward:"A collection for the wonderfully chaotic." },
  { id:"soft", name:"Soft Hours Set", icon:"🧸", items:["title_soft","avatar_aurora","frame_cloud"], reward:"A little collection of gentle things." }
];

let shopFilter = "All";

function renderShop() {
  const visibleItems = shopItems.filter(i => shopFilter === "All" || i.rarity === shopFilter);
  $("shopGrid").innerHTML = visibleItems.map(i => {
    const owned = state.ownedItems.includes(i.id);
    return `
      <article class="shop-item shop-item-${i.rarity.toLowerCase()}">
        <div class="shop-item-top"><span>${i.icon}</span><small class="shop-rarity">${i.rarity}</small></div>
        <h4>${i.name}</h4>
        <p>${i.desc}</p>
        <small class="shop-category">${i.category}</small>
        <button class="small-btn" data-buy="${i.id}" ${owned || state.stars < i.cost ? "disabled" : ""}>
          ${owned ? "✓ Collected" : `⭐ ${i.cost} · Unlock`}
        </button>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-shop-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.shopFilter === shopFilter);
  });

  $("collectionList").innerHTML = state.ownedItems.length
    ? state.ownedItems.map(id => {
        const shopItem = shopItems.find(x => x.id === id);
        const loungeItem = Object.prototype.hasOwnProperty.call(loungeCollectibles, id) ? loungeCollectibles[id] : null;
        const item = shopItem || loungeItem;
        return item ? `<span class="collection-pill">${item.icon} ${item.name}</span>` : "";
      }).join("")
    : '<span class="empty-state">Your collection starts here. Pick a treasure!</span>';

  const setsRoot = $("collectionSets");
  if (setsRoot) {
    setsRoot.innerHTML = shopSets.map(set => {
      const count = set.items.filter(id => state.ownedItems.includes(id)).length;
      const complete = count === set.items.length;
      const names = set.items.map(id => {
        const item = shopItems.find(x => x.id === id);
        return item ? `${state.ownedItems.includes(id) ? "✓" : "○"} ${item.name}` : "";
      }).join(" · ");
      return `
        <article class="shop-set ${complete ? "is-complete" : ""}">
          <div class="shop-set-head"><span>${set.icon}</span><strong>${set.name}</strong><b>${count}/${set.items.length}</b></div>
          <p>${set.reward}</p><small>${names}</small>
          <div class="shop-set-track"><i style="width:${count / set.items.length * 100}%"></i></div>
          <em>${complete ? "✦ SET COMPLETE" : "Collect all three to complete this set"}</em>
        </article>
      `;
    }).join("");
  }
}

function renderAvatarDisplay(element) {
  if (!element) return;
  const photo = state.profile?.photo || "";
  if (photo && /^data:image\/(jpeg|png|webp);base64,/.test(photo)) {
    const img = document.createElement("img");
    img.src = photo;
    img.alt = "Profile photo";
    img.className = "profile-photo-image";
    element.replaceChildren(img);
  } else {
    element.textContent = state.profile?.avatar || "💜";
  }
}

function renderEquipmentOptions() {
  const slots = {
    title: ["Titles", "Choose a title"],
    avatar: ["Avatars", "Choose an avatar decoration"],
    frame: ["Frames", "Choose a frame"],
    aura: ["Auras", "Choose an aura"],
    badge: ["Badges", "Choose a badge"]
  };
  const root = $("equipmentOptions");
  if (!root) return;
  root.innerHTML = Object.entries(slots).map(([slot, config]) => {
    const items = shopItems.filter(item => item.category === config[0] && state.ownedItems.includes(item.id));
    const selected = state.equippedItems?.[slot] || "";
    return `
      <label class="equipment-slot"><span>${config[1]}</span>
        <select data-equip-slot="${slot}">
          <option value="">Nothing equipped</option>
          ${items.map(item => `<option value="${item.id}" ${selected === item.id ? "selected" : ""}>${item.icon} ${item.name}</option>`).join("")}
        </select>
      </label>
    `;
  }).join("");
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
$("profileHeroEdit")?.addEventListener("click", () => $("profileDialog").showModal());

$("backupOpen").onclick = () =>
  $("settingsDialog").showModal();

$("saveProfile").onclick = async () => {
  state.profile.name = $("profileName").value.trim() || "Sis";
  state.profile.avatar = $("profileAvatar").value || state.profile.avatar || "💜";
  state.profile.bio = $("profileBio").value.trim().slice(0, 180);
  save();
  try {
    if (typeof window.tambayanSyncPublicProfile === "function") {
      await window.tambayanSyncPublicProfile({
        name: state.profile.name,
        avatar: state.profile.avatar
      });
    }
    $("profileDialog").close();
    toast("Profile updated and synced! 💜");
  } catch (error) {
    console.error("Could not sync public profile:", error);
    toast("Saved on this device. Online profile sync failed — please try again.");
  }
};

$("profilePhotoInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast("Please choose an image file.");
    event.target.value = "";
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    toast("Please choose a photo under 8 MB.");
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const source = new Image();
    source.onload = () => {
      const max = 420;
      const scale = Math.min(1, max / Math.max(source.width, source.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(source.width * scale));
      canvas.height = Math.max(1, Math.round(source.height * scale));
      const ctx = canvas.getContext("2d");
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
      state.profile.photo = canvas.toDataURL("image/jpeg", 0.76);
      renderAvatarDisplay($("avatarPreview"));
      const status = $("profilePhotoStatus");
      if (status) status.textContent = "Photo ready! Tap Save profile to keep it.";
      toast("Profile photo ready! Save your profile to keep it. 📸");
    };
    source.onerror = () => toast("This photo format could not be opened. Try JPG or PNG.");
    source.src = reader.result;
  };
  reader.onerror = () => toast("Could not read that photo. Please try again.");
  reader.readAsDataURL(file);
});

$("removeProfilePhoto").onclick = () => {
  state.profile.photo = "";
  renderAvatarDisplay($("avatarPreview"));
  $("profilePhotoStatus").textContent = "Photo removed. Your selected emoji will be used.";
  $("profilePhotoInput").value = "";
};


function updateAvatarSelection(avatar) {
  $("profileAvatar").value = avatar;
  state.profile.avatar = avatar;
  renderAvatarDisplay($("avatarPreview"));

  document.querySelectorAll(".avatar-choice").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.avatar === avatar
    );
  });
}

$("profileOpen").addEventListener("click", () => {
  $("profileName").value = state.profile.name;
  $("profileBio").value = state.profile.bio || "";
  updateAvatarSelection(state.profile.avatar);
  const photoStatus = $("profilePhotoStatus");
  if (photoStatus) photoStatus.textContent = state.profile.photo ? "A profile photo is saved to your account." : "No profile photo uploaded yet.";
  renderEquipmentOptions();
});

document.addEventListener("click", event => {
  const button = event.target.closest(".avatar-choice");

  if (!button) return;

  event.preventDefault();
  updateAvatarSelection(button.dataset.avatar);
}, true);

// Collectible equipment is account-specific and only allows owned items.
document.addEventListener("change", event => {
  const select = event.target.closest("[data-equip-slot]");
  if (!select) return;

  const slot = select.dataset.equipSlot;
  const categories = {
    title: "Titles", avatar: "Avatars", frame: "Frames",
    aura: "Auras", badge: "Badges"
  };
  if (!Object.prototype.hasOwnProperty.call(categories, slot)) return;

  const itemId = select.value;
  const item = itemId
    ? shopItems.find(entry =>
        entry.id === itemId &&
        entry.category === categories[slot] &&
        state.ownedItems.includes(entry.id)
      )
    : null;

  if (itemId && !item) {
    select.value = state.equippedItems?.[slot] || "";
    toast("That collectible is not in this account's collection.");
    return;
  }

  state.equippedItems = { ...(state.equippedItems || {}), [slot]: itemId };
  save();
  toast(item ? item.name + " equipped! ✨" : "Equipment updated.");
});


// The old Daily Message button was retired. Daily encouragement now lives in Daily Dispatch.

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

const breathSteps = ["Breathe in gently for 4 counts.", "Hold softly for 4 counts. No strain.", "Breathe out slowly for 6 counts.", "Rest for a moment. You can begin again whenever you want."];
let breathIndex = 0;
$("breathNext").onclick = () => { breathIndex = (breathIndex + 1) % breathSteps.length; $("breathStep").textContent = breathSteps[breathIndex]; $("breathProgress").textContent = "STEP " + (breathIndex + 1) + " OF 4"; $("breathNext").textContent = breathIndex === 3 ? "Start another round" : "Next breathing step"; };
const groundingSteps = ["Notice 5 things you can see around you.", "Notice 4 things you can physically feel.", "Notice 3 things you can hear.", "Notice 2 things you can smell.", "Notice 1 thing you can taste, or one slow breath."];
let groundingIndex = 0;
$("groundingNext").onclick = () => { groundingIndex = (groundingIndex + 1) % groundingSteps.length; $("groundingList").textContent = groundingSteps[groundingIndex]; $("groundingNext").textContent = groundingIndex === 4 ? "Begin again" : "Next grounding step"; };
$("kindNoteBtn").onclick = () => { $("kindNoteText").textContent = random(["Unclench your jaw and let your shoulders drop for a moment.", "Take a sip of water and give yourself a small pause.", "Put on one song that matches the mood you need right now.", "Send a simple hello to someone who makes you feel safe.", "Look away from the screen and let your eyes rest for a few breaths.", "Make your next task smaller: choose just one tiny first step.", "Find a comfortable position and notice what your body is touching."]); };
$("comfortJournal").oninput = () => { $("comfortCharCount").textContent = $("comfortJournal").value.length + " / 1000"; };
$("comfortClear").onclick = () => { $("comfortJournal").value = ""; $("comfortCharCount").textContent = "0 / 1000"; };
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
  const frog = $("frogText");

  frog.classList.remove("revealed");
  void frog.offsetWidth;

  frog.textContent = random([
    "RIBBIT. The tea is hot but your peace is hotter.",
    "The frog says: don't text them. Text your bestie.",
    "Ribbit: someone is watching your stories. Let them.",
    "The frog has no advice. Just vibes and damp skin."
  ]);

  frog.classList.add("revealed");

  visit("library");
};

$("universeBtn").onclick = () => {
  const universe = $("universeText");

  universe.classList.remove("revealed");
  void universe.offsetWidth;

  universe.textContent = random([
    "YES. But use your brain too.",
    "NO. Protect your peace.",
    "THE SIGNS ARE UNCLEAR. Ask again after a snack.",
    "MOST LIKELY. Stop asking the universe and take a step."
  ]);

  universe.classList.add("revealed");

  visit("library");
};

$("machineBtn").onclick = () => {
  const machine = $("machineText");

  machine.classList.remove("revealed");
  void machine.offsetWidth;

  machine.textContent = random([
    "🫶 LAMBING! You deserve softness today.",
    "👋 SAMPAL! Wake up, the standards are on the floor.",
    "💜 LAMBING! Virtual hug, no explanation needed.",
    "🎰 JACKPOT: Both. Sampal sa delusion, lambing sa sarili."
  ]);

  machine.classList.add("revealed");

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

$("equipmentOptions").onchange = e => {
  const select = e.target.closest("[data-equip-slot]");
  if (!select) return;
  const slot = select.dataset.equipSlot;
  const itemId = select.value;
  if (itemId && !state.ownedItems.includes(itemId)) return;
  const item = itemId ? shopItems.find(entry => entry.id === itemId) : null;
  const expectedCategory = { title:"Titles", avatar:"Avatars", frame:"Frames", aura:"Auras", badge:"Badges" }[slot];
  if (itemId && (!item || item.category !== expectedCategory)) {
    toast("That collectible cannot be equipped in this slot.");
    renderEquipmentOptions();
    return;
  }
  state.equippedItems = state.equippedItems || {};
  if (itemId) state.equippedItems[slot] = itemId;
  else delete state.equippedItems[slot];
  save();
  toast(itemId ? "Treasure equipped! ✨" : "Equipment updated.");
};

$("shopFilters").onclick = e => {
  const button = e.target.closest("[data-shop-filter]");
  if (!button) return;
  shopFilter = button.dataset.shopFilter;
  renderShop();
};

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
      "Importing will replace this device's current progress and, while signed in, sync the imported save to your account on other devices. Export a backup first. Continue?"
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
    "This will erase all progress for this account on this device and sync the reset to your account in the cloud. Other devices will receive the reset too. This cannot be undone unless you have a backup. Continue?"
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
