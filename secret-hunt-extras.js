/* Bading Tambayan 4.2 — Secret Hunt add-on
 * Keep this file separate from lounge.js.
 * The answer is never stored or sent by this frontend.
 */
(() => {
  "use strict";

  const HINTS = [
    {
      text: "I belong to the color family of lavender.",
      location: "Community Garden · Mood Garden"
    },
    {
      text: "I have five points, but I'm not a flower.",
      location: "NPC of the Day card"
    },
    {
      text: "Look where your Tambayan adventures begin.",
      location: "Community Spaces section"
    }
  ];

  const STYLE_ID = "secretHuntExtrasStyles";
  const HINTS_ID = "secretHuntExtraHints";
  const TREASURE_ID = "secretHuntPurpleStar";
  const STATUS_ID = "secretHuntTreasureStatus";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .secret-hunt-hints {
        display: grid;
        gap: 8px;
        margin-top: 14px;
      }
      .secret-hunt-hints h4 {
        margin: 0 0 2px;
      }
      .secret-hunt-hint-button {
        width: 100%;
        text-align: left;
        white-space: normal;
        line-height: 1.4;
      }
      .secret-hunt-hint-reveal {
        margin: 6px 0 2px;
        padding: 9px 11px;
        border-radius: 10px;
        background: rgba(160, 120, 210, .13);
        line-height: 1.45;
      }
      .secret-hunt-treasure {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        width: 100%;
        margin-top: 12px;
        padding: 13px;
        border: 1px solid rgba(215, 165, 255, .65);
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(155, 105, 220, .24), rgba(215, 165, 255, .13));
        color: inherit;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }
      .secret-hunt-treasure:disabled {
        opacity: .65;
        cursor: wait;
      }
      .secret-hunt-purple-star {
        font-size: 2rem;
        line-height: 1;
        filter: drop-shadow(0 0 8px rgba(190, 130, 255, .8));
      }
      .secret-hunt-treasure-status {
        margin: 8px 0 0;
        line-height: 1.45;
      }
    `;
    document.head.appendChild(style);
  }

  function findCard(title) {
    return Array.from(document.querySelectorAll(".tool-card, .hangout-card"))
      .find(card => {
        const heading = card.querySelector("h3");
        return heading && heading.textContent.trim().toLowerCase() === title.toLowerCase();
      }) || null;
  }

  function makeHints(card) {
    if (!card || card.querySelector("#" + HINTS_ID)) return;

    const huntBox = card.querySelector(".lounge-hunt-box");
    const host = huntBox || card;
    const panel = document.createElement("div");
    panel.id = HINTS_ID;
    panel.className = "secret-hunt-hints";
    panel.setAttribute("aria-label", "Secret Hunt hints");

    const heading = document.createElement("h4");
    heading.textContent = "💡 Need a little hint?";
    panel.appendChild(heading);

    HINTS.forEach((hint, index) => {
      const item = document.createElement("div");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "small-btn secret-hunt-hint-button";
      button.textContent = "Reveal hint " + (index + 1);
      button.setAttribute("aria-expanded", "false");

      const reveal = document.createElement("p");
      reveal.className = "secret-hunt-hint-reveal";
      reveal.hidden = true;
      reveal.textContent = hint.text + " 📍 " + hint.location;

      button.addEventListener("click", () => {
        const opening = reveal.hidden;
        reveal.hidden = !opening;
        button.setAttribute("aria-expanded", String(opening));
        button.textContent = opening
          ? "Hide hint " + (index + 1)
          : "Reveal hint " + (index + 1);
      });

      item.append(button, reveal);
      panel.appendChild(item);
    });

    host.appendChild(panel);
  }

  function removeOldAnswerForm(card) {
    if (!card) return;
    card.querySelectorAll(".lounge-hunt-form, form").forEach(form => {
      // Only remove the legacy answer form, never unrelated forms.
      if (form.querySelector(".lounge-hunt-input") ||
          form.querySelector('input[aria-label="Your Secret Hunt answer"]')) {
        form.remove();
      }
    });
  }

  function getResultObject(data) {
    if (Array.isArray(data)) return data[0] || {};
    return data && typeof data === "object" ? data : {};
  }

  function setTreasureStatus(element, message, isError) {
    element.textContent = message;
    element.style.color = isError ? "#ff9bba" : "";
  }

  function addTreasure(spinCard) {
    if (!spinCard || spinCard.querySelector("#" + TREASURE_ID)) return;

    const button = document.createElement("button");
    button.type = "button";
    button.id = TREASURE_ID;
    button.className = "secret-hunt-treasure";
    button.innerHTML =
      '<span class="secret-hunt-purple-star" aria-hidden="true">💜⭐</span>' +
      '<span>Tap the hidden Purple Star</span>';
    button.setAttribute("aria-label", "Discover the hidden Purple Star");

    const status = document.createElement("p");
    status.id = STATUS_ID;
    status.className = "form-note secret-hunt-treasure-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    button.addEventListener("click", async () => {
      const client = window.tambayanSupabaseClient;

      if (!client || typeof client.rpc !== "function") {
        setTreasureStatus(
          status,
          "The Lounge connection is still starting. Please try again in a moment.",
          true
        );
        return;
      }

      button.disabled = true;
      setTreasureStatus(status, "✨ Checking your discovery...", false);

      try {
        // The secure database wrapper retrieves the answer server-side.
        const { data, error } = await client.rpc("lounge_click_hunt_treasure");
        if (error) throw error;

        const result = getResultObject(data);
        const already =
          result.already_discovered === true ||
          result.status === "already_discovered" ||
          result.status === "already_claimed";

        if (already) {
          setTreasureStatus(
            status,
            "You've already discovered today's Purple Star! Your discovery is safe and recorded. 💜",
            false
          );
          button.textContent = "💜 Purple Star already discovered";
          return;
        }

        if (result.success === false) {
          setTreasureStatus(
            status,
            result.message || "The Purple Star couldn't be discovered right now. Please try again later.",
            true
          );
          return;
        }

        const rewardType = result.reward_type;
        const rewardAmount = result.reward_amount;
        let rewardMessage = "Your discovery has been recorded!";

        if (rewardType === "xp") {
          rewardMessage = "You found it! 🎉 You received " +
            (rewardAmount ?? 10) + " XP!";
        } else if (rewardType === "star") {
          rewardMessage = "You found it! ⭐ You received " +
            (rewardAmount ?? "") + " star(s)!";
        } else if (rewardType === "collectible") {
          rewardMessage = "You found it! 🎁 Your collectible reward has been recorded.";
        }

        setTreasureStatus(status, rewardMessage + " See you on the next hunt! 💜", false);
        button.textContent = "💜 Purple Star discovered!";
      } catch (error) {
        console.error("Secret Hunt treasure click error:", error);
        setTreasureStatus(
          status,
          "We couldn't record your discovery right now. Please check your connection and try again.",
          true
        );
      } finally {
        // Keep a successfully discovered button disabled; allow retries after errors.
        if (!/discovered/i.test(button.textContent)) {
          button.disabled = false;
        }
      }
    });

    spinCard.append(button, status);
  }

  function enhance() {
    addStyles();

    const huntCard = findCard("Secret Hunt");
    const spinCard = findCard("Spin & Win");

    if (huntCard) {
      removeOldAnswerForm(huntCard);
      makeHints(huntCard);
    }

    if (spinCard) addTreasure(spinCard);
  }

  function start() {
    enhance();

    // lounge.js builds the Secret Hunt contents asynchronously.
    const observer = new MutationObserver(() => {
      enhance();
      const huntReady = !!document.querySelector("#" + HINTS_ID);
      const treasureReady = !!document.querySelector("#" + TREASURE_ID);
      if (huntReady && treasureReady) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const huntReady = !!document.querySelector("#" + HINTS_ID);
    const treasureReady = !!document.querySelector("#" + TREASURE_ID);
    if (huntReady && treasureReady) observer.disconnect();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
      
