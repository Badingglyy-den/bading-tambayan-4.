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

  function normalizeResult(data) {
    return Array.isArray(data) ? (data[0] ?? data) : data;
  }

  // Wait until Supabase has finished creating or restoring the anonymous session.
  async function waitForClient(maxAttempts = 40) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const client = getClient();

      if (
        client &&
        typeof client.rpc === "function" &&
        typeof client.from === "function" &&
        client.auth &&
        typeof client.auth.getSession === "function"
      ) {
        try {
          const { data, error } = await client.auth.getSession();

          if (!error && data?.session?.user?.id) {
            return client;
          }
        } catch (error) {
          console.warn("Waiting for Lounge authentication:", error);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 250));
    }

    return null;
  }

  function formatReward(data, gameName) {
    const status = findValue(data, ["status"]);
    if (status === "already_claimed") {
      return "You've already claimed today's " + gameName + ". Come back tomorrow! 💜";
    }

    const rewardType = findValue(data, ["reward_type", "type"]);
    const amount = findValue(data, ["amount"]);
    const tier = findValue(data, ["box_tier", "tier"]);

    if (rewardType === "xp") {
      return "🎉 You received " + (amount ?? "") + " XP!";
    }
    if (rewardType === "star") {
      return "⭐ You received " + (amount ?? "") + " star(s)!";
    }
    if (rewardType === "collectible") {
      return "🎁 You found a collectible!" +
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

      const result = normalizeResult(data);
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

  function addText(parent, tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    parent.appendChild(element);
    return element;
  }

  function getPollOptionText(option) {
    return findValue(option, ["option_text", "option_label", "text", "label", "title"]) || "Option";
  }

  function getPollOptionId(option) {
    return findValue(option, ["id", "option_id"]);
  }

  function getPollResultsCard(card) {
    let panel = card.querySelector("#loungePollResults");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "loungePollResults";
      panel.className = "lounge-poll-results";
      panel.setAttribute("aria-live", "polite");
      card.appendChild(panel);
    }
    return panel;
  }

  async function loadPoll(card) {
    const client = getClient();
    const button = card.querySelector("button");
    if (!client || !client.from || !client.rpc) {
      if (button) {
        button.disabled = true;
        button.textContent = "Poll connection unavailable";
      }
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = "Loading today's poll...";
    }

    try {
      const { data: poll, error: pollError } = await client
        .from("lounge_daily_polls")
        .select("*")
        .eq("status", "published")
        .order("poll_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pollError) throw pollError;

      if (!poll) {
        if (button) button.textContent = "No poll published yet";
        addText(card, "p", "A new community poll will appear here when one is published. 💜", "form-note");
        return;
      }

      const pollId = findValue(poll, ["id", "poll_id"]);
      const question = findValue(poll, ["question", "poll_question", "title"]) || "Today's community question";

      const { data: options, error: optionsError } = await client
        .from("lounge_poll_options")
        .select("*")
        .eq("poll_id", pollId);

      if (optionsError) throw optionsError;
      if (!Array.isArray(options) || options.length < 2) {
        if (button) button.textContent = "Poll is being prepared";
        addText(card, "p", "This poll's choices are still being prepared.", "form-note");
        return;
      }

      const oldDescription = card.querySelector("p");
      if (oldDescription) oldDescription.textContent = question;

      const choices = document.createElement("div");
      choices.className = "lounge-poll-choices";
      choices.setAttribute("role", "group");
      choices.setAttribute("aria-label", "Poll answer choices");
      card.appendChild(choices);

      const status = addText(card, "p", "", "form-note");
      status.id = "loungePollStatus";

      const resultsPanel = getPollResultsCard(card);

      async function refreshResults() {
        const { data, error } = await client.rpc("lounge_get_poll_results", {
          p_poll_id: pollId
        });
        if (error) throw error;

        const rows = Array.isArray(data) ? data : (data ? [data] : []);
        resultsPanel.replaceChildren();
        addText(resultsPanel, "h4", "Live results");
        let total = 0;

        rows.forEach(row => {
          const count = Number(findValue(row, ["vote_count", "votes", "count"]) || 0);
          total += count;
        });

        rows.forEach(row => {
          const label = findValue(row, ["option_text", "option_label", "text", "label"]) || "Option";
          const count = Number(findValue(row, ["vote_count", "votes", "count"]) || 0);
          const rawPercent = findValue(row, ["percentage", "percent"]);
          const percent = rawPercent === undefined
            ? (total ? Math.round((count / total) * 100) : 0)
            : Math.round(Number(rawPercent));
          const line = document.createElement("p");
          line.className = "lounge-poll-result-line";
          line.textContent = label + " — " + percent + "% (" + count + ")";
          resultsPanel.appendChild(line);
        });

        addText(resultsPanel, "p", "Total votes: " + total, "form-note");
      }

      options.forEach(option => {
        const optionId = getPollOptionId(option);
        const choice = document.createElement("button");
        choice.type = "button";
        choice.className = "small-btn lounge-poll-option";
        choice.textContent = getPollOptionText(option);
        choice.disabled = !optionId;
        choice.addEventListener("click", async () => {
          choices.querySelectorAll("button").forEach(item => item.disabled = true);
          setStatus(status, "Submitting your vote...");
          try {
            const { data, error } = await client.rpc("lounge_submit_poll_vote", {
              p_poll_id: pollId,
              p_option_id: optionId
            });
            if (error) throw error;

            const voteStatus = findValue(data, ["status"]);
            if (voteStatus === "already_voted") {
              setStatus(status, "You've already voted in this poll. Here are the results. 💜");
            } else {
              setStatus(status, "Your vote has been counted! Thank you for joining in. 💜");
            }
            await refreshResults();
          } catch (error) {
            console.error("Daily Poll vote error:", error);
            setStatus(status, "We couldn't submit your vote. Please try again later.", true);
            choices.querySelectorAll("button").forEach(item => item.disabled = false);
          }
        });
        choices.appendChild(choice);
      });

      if (button) button.remove();
      await refreshResults();
    } catch (error) {
      console.error("Daily Poll load error:", error);
      if (button) {
        button.disabled = true;
        button.textContent = "Poll temporarily unavailable";
      }
      addText(card, "p", "We couldn't load the poll right now. Please try again later.", "form-note");
    }
  }

  const MOODS = [
    { key: "happy", flower: "🌻", name: "Sunflower" },
    { key: "loved", flower: "🌹", name: "Pink Rose" },
    { key: "peaceful", flower: "🪻", name: "Lavender" },
    { key: "sad", flower: "🔵", name: "Bluebell" },
    { key: "exhausted", flower: "🌼", name: "Daisy" },
    { key: "motivated", flower: "🌷", name: "Tulip" }
  ];

  function addMoodStyles() {
    if (document.getElementById("loungeMoodStyles")) return;

    const style = document.createElement("style");
    style.id = "loungeMoodStyles";
    style.textContent = `
      .lounge-mood-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin: 12px 0;
      }
      .lounge-mood-choice {
        min-width: 0;
        white-space: normal;
        line-height: 1.35;
      }
      .lounge-mood-choice[aria-pressed="true"] {
        outline: 2px solid #d7a5ff;
        background: rgba(180, 120, 230, .2);
      }
      .lounge-mood-section {
        margin-top: 14px;
      }
      .lounge-mood-section h4 {
        margin: 8px 0;
      }
      .lounge-mood-counts {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
      }
      .lounge-mood-count {
        margin: 0;
        padding: 7px 9px;
        border-radius: 10px;
        background: rgba(160, 120, 210, .1);
        font-size: .9rem;
      }
      .lounge-mood-indicator {
        margin: 12px 0;
        padding: 12px 14px;
        border: 1px solid rgba(215, 165, 255, .55);
        border-radius: 14px;
        background: rgba(180, 120, 230, .16);
      }
      .lounge-mood-indicator-label {
        display: block;
        margin-bottom: 4px;
        font-size: .78rem;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
        opacity: .85;
      }
      .lounge-mood-indicator-value {
        font-size: 1rem;
        font-weight: 700;
      }
      @media (min-width: 520px) {
        .lounge-mood-options,
        .lounge-mood-counts {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getMoodCount(rows, moodKey) {
    if (!Array.isArray(rows)) return 0;
    const row = rows.find(item => findValue(item, ["mood"]) === moodKey);
    return row ? Number(findValue(row, ["total_count", "count"]) || 0) : 0;
  }

  function renderMoodCounts(container, rows) {
    container.replaceChildren();
    MOODS.forEach(mood => {
      const count = getMoodCount(rows, mood.key);
      addText(
        container,
        "p",
        mood.flower + " " + mood.name + ": " + count,
        "lounge-mood-count"
      );
    });
  }

  async function loadMoodGarden(card) {
    addMoodStyles();

    const originalButton = card.querySelector("button");
    if (originalButton) {
      originalButton.disabled = true;
      originalButton.textContent = "Loading today's garden...";
    }

    const description = card.querySelector("p");
    const garden = document.createElement("div");
    garden.className = "lounge-mood-garden";
    garden.setAttribute("aria-live", "polite");
    if (description) {
      description.insertAdjacentElement("afterend", garden);
    } else {
      card.appendChild(garden);
    }

    const status = addText(garden, "p", "Connecting to the Mood Garden...", "form-note");

    const moodIndicator = document.createElement("div");
    moodIndicator.className = "lounge-mood-indicator";
    moodIndicator.hidden = true;
    addText(
      moodIndicator,
      "span",
      "Today's Mood",
      "lounge-mood-indicator-label"
    );
    const moodIndicatorValue = addText(
      moodIndicator,
      "span",
      "",
      "lounge-mood-indicator-value"
    );
    garden.appendChild(moodIndicator);

    const choices = document.createElement("div");
    choices.className = "lounge-mood-options";
    choices.setAttribute("role", "group");
    choices.setAttribute("aria-label", "Choose today's mood");
    garden.appendChild(choices);

    const dailySection = document.createElement("section");
    dailySection.className = "lounge-mood-section";
    addText(dailySection, "h4", "🌱 Today's flowers");
    const dailyCounts = document.createElement("div");
    dailyCounts.className = "lounge-mood-counts";
    dailySection.appendChild(dailyCounts);
    garden.appendChild(dailySection);

    const totalSection = document.createElement("section");
    totalSection.className = "lounge-mood-section";
    addText(totalSection, "h4", "🌸 Garden grown together");
    const totalCounts = document.createElement("div");
    totalCounts.className = "lounge-mood-counts";
    totalSection.appendChild(totalCounts);
    garden.appendChild(totalSection);

    if (originalButton) originalButton.remove();

    const client = await waitForClient();
    if (!client) {
      setStatus(status, "The Lounge connection is unavailable right now. Please refresh and try again.", true);
      return;
    }

    async function refreshGarden() {
      const { data, error } = await client.rpc("lounge_get_mood_garden");
      if (error) throw error;

      const result = normalizeResult(data) || {};
      const daily = Array.isArray(result.daily) ? result.daily : [];
      const totals = Array.isArray(result.totals) ? result.totals : [];
      const myMood = result.my_mood || null;

      renderMoodCounts(dailyCounts, daily);
      renderMoodCounts(totalCounts, totals);

      if (myMood) {
        const selectedMood = MOODS.find(mood => mood.key === myMood);
        const moodLabel = selectedMood
          ? selectedMood.key.charAt(0).toUpperCase() + selectedMood.key.slice(1)
          : String(myMood);

        moodIndicatorValue.textContent = selectedMood
          ? moodLabel + " — " + selectedMood.flower + " " + selectedMood.name
          : moodLabel;
        moodIndicator.hidden = false;
        choices.replaceChildren();
        setStatus(status, "Your mood has been recorded for today. Thank you for sharing! 💜");
        return true;
      }

      moodIndicator.hidden = true;
      setStatus(status, "Choose the flower that represents your mood today. Your choice is private. 💜");
      choices.replaceChildren();

      MOODS.forEach(mood => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "small-btn lounge-mood-choice";
        button.textContent = mood.flower + " " + mood.name;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", async () => {
          choices.querySelectorAll("button").forEach(item => {
            item.disabled = true;
          });
          setStatus(status, "🌱 Planting your flower...");

          try {
            const { data: submitData, error: submitError } = await client.rpc("lounge_submit_mood", {
              p_mood: mood.key
            });
            if (submitError) throw submitError;

            const submitResult = normalizeResult(submitData) || {};
            if (submitResult.success === false) {
              setStatus(status, submitResult.message || "You've already selected a mood today. 💜");
            } else {
              setStatus(status, "Your " + mood.name + " has been planted! Thank you for sharing. 💜");
            }

            await refreshGarden();
          } catch (error) {
            console.error("Mood Garden submit error:", error);
            setStatus(status, "We couldn't save your mood right now. Please try again later.", true);
            choices.querySelectorAll("button").forEach(item => {
              item.disabled = false;
            });
          }
        });
        choices.appendChild(button);
      });

      return false;
    }

    try {
      await refreshGarden();
    } catch (error) {
      console.error("Mood Garden load error:", error);
      setStatus(status, "We couldn't load the Mood Garden right now. Please try again later.", true);
    }
  }

  function setup() {
    const cards = Array.from(document.querySelectorAll(".tool-card"));
    const spinCard = cards.find(card => /spin\s*&\s*win/i.test(card.textContent));
    const boxCard = cards.find(card => /mystery\s*box/i.test(card.textContent));
    const pollCard = cards.find(card => /daily\s*poll/i.test(card.textContent));
    const moodCard = cards.find(card => /mood\s*garden/i.test(card.textContent));

    if (!spinCard && !boxCard && !pollCard && !moodCard) return;

    const host = spinCard || boxCard || pollCard || moodCard;
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

    if (pollCard) loadPoll(pollCard);
    if (moodCard) loadMoodGarden(moodCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
})();
        
