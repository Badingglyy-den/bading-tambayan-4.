
(() => {
  "use strict";

  const main = document.querySelector("main.shell");
  const header = document.querySelector(".topbar");

  if (!main || !header || document.querySelector(".app-nav")) return;

  const originalNodes = Array.from(main.children);

  const findIndex = id =>
    originalNodes.findIndex(node => node.id === id);

  const gamesIndex = findIndex("games");
  const comfortIndex = findIndex("comfort");
  const labIndex = findIndex("lab");
  const mysteryIndex = findIndex("mystery");
  const diaryIndex = findIndex("diary");
  const hangoutIndex = findIndex("hangout");

  if (
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
      end: gamesIndex,
      routes: ["home", "worlds"]
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
      label: "🌟 Community",
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
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      width: 100%;
      padding: 10px 14px;
      overflow-x: auto;
      scrollbar-width: none;
      background: rgba(16, 13, 32, .94);
      border-bottom: 1px solid var(--line, #ffffff18);
      backdrop-filter: blur(16px);
    }

    .app-nav::-webkit-scrollbar {
      display: none;
    }

    .app-nav button {
      flex: 0 0 auto;
      border: 1px solid transparent;
      border-radius: 12px;
      padding: 10px 13px;
      background: transparent;
      color: var(--muted, #b9aecb);
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
      transition: .2s ease;
    }

    .app-nav button:hover {
      background: rgba(167, 124, 232, .14);
      color: var(--text, #fff);
    }

    .app-nav button.active {
      background: rgba(167, 124, 232, .2);
      color: var(--accent, #c6a5ff);
      border-color: var(--accent, #c6a5ff);
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

    @media (max-width: 560px) {
      .app-nav {
        padding: 8px 9px;
        gap: 5px;
      }

      .app-nav button {
        padding: 10px 11px;
        font-size: 10px;
      }

      .app-view {
        min-height: 70vh;
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
    activate(routeMap[route] || "home");
  }

  window.addEventListener("popstate", activateFromHash);
  window.addEventListener("hashchange", activateFromHash);

  activateFromHash();

})();
    
