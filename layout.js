(() => {
  "use strict";

  const main = document.querySelector("main.shell");
  const header = document.querySelector(".topbar");

  if (!main || !header || document.querySelector(".app-nav")) return;

  const originalNodes = Array.from(main.children);

  const findIndex = id =>
    originalNodes.findIndex(node => node.id === id);

  
  const mapIndex = findIndex("verse-map");
  const gamesIndex = findIndex("games");
  const comfortIndex = findIndex("comfort");
  const labIndex = findIndex("lab");
  const mysteryIndex = findIndex("mystery");
  const diaryIndex = findIndex("diary");
  const hangoutIndex = findIndex("hangout");
  const rageIndex = findIndex("rageRoom");
  const cosmicIndex = findIndex("cosmicFrontier");
  const dopamineIndex = findIndex("dopamineDistrict");

  if (
    mapIndex < 0 ||
    gamesIndex < 0 ||
    comfortIndex < 0 ||
    labIndex < 0 ||
    mysteryIndex < 0 ||
    diaryIndex < 0 ||
    hangoutIndex < 0 ||
    rageIndex < 0 ||
    cosmicIndex < 0 ||
    dopamineIndex < 0
  ) {
    console.error("Tambayan layout: required sections were not found.");
    return;
  }


  let spaceIndex = -1;

  for (let i = hangoutIndex + 1; i < originalNodes.length; i++) {
    const node = originalNodes[i];

    if (
      node.classList.contains("section-heading") &&
      !node.id
    ) {
      spaceIndex = i;
      break;
    }
  }

  if (spaceIndex < 0) {
    console.error("Tambayan layout: My Space section was not found.");
    return;
  }

  const definitions = [
    {
      id: "home",
      label: "🏠 Home",
      start: 0,
      end: mapIndex,
      routes: ["home", "worlds"]
    },
    {
      id: "map",
      label: "🗺️ Map",
      start: mapIndex,
      end: gamesIndex,
      routes: ["verse-map", "map"]
    },

    {
      id: "arcade",
      label: "🎮 Arcade",
      start: gamesIndex,
      end: comfortIndex,
      routes: ["games", "arcade"]
    },
    {
      id: "comfort",
      label: "🫂 Comfort",
      start: comfortIndex,
      end: labIndex,
      routes: ["comfort"]
    },
    {
      id: "lab",
      label: "🧪 Lab",
      start: labIndex,
      end: mysteryIndex,
      routes: ["lab"]
    },
    {
      id: "mystery",
      label: "🔮 Mystery",
      start: mysteryIndex,
      end: diaryIndex,
      routes: ["mystery"]
    },
    {
      id: "diary",
      label: "📔 Diary",
      start: diaryIndex,
      end: hangoutIndex,
      routes: ["diary"]
    },
    {
      id: "community",
      label: "🌟 Tambayan Lounge",
      start: hangoutIndex,
      end: rageIndex,
      routes: ["hangout", "community"]
    },
    {
      id: "rage",
      label: "🔥 Rage Room",
      start: rageIndex,
      end: cosmicIndex,
      routes: ["rageRoom", "rage"]
    },
    {
      id: "cosmic",
      label: "🚀 Cosmic Frontier",
      start: cosmicIndex,
      end: dopamineIndex,
      routes: ["cosmicFrontier", "cosmic"]
    },
    {
      id: "dopamine",
      label: "🪩 Dopamine District",
      start: dopamineIndex,
      end: spaceIndex,
      routes: ["dopamineDistrict", "dopamine"]
    },
    {
      id: "space",
      label: "✨ My Space",
      start: spaceIndex,
      end: originalNodes.length,
      routes: ["space", "shop", "profile"]
    }
  ];

  const style = document.createElement("style");

  style.textContent = `
    
.app-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 7px;
  width: 100%;
  padding: 12px 16px;
  background: rgba(16, 13, 32, .96);
  border-bottom: 1px solid var(--line, #ffffff18);
  backdrop-filter: blur(18px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, .16);
}

.app-nav button {
  flex: 0 1 auto;
  min-height: 42px;
  border: 1px solid transparent;
  border-radius: 13px;
  padding: 10px 14px;
  background: transparent;
  color: var(--muted, #b9aecb);
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
  -webkit-tap-highlight-color: transparent;
}

.app-nav button:hover {
  background: rgba(167, 124, 232, .14);
  color: var(--text, #fff);
}

.app-nav button.active {
  background: rgba(167, 124, 232, .22);
  color: var(--accent, #c6a5ff);
  border-color: var(--accent, #c6a5ff);
  box-shadow: 0 0 14px rgba(167, 124, 232, .22);
}

.app-nav button:focus-visible {
  outline: 2px solid #e1c5ff;
  outline-offset: 3px;
}

.app-view {
  display: none;
  width: 100%;
  min-height: 65vh;
  animation: tambayanViewIn .22s ease;
}

.app-view.active {
  display: block;
}

@keyframes tambayanViewIn {
  from {
    opacity: 0;
    transform: translateY(7px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-view > .section-heading:first-child {
  margin-top: 12px;
}

.app-view > .footer {
  margin-top: 35px;
}

@media (max-width: 850px) {
  .app-nav {
    justify-content: flex-start;
  }
}

@media (max-width: 850px) {
  body {
    padding-bottom: calc(76px + env(safe-area-inset-bottom));
  }

  .app-nav {
    position: fixed !important;
    top: auto !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 7px;
    padding: 9px 10px calc(9px + env(safe-area-inset-bottom));
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    background: rgba(20, 14, 37, .97);
    border-top: 1px solid rgba(195, 150, 255, .25);
    border-bottom: 0;
    box-shadow: 0 -8px 28px rgba(0, 0, 0, .3);
  }

  .app-nav::-webkit-scrollbar {
    display: none;
  }

  .app-nav button {
    flex: 0 0 auto;
    min-height: 46px;
    padding: 11px 13px;
    font-size: 11px;
    border-radius: 13px;
  }

  .app-view {
    min-height: 70vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-view {
    animation: none;
  }

  .app-nav button {
    transition: none;
  }
}

  `;

  document.head.appendChild(style);

  const views = {};
  const nav = document.createElement("nav");

  nav.className = "app-nav";
  nav.setAttribute("aria-label", "Main navigation");

  definitions.forEach(definition => {
    const view = document.createElement("section");

    view.className = "app-view";
    view.id = "view-" + definition.id;
    view.dataset.view = definition.id;

    views[definition.id] = view;
    main.appendChild(view);

    const button = document.createElement("button");

    button.type = "button";
    button.textContent = definition.label;
    button.dataset.go = definition.id;

    nav.appendChild(button);

    for (
      let i = definition.start;
      i < definition.end;
      i++
    ) {
      const node = originalNodes[i];

      if (node) view.appendChild(node);
    }
  });

  header.insertAdjacentElement("afterend", nav);


  // Tambayan Lounge: keep its overview compact and reveal one destination at a time.
  const loungeView = views.community;
  const loungeLayout = loungeView?.querySelector(".hangout-layout");

  if (loungeView && loungeLayout && !loungeView.querySelector(".lounge-hub")) {
    const welcome = loungeLayout.querySelector(".lounge-welcome");
    const destinations = [
      {
        id: "games",
        label: "Game Corner",
        icon: "🎡",
        description: "Daily spins and mystery rewards",
        panel: loungeLayout.querySelectorAll(".lounge-section")[0]
      },
      {
        id: "garden",
        label: "Community Garden",
        icon: "🌷",
        description: "Polls and shared moods",
        panel: loungeLayout.querySelectorAll(".lounge-section")[1]
      },
      {
        id: "discover",
        label: "Discovery Corner",
        icon: "🔎",
        description: "Secret hunts and daily characters",
        panel: loungeLayout.querySelectorAll(".lounge-section")[2]
      },
      {
        id: "spaces",
        label: "Community Spaces",
        icon: "💌",
        description: "Leave a little kindness",
        panel: loungeLayout.querySelectorAll(".lounge-section")[3]
      },
      {
        id: "public",
        label: "Public Tambayan",
        icon: "🌍",
        description: "Posts, comments, and members",
        panel: loungeView.querySelector("#publicCommunity")
      },
      {
        id: "online",
        label: "Online Tambayan",
        icon: "🪩",
        description: "Private rooms and live chat",
        panel: loungeLayout.querySelector("#onlineTambayan")
      }
    ].filter(item => item.panel);

    const hub = document.createElement("section");
    hub.className = "lounge-hub";
    hub.innerHTML = `
      <div class="lounge-hub-heading">
        <p class="eyebrow">YOUR LOUNGE, YOUR PACE</p>
        <h3>Where would you like to go?</h3>
        <p>Pick a corner. The rest can wait until you need it.</p>
      </div>
      <div class="lounge-hub-grid" role="group" aria-label="Tambayan Lounge destinations">
        ${destinations.map(item => `
          <button class="lounge-hub-tile" type="button" data-lounge-open="${item.id}" aria-controls="lounge-panel-${item.id}">
            <span class="lounge-hub-icon" aria-hidden="true">${item.icon}</span>
            <span class="lounge-hub-copy"><strong>${item.label}</strong><small>${item.description}</small></span>
            <span class="lounge-hub-arrow" aria-hidden="true">↗</span>
          </button>
        `).join("")}
      </div>
    `;

    const back = document.createElement("button");
    back.type = "button";
    back.className = "lounge-back-button";
    back.textContent = "← Back to Lounge";
    back.hidden = true;
    back.addEventListener("click", () => showLoungeHub());

    loungeLayout.insertBefore(hub, welcome?.nextSibling || loungeLayout.firstChild);
    loungeView.querySelector(".section-heading#hangout")?.appendChild(back);

    destinations.forEach(item => {
      item.panel.id = item.panel.id || "lounge-panel-" + item.id;
      item.panel.dataset.loungePanel = item.id;
      if (item.id === "garden") item.panel.classList.add("lounge-community-garden");
      item.panel.hidden = true;
    });

    // The public community module creates its own section beside the Lounge.
    // Bring it into the Lounge layout so it can use the same compact navigation.
    const publicPanel = loungeView.querySelector("#publicCommunity");
    if (publicPanel && publicPanel.parentElement !== loungeLayout) {
      loungeLayout.appendChild(publicPanel);
    }

    // The chat module inserts this section into the Lounge layout before this file runs.
    const onlinePanel = loungeLayout.querySelector("#onlineTambayan");
    if (onlinePanel) {
      onlinePanel.dataset.loungePanel = "online";
      onlinePanel.hidden = true;
    }

    function showLoungeHub() {
      if (welcome) welcome.hidden = false;
      hub.hidden = false;
      back.hidden = true;
      destinations.forEach(item => { item.panel.hidden = true; });
      loungeView.dataset.loungeOpen = "hub";
    }

    function openLoungePanel(id) {
      const item = destinations.find(destination => destination.id === id);
      if (!item) return;
      if (welcome) welcome.hidden = true;
      hub.hidden = true;
      destinations.forEach(destination => {
        destination.panel.hidden = destination.id !== id;
      });
      back.hidden = false;
      loungeView.dataset.loungeOpen = id;
      // Keep the visitor at their current reading position when switching Lounge panels.
    }

    // One delegated handler powers both the overview tiles and the Shared Spaces shortcuts.
    loungeView.addEventListener("click", event => {
      const button = event.target.closest("[data-lounge-open]");
      if (button && loungeView.contains(button)) openLoungePanel(button.dataset.loungeOpen);
    });

    showLoungeHub();
  }

  const loungeStyle = document.createElement("style");
  loungeStyle.id = "lounge-hub-navigation-styles";
  loungeStyle.textContent = `
    #view-community .lounge-hub { margin: 18px 0 32px; }
    #view-community .lounge-hub-heading { margin: 0 0 16px; }
    #view-community .lounge-hub-heading h3 { margin: 5px 0; font-size: clamp(21px,3vw,27px); }
    #view-community .lounge-hub-heading > p:last-child { margin: 5px 0; color: var(--muted); font-size: 13px; }
    #view-community .lounge-hub-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
    #view-community .lounge-hub-tile { display: grid; grid-template-columns: 44px minmax(0,1fr) 18px; align-items: center; gap: 12px; min-width: 0; min-height: 82px; padding: 15px; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); color: var(--text); text-align: left; cursor: pointer; }
    #view-community .lounge-hub-tile:hover { border-color: var(--accent); background: var(--panel2); }
    #view-community .lounge-hub-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 13px; background: var(--panel2); font-size: 23px; }
    #view-community .lounge-hub-copy { display: grid; gap: 4px; min-width: 0; }
    #view-community .lounge-hub-copy strong { font-size: 13px; }
    #view-community .lounge-hub-copy small { color: var(--muted); font-size: 10px; line-height: 1.4; }
    #view-community .lounge-hub-arrow { color: var(--accent); font-size: 17px; }
    #view-community .lounge-back-button { display: inline-flex; align-items: center; min-height: 40px; margin: 14px 0 4px; padding: 9px 13px; border: 1px solid var(--line); border-radius: 11px; background: var(--panel); color: var(--text); font: inherit; font-size: 12px; font-weight: 800; cursor: pointer; }
    #view-community [data-lounge-panel][hidden], #view-community .lounge-hub[hidden], #view-community .lounge-back-button[hidden], #view-community .lounge-welcome[hidden] { display: none !important; }
    #view-community .lounge-section[data-lounge-panel] { margin-top: 18px; }
    /* Give Daily Poll and Mood Garden their own full-width space. */
    #view-community .lounge-community-garden .tool-grid {
      grid-template-columns: minmax(0,1fr);
      gap: 18px;
    }
    #view-community .lounge-community-garden .tool-card {
      min-height: 150px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    #view-community .lounge-community-garden .tool-card > span { font-size: 32px; }
    #view-community .lounge-community-garden .tool-card h3 { margin: 12px 0 7px; font-size: 18px; }
    #view-community .lounge-community-garden .tool-card p { max-width: 48ch; line-height: 1.65; }
    #view-community #publicCommunity[data-lounge-panel], #view-community #onlineTambayan[data-lounge-panel] { margin-top: 18px; }
    #view-community .section-heading#hangout { scroll-margin-top: 16px; }
    @media(max-width:560px) {
      #view-community .lounge-hub-grid { grid-template-columns: 1fr; gap: 9px; }
      #view-community .lounge-hub-tile { min-height: 72px; padding: 12px; }
    }
    @media(prefers-reduced-motion:reduce) { #view-community .lounge-hub-tile { transition: none; } }
  `;
  document.head.appendChild(loungeStyle);

  const routeMap = {};

  definitions.forEach(definition => {
    definition.routes.forEach(route => {
      routeMap[route] = definition.id;
    });
  });

  function activate(viewId, updateUrl = false) {
    if (!views[viewId]) viewId = "home";

    Object.entries(views).forEach(([id, view]) => {
      view.classList.toggle("active", id === viewId);
    });

    nav.querySelectorAll("button").forEach(button => {
      const active = button.dataset.go === viewId;

      button.classList.toggle("active", active);

      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    if (updateUrl) {
      const definition = definitions.find(
        item => item.id === viewId
      );

      history.pushState(
        { view: viewId },
        "",
        "#" + definition.routes[0]
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  nav.addEventListener("click", event => {
    const button = event.target.closest("[data-go]");

    if (!button) return;

    activate(button.dataset.go, true);
  });

  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');

    if (!link) return;

    const route = link.getAttribute("href").slice(1);
    const viewId = routeMap[route];

    if (!viewId) return;

    event.preventDefault();
    activate(viewId, true);
  });

  function activateFromHash() {
  const route = location.hash.replace(/^#/, "");
  const viewId = routeMap[route];

  if (viewId) {
    activate(viewId);
    return;
  }

  if (!document.querySelector(".app-view.active")) {
    activate("home");
  }
}

  window.addEventListener("popstate", activateFromHash);
  window.addEventListener("hashchange", activateFromHash);

  activateFromHash();

})();
      
