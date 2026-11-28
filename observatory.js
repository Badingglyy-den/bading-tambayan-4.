(() => {
  "use strict";

  const skies = {
    bloomtide: {
      season: "Bloomtide", icon: "🌸", prompt: "Look for the first bright point you notice after sunset. Give your eyes a moment to adjust before deciding what you can see.",
      lesson: "Your eyes need time to adapt to darkness. After about 20–30 minutes away from bright screens and lights, you may notice fainter stars.",
      featured: "lantern-fish"
    },
    suncrest: {
      season: "Suncrest", icon: "☀️", prompt: "Find a comfortable spot with a wide view of the sky. Notice how the colours change as daylight fades.",
      lesson: "The sky often looks red or orange near sunset because sunlight travels through more atmosphere, scattering shorter blue wavelengths away from your line of sight.",
      featured: "sun-kite"
    },
    leafwhisper: {
      season: "Leafwhisper", icon: "🍂", prompt: "Choose one bright star-like point and watch it for a little while. Does it seem steady, or does it shimmer?",
      lesson: "Stars can appear to twinkle because moving layers of air bend their light in changing ways. Planets usually twinkle less noticeably.",
      featured: "teacup"
    },
    frostveil: {
      season: "Frostveil", icon: "❄️", prompt: "On a clear evening, notice the darkest part of the sky you can safely see. Let your eyes adjust and look for a pattern.",
      lesson: "A constellation is a recognised pattern of stars as seen from Earth. The stars in a pattern can be very far apart from one another in space.",
      featured: "quiet-fox"
    }
  };

  const constellations = [
    { id:"lantern-fish", name:"The Lantern Fish", icon:"🐟", season:"Bloomtide", subtitle:"A guide through new beginnings", story:"A little fish carrying a light through the dark. In the Tambayanverse, it reminds us that even a small curiosity can lead somewhere lovely.", fact:"Its three brightest points form the lantern, while the curved trail suggests a tail." ,
      points:[[92,104],[145,72],[202,93],[250,135],[206,174],[148,159],[92,104],[70,139]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,7]] },
    { id:"sun-kite", name:"The Sunwoven Kite", icon:"🪁", season:"Suncrest", subtitle:"A bright little wanderer", story:"A kite caught in a warm current, always looking toward the next open horizon. It stands for play, courage, and trying something new.", fact:"The long crossing lines make a diamond shape, with a trailing point like a ribbon.",
      points:[[160,48],[235,112],[160,180],[85,112],[160,48],[160,180],[160,48],[160,225]], lines:[[0,1],[1,2],[2,3],[3,0],[0,2],[2,7]] },
    { id:"teacup", name:"The Falling Teacup", icon:"🍵", season:"Leafwhisper", subtitle:"A pause among golden leaves", story:"A little cup tipped toward the horizon, reminding sky-watchers that slowing down is also a way of moving forward.", fact:"The open bowl is outlined by four points; a short chain beneath it makes the handle.",
      points:[[91,86],[154,76],[219,91],[238,145],[175,159],[112,146],[91,86],[238,145],[260,184]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[3,7],[7,8]] },
    { id:"quiet-fox", name:"The Quiet Fox", icon:"🦊", season:"Frostveil", subtitle:"A companion for quiet nights", story:"A fox curled beneath a winter sky. It represents patience, careful listening, and finding warmth in quiet moments.", fact:"Two upper points form the ears, while the lower zigzag traces a curled tail.",
      points:[[105,91],[130,43],[157,88],[215,96],[245,146],[195,177],[145,151],[105,91],[72,171]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]] }
  ];

  const $ = id => document.getElementById(id);
  const section = $("observatory");
  if (!section) return;

  const seasonId = document.body.dataset.season || "bloomtide";
  const season = skies[seasonId] || skies.bloomtide;
  let selected = constellations.find(item => item.id === season.featured) || constellations[0];

  const title = $("observatorySeason");
  const prompt = $("observatoryPrompt");
  const lesson = $("observatoryLesson");
  const detailName = $("observatoryConstellationName");
  const detailStory = $("observatoryConstellationStory");
  const detailFact = $("observatoryConstellationFact");
  const map = $("observatorySkyMap");
  const choices = $("observatoryConstellationList");

  if (title) title.textContent = season.icon + " " + season.season + " sky";
  if (prompt) prompt.textContent = season.prompt;
  if (lesson) lesson.textContent = season.lesson;

  const svgNS = "http://www.w3.org/2000/svg";
  function svgElement(tag, attrs, parent) {
    const node = document.createElementNS(svgNS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (parent) parent.appendChild(node);
    return node;
  }

  function renderMap(item) {
    if (!map) return;
    map.replaceChildren();
    const svg = svgElement("svg", { viewBox:"0 0 320 250", role:"img", "aria-label":item.name + " constellation illustration" }, map);
    svgElement("text", { x:160, y:20, "text-anchor":"middle", class:"sky-caption" }, svg).textContent = item.name.toUpperCase();
    item.lines.forEach(([from,to]) => {
      const a=item.points[from], b=item.points[to];
      svgElement("line", { x1:a[0], y1:a[1], x2:b[0], y2:b[1], class:"sky-line" }, svg);
    });
    item.points.forEach((point,index) => {
      svgElement("circle", { cx:point[0], cy:point[1], r:index===0?4.5:3.2, class:index===0?"sky-star main":"sky-star" }, svg);
    });
    svgElement("text", { x:160, y:239, "text-anchor":"middle", class:"sky-small" }, svg).textContent = "A TAMBAYANVERSE STAR PATTERN";
  }

  function selectConstellation(item) {
    selected = item;
    if (detailName) detailName.textContent = item.icon + " " + item.name;
    if (detailStory) detailStory.textContent = item.story;
    if (detailFact) detailFact.textContent = item.fact;
    renderMap(item);
    if (choices) choices.querySelectorAll("button").forEach(button => {
      const active = button.dataset.constellation === item.id;
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  if (choices) {
    choices.replaceChildren();
    constellations.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "observatory-constellation-choice";
      button.dataset.constellation = item.id;
      button.setAttribute("aria-pressed", "false");
      const icon = document.createElement("span"); icon.textContent = item.icon;
      const name = document.createElement("strong"); name.textContent = item.name;
      const seasonLabel = document.createElement("small"); seasonLabel.textContent = item.season + " sky";
      button.append(icon,name,seasonLabel);
      button.addEventListener("click", () => selectConstellation(item));
      choices.appendChild(button);
    });
  }

  selectConstellation(selected);
})();
