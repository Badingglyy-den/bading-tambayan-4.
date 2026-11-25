(() => {
  "use strict";

  const getClient = () => window.tambayanSupabaseClient || null;

  function setStatus(element, message, isError = false) {
    if (!element) return;
    element.textContent = message;
    element.style.color = isError ? "#ff9bba" : "";
  }

  function findValue(object, keys) {
    if (!object || typeof object !== "object") return undefined;

    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        return object[key];
      }
    }

    for (const value of Object.values(object)) {
      if (value && typeof value === "object") {
        const found = findValue(value, keys);
        if (found !== undefined) return found;
      }
    }

    return undefined;
  }

  function formatReward(data, gameName) {
    const status = findValue(data, ["status"]);
    if (status === "already_claimed") {
      return "You've already claimed today's " + gameName + ". Come back tomorrow! 💜";
    }

    const rewardType = findValue(data, ["reward_type", "type"]);
    const amount = findValue(data, ["amount"]);
    const tier = findValue(data, ["box_tier", "tier"]);
    const collectible = findValue(data, ["collectible_key", "collectible"]);

    if (rewardType === "xp") {
      return "🎉 You received " + (amount ?? "") + " XP!";
    }
    if (rewardType === "star") {
      return "⭐ You received " + (amount ?? "") + " star(s)!";
    }
    if (rewardType === "collectible") {
      return "🎁 You found a collectible" + (collectible ? "!" : "!") +
        (tier ? " (" + tier + " box)" : "");
    }

    if (tier) {
      return "🎉 You opened a " + tier + " Mystery Box! Your reward was recorded.";
    }

    return "🎉 Your " + gameName + " reward was recorded!";
  }

  async function claim(functionName, gameName, button, statusElement) {
    const client = getClient();

    if (!client || typeof client.rpc !== "function") {
      setStatus(statusElement, "The Lounge connection is still starting. Please try again in a moment.", true);
      return;
    }

    button.disabled = true;
    setStatus(statusElement, "✨ Checking your daily reward...");

    try {
      const { data, error } = await client.rpc(functionName);
      if (error) throw error;

      const result = Array.isArray(data) ? (data[0] ?? data) : data;
      setStatus(statusElement, formatReward(result, gameName));
    } catch (error) {
      console.error("Lounge reward error:", error);
      const message = String(error?.message || "");
      if (/already|duplicate|unique/i.test(message)) {
        setStatus(statusElement, "You've already claimed today's " + gameName + ". Come back tomorrow! 💜");
      } else {
        setStatus(statusElement, "We couldn't claim your reward right now. Please try again later.", true);
      }
    } finally {
      button.disabled = false;
    }
  }

  function setup() {
    const cards = Array.from(document.querySelectorAll(".tool-card"));
    const spinCard = cards.find(card => /spin\s*&\s*win/i.test(card.textContent));
    const boxCard = cards.find(card => /mystery\s*box/i.test(card.textContent));

    if (!spinCard && !boxCard) return;

    const host = spinCard || boxCard;
    let statusElement = document.getElementById("loungeGameStatus");

    if (!statusElement) {
      statusElement = document.createElement("p");
      statusElement.id = "loungeGameStatus";
      statusElement.className = "form-note";
      statusElement.setAttribute("role", "status");
      statusElement.setAttribute("aria-live", "polite");
      host.parentElement?.after(statusElement);
    }

    if (spinCard) {
      const button = spinCard.querySelector("button");
      if (button) {
        button.disabled = false;
        button.textContent = "🎡 Spin today";
        button.addEventListener("click", () => {
          claim("lounge_spin_and_win", "Spin & Win", button, statusElement);
        });
      }
    }

    if (boxCard) {
      const button = boxCard.querySelector("button");
      if (button) {
        button.disabled = false;
        button.textContent = "🎁 Open today's box";
        button.addEventListener("click", () => {
          claim("lounge_open_mystery_box", "Mystery Box", button, statusElement);
        });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
})();
      
