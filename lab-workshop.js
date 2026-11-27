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
    "creatureBody", "creatureColor", "creatureFace", "creatureAccessory", "creaturePersonality"
  ];
  const bodyTypes = {
    "🐸": "frog", "🐱": "cat", "🐙": "octopus", "👾": "alien",
    "👻": "ghost", "🐲": "dragon", "🦇": "bat", "🪼": "jelly"
  };
  const bodyShapes = {
    frog: "M52 111 C52 72 80 49 120 49 C160 49 188 72 188 111 C188 151 164 181 120 181 C76 181 52 151 52 111Z",
    cat: "M54 91 L49 43 Q48 34 57 40 L88 64 Q120 48 152 64 L183 40 Q192 34 191 43 L186 91 C197 132 174 180 120 181 C66 180 43 132 54 91Z",
    octopus: "M62 105 C62 67 86 47 120 47 C154 47 178 67 178 105 C178 132 162 143 151 145 C165 159 181 153 183 169 C185 184 165 187 154 174 C144 193 128 194 120 177 C109 195 91 190 88 174 C73 187 55 180 59 165 C62 153 75 154 85 145 C72 138 62 125 62 105Z",
    alien: "M120 34 C165 34 190 67 185 112 C181 156 157 183 120 183 C83 183 59 156 55 112 C50 67 75 34 120 34Z",
    ghost: "M57 164 L57 101 C57 61 82 37 120 37 C158 37 183 61 183 101 L183 164 Q168 151 153 166 Q137 181 120 165 Q103 181 87 166 Q72 151 57 164Z",
    dragon: "M54 113 C54 75 83 49 120 49 C157 49 186 75 186 113 C186 153 159 181 120 181 C81 181 54 153 54 113Z",
    bat: "M55 98 C55 63 83 43 120 43 C157 43 185 63 185 98 C185 145 160 181 120 181 C80 181 55 145 55 98Z",
    jelly: "M48 119 C48 70 78 38 120 38 C162 38 192 70 192 119 C192 153 169 171 120 171 C71 171 48 153 48 119Z"
  };
  const bodyColors = {
    "🐸":"#9bcf83","🐱":"#e9a8bc","🐙":"#a9a0df","👾":"#a9a0df",
    "👻":"#d7d6c9","🐲":"#80c9c5","🦇":"#a8b4c9","🪼":"#80c9c5"
  };
  const safeColor = value => /^#[0-9a-f]{6}$/i.test(value || "") ? value : "#9bcf83";
  const getCreature = () => ({
    body: $("creatureBody").value,
    color: safeColor($("creatureColor").value),
    face: $("creatureFace").value,
    accessory: $("creatureAccessory").value,
    personality: $("creaturePersonality").value,
    name: $("creatureName").value.trim().slice(0, 22)
  });

  function creatureSVG(creature, extraClass = "") {
    const kind = bodyTypes[creature.body] || "frog";
    const fill = safeColor(creature.color || bodyColors[creature.body]);
    const face = creature.face || "👀";
    let appendages = "";
    if (kind === "frog") appendages = '<path d="M78 70 Q70 35 83 30 Q98 26 100 62 M140 62 Q142 26 157 30 Q170 35 162 70" fill="' + fill + '" stroke="#354735" stroke-width="5" stroke-linecap="round"/>';
    if (kind === "cat") appendages = '<path d="M58 85 L52 39 Q52 31 61 39 L94 67 M146 67 L179 39 Q188 31 188 39 L182 85" fill="' + fill + '" stroke="#354735" stroke-width="5" stroke-linejoin="round"/>';
    if (kind === "octopus") appendages = '<path d="M77 137 Q42 149 52 177 Q58 192 76 174 M96 151 Q75 181 93 194 M143 151 Q165 181 147 194 M162 137 Q198 149 188 177 Q182 192 164 174" fill="none" stroke="' + fill + '" stroke-width="15" stroke-linecap="round"/>';
    if (kind === "alien") appendages = '<path d="M96 53 Q83 20 67 29 M144 53 Q157 20 173 29" fill="none" stroke="#354735" stroke-width="5" stroke-linecap="round"/><circle cx="67" cy="29" r="7" fill="#f2d17a"/><circle cx="173" cy="29" r="7" fill="#f2d17a"/>';
    if (kind === "dragon") appendages = '<path d="M166 143 Q205 153 193 181 Q183 190 169 178 L184 176 L174 164" fill="' + fill + '" stroke="#354735" stroke-width="5" stroke-linejoin="round"/><path d="M77 61 L65 31 L99 51 M143 51 L175 31 L163 66" fill="#e6a56e" stroke="#354735" stroke-width="4" stroke-linejoin="round"/>';
    if (kind === "bat") appendages = '<path d="M67 105 Q32 68 20 91 Q42 96 31 126 Q49 117 57 143 L77 135 M173 105 Q208 68 220 91 Q198 96 209 126 Q191 117 183 143 L163 135" fill="' + fill + '" stroke="#354735" stroke-width="4" stroke-linejoin="round"/>';
    if (kind === "jelly") appendages = '<path d="M76 157 Q60 182 75 199 M101 164 Q91 189 105 204 M139 164 Q149 189 135 204 M164 157 Q180 182 165 199" fill="none" stroke="' + fill + '" stroke-width="11" stroke-linecap="round"/>';
    if (kind === "ghost") appendages = '<path d="M57 125 Q33 126 28 145 M183 125 Q207 126 212 145" fill="none" stroke="' + fill + '" stroke-width="14" stroke-linecap="round"/>';
    let eyes = '<ellipse cx="94" cy="105" rx="10" ry="14" fill="#28342e"/><ellipse cx="146" cy="105" rx="10" ry="14" fill="#28342e"/><circle cx="97" cy="100" r="3.5" fill="white"/><circle cx="149" cy="100" r="3.5" fill="white"/>';
    if (face === "😴") eyes = '<path d="M82 105 Q94 116 106 105 M134 105 Q146 116 158 105" fill="none" stroke="#28342e" stroke-width="6" stroke-linecap="round"/><text x="169" y="69" font-size="20" fill="#fff2b7">z</text>';
    if (face === "😈") eyes = '<path d="M82 96 L105 103 M135 103 L158 96" stroke="#28342e" stroke-width="7" stroke-linecap="round"/><circle cx="96" cy="109" r="5" fill="#28342e"/><circle cx="145" cy="109" r="5" fill="#28342e"/>';
    if (face === "🥹") eyes = '<ellipse cx="94" cy="104" rx="11" ry="15" fill="#28342e"/><ellipse cx="146" cy="104" rx="11" ry="15" fill="#28342e"/><circle cx="97" cy="99" r="4" fill="white"/><circle cx="149" cy="99" r="4" fill="white"/><path d="M79 126 Q72 139 83 142 M161 126 Q168 139 157 142" fill="#9bc9ef"/>';
    if (face === "🤨") eyes = '<ellipse cx="94" cy="108" rx="9" ry="12" fill="#28342e"/><ellipse cx="146" cy="108" rx="9" ry="12" fill="#28342e"/><path d="M80 86 L105 92 M135 92 L160 80" stroke="#354735" stroke-width="5" stroke-linecap="round"/>';
    if (face === "🤩") eyes = '<path d="M94 91 L98 101 L109 102 L100 109 L103 120 L94 113 L85 120 L88 109 L79 102 L90 101Z M146 91 L150 101 L161 102 L152 109 L155 120 L146 113 L137 120 L140 109 L131 102 L142 101Z" fill="#fff7cb"/>';
    let accessory = "";
    if (creature.accessory === "🎀") accessory = '<path d="M104 48 Q77 25 75 48 Q76 67 111 57 Q129 69 145 53 Q151 30 119 47Z" fill="#ef83ad" stroke="#75465a" stroke-width="4"/><circle cx="112" cy="53" r="7" fill="#ffd5e4"/>';
    if (creature.accessory === "👑") accessory = '<path d="M77 57 L69 23 L96 43 L120 13 L144 43 L171 23 L163 57Z" fill="#f3cc67" stroke="#795d2f" stroke-width="4" stroke-linejoin="round"/><path d="M79 56 H161" stroke="#795d2f" stroke-width="5"/>';
    if (creature.accessory === "🪴") accessory = '<path d="M120 52 Q91 30 92 12 Q119 11 120 52 Q126 18 151 17 Q154 39 120 52Z" fill="#7db77b" stroke="#3e6848" stroke-width="4"/>';
    if (creature.accessory === "🕶️") accessory = '<rect x="75" y="91" width="38" height="25" rx="8" fill="#303b4b" stroke="#e8e5d5" stroke-width="3"/><rect x="127" y="91" width="38" height="25" rx="8" fill="#303b4b" stroke="#e8e5d5" stroke-width="3"/><path d="M113 99 H127" stroke="#e8e5d5" stroke-width="4"/>';
    if (creature.accessory === "🧢") accessory = '<path d="M77 66 Q85 30 124 36 Q158 38 164 68 L177 77 Q129 91 73 76Z" fill="#7d91bd" stroke="#35435f" stroke-width="4"/>';
    if (creature.accessory === "✨") accessory = '<path d="M177 46 L183 62 L199 68 L183 74 L177 91 L171 74 L155 68 L171 62Z" fill="#f6d778"/>';
    if (creature.accessory === "🫧") accessory = '<circle cx="177" cy="54" r="12" fill="#bcebf0" fill-opacity=".75" stroke="#e8ffff" stroke-width="3"/><circle cx="190" cy="34" r="6" fill="#bcebf0" fill-opacity=".75" stroke="#e8ffff" stroke-width="2"/>';
    const mouth = face === "😈" ? '<path d="M104 133 Q120 145 136 133 L132 145 L108 145Z" fill="#7d4552"/>' : face === "😴" ? '<path d="M111 134 Q120 139 129 134" fill="none" stroke="#513c3d" stroke-width="4" stroke-linecap="round"/>' : '<path d="M108 132 Q120 148 132 132" fill="none" stroke="#513c3d" stroke-width="4" stroke-linecap="round"/>';
    const feet = kind === "octopus" || kind === "jelly" ? "" : '<path d="M91 169 Q79 190 63 181 M149 169 Q161 190 177 181" fill="none" stroke="#354735" stroke-width="10" stroke-linecap="round"/>';
    return '<svg class="assembled-creature ' + extraClass + '" viewBox="0 0 240 220" role="img" aria-label="Assembled ' + kind + ' creature" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse cx="120" cy="202" rx="69" ry="9" fill="#111b15" opacity=".24"/>' +
      appendages + feet +
      '<path d="' + bodyShapes[kind] + '" fill="' + fill + '" stroke="#354735" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M72 124 Q80 155 120 157 Q160 155 168 124" fill="none" stroke="#ffffff" stroke-opacity=".22" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="78" cy="128" rx="10" ry="6" fill="#ee8d9e" opacity=".6"/><ellipse cx="162" cy="128" rx="10" ry="6" fill="#ee8d9e" opacity=".6"/>' +
      eyes + mouth + accessory +
      '</svg>';
  }

  function updateCreaturePreview() {
    const creature = getCreature();
    $("creaturePreview").innerHTML = creatureSVG(creature);
    $("creatureSpecimenLabel").textContent =
      creature.name ? creature.name.toUpperCase() : "UNNAMED SPECIMEN";
  }

  function renderCreatures() {
    const shelf = $("creatureCollection");
    const count = $("creatureCount");
    if (!shelf || !count) return;
    const creatures = workshop.creatures.slice(0, 24);
    count.textContent = creatures.length + " saved";
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
      const art = document.createElement("div");
      art.className = "specimen-art";
      art.innerHTML = creatureSVG(creature, "specimen-creature");
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
      const iconId = { Power: "machinePowerIcon", Body: "machineBodyIcon", Output: "machineOutputIcon" }[part];
      $(iconId).textContent = option.dataset.icon;
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
