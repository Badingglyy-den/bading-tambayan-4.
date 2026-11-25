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

  function setup() {
    const cards = Array.from(document.querySelectorAll(".tool-card"));
    const spinCard = cards.find(card => /spin\s*&\s*win/i.test(card.textContent));
    const boxCard = cards.find(card => /mystery\s*box/i.test(card.textContent));
    const pollCard = cards.find(card => /daily\s*poll/i.test(card.textContent));

    if (!spinCard && !boxCard && !pollCard) return;

    const host = spinCard || boxCard || pollCard;
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
})();
        
