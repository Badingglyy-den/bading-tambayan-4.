(() => {
  "use strict";

  const KEY = "bt_community_garden_v1";
  const $ = id => document.getElementById(id);
  const hub = $("gardenHub");
  const roomView = $("gardenRoomView");
  const localRoom = $("gardenLocalRoom");
  if (!hub || !roomView || !localRoom) return;

  const titles = {
    poll: ["📊", "Daily Poll"],
    mood: ["🌷", "Mood Garden"],
    wishes: ["🌳", "The Wish Tree"],
    acts: ["🌱", "Little Acts, Big Blooms"],
    notes: ["💌", "Garden Notes"],
    fireflies: ["✨", "Firefly Moments"],
    greenhouse: ["🏡", "The Seasonal Greenhouse"]
  };

  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch (_) { return {}; }
  };
  let data = read();
  const write = () => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (error) { console.warn("Garden save unavailable:", error); }
  };
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const today = () => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const values = {};
    parts.forEach(part => { if (part.type !== "literal") values[part.type] = part.value; });
    return values.year + "-" + values.month + "-" + values.day;
  };
  const dateLabel = value => {
    const date = new Date(value + "T12:00:00");
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };
  const list = (items, empty, className) => items.length
    ? '<div class="' + className + '">' + items.map(item =>
        '<div class="garden-saved-item"><p>' + escapeHTML(item.text) + '</p><small>' +
        escapeHTML(item.date ? dateLabel(item.date) : "Saved") + '</small></div>'
      ).join("") + '</div>'
    : '<p class="garden-empty-state">' + empty + '</p>';

  function renderWishes() {
    const items = Array.isArray(data.wishes) ? data.wishes : [];
    localRoom.innerHTML = '<p class="garden-room-eyebrow">A PLACE FOR WHAT YOU HOPE FOR</p>' +
      '<h3>🌳 The Wish Tree</h3><p class="garden-room-description">Write a wish, a hope, or something you are quietly working toward. Your notes stay private on this device.</p>' +
      '<form data-garden-form="wish"><label for="gardenWishInput">What are you wishing for?</label><textarea id="gardenWishInput" maxlength="180" placeholder="A little wish, in your own words..." required></textarea><div class="garden-form-footer"><small>180 characters max</small><button class="small-btn" type="submit">Hang my wish ✨</button></div></form>' +
      '<h4 class="garden-subheading">Your branches</h4>' + list(items, "Your tree is waiting for its first wish.", "garden-saved-list");
  }

  const challenges = [
    ["send-kindness", "Send someone a sincere compliment", "💬"],
    ["pause", "Take a proper five-minute pause", "🍃"],
    ["check-in", "Check in on someone you care about", "💗"],
    ["tidy", "Make one tiny corner of your space nicer", "🪴"],
    ["thank-you", "Tell someone one thing you appreciate", "🌼"]
  ];
  function renderActs() {
    const day = today();
    data.completedActs = data.completedActs && data.completedActs.date === day
      ? data.completedActs : { date: day, ids: [] };
    const done = data.completedActs.ids;
    localRoom.innerHTML = '<p class="garden-room-eyebrow">SMALL THINGS COUNT</p><h3>🌱 Little Acts, Big Blooms</h3>' +
      '<p class="garden-room-description">Pick one gentle mission. No streak pressure, no leaderboard—just a little good in your day.</p>' +
      '<div class="garden-progress"><span>' + done.length + ' of 5 little acts done today</span><span class="garden-progress-track"><i style="width:' + (done.length / 5 * 100) + '%"></i></span></div>' +
      '<div class="garden-challenge-list">' + challenges.map(item =>
        '<button class="garden-challenge' + (done.includes(item[0]) ? ' is-done' : '') + '" type="button" data-garden-act="' + item[0] + '" aria-pressed="' + done.includes(item[0]) + '">' +
        '<span>' + item[2] + '</span><strong>' + item[1] + '</strong><b>' + (done.includes(item[0]) ? '✓' : '+') + '</b></button>'
      ).join("") + '</div><p class="garden-small-print">Your checklist resets each day. Completing these is for your own feel-good moment, not a site reward.</p>';
  }

  function renderNotes() {
    const items = Array.isArray(data.notes) ? data.notes : [];
    localRoom.innerHTML = '<p class="garden-room-eyebrow">A SOFT PLACE TO LAND</p><h3>💌 Garden Notes</h3>' +
      '<p class="garden-room-description">Write a kind note, a reminder for a hard day, or words you might share with someone later. These are private drafts for now.</p>' +
      '<form data-garden-form="note"><label for="gardenNoteInput">Leave yourself a little kindness</label><textarea id="gardenNoteInput" maxlength="280" placeholder="You deserve patience, too..." required></textarea><div class="garden-form-footer"><small>280 characters max</small><button class="small-btn" type="submit">Save note 💜</button></div></form>' +
      '<h4 class="garden-subheading">Notes you've kept</h4>' + list(items, "Your kind words will live here.", "garden-saved-list");
  }

  function renderFireflies() {
    const items = Array.isArray(data.fireflies) ? data.fireflies : [];
    localRoom.innerHTML = '<p class="garden-room-eyebrow">KEEP THE LITTLE LIGHTS</p><h3>✨ Firefly Moments</h3>' +
      '<p class="garden-room-description">Catch one tiny thing that made today feel a little brighter. It does not have to be a big moment.</p>' +
      '<form data-garden-form="firefly"><label for="gardenFireflyInput">A moment worth keeping</label><textarea id="gardenFireflyInput" maxlength="160" placeholder="The sky looked extra pretty on my way home..." required></textarea><div class="garden-form-footer"><small>160 characters max</small><button class="small-btn" type="submit">Catch this firefly ✨</button></div></form>' +
      '<h4 class="garden-subheading">Your little lights</h4>' + list(items, "Your first firefly is waiting to be caught.", "garden-saved-list");
  }

  function renderGreenhouse() {
    const seasons = [
      ["bloomtide", "🌸", "Bloomtide", "Fresh starts and soft colors"],
      ["suncrest", "☀️", "Suncrest", "Warm days and golden petals"],
      ["leafwhisper", "🍂", "Leafwhisper", "Quiet changes and cozy corners"],
      ["frostveil", "❄️", "Frostveil", "Slow days and gentle lights"]
    ];
    const chosen = data.season || "bloomtide";
    localRoom.innerHTML = '<p class="garden-room-eyebrow">A LITTLE CHANGE OF SCENERY</p><h3>🏡 The Seasonal Greenhouse</h3>' +
      '<p class="garden-room-description">Choose the atmosphere for your personal garden patch. This changes your saved greenhouse setting, not the shared site season.</p>' +
      '<div class="garden-season-list">' + seasons.map(season =>
        '<button class="garden-season' + (chosen === season[0] ? ' is-selected' : '') + '" type="button" data-garden-season="' + season[0] + '" aria-pressed="' + (chosen === season[0]) + '">' +
        '<span>' + season[1] + '</span><strong>' + season[2] + '</strong><small>' + season[3] + '</small>' +
        (chosen === season[0] ? '<b>Selected</b>' : '') + '</button>'
      ).join("") + '</div><p class="garden-save-status" role="status">Your greenhouse choice is saved on this device.</p>';
  }

  const renderers = { wishes: renderWishes, acts: renderActs, notes: renderNotes, fireflies: renderFireflies, greenhouse: renderGreenhouse };

  function openRoom(name) {
    const info = titles[name];
    if (!info) return;
    hub.hidden = true;
    roomView.hidden = false;
    $("gardenDailyPollRoom").hidden = name !== "poll";
    $("gardenMoodGardenRoom").hidden = name !== "mood";
    localRoom.hidden = name === "poll" || name === "mood";
    if (renderers[name]) renderers[name]();
    roomView.dataset.activeRoom = name;
    $("gardenBackButton").focus({ preventScroll: true });
    roomView.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function goBack() {
    roomView.hidden = true;
    hub.hidden = false;
    $("gardenPathsToggle").focus({ preventScroll: true });
    hub.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  hub.addEventListener("click", event => {
    const button = event.target.closest("[data-garden-open]");
    if (button) openRoom(button.dataset.gardenOpen);
  });
  $("gardenBackButton").addEventListener("click", goBack);
  $("gardenPathsToggle").addEventListener("click", () => {
    const panel = $("gardenExtraPaths");
    const expanded = $("gardenPathsToggle").getAttribute("aria-expanded") === "true";
    $("gardenPathsToggle").setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
    $("gardenPathsToggle").querySelector(".garden-toggle-mark").textContent = expanded ? "＋" : "−";
    $("gardenPathsToggle").querySelector("span").textContent = expanded ? "Explore 5 more garden spots" : "Hide the extra garden spots";
  });

  localRoom.addEventListener("submit", event => {
    const form = event.target.closest("form[data-garden-form]");
    if (!form) return;
    event.preventDefault();
    const field = form.querySelector("textarea");
    const value = field.value.trim();
    if (!value) { field.focus(); return; }
    const type = form.dataset.gardenForm;
    const key = type === "wish" ? "wishes" : type === "note" ? "notes" : "fireflies";
    if (!Array.isArray(data[key])) data[key] = [];
    data[key].unshift({ text: value, date: today() });
    data[key] = data[key].slice(0, 30);
    write();
    const render = type === "wish" ? renderWishes : type === "note" ? renderNotes : renderFireflies;
    render();
    const status = document.createElement("p");
    status.className = "garden-save-status";
    status.setAttribute("role", "status");
    status.textContent = "Saved in your garden. 💜";
    localRoom.prepend(status);
  });

  localRoom.addEventListener("click", event => {
    const act = event.target.closest("[data-garden-act]");
    if (act) {
      const id = act.dataset.gardenAct;
      if (data.completedActs.ids.includes(id)) data.completedActs.ids = data.completedActs.ids.filter(item => item !== id);
      else data.completedActs.ids.push(id);
      write(); renderActs(); return;
    }
    const season = event.target.closest("[data-garden-season]");
    if (season) { data.season = season.dataset.gardenSeason; write(); renderGreenhouse(); }
  });

  $("gardenPathsToggle").setAttribute("aria-expanded", "false");
})();