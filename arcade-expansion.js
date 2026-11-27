(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const reward = (reason) => {
    if (typeof window.tambayanApplyLoungeReward === "function") {
      window.tambayanApplyLoungeReward("xp", 8, reason || "Arcade puzzle solved!");
    }
  };
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const normalize = value => String(value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  // RIDDLE ROOM
  const riddles = [
    { q: "I have keys but no locks, space but no room. What am I?", a: ["keyboard", "a keyboard"] },
    { q: "The more you take, the more you leave behind. What are they?", a: ["footsteps", "steps"] },
    { q: "I speak without a mouth and hear without ears. What am I?", a: ["echo", "an echo"] },
    { q: "I get wetter the more I dry. What am I?", a: ["towel", "a towel"] },
    { q: "I have a face and two hands, but no arms or legs. What am I?", a: ["clock", "a clock"] },
    { q: "What has one eye but cannot see?", a: ["needle", "a needle"] },
    { q: "I can travel around the world while staying in one corner. What am I?", a: ["stamp", "a stamp"] },
    { q: "What belongs to you but other people use it more?", a: ["your name", "name"] },
    { q: "What has many teeth but cannot bite?", a: ["comb", "a comb"] },
    { q: "What goes up but never comes down?", a: ["age", "your age"] }
  ];
  let riddle = null, riddleSolved = false;
  function nextRiddle() { riddle = pick(riddles); riddleSolved = false; $("riddlePrompt").textContent = riddle.q; $("riddleInput").value = ""; $("riddleResult").textContent = "Think carefully. Hint: the answer is an everyday thing."; }
  $("riddleCheck").addEventListener("click", () => {
    if (riddleSolved) return;
    if (riddle.a.map(normalize).includes(normalize($("riddleInput").value))) { riddleSolved = true; $("riddleResult").textContent = "Correct! Your detective brain is awake. +8 XP"; reward("Riddle solved!"); }
    else $("riddleResult").textContent = "Not quite. Try another angle!";
  });
  $("riddleNext").addEventListener("click", nextRiddle); nextRiddle();

  // CODE BREAKER
  let code = "", codeAttempts = 0, codeSolved = false;
  function newCode() { code = String(Math.floor(100 + Math.random() * 900)); while (new Set(code).size !== 3) code = String(Math.floor(100 + Math.random() * 900)); codeAttempts = 0; codeSolved = false; $("codeInput").value = ""; $("codeResult").textContent = "6 attempts. Digits correct and in the right place are marked ✓; correct digits in the wrong place are marked •."; }
  $("codeCheck").addEventListener("click", () => {
    if (codeSolved || codeAttempts >= 6) return;
    const guess = $("codeInput").value.trim();
    if (!/^\d{3}$/.test(guess) || new Set(guess).size !== 3) { $("codeResult").textContent = "Enter three different digits."; return; }
    codeAttempts++;
    let exact = 0, near = 0;
    [...guess].forEach((digit, i) => { if (code[i] === digit) exact++; else if (code.includes(digit)) near++; });
    if (exact === 3) { codeSolved = true; $("codeResult").textContent = "CODE CRACKED! You found it in " + codeAttempts + " attempt(s). +8 XP"; reward("Code Breaker solved!"); }
    else { $("codeResult").textContent = "Attempt " + codeAttempts + "/6 · " + exact + " correct place ✓ · " + near + " right digit, wrong place •"; if (codeAttempts >= 6) $("codeResult").textContent += " · The code was " + code + ". Start a new code!"; }
  });
  $("codeNew").addEventListener("click", newCode); newCode();

  // SPOT THE DIFFERENCE
  const symbols = ["🌙", "⭐", "💜", "🦋", "🌷", "🍓", "🐸", "🪩"];
  let diffAnswer = 0, diffSolved = false;
  function nextDifference() {
    const row = Array.from({ length: 5 }, () => pick(symbols));
    diffAnswer = Math.floor(Math.random() * row.length);
    let changed = pick(symbols.filter(item => item !== row[diffAnswer]));
    const second = [...row]; second[diffAnswer] = changed; diffSolved = false;
    $("differencePuzzle").innerHTML = '<div class="difference-row"><b>A</b>' + row.map(x => '<span>' + x + '</span>').join("") + '</div><div class="difference-row"><b>B</b>' + second.map(x => '<span>' + x + '</span>').join("") + '</div>';
    $("differenceChoices").innerHTML = row.map((_, i) => '<button type="button" class="choice-btn" data-diff="' + (i + 1) + '">' + (i + 1) + '</button>').join("");
    $("differenceResult").textContent = "Which column changed between A and B?";
  }
  $("differenceChoices").addEventListener("click", e => { const b = e.target.closest("[data-diff]"); if (!b || diffSolved) return; if (Number(b.dataset.diff) === diffAnswer + 1) { diffSolved = true; $("differenceResult").textContent = "Sharp eyes! Difference found. +8 XP"; reward("Spot the Difference solved!"); } else $("differenceResult").textContent = "Not that column. Compare the rows again."; });
  $("differenceNext").addEventListener("click", nextDifference); nextDifference();

  // ODD ONE OUT
  const oddSets = [
    { q: "Which one is not a planet?", options: ["Mars", "Venus", "Moon", "Jupiter"], a: "Moon" },
    { q: "Which one is not a primary color of light?", options: ["Red", "Green", "Blue", "Yellow"], a: "Yellow" },
    { q: "Which one is not a mammal?", options: ["Dolphin", "Bat", "Penguin", "Whale"], a: "Penguin" },
    { q: "Which one is not a musical instrument?", options: ["Violin", "Flute", "Cello", "Canvas"], a: "Canvas" },
    { q: "Which one is not a shape?", options: ["Triangle", "Circle", "Square", "Velvet"], a: "Velvet" },
    { q: "Which one is not a season?", options: ["Spring", "Summer", "Autumn", "Midnight"], a: "Midnight" },
    { q: "Which one is not a web browser?", options: ["Firefox", "Chrome", "Safari", "Bluetooth"], a: "Bluetooth" },
    { q: "Which one is not a type of weather?", options: ["Rain", "Snow", "Fog", "Granite"], a: "Granite" }
  ];
  let odd = null, oddSolved = false;
  function nextOdd() { odd = pick(oddSets); oddSolved = false; $("oddQuestion").textContent = odd.q; $("oddChoices").innerHTML = odd.options.map(x => '<button type="button" class="choice-btn" data-odd="' + x + '">' + x + '</button>').join(""); $("oddResult").textContent = "Choose the one that doesn't belong."; }
  $("oddChoices").addEventListener("click", e => { const b = e.target.closest("[data-odd]"); if (!b || oddSolved) return; if (b.dataset.odd === odd.a) { oddSolved = true; $("oddResult").textContent = "Exactly! You spotted the outsider. +8 XP"; reward("Odd One Out solved!"); } else $("oddResult").textContent = "Not quite. Think about the category."; });
  $("oddNext").addEventListener("click", nextOdd); nextOdd();

  // PATTERN PANIC
  const patterns = [
    { q: "2 · 4 · 8 · 16 · ?", o: ["18", "24", "32", "36"], a: "32" },
    { q: "1 · 1 · 2 · 3 · 5 · ?", o: ["6", "7", "8", "10"], a: "8" },
    { q: "3 · 6 · 9 · 12 · ?", o: ["14", "15", "16", "18"], a: "15" },
    { q: "A · C · E · G · ?", o: ["H", "I", "J", "K"], a: "I" },
    { q: "20 · 18 · 15 · 11 · ?", o: ["8", "7", "6", "5"], a: "6" },
    { q: "1 · 4 · 9 · 16 · ?", o: ["20", "24", "25", "36"], a: "25" },
    { q: "2 · 3 · 5 · 8 · 12 · ?", o: ["15", "16", "17", "18"], a: "17" },
    { q: "Z · X · V · T · ?", o: ["S", "R", "Q", "P"], a: "R" }
  ];
  let pattern = null, patternSolved = false;
  function nextPattern() { pattern = pick(patterns); patternSolved = false; $("patternQuestion").textContent = pattern.q; $("patternChoices").innerHTML = pattern.o.map(x => '<button type="button" class="choice-btn" data-pattern="' + x + '">' + x + '</button>').join(""); $("patternResult").textContent = "Find the rule, then choose the next item."; }
  $("patternChoices").addEventListener("click", e => { const b = e.target.closest("[data-pattern]"); if (!b || patternSolved) return; if (b.dataset.pattern === pattern.a) { patternSolved = true; $("patternResult").textContent = "Pattern mastered! +8 XP"; reward("Pattern Panic solved!"); } else $("patternResult").textContent = "Try again. Look at how the sequence changes."; });
  $("patternNext").addEventListener("click", nextPattern); nextPattern();

  // EMOJI DETECTIVE
  const cases = [
    { story: "The cupcake vanished. The kitchen log says: the baker was decorating, the cat was asleep, and the guard was outside. Who had the chance to take it?", o: ["The baker", "The cat", "The guard"], a: "The baker" },
    { story: "A window was found open. The floor is dry, but a wet umbrella is beside the door. What most likely happened?", o: ["Someone came in from rain", "A pipe burst", "The room flooded"], a: "Someone came in from rain" },
    { story: "Three friends were questioned. Ana says she was reading. Bea says she saw the lights go out. Cy says the power never went out. The room is pitch black. Who is contradicting the evidence?", o: ["Ana", "Bea", "Cy"], a: "Cy" },
    { story: "The library book is missing. The librarian saw muddy footprints leading from the shelf to the garden, but none coming back. Where should the search begin?", o: ["The garden", "The roof", "The kitchen"], a: "The garden" },
    { story: "A snowman melted overnight. The door was locked, the heater was on, and the window was closed. What caused it?", o: ["The heater", "A visitor", "Moonlight"], a: "The heater" }
  ];
  let currentCase = null, caseSolved = false;
  function nextCase() { currentCase = pick(cases); caseSolved = false; $("detectiveStory").textContent = currentCase.story; $("detectiveChoices").innerHTML = currentCase.o.map(x => '<button type="button" class="choice-btn" data-case="' + x + '">' + x + '</button>').join(""); $("detectiveResult").textContent = "Study the evidence before accusing anyone."; }
  $("detectiveChoices").addEventListener("click", e => { const b = e.target.closest("[data-case]"); if (!b || caseSolved) return; if (b.dataset.case === currentCase.a) { caseSolved = true; $("detectiveResult").textContent = "Case closed! Excellent detective work. +8 XP"; reward("Emoji Detective case solved!"); } else $("detectiveResult").textContent = "That theory doesn't fit all the clues. Reconsider."; });
  $("detectiveNext").addEventListener("click", nextCase); nextCase();
})();
