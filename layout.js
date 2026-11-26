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

  if (
    mapIndex < 0 ||
    gamesIndex < 0 ||
    comfortIndex < 0 ||
    labIndex < 0 ||
    mysteryIndex < 0 ||
    diaryIndex < 0 ||
    hangoutIndex < 0
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
      end: spaceIndex,
      routes: ["hangout", "community"]
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

  if (!viewId) return;

  activate(viewId);
}

  window.addEventListener("popstate", activateFromHash);
  window.addEventListener("hashchange", activateFromHash);

  activateFromHash();

})();
      
