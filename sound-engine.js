(() => {
  "use strict";

  const STORE = "bt_sound_settings_v1";
  const defaults = { master: true, music: true, effects: true, musicVolume: 0.55, effectsVolume: 0.85 };
  let settings = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && typeof saved === "object") settings = {
      master: saved.master !== false,
      music: saved.music !== false,
      effects: saved.effects !== false,
      musicVolume: Math.max(0, Math.min(1, Number(saved.musicVolume ?? defaults.musicVolume))),
      effectsVolume: Math.max(0, Math.min(1, Number(saved.effectsVolume ?? defaults.effectsVolume)))
    };
  } catch (_) {}

  let context = null;
  let masterGain = null;
  let musicGain = null;
  let effectsGain = null;
  let activeWorld = "";
  let ambienceNodes = [];
  let unlocked = false;
  let lastUiSound = 0;

  const worldScenes = {
    games: { name: "Arcade", notes: [261.63, 329.63, 392.00], wave: "triangle", pulse: 0.11 },
    comfort: { name: "Comfort Corner", notes: [174.61, 220.00, 261.63], wave: "sine", pulse: 0.08 },
    lab: { name: "Creative Lab", notes: [196.00, 246.94, 293.66], wave: "sine", pulse: 0.1 },
    mystery: { name: "Mystery Library", notes: [146.83, 185.00, 220.00], wave: "triangle", pulse: 0.07 },
    diary: { name: "Diary", notes: [196.00, 233.08, 293.66], wave: "sine", pulse: 0.06 },
    community: { name: "Tambayan Lounge", notes: [220.00, 277.18, 329.63], wave: "sine", pulse: 0.09 },
    rage: { name: "Rage Room", notes: [110.00, 146.83, 174.61], wave: "triangle", pulse: 0.12 },
    cosmic: { name: "Cosmic Frontier", notes: [130.81, 196.00, 261.63], wave: "sine", pulse: 0.06 },
    space: { name: "My Space", notes: [196.00, 246.94, 392.00], wave: "sine", pulse: 0.06 }
  };

  function persist() {
    try { localStorage.setItem(STORE, JSON.stringify(settings)); } catch (_) {}
    syncControls();
    updateVolumes();
  }

  function ensureAudio() {
    if (context) return context;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return null;
    context = new Audio();
    masterGain = context.createGain();
    musicGain = context.createGain();
    effectsGain = context.createGain();
    musicGain.connect(masterGain);
    effectsGain.connect(masterGain);
    masterGain.connect(context.destination);
    updateVolumes();
    return context;
  }

  function updateVolumes() {
    if (!context || !masterGain) return;
    const now = context.currentTime;
    masterGain.gain.setTargetAtTime(settings.master ? 1 : 0, now, 0.04);
    musicGain.gain.setTargetAtTime(settings.music ? settings.musicVolume : 0, now, 0.08);
    effectsGain.gain.setTargetAtTime(settings.effects ? settings.effectsVolume : 0, now, 0.025);
  }

  function stopAmbience() {
    if (!context || !ambienceNodes.length) { ambienceNodes = []; return; }
    const now = context.currentTime;
    ambienceNodes.forEach(node => {
      try {
        if (node.gain) node.gain.gain.setTargetAtTime(0, now, 0.18);
        if (node.osc) node.osc.stop(now + 0.8);
        if (node.lfo) node.lfo.stop(now + 0.8);
      } catch (_) {}
    });
    ambienceNodes = [];
  }

  function startAmbience(id) {
    if (!context || context.state !== "running" || !settings.master || !settings.music || !worldScenes[id]) return;
    stopAmbience();
    const scene = worldScenes[id];
    const now = context.currentTime;
    scene.notes.forEach((frequency, index) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const lfo = context.createOscillator();
      const lfoGain = context.createGain();
      osc.type = scene.wave;
      osc.frequency.value = frequency;
      osc.detune.value = index === 1 ? -4 : index === 2 ? 5 : 0;
      gain.gain.value = 0.0001;
      lfo.type = "sine";
      lfo.frequency.value = scene.pulse + index * 0.018;
      lfoGain.gain.value = 0.006;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(musicGain);
      osc.start(now);
      lfo.start(now);
      gain.gain.setTargetAtTime(0.085 - index * 0.012, now, 1.1);
      ambienceNodes.push({ osc, gain, lfo });
    });
  }

  function routeWorld() {
    // The app's main navigation switches .app-view sections with pushState,
    // which does not emit hashchange. Prefer the active view over the URL.
    const activeView = document.querySelector(".app-view.active");
    const viewId = (activeView?.dataset.view || "").toLowerCase();
    const viewRoutes = {
      arcade: "games", games: "games", comfort: "comfort", lab: "lab",
      mystery: "mystery", diary: "diary", community: "community",
      rage: "rage", cosmic: "cosmic", space: "space"
    };
    if (viewRoutes[viewId]) return viewRoutes[viewId];

    const route = (location.hash || "#home").slice(1).toLowerCase();
    const routes = {
      games: "games", arcade: "games", comfort: "comfort", lab: "lab",
      mystery: "mystery", diary: "diary", hangout: "community",
      community: "community", rage: "rage", rageroom: "rage",
      cosmic: "cosmic", cosmicfrontier: "cosmic", space: "space",
      shop: "space", profile: "space"
    };
    return routes[route] || "";
  }

  function syncWorld() {
    const next = routeWorld();
    if (next === activeWorld) return;
    activeWorld = next;
    stopAmbience();
    if (unlocked && activeWorld) startAmbience(activeWorld);
  }

  async function unlock() {
    if (unlocked) {
      if (context && context.state === "suspended") {
        try { await context.resume(); } catch (_) {}
        if (activeWorld) startAmbience(activeWorld);
      }
      return;
    }
    const audio = ensureAudio();
    if (!audio) return;
    try {
      await audio.resume();
      unlocked = audio.state === "running";
      if (unlocked && activeWorld) startAmbience(activeWorld);
    } catch (_) {}
  }

  function tone(frequency, duration, type = "sine", volume = 0.12, slide = 0) {
    if (!settings.master || !settings.effects || !context || context.state !== "running") return;
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(35, frequency + slide), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(effectsGain);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }


  function ceramicSmash() {
    if (!context || context.state !== "running" || !settings.master || !settings.effects) return;
    const now = context.currentTime;

    // A bright, brittle ceramic crack made from filtered noise.
    function noiseBurst(delay, duration, peak, cutoff, resonance) {
      const length = Math.ceil(context.sampleRate * duration);
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        const fade = Math.pow(1 - i / length, 2.2);
        data[i] = (Math.random() * 2 - 1) * fade;
      }
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const envelope = context.createGain();
      source.buffer = buffer;
      filter.type = "highpass";
      filter.frequency.value = cutoff;
      filter.Q.value = resonance;
      envelope.gain.setValueAtTime(0.0001, now + delay);
      envelope.gain.exponentialRampToValueAtTime(peak, now + delay + 0.003);
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      source.connect(filter);
      filter.connect(envelope);
      envelope.connect(effectsGain);
      source.start(now + delay);
      source.stop(now + delay + duration + 0.01);
    }

    // Main impact, brittle fracture, then scattered ceramic fragments.
    noiseBurst(0, 0.24, 0.72, 850, 0.7);
    noiseBurst(0.025, 0.16, 0.42, 2100, 1.1);
    noiseBurst(0.085, 0.22, 0.34, 1350, 0.8);
    tone(185, 0.19, "triangle", 0.22, -115);
    [0.12, 0.19, 0.27, 0.34, 0.42].forEach((delay, i) => {
      const frequency = [1760, 2349, 1480, 2637, 1976][i];
      setTimeout(() => tone(frequency, 0.075 + (i % 2) * 0.035, "sine", 0.16, -frequency * 0.22), delay * 1000);
    });
  }

  function punchImpact() {
    if (!context || context.state !== "running" || !settings.master || !settings.effects) return;
    const now = context.currentTime;
    const variation = 0.88 + Math.random() * 0.24;

    // Short airy swing immediately before the hit.
    const airLength = Math.ceil(context.sampleRate * 0.105);
    const airBuffer = context.createBuffer(1, airLength, context.sampleRate);
    const airData = airBuffer.getChannelData(0);
    for (let i = 0; i < airLength; i++) {
      const t = i / airLength;
      airData[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2) * Math.sin(Math.PI * t);
    }
    const air = context.createBufferSource();
    const airFilter = context.createBiquadFilter();
    const airGain = context.createGain();
    air.buffer = airBuffer;
    airFilter.type = "bandpass";
    airFilter.frequency.value = 1250 + Math.random() * 500;
    airFilter.Q.value = 0.7;
    airGain.gain.setValueAtTime(0.0001, now);
    airGain.gain.exponentialRampToValueAtTime(0.12 * variation, now + 0.018);
    airGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.105);
    air.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(effectsGain);
    air.start(now);

    // Soft, low-frequency body thump plus a textured glove/bag contact.
    const hitLength = Math.ceil(context.sampleRate * 0.22);
    const hitBuffer = context.createBuffer(1, hitLength, context.sampleRate);
    const hitData = hitBuffer.getChannelData(0);
    for (let i = 0; i < hitLength; i++) {
      const t = i / hitLength;
      hitData[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3.1);
    }
    const hit = context.createBufferSource();
    const low = context.createBiquadFilter();
    const bodyGain = context.createGain();
    hit.buffer = hitBuffer;
    low.type = "lowpass";
    low.frequency.value = 430 + Math.random() * 100;
    low.Q.value = 0.8;
    bodyGain.gain.setValueAtTime(0.0001, now + 0.035);
    bodyGain.gain.exponentialRampToValueAtTime(0.52 * variation, now + 0.043);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    hit.connect(low);
    low.connect(bodyGain);
    bodyGain.connect(effectsGain);
    hit.start(now + 0.035);

    const thud = context.createOscillator();
    const thudGain = context.createGain();
    thud.type = "sine";
    thud.frequency.setValueAtTime(118 * variation, now + 0.035);
    thud.frequency.exponentialRampToValueAtTime(58, now + 0.2);
    thudGain.gain.setValueAtTime(0.0001, now + 0.035);
    thudGain.gain.exponentialRampToValueAtTime(0.24, now + 0.045);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);
    thud.connect(thudGain);
    thudGain.connect(effectsGain);
    thud.start(now + 0.035);
    thud.stop(now + 0.25);

    // Light bag/chain rattle after the impact.
    tone(235 + Math.random() * 45, 0.075, "triangle", 0.035, -90);
  }

  // Short, tactile interface Foley synthesized locally (no remote audio dependency).
  function uiFoley(kind = "click") {
    if (!context || context.state !== "running" || !settings.master || !settings.effects) return;
    const now = context.currentTime;
    const noise = (duration, peak, filterType, frequency, delay = 0) => {
      const length = Math.max(1, Math.ceil(context.sampleRate * duration));
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        const t = i / length;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3.4);
      }
      const src = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      src.buffer = buffer;
      filter.type = filterType;
      filter.frequency.value = frequency;
      filter.Q.value = 0.75;
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(peak, now + delay + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      src.connect(filter); filter.connect(gain); gain.connect(effectsGain);
      src.start(now + delay); src.stop(now + delay + duration + 0.01);
    };
    if (kind === "click") {
      noise(0.045, 0.11, "bandpass", 1850);
      tone(720 + Math.random() * 90, 0.035, "triangle", 0.025, -180);
    } else if (kind === "open") {
      noise(0.09, 0.075, "bandpass", 1150);
      tone(520, 0.11, "sine", 0.045, 240);
    } else if (kind === "close") {
      noise(0.075, 0.07, "lowpass", 900);
      tone(560, 0.09, "sine", 0.035, -190);
    } else if (kind === "switch") {
      noise(0.035, 0.12, "highpass", 1450);
      tone(390, 0.045, "triangle", 0.035, 110);
    } else if (kind === "error") {
      tone(210, 0.12, "triangle", 0.09, -55);
      setTimeout(() => tone(165, 0.13, "triangle", 0.075, -30), 105);
    }
  }

  function play(name = "click") {
    if (!context || context.state !== "running" || !settings.master || !settings.effects) return;
    if (name === "notify") {
      tone(659.25, 0.24, "sine", 0.16);
      setTimeout(() => tone(880, 0.3, "sine", 0.12), 100);
    } else if (name === "success") {
      tone(587.33, 0.12, "sine", 0.11);
      setTimeout(() => tone(783.99, 0.18, "sine", 0.10), 90);
    } else if (name === "break") {
      ceramicSmash();
    } else if (name === "pin") {
      tone(1046.5, 0.09, "triangle", 0.12, -260);
    } else if (name === "punch") {
      punchImpact();
    } else if (name === "discover") {
      tone(587.33, 0.18, "sine", 0.12);
      setTimeout(() => tone(783.99, 0.22, "sine", 0.12), 90);
    } else if (["click", "open", "close", "switch", "error"].includes(name)) {
      uiFoley(name);
    }
  }

  function syncControls() {
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.checked = value; };
    set("soundMasterToggle", settings.master);
    set("soundMusicToggle", settings.music);
    set("soundEffectsToggle", settings.effects);
    const music = document.getElementById("soundMusicVolume");
    const effects = document.getElementById("soundEffectsVolume");
    const musicOut = document.getElementById("soundMusicValue");
    const effectsOut = document.getElementById("soundEffectsValue");
    if (music) music.value = Math.round(settings.musicVolume * 100);
    if (effects) effects.value = Math.round(settings.effectsVolume * 100);
    if (musicOut) musicOut.value = Math.round(settings.musicVolume * 100) + "%";
    if (effectsOut) effectsOut.value = Math.round(settings.effectsVolume * 100) + "%";
  }

  function setStatus(message) {
    const el = document.getElementById("soundSettingsStatus");
    if (el) el.textContent = message;
  }

  document.addEventListener("pointerdown", () => { unlock(); }, { capture: true });
  document.addEventListener("click", event => {
    const target = event.target.closest("button, a, [role='button'], input[type='checkbox'], input[type='radio']");
    if (!target) return;
    const now = Date.now();
    if (now - lastUiSound < 65) return;
    lastUiSound = now;
    if (target.id === "rageDoll") play("pin");
    else if (target.matches("[data-plate]")) play("break");
    else if (target.id === "ragePunchTarget") play("punch");
    else if (target.matches("[data-cosmic-find], [data-cosmic-planet], #cosmicScanCreature")) play("discover");
    else if (target.matches("input[type='checkbox'], input[type='radio'], [role='switch']")) play("switch");
    else if (target.matches("[data-sound='success']")) play("success");
    else if (target.matches("[data-sound='error']")) play("error");
    else if (target.matches("[data-open], [aria-haspopup='dialog'], #soundSettingsOpen")) play("open");
    else if (target.matches("[data-close], .modal-close, [aria-label*='Close'], [aria-label*='close']")) play("close");
    else if (target.closest("dialog") && target.matches("button")) play("click");
    else play("click");
  }, true);

  // Native dialog lifecycle sounds for modal open/close, including programmatic closes.
  document.addEventListener("toggle", event => {
    if (event.target instanceof HTMLDialogElement && event.target.open) play("open");
  }, true);
  document.addEventListener("close", event => {
    if (event.target instanceof HTMLDialogElement) play("close");
  }, true);

  document.addEventListener("tambayan:notification", () => play("notify"));
  document.addEventListener("tambayan:sound-success", () => play("success"));
  window.addEventListener("hashchange", syncWorld);
  // Observe app-view activation so ambience follows the real in-app navigation,
  // including navigation that uses history.pushState instead of hashchange.
  const viewObserver = new MutationObserver(() => syncWorld());
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".app-view").forEach(view => {
      viewObserver.observe(view, { attributes: true, attributeFilter: ["class"] });
    });
    syncWorld();
  });
  document.addEventListener("click", event => {
    if (event.target.closest("[data-go], a[href^=\"#\"]")) setTimeout(syncWorld, 0);
  }, true);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && context && context.state === "running") {
      stopAmbience();
    } else if (!document.hidden && unlocked && activeWorld) {
      startAmbience(activeWorld);
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    syncWorld();
    syncControls();
    const open = document.getElementById("soundSettingsOpen");
    const dialog = document.getElementById("soundSettingsDialog");
    open?.addEventListener("click", () => {
      syncControls();
      if (dialog && !dialog.open) dialog.showModal();
    });
    document.getElementById("soundMasterToggle")?.addEventListener("change", event => {
      settings.master = event.target.checked;
      persist();
      if (!settings.master) stopAmbience();
      else { unlock(); if (activeWorld) startAmbience(activeWorld); }
      setStatus(settings.master ? "Sound is on." : "All sounds are muted.");
    });
    document.getElementById("soundMusicToggle")?.addEventListener("change", event => {
      settings.music = event.target.checked;
      persist();
      if (!settings.music) stopAmbience();
      else { unlock(); if (activeWorld) startAmbience(activeWorld); }
      setStatus(settings.music ? "World ambience is enabled." : "World ambience is off.");
    });
    document.getElementById("soundEffectsToggle")?.addEventListener("change", event => {
      settings.effects = event.target.checked;
      persist();
      setStatus(settings.effects ? "Sound effects are enabled." : "Sound effects are off.");
    });
    document.getElementById("soundMusicVolume")?.addEventListener("input", event => {
      settings.musicVolume = Number(event.target.value) / 100;
      persist();
    });
    document.getElementById("soundEffectsVolume")?.addEventListener("input", event => {
      settings.effectsVolume = Number(event.target.value) / 100;
      persist();
    });
    document.getElementById("soundTestButton")?.addEventListener("click", async () => {
      await unlock();
      if (!context) {
        setStatus("This browser does not support Web Audio.");
        return;
      }
      if (context.state !== "running") {
        setStatus("Audio is still blocked by the browser. Tap Test sound once more, and check your phone's media volume.");
        return;
      }
      if (!settings.master || !settings.effects) {
        setStatus("Turn on All sounds and Sound effects before testing.");
        return;
      }
      tone(880, 0.42, "sine", 0.34);
      setTimeout(() => tone(1174.66, 0.48, "sine", 0.3), 180);
      setStatus("Playing a louder two-note test. If silent, check Android media volume.");

    });
    if (activeWorld) syncWorld();
  });

  window.btSound = {
    play,
    notify: () => play("notify"),
    success: () => play("success"),
    setWorld: id => { activeWorld = worldScenes[id] ? id : ""; stopAmbience(); if (activeWorld && unlocked) startAmbience(activeWorld); },
    getSettings: () => ({ ...settings })
  };
})();