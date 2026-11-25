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
    }
  ];
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
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      weekday: "long"
    }).format(new Date());

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    return days.indexOf(weekday);
  }

  function addStyles() {
    if (document.getElementById("npcOfDayStyles")) return;

    const style = document.createElement("style");
    style.id = "npcOfDayStyles";

    style.textContent = `
      .npc-day-card {
        margin-top: 12px;
      }

      .npc-day-profile {
        padding: 16px;
        border: 1px solid rgba(215, 165, 255, .5);
        border-radius: 16px;
        background: rgba(160, 120, 210, .12);
        text-align: center;
      }

      .npc-day-avatar {
        width: 86px;
        height: 86px;
        display: grid;
        place-items: center;
        margin: 0 auto 10px;
        border-radius: 50%;
        background: rgba(215, 165, 255, .18);
        font-size: 3rem;
      }

      .npc-day-name {
        margin: 5px 0;
        font-size: 1.35rem;
      }

      .npc-day-title,
      .npc-day-personality {
        margin: 4px 0;
        opacity: .8;
      }

      .npc-day-dialogue {
        min-height: 75px;
        margin: 14px 0;
        padding: 14px;
        border-radius: 12px;
        background: rgba(255, 255, 255, .07);
        line-height: 1.55;
        text-align: center;
      }

      .npc-day-choices {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 7px;
      }

      .npc-day-choice {
        min-width: 0;
        padding: 10px 5px;
        white-space: normal;
        line-height: 1.35;
      }

      .npc-day-note {
        margin-top: 10px;
        font-size: .82rem;
        opacity: .7;
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
