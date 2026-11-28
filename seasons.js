(() => {
  "use strict";

  // A fictional Tambayanverse year: four seasons, 28 days each.
  // The fixed UTC anchor keeps the season consistent for every member worldwide.
  const SEASON_LENGTH = 28;
  const YEAR_LENGTH = SEASON_LENGTH * 4;
  const CALENDAR_ANCHOR = Date.UTC(2026, 9, 1);
  const seasons = [
    { id: "bloomtide", name: "Bloomtide", icon: "🌸", description: "A season of fresh starts, small beginnings, and little things taking root.", next: "Suncrest", mood: "Fresh beginnings" },
    { id: "suncrest", name: "Suncrest", icon: "☀️", description: "Long bright days invite curiosity, play, and a little extra sunshine.", next: "Leafwhisper", mood: "Bright days" },
    { id: "leafwhisper", name: "Leafwhisper", icon: "🍂", description: "A slower, golden season for gathering thoughts and noticing what matters.", next: "Frostveil", mood: "Golden moments" },
    { id: "frostveil", name: "Frostveil", icon: "❄️", description: "A quiet season of soft lights, cozy corners, and gentle wonder.", next: "Bloomtide", mood: "Quiet wonder" }
  ];

  const $ = id => document.getElementById(id);
  const date = new Date();
  const todayUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const elapsedDays = Math.floor((todayUTC - CALENDAR_ANCHOR) / 86400000);
  const dayInYear = ((elapsedDays % YEAR_LENGTH) + YEAR_LENGTH) % YEAR_LENGTH;
  const seasonIndex = Math.floor(dayInYear / SEASON_LENGTH);
  const dayInSeason = (dayInYear % SEASON_LENGTH) + 1;
  const current = seasons[seasonIndex];
  const daysRemaining = SEASON_LENGTH - dayInSeason;
  const progress = Math.round((dayInSeason / SEASON_LENGTH) * 100);

  document.body.dataset.season = current.id;
  document.documentElement.dataset.season = current.id;

  if ($("seasonCurrentIcon")) $("seasonCurrentIcon").textContent = current.icon;
  if ($("seasonCurrentName")) $("seasonCurrentName").textContent = current.name;
  if ($("seasonCurrentDescription")) $("seasonCurrentDescription").textContent = current.description;
  if ($("seasonDayCount")) $("seasonDayCount").textContent = `DAY ${String(dayInSeason).padStart(2, "0")} OF ${SEASON_LENGTH}`;
  if ($("seasonNextChange")) $("seasonNextChange").textContent = daysRemaining === 0
    ? `${current.next} begins tomorrow.`
    : `${current.next} arrives in ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}.`;
  if ($("seasonProgressFill")) $("seasonProgressFill").style.width = `${progress}%`;
  if ($("seasonProgressTrack")) $("seasonProgressTrack").setAttribute("aria-valuenow", String(dayInSeason));

  document.querySelectorAll("[data-season-card]").forEach(card => {
    const active = card.dataset.seasonCard === current.id;
    card.classList.toggle("is-current", active);
    if (active) card.setAttribute("aria-current", "season");
    else card.removeAttribute("aria-current");
  });
})();
