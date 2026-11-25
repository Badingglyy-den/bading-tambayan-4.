
/* Bading Tambayan 4.2 — Secret Hunt add-on
 * Four independent discoveries with individual hints and rewards.
 * Keep this file separate from lounge.js.
 */
(() => {
  "use strict";

  const DISCOVERIES = [
    {
      key: "purple star",
      name: "Purple Star",
      icon: "★",
      iconClass: "secret-hunt-purple-star",
      location: "Spin & Win",
      hints: [
        {
          text: "Sometimes, a little luck leads to an unexpected discovery.",
          location: "Where chance plays a part."
        },
        {
          text: "A little spin might bring you more than the reward you're expecting.",
          location: "Look among the games of chance."
        },
        {
          text: "Where you spin for a chance to win, something tiny and purple is waiting.",
          location: "Spin & Win."
        }
      ]
    },
    {
      key: "golden bell",
      name: "Golden Bell",
      icon: "🔔",
      iconClass: "secret-hunt-object-icon",
      location: "NPC of the Day",
      hints: [
        {
          text: "Some visitors bring a little extra sparkle with them.",
          location: "Keep an eye on the day's guest."
        },
        {
          text: "The surprise is close to someone who drops by for a daily hello.",
          location: "Find the featured character."
        },
        {
          text: "Today's visitor has a tiny bell waiting nearby.",
          location: "NPC of the Day."
        }
      ]
    },
    {
      key: "secret heart",
      name: "Secret Heart",
      icon: "💗",
      iconClass: "secret-hunt-object-icon",
      location: "Mood Garden",
      hints: [
        {
          text: "A feeling can leave a little trace, even without words.",
          location: "Look where moods are given a place to grow."
        },
        {
          text: "Somewhere, today's feeling can bloom into a flower.",
          location: "Find the garden for your mood."
        },
        {
          text: "Look beside the place where you plant a flower for today's mood.",
          location: "Mood Garden."
        }
      ]
    },
    {
      key: "tiny tambayan gem",
      name: "Tiny Tambayan Gem",
      icon: "💎",
      iconClass: "secret-hunt-object-icon",
      location: "Community Spaces",
      hints: [
        {
          text: "The best little treasures are sometimes found where people meet.",
          location: "Look around the shared corner."
        },
        {
          text: "Kind words and conversations leave room for something precious.",
          location: "Find the section that brings everyone together."
        },
        {
          text: "A tiny gem is tucked by the heading for our shared places.",
          location: "Community Spaces."
        }
      ]
    }
  ];

  const STYLE_ID = "secretHuntExtrasStyles";
  const HINTS_ID = "secretHuntExtraHints";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      .secret-hunt-hints {
        display: grid;
        gap: 12px;
        margin-top: 14px;
      }

      .secret-hunt-hints h4 {
        margin: 0 0 2px;
      }

      .secret-hunt-hint-group {
        display: grid;
        gap: 7px;
      }

      .secret-hunt-hint-group h5 {
        margin: 5px 0 0;
        font-size: .92em;
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
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 28px !important;
        min-width: 28px !important;
        max-width: 28px !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        flex: 0 0 28px !important;
        margin: 8px 0 0 auto !important;
        padding: 0 !important;
        border: 1px solid rgba(215, 165, 255, .3) !important;
        border-radius: 50% !important;
        background: rgba(155, 105, 220, .12) !important;
        color: inherit;
        font-size: 0 !important;
        line-height: 1 !important;
        cursor: pointer;
        opacity: .8;
        transition: opacity .2s, transform .2s;
      }

      .secret-hunt-treasure:hover {
        opacity: 1;
        transform: scale(1.08);
      }

      .secret-hunt-treasure:disabled {
        opacity: .5;
        cursor: wait;
      }

      .secret-hunt-purple-star {
        display: block;
        color: #bd8cff !important;
        font-size: 17px !important;
        line-height: 1 !important;
        text-shadow: 0 0 7px rgba(189, 140, 255, .8);
      }

      .secret-hunt-object-icon {
        display: block;
        font-size: 16px !important;
        line-height: 1 !important;
      }

      .secret-hunt-treasure-status {
        margin: 8px 0 0;
        line-height: 1.45;
      }

      .secret-hunt-community-anchor {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin: 0 0 10px;
      }

      .secret-hunt-community-anchor .secret-hunt-treasure {
        margin: 0 !important;
      }

      .secret-hunt-community-anchor .secret-hunt-treasure-status {
        width: 100%;
        text-align: right;
      }
    `;

    document.head.appendChild(style);
  }

  function findCard(title) {
    return Array.from(
      document.querySelectorAll(".tool-card, .hangout-card")
    ).find(card => {
      const heading = card.querySelector("h3");

      return heading &&
        heading.textContent.trim().toLowerCase() ===
          title.toLowerCase();
    }) || null;
  }

  function findCommunitySection() {
    return Array.from(
      document.querySelectorAll(".lounge-section")
    ).find(section => {
      const eyebrow = section.querySelector(".eyebrow");

      return eyebrow &&
        eyebrow.textContent.toLowerCase().includes("community spaces");
    }) || null;
  }

  function makeHints(card) {
    if (!card || card.querySelector("#" + HINTS_ID)) return;

    const huntBox = card.querySelector(".lounge-hunt-box");
    const host = huntBox || card;

    const panel = document.createElement("div");
    panel.id = HINTS_ID;
    panel.className = "secret-hunt-hints";
    panel.setAttribute("aria-label", "Secret Hunt discovery hints");

    const heading = document.createElement("h4");
    heading.textContent = "💡 Your Secret Hunt clues";
    panel.appendChild(heading);

    DISCOVERIES.forEach(discovery => {
      const group = document.createElement("div");
      group.className = "secret-hunt-hint-group";

      const groupHeading = document.createElement("h5");
      groupHeading.textContent =
        discovery.icon + " " + discovery.name;

      group.appendChild(groupHeading);

      discovery.hints.forEach((hint, index) => {
        const item = document.createElement("div");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "small-btn secret-hunt-hint-button";
        button.textContent = "Reveal hint " + (index + 1);
        button.setAttribute("aria-expanded", "false");

        const reveal = document.createElement("p");
        reveal.className = "secret-hunt-hint-reveal";
        reveal.hidden = true;
        reveal.textContent =
          hint.text + " 📍 " + hint.location;

        button.addEventListener("click", () => {
          const opening = reveal.hidden;
          reveal.hidden = !opening;

          button.setAttribute(
            "aria-expanded",
            String(opening)
          );

          button.textContent = opening
            ? "Hide hint " + (index + 1)
            : "Reveal hint " + (index + 1);
        });

        item.append(button, reveal);
        group.appendChild(item);
      });

      panel.appendChild(group);
    });

    host.appendChild(panel);
  }

  function removeOldAnswerForm(card) {
    if (!card) return;

    card.querySelectorAll(".lounge-hunt-form, form").forEach(form => {
      if (
        form.querySelector(".lounge-hunt-input") ||
        form.querySelector(
          'input[aria-label="Your Secret Hunt answer"]'
        )
      ) {
        form.remove();
      }
    });
  }

  function getResultObject(data) {
    if (Array.isArray(data)) return data[0] || {};

    return data && typeof data === "object"
      ? data
      : {};
  }

  function setStatus(element, message, isError) {
    element.textContent = message;
    element.style.color = isError ? "#ff9bba" : "";
  }

  function addTreasure(target, discovery, isCommunitySection) {
    if (!target) return;

    const buttonId =
      "secretHuntTreasure_" +
      discovery.key.replace(/[^a-z0-9]/g, "_");

    const statusId = buttonId + "Status";

    if (target.querySelector("#" + buttonId)) return;

    const button = document.createElement("button");
    button.type = "button";
    button.id = buttonId;
    button.className = "secret-hunt-treasure";
    button.setAttribute(
      "aria-label",
      "Discover the hidden " + discovery.name
    );

    const icon = document.createElement("span");
    icon.className = discovery.iconClass;
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = discovery.icon;

    button.appendChild(icon);
    button.title = "A tiny Secret Hunt discovery — tap to reveal";

    const status = document.createElement("p");
    status.id = statusId;
    status.className =
      "form-note secret-hunt-treasure-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    button.addEventListener("click", async () => {
      const client = window.tambayanSupabaseClient;

      if (!client || typeof client.rpc !== "function") {
        setStatus(
          status,
          "The Lounge connection is still starting. Please try again in a moment.",
          true
        );
        return;
      }

      button.disabled = true;

      setStatus(status, "✨ Checking your discovery...", false);

      try {
        const { data, error } = await client.rpc(
          "lounge_click_hunt_treasure",
          { p_object_key: discovery.key }
        );

        if (error) throw error;

        const result = getResultObject(data);

        const already =
          result.already_discovered === true ||
          result.status === "already_discovered" ||
          result.status === "already_claimed";

        if (already) {
          setStatus(
            status,
            "You've already discovered the " +
              discovery.name +
              "! Your discovery is safe and recorded. 💜",
            false
          );

          button.setAttribute(
            "aria-label",
            discovery.name + " already discovered"
          );

          return;
        }

        if (result.success === false) {
          setStatus(
            status,
            result.message ||
              "The " + discovery.name +
              " couldn't be discovered right now. Please try again later.",
            true
          );
          return;
        }

        const rewardType = result.reward_type;
        const rewardAmount = result.reward_amount;

        if (
          rewardType === "xp" ||
          rewardType === "star" ||
          rewardType === "stars"
        ) {
          if (
            typeof window.tambayanApplyLoungeReward !== "function"
          ) {
            throw new Error(
              "The local reward bridge is unavailable. Please refresh the page."
            );
          }

          const applied = window.tambayanApplyLoungeReward(
            rewardType,
            rewardAmount,
            "Secret Hunt — " + discovery.name
          );

          if (!applied) {
            throw new Error(
              "The Secret Hunt reward could not be added to your local profile."
            );
          }
        } else if (rewardType === "collectible") {
          if (
            typeof window.tambayanAddLoungeCollectible !== "function"
          ) {
            throw new Error(
              "The collectible inventory bridge is unavailable. Please refresh the page."
            );
          }

          const applied = window.tambayanAddLoungeCollectible(
            result.collectible_key,
            "Secret Hunt — " + discovery.name
          );

          if (!applied) {
            throw new Error(
              "The Secret Hunt collectible could not be added to your inventory."
            );
          }
        }

        let rewardMessage = "Your discovery has been recorded!";

        if (rewardType === "xp") {
          rewardMessage =
            "You found it! 🎉 You received " +
            rewardAmount + " XP!";
        } else if (
          rewardType === "star" ||
          rewardType === "stars"
        ) {
          rewardMessage =
            "You found it! ⭐ You received " +
            rewardAmount + " star(s)!";
        } else if (rewardType === "collectible") {
          rewardMessage =
            "You found it! 🎁 Your Rare Tambayan Gem has been added to your collection.";
        }

        setStatus(
          status,
          rewardMessage + " See you on the next hunt! 💜",
          false
        );

        button.setAttribute(
          "aria-label",
          discovery.name + " discovered"
        );

      } catch (error) {
        console.error(
          "Secret Hunt discovery error:",
          error
        );

        setStatus(
          status,
          "We couldn't record your discovery right now. Please check your connection and try again.",
          true
        );

      } finally {
        if (
          !/discovered/i.test(
            button.getAttribute("aria-label") || ""
          )
        ) {
          button.disabled = false;
        }
      }
    });

    if (isCommunitySection) {
      const anchor = document.createElement("div");
      anchor.className = "secret-hunt-community-anchor";
      anchor.append(button, status);

      const heading = target.querySelector("h3");

      if (heading) {
        heading.insertAdjacentElement("afterend", anchor);
      } else {
        target.appendChild(anchor);
      }
    } else {
      target.append(button, status);
    }
  }

  function enhance() {
    addStyles();

    const huntCard = findCard("Secret Hunt");
    const spinCard = findCard("Spin & Win");
    const moodCard = findCard("Mood Garden");
    const npcCard = findCard("NPC of the Day");
    const communitySection = findCommunitySection();

    if (huntCard) {
      removeOldAnswerForm(huntCard);
      makeHints(huntCard);
    }

    addTreasure(spinCard, DISCOVERIES[0], false);
    addTreasure(npcCard, DISCOVERIES[1], false);
    addTreasure(moodCard, DISCOVERIES[2], false);
    addTreasure(communitySection, DISCOVERIES[3], true);
  }

  function start() {
    enhance();

    const observer = new MutationObserver(() => {
      enhance();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }
})();
  
