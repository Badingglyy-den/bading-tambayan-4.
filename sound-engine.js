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
      gain.gain.setTargetAtTime(0.045 - index * 0.006, now, 1.1);
      ambienceNodes.push({ osc, gain, lfo });
    });
  }

  function routeWorld() {
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

  function play(name = "click") {
    if (!context || context.state !== "running" || !settings.master || !settings.effects) return;
    if (name === "notify") {
      tone(659.25, 0.24, "sine", 0.16);
      setTimeout(() => tone(880, 0.3, "sine", 0.12), 100);
    } else if (name === "success") {
      tone(523.25, 0.16, "sine", 0.13);
      setTimeout(() => tone(783.99, 0.24, "sine", 0.13), 100);
    } else if (name === "break") {
      ceramicSmash();
    } else if (name === "pin") {
      tone(1046.5, 0.09, "triangle", 0.12, -260);
    } else if (name === "punch") {
      tone(105, 0.16, "sine", 0.2, -45);
    } else if (name === "discover") {
      tone(587.33, 0.18, "sine", 0.12);
      setTimeout(() => tone(783.99, 0.22, "sine", 0.12), 90);
    } else {
      tone(480, 0.045, "sine", 0.055);
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
    const target = event.target.closest("button, a, [role='button']");
    if (!target) return;
    const now = Date.now();
    if (now - lastUiSound < 65) return;
    lastUiSound = now;
    if (target.id === "rageDoll") play("pin");
    else if (target.matches("[data-plate]")) play("break");
    else if (target.id === "ragePunchTarget") play("punch");
    else if (target.matches("[data-cosmic-find], [data-cosmic-planet], #cosmicScanCreature")) play("discover");
    else play("click");
  }, true);

  document.addEventListener("tambayan:notification", () => play("notify"));
  document.addEventListener("tambayan:sound-success", () => play("success"));
  window.addEventListener("hashchange", syncWorld);
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