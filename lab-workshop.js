(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const bridge = window.tambayanProgress;
  const readWorkshop = () => {
    try {
      if (bridge && typeof bridge.getLabWorkshop === "function") {
        return bridge.getLabWorkshop() || { creatures: [] };
      }
    } catch (error) {
      console.warn("Lab Workshop progress could not be read.", error);
    }
    return { creatures: [] };
  };
  const writeWorkshop = data => {
    try {
      if (bridge && typeof bridge.setLabWorkshop === "function") {
        bridge.setLabWorkshop(data);
        return true;
      }
    } catch (error) {
      console.warn("Lab Workshop progress could not be saved.", error);
    }
    return false;
  };

  let workshop = readWorkshop();
  if (!Array.isArray(workshop.creatures)) workshop.creatures = [];

  const creatureParts = [
    "creatureBody", "creatureFace", "creatureAccessory", "creaturePersonality"
  ];
  const getCreature = () => ({
    body: $("creatureBody").value,
    face: $("creatureFace").value,
    accessory: $("creatureAccessory").value,
    personality: $("creaturePersonality").value,
    name: $("creatureName").value.trim().slice(0, 22)
  });

  function updateCreaturePreview() {
    const creature = getCreature();
    $("creaturePreview").textContent =
      creature.body + " " + creature.face + (creature.accessory ? " " + creature.accessory : "");
    $("creatureSpecimenLabel").textContent =
      creature.name ? creature.name.toUpperCase() : "UNNAMED SPECIMEN";
  }

  function renderCreatures() {
    const shelf = $("creatureCollection");
    const count = $("creatureCount");
    if (!shelf || !count) return;
    const creatures = workshop.creatures.slice(0, 24);
    count.textContent = creatures.length + (creatures.length === 1 ? " saved" : " saved");
    shelf.replaceChildren();

    if (!creatures.length) {
      const empty = document.createElement("p");
      empty.className = "lab-empty";
      empty.textContent = "Nothing in the jars yet.";
      shelf.appendChild(empty);
      return;
    }

    creatures.forEach(creature => {
      const card = document.createElement("article");
      card.className = "specimen-card";
      const art = document.createElement("span");
      art.className = "specimen-art";
      art.textContent = [creature.body, creature.face, creature.accessory].filter(Boolean).join(" ");
      const details = document.createElement("span");
      details.className = "specimen-details";
      const name = document.createElement("strong");
      name.textContent = creature.name;
      const trait = document.createElement("small");
      trait.textContent = creature.personality;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "specimen-remove";
      remove.textContent = "Release";
      remove.setAttribute("aria-label", "Remove " + creature.name + " from specimen shelf");
      remove.dataset.releaseCreature = creature.id;
      details.append(name, trait);
      card.append(art, details, remove);
      shelf.appendChild(card);
    });
  }

  creatureParts.forEach(id => $(id).addEventListener("change", updateCreaturePreview));
  $("creatureName").addEventListener("input", updateCreaturePreview);
  $("saveCreature").addEventListener("click", () => {
    const creature = getCreature();
    if (!creature.name) {
      $("creatureStatus").textContent = "Give your specimen a name first. Even weird little creatures deserve one.";
      $("creatureName").focus();
      return;
    }
    if (workshop.creatures.length >= 24) {
      $("creatureStatus").textContent = "The shelf is full. Release one specimen before adding another.";
      return;
    }
    creature.id = "specimen_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6);
    creature.savedAt = new Date().toISOString();
    workshop.creatures.unshift(creature);
    workshop.creatures = workshop.creatures.slice(0, 24);
    const saved = writeWorkshop(workshop);
    renderCreatures();
    $("creatureStatus").textContent = saved
      ? creature.name + " has a place on your shelf. Look at that little menace."
      : "This session could not save your specimen. Please sign in again and retry.";
  });
  $("creatureCollection").addEventListener("click", event => {
    const button = event.target.closest("[data-release-creature]");
    if (!button) return;
    workshop.creatures = workshop.creatures.filter(item => item.id !== button.dataset.releaseCreature);
    writeWorkshop(workshop);
    renderCreatures();
    $("creatureStatus").textContent = "Specimen released. The jar is available again.";
  });

  const craftFields = ["craftTitle", "craftIcon", "craftPaper", "craftDecorationChoice"];
  function updateCraftPreview() {
    $("craftTitlePreview").textContent = $("craftTitle").value.trim() || "untitled little thing";
    $("craftIconPreview").textContent = $("craftIcon").value;
    $("craftPreview").dataset.paper = $("craftPaper").value;
    $("craftDecoration").textContent = $("craftDecorationChoice").value;
  }
  craftFields.forEach(id => $(id).addEventListener("input", updateCraftPreview));
  craftFields.slice(1).forEach(id => $(id).addEventListener("change", updateCraftPreview));

  const paperColors = {
    lilac: ["#e9ddf4", "#443451"], peach: ["#f6ddc9", "#583b32"],
    matcha: ["#e2ebd4", "#344633"], night: ["#29334b", "#f3e9ff"],
    pink: ["#f5d9e7", "#57374b"]
  };
  $("downloadCraft").addEventListener("click", () => {
    const title = $("craftTitle").value.trim() || "untitled little thing";
    const icon = $("craftIcon").value;
    const decoration = $("craftDecorationChoice").value;
    const colors = paperColors[$("craftPaper").value] || paperColors.lilac;
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1100;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      $("craftStatus").textContent = "This browser could not prepare the image. Try again in a moment.";
      return;
    }
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,.78)";
    ctx.lineWidth = 18;
    ctx.strokeRect(36, 36, 828, 1028);
    ctx.textAlign = "center";
    ctx.fillStyle = colors[1];
    ctx.font = "42px Georgia, serif";
    ctx.fillText(decoration, 450, 210);
    ctx.font = "150px serif";
    ctx.fillText(icon, 450, 520);
    ctx.font = "bold 66px Georgia, serif";
    const words = title.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach(word => {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > 730 && line) {
        lines.push(line);
        line = word;
      } else line = test;
    });
    if (line) lines.push(line);
    const shown = lines.slice(0, 3);
    shown.forEach((part, index) => ctx.fillText(part, 450, 680 + index * 78));
    ctx.font = "bold 22px monospace";
    ctx.letterSpacing = "5px";
    ctx.fillText("MADE IN THE LAB", 450, 950);
    canvas.toBlob(blob => {
      if (!blob) {
        $("craftStatus").textContent = "The design could not be exported. Please try again.";
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bading-tambayan-design.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      $("craftStatus").textContent = "Your little design is ready. Check your downloads.";
    }, "image/png");
  });

  const machineNames = {
    battery: "borrowed battery", sun: "pocket sunshine", hamster: "very busy hamster",
    scream: "one dramatic scream", wind: "tiny windmill",
    wheel: "three suspicious wheels", toaster: "retired toaster",
    umbrella: "upside-down umbrella", box: "cardboard box", fan: "overworked fan",
    balloons: "balloons", toast: "perfect toast", confetti: "confetti",
    soap: "soap bubbles", flowers: "tiny flowers"
  };
  function updateMachineIcons() {
    ["Power", "Body", "Output"].forEach(part => {
      const select = $("machine" + part);
      const option = select.options[select.selectedIndex];
      $("machine" + part.toLowerCase() + "Icon").textContent = option.dataset.icon;
    });
  }
  ["machinePower", "machineBody", "machineOutput"].forEach(id => $(id).addEventListener("change", updateMachineIcons));

  const outcomes = [
    "It works. Nobody knows why, including the machine.",
    "A surprisingly useful invention. Please do not ask for the blueprint.",
    "It made a noise like a tiny doorbell and then did its job.",
    "It technically works, but only when nobody is watching.",
    "A glorious failure. The workshop smells faintly of toast.",
    "It has developed a new purpose that was not in the instructions.",
    "It works once, dramatically, and refuses to repeat the performance.",
    "The invention is harmless. The paperwork is not."
  ];
  $("testMachine").addEventListener("click", () => {
    const power = $("machinePower").value;
    const body = $("machineBody").value;
    const output = $("machineOutput").value;
    const key = power + "-" + body + "-" + output;
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    const result = outcomes[hash % outcomes.length];
    $("machineResult").innerHTML = "";
    const label = document.createElement("span");
    label.className = "machine-result-label";
    label.textContent = "TEST RESULT / " + (hash % 2 ? "UNEXPECTED SUCCESS" : "QUESTIONABLE OUTCOME");
    const summary = document.createElement("p");
    summary.textContent = "Using " + machineNames[power] + ", a " + machineNames[body] + ", and " + output + ": " + result;
    $("machineResult").append(label, summary);
  });

  updateCreaturePreview();
  renderCreatures();
  updateCraftPreview();
  updateMachineIcons();
})();
