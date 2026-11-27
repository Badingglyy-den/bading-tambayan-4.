(() => {
  "use strict";

  const NPCS = [
    {
      id: "lumi",
      name: "Lumi",
      emoji: "✨",
      title: "The Little Star Spirit",
      personality: "Shy, sweet, and curious",
      greeting: "Oh! You came back. I was hoping you would.",
      talk: [
        "I like watching the stars. They make the night feel less lonely.",
        "Sometimes I wish I could collect all the happy moments in the world.",
        "Do you think stars make wishes too?"
      ],
      ask: [
        "My favorite color? A soft lavender, like the sky just before sunset.",
        "A secret? I sometimes practice saying hello before meeting someone.",
        "I think everyone deserves a little sparkle in their day."
      ],
      goodbye: "Take care, okay? I'll be right here when you return. ✨"
    },
    {
      id: "bibi",
      name: "Bibi",
      emoji: "🐸",
      title: "The Chaotic Frog",
      personality: "Playful, nosy, and full of nonsense",
      greeting: "I have news. Actually, I have no news. But sit down.",
      talk: [
        "I saw someone talking to a plant earlier. Honestly? Same.",
        "Do you ever just want to disappear and reappear with snacks?",
        "Today's agenda: absolutely nothing. Very productive."
      ],
      ask: [
        "My favorite hobby is minding everyone's business. Respectfully.",
        "A secret? I once forgot why I entered a room. I was outside.",
        "I would win a staring contest against a fish. Probably."
      ],
      goodbye: "BYEEE! Don't forget to bring me imaginary snacks next time!"
    },
    {
      id: "momo",
      name: "Momo",
      emoji: "👻",
      title: "The Dramatic Ghost",
      personality: "Theatrical, emotional, and affectionate",
      greeting: "I have been waiting dramatically for you.",
      talk: [
        "The wind blew today. I took it personally.",
        "Sometimes I float around just to make an entrance.",
        "I deserve an award for being this mysterious."
      ],
      ask: [
        "My biggest fear? Being ignored during a dramatic monologue.",
        "A secret? I still get scared of my own reflection.",
        "I once haunted a refrigerator because I wanted a midnight snack."
      ],
      goodbye: "Farewell, my dearest visitor! Until our next dramatic encounter!"
    },
    {
      id: "pochi",
      name: "Pochi",
      emoji: "🐱",
      title: "The Sleepy Cat",
      personality: "Laid-back, sleepy, and unexpectedly wise",
      greeting: "My advice? Take a nap. Then take another.",
      talk: [
        "I found the sunniest spot in the whole Tambayanverse. It's mine.",
        "You look like you could use a little rest.",
        "I don't chase dreams. I sleep until they come to me."
      ],
      ask: [
        "My favorite food? Anything. I am not picky. Actually, I am.",
        "A secret? I pretend not to hear people when I'm comfortable.",
        "The secret to happiness is a warm blanket and zero responsibilities."
      ],
      goodbye: "Mrrp. Go have a good day. I shall return to my nap."
    },
    {
      id: "nubi",
      name: "Nubi",
      emoji: "☁️",
      title: "The Cheerful Cloud",
      personality: "Optimistic, gentle, and encouraging",
      greeting: "It's Friday! Even the clouds are celebrating!",
      talk: [
        "I hope something unexpectedly nice happens to you today.",
        "Even cloudy days have their own kind of beauty.",
        "I collect little moments that make people smile."
      ],
      ask: [
        "My favorite weather? The kind that makes everyone feel cozy.",
        "A secret? I sometimes make heart-shaped clouds for people.",
        "If I could give you anything, it would be a worry-free afternoon."
      ],
      goodbye: "Float gently through your day! Sending you a little sunshine!"
    },
    {
      id: "ruru",
      name: "Ruru",
      emoji: "🦝",
      title: "The Curious Collector",
      personality: "Observant, clever, and a little mischievous",
      greeting: "I found something interesting. Want to hear?",
      talk: [
        "Every little object has a story. I like finding them.",
        "I once spent an entire afternoon looking for a button.",
        "The best discoveries happen when you're not looking for them."
      ],
      ask: [
        "My collection? Shiny things, old notes, and forgotten treasures.",
        "A secret? I know where the best hiding spots are.",
        "I think curiosity is the best kind of adventure."
      ],
      goodbye: "Keep your eyes open! You never know what you'll discover."
    },
    {
      id: "yuki",
      name: "Yuki",
      emoji: "🌙",
      title: "The Moon Bunny",
      personality: "Gentle, thoughtful, and dreamy",
      greeting: "Before the new week begins, how was your heart this week?",
      talk: [
        "You don't have to have everything figured out tonight.",
        "I think quiet moments can be just as meaningful as loud ones.",
        "Rest is not wasted time. Even the moon has phases."
      ],
      ask: [
        "My favorite place? Somewhere peaceful, under the moonlight.",
        "A secret? I make little wishes for everyone I meet.",
        "I believe tomorrow deserves a chance, no matter how today went."
      ],
      goodbye: "Sleep peacefully, little wanderer. The moon will keep you company."
    },
    {
      id: "tavi", name: "Tavi", emoji: "📚", title: "The Study Buddy",
      personality: "Patient, curious, and quietly competitive",
      greeting: "Got a subject to tackle? Let's make it less intimidating.",
      talk: ["Small study sessions add up faster than you think.", "Try explaining a topic in your own words. That's how you find the gaps."],
      ask: ["My trick? I turn big chapters into tiny questions.", "I celebrate understanding one thing properly, not rushing ten things."],
      goodbye: "One page, one problem, one step. You've got this."
    },
    {
      id: "kiko", name: "Kiko", emoji: "🧺", title: "The Little Organizer",
      personality: "Neat, practical, and fond of clear spaces",
      greeting: "Let's give those scattered thoughts somewhere to go.",
      talk: ["A list is useful when it helps you decide what matters.", "You don't need to organize everything. Start with one corner."],
      ask: ["I sort things into now, later, and let go.", "My favorite tool is a tiny checklist."],
      goodbye: "A little order can make room for a lot of breathing space."
    },
    {
      id: "sora", name: "Sora", emoji: "🪁", title: "The Idea Architect",
      personality: "Inventive, imaginative, and encouraging",
      greeting: "Tell me the idea that's been floating around your head.",
      talk: ["An idea becomes real when you give it a first step.", "Messy drafts are allowed. They're how good plans begin."],
      ask: ["I start with what, why, and what happens next.", "Keep the first version small enough to actually finish."],
      goodbye: "Go make a little room for that idea to grow."
    },
    {
      id: "pippa", name: "Pippa", emoji: "⏳", title: "The Timekeeper",
      personality: "Cheerful, focused, and gently firm",
      greeting: "Ready for a little focus sprint? I'll keep an eye on the clock.",
      talk: ["Pick one task before you start the timer.", "A real break is part of a good work session."],
      ask: ["I like short sprints with a clear finish line.", "Put distractions somewhere out of reach for a while."],
      goodbye: "Time well spent is better than time perfectly planned."
    },
    {
      id: "remy", name: "Remy", emoji: "🧭", title: "The Curious Researcher",
      personality: "Inquisitive, thoughtful, and detail-loving",
      greeting: "What have you been curious about lately?",
      talk: ["Write down what you know before searching for what you don't.", "Good questions make learning easier."],
      ask: ["I keep a question, a few findings, and a source note.", "Curiosity is useful when you follow it somewhere."],
      goodbye: "Keep asking good questions. They open interesting doors."
    },
    {
      id: "olli", name: "Olli", emoji: "🌱", title: "The Goal Gardener",
      personality: "Steady, patient, and quietly determined",
      greeting: "What are we growing little by little?",
      talk: ["A goal needs a next action, not just a deadline.", "Progress is easier to see when you mark the small milestones."],
      ask: ["I water goals with consistency, not pressure.", "Try choosing one milestone you can reach this week."],
      goodbye: "Keep tending to it. Growth doesn't need to be loud."
    },
    {
      id: "aki", name: "Aki", emoji: "🎯", title: "The Challenge Maker",
      personality: "Energetic, resourceful, and playful",
      greeting: "Want a small challenge that leaves you with something done?",
      talk: ["A useful challenge should end with a real result.", "Make it small enough to finish today."],
      ask: ["I like challenges that teach a skill or clear a task.", "You can make progress without turning everything into a competition."],
      goodbye: "Go finish one tiny challenge. I'll be cheering."
    }
  ];
   window.tambayanNPCs = NPCS.map(npc => ({ id: npc.id, name: npc.name, emoji: npc.emoji, title: npc.title, personality: npc.personality }));

  const RARE_DIALOGUE = {
    lumi: [
      "A little secret? I saved a special sparkle just for you. ✨",
      "Sometimes, I make a wish that you'll have a wonderful day."
    ],
    bibi: [
      "Psst! You're my favorite person to bother today. 🐸",
      "I wasn't supposed to tell you this, but I hid snacks somewhere."
    ],
    momo: [
      "Wait... you can see me? I thought I was being mysterious.",
      "I'll tell you a secret, but you must gasp dramatically first!"
    ],
    pochi: [
      "Psst... I saved the warmest sleeping spot for you. 🐱",
      "You're one of the few people I'd wake up for. Don't tell anyone."
    ],
    nubi: [
      "I made a tiny heart-shaped cloud just for you. ☁️",
      "I hope you know that your presence makes this place brighter."
    ],
    ruru: [
      "I found a shiny little treasure. I was going to keep it, but I thought of you.",
      "You're officially on my list of trusted treasure hunters. 🦝"
    ],
    yuki: [
      "I made a little wish for you under the moonlight. 🌙",
      "Even on your quietest days, you are worth celebrating."
    ]
  };
  function getManilaDay() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila", year: "numeric", month: "numeric", day: "numeric"
    }).formatToParts(new Date());
    const part = key => Number(parts.find(item => item.type === key)?.value || 1);
    const year = part("year"), month = part("month"), day = part("day");
    const dayOfYear = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000);
    return dayOfYear % NPCS.length;
  }

  function addStyles() {
    if (document.getElementById("npcOfDayStyles")) return;

    const style = document.createElement("style");
    style.id = "npcOfDayStyles";

  style.textContent = `
  .npc-day-card {
    margin-top: 14px;
  }

  .npc-day-profile {
    padding: 20px 16px;
    border: 1px solid rgba(215, 165, 255, .55);
    border-radius: 20px;
    background: linear-gradient(
      145deg,
      rgba(174, 132, 230, .20),
      rgba(120, 95, 180, .10)
    );
    text-align: center;
    box-shadow: 0 8px 24px rgba(100, 65, 150, .12);
  }

  .npc-day-avatar {
    width: 100px;
    height: 100px;
    display: grid;
    place-items: center;
    margin: 0 auto 12px;
    border: 1px solid rgba(230, 200, 255, .65);
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(235, 210, 255, .35),
      rgba(160, 120, 210, .18)
    );
    box-shadow: 0 0 22px rgba(200, 155, 255, .22);
    font-size: 3.5rem;
  }

  .npc-day-name {
    margin: 6px 0;
    font-size: 1.5rem;
    font-weight: 800;
  }

  .npc-day-title {
    margin: 4px 0;
    font-weight: 600;
  }

  .npc-day-personality {
    margin: 6px 0 0;
    font-size: .9rem;
    opacity: .75;
  }

  .npc-day-dialogue {
    min-height: 76px;
    display: grid;
    place-items: center;
    margin: 14px 0;
    padding: 16px;
    border: 1px solid rgba(215, 165, 255, .22);
    border-radius: 16px;
    background: rgba(160, 120, 210, .10);
    line-height: 1.65;
    text-align: center;
  }

  .npc-day-choices {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .npc-day-choice {
    min-width: 0;
    padding: 11px 5px;
    border-radius: 12px;
    white-space: normal;
    line-height: 1.35;
  }

  .npc-day-note {
    margin-top: 12px;
    font-size: .8rem;
    opacity: .65;
    text-align: center;
  }
`;

    document.head.appendChild(style);
  }

  function setupNPC() {
    const cards = Array.from(
      document.querySelectorAll(".tool-card")
    );

    const card = cards.find(item => {
  const heading = item.querySelector("h3");
  return heading &&
    heading.textContent.trim().toLowerCase() === "npc of the day";
});

    if (!card || card.dataset.npcReady === "true") return;

    card.dataset.npcReady = "true";

    addStyles();

    const npc = NPCS[getManilaDay()];

const todayKey = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Manila"
}).format(new Date());

const visitKey = `tambayan_npc_visit_${todayKey}_${npc.id}`;

let isReturningVisitor = false;

try {
  isReturningVisitor = localStorage.getItem(visitKey) === "visited";
  localStorage.setItem(visitKey, "visited");
} catch (error) {
  console.warn("NPC visit tracking unavailable:", error);
}
    const oldButton = card.querySelector("button");
    const oldDescription = card.querySelector("p");

    if (oldDescription) {
      oldDescription.textContent =
        "A new Tambayanverse resident visits every day. Come say hello!";
    }

    const container = document.createElement("div");
    container.className = "npc-day-card";

    const profile = document.createElement("div");
    profile.className = "npc-day-profile";

    const avatar = document.createElement("div");
    avatar.className = "npc-day-avatar";
    avatar.textContent = npc.emoji;

    const name = document.createElement("h4");
    name.className = "npc-day-name";
    name.textContent = npc.name;

    const title = document.createElement("p");
    title.className = "npc-day-title";
    title.textContent = npc.title;

    const personality = document.createElement("p");
    personality.className = "npc-day-personality";
    personality.textContent = npc.personality;

    profile.append(avatar, name, title, personality);

    const dialogue = document.createElement("div");
    dialogue.className = "npc-day-dialogue";
    dialogue.setAttribute("role", "status");
    dialogue.setAttribute("aria-live", "polite");
    dialogue.textContent = isReturningVisitor
  ? `You're back! ${npc.name} is happy to see you again. 💜`
  : npc.greeting;

    const choices = document.createElement("div");
    choices.className = "npc-day-choices";

    const note = document.createElement("p");
    note.className = "npc-day-note";
    note.textContent = "Today's visitor · Come back tomorrow for someone new.";

    function showRandom(lines) {
  const rareLines = RARE_DIALOGUE[npc.id] || [];
  const isRare = Math.random() < 0.12;

  if (isRare && rareLines.length > 0) {
    const index = Math.floor(Math.random() * rareLines.length);
    dialogue.textContent = `🌟 Rare moment! ${rareLines[index]}`;
    return;
  }

  const index = Math.floor(Math.random() * lines.length);
  dialogue.textContent = lines[index];
}

    const actions = [
      {
        label: "💬 Talk",
        run: () => showRandom(npc.talk)
      },
      {
        label: "❔ Ask",
        run: () => showRandom(npc.ask)
      },
      {
        label: "👋 Goodbye",
        run: () => {
          dialogue.textContent = npc.goodbye;
        }
      }
    ];

    actions.forEach(action => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "small-btn npc-day-choice";
      button.textContent = action.label;
      button.addEventListener("click", action.run);
      choices.appendChild(button);
    });

    container.append(profile, dialogue, choices, note);

    if (oldButton) {
      oldButton.replaceWith(container);
    } else {
      card.appendChild(container);
    }
  }

  function start() {
    setupNPC();

    // Retry briefly in case the Lounge layout loads after this script.
    let attempts = 0;

    const observer = new MutationObserver(() => {
      setupNPC();

      attempts += 1;

      if (
        document.querySelector('.tool-card[data-npc-ready="true"]') ||
        attempts > 30
      ) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => observer.disconnect(), 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }
})();
