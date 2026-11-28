(() => {
  "use strict";
  const moments = {
    bloomtide: [
      ["Pochi", "🌱", "I spotted a tiny new leaf today. It reminded me that beginnings can be almost invisible."],
      ["Olli", "🌼", "A small thing you care for today might become something lovely later."],
      ["Momo", "📝", "The air feels full of first lines. You don't have to know the ending yet."],
      ["Sora", "🪁", "I left a little space in the day for an idea to land."],
      ["Yuki", "🌷", "What would you like to give a fresh start this season?"]
    ],
    suncrest: [
      ["Pippa", "☀️", "I borrowed a little sunshine for your next focused sprint. Use it gently."],
      ["Aki", "🍋", "Today's tiny challenge: do one thing that makes an ordinary day brighter."],
      ["Lumi", "✨", "Pick one priority that would make you feel lighter by tonight."],
      ["Tavi", "📚", "A bright day is good for learning one new thing, even if it's just a small one."],
      ["Bibi", "🧩", "Big plans can wait in the shade. Let's finish one small piece first."]
    ],
    leafwhisper: [
      ["Yuki", "🍂", "I found a quiet moment between the falling leaves. Maybe you can find one too."],
      ["Kiko", "📎", "Keep the memories that matter. You don't need to carry every little thing."],
      ["Remy", "🔎", "I noticed something today because I slowed down long enough to look."],
      ["Momo", "🍁", "Some thoughts need a little space before they're ready to become words."],
      ["Nubi", "☕", "Rest can be part of the plan, not a reward you have to earn."]
    ],
    frostveil: [
      ["Nubi", "❄️", "A quiet day is not an empty day. Be kind to your own pace."],
      ["Pochi", "🧣", "Even in the coldest stretch, a small routine can feel like a warm light."],
      ["Olli", "🌙", "Growth keeps happening under the surface. Trust the small steps."],
      ["Ruru", "🕯️", "A good question can be a little lantern on a quiet evening."],
      ["Sora", "🦊", "Leave room for wonder. Not every moment needs to become a task."]
    ]
  };
  const season = document.body.dataset.season || "bloomtide";
  const choices = moments[season] || moments.bloomtide;
  const utcDay = Math.floor(Date.now() / 86400000);
  const [speaker, icon, message] = choices[((utcDay % choices.length) + choices.length) % choices.length];
  const speakerNode = document.getElementById("seasonMomentSpeaker");
  const iconNode = document.getElementById("seasonMomentIcon");
  const textNode = document.getElementById("seasonMomentText");
  if (speakerNode) speakerNode.textContent = speaker.toUpperCase() + " LEFT A LITTLE NOTE";
  if (iconNode) iconNode.textContent = icon;
  if (textNode) textNode.textContent = message;
  document.documentElement.dataset.livingWorld = "ready";
})();