(() => {
  "use strict";

  const SUPABASE_URL = "https://lieisalrqexbqvgjwekv.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sDPQI0S05ykOaMye6_CrzA_zMOskR0P";
  const table = "kindness_wall_messages";
  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);

  function start() {
    const promptBox = document.querySelector(".prompt-box");
    if (!promptBox || !window.supabase || $("kindnessWallStatus")) return;
    const textarea = $("kindMessage");
    const button = $("kindPost");
    const feed = $("kindFeed");
    if (!textarea || !button || !feed) return;

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    let currentUser = null;
    let loading = false;

    const intro = promptBox.querySelector("p");
    if (intro) intro.textContent = "Leave a little kindness for the next visitor. Messages are shared with everyone, on every device.";

    const nameLabel = document.createElement("label");
    nameLabel.htmlFor = "kindnessNickname";
    nameLabel.textContent = "Nickname (optional)";
    nameLabel.style.cssText = "display:block;font-size:11px;color:var(--muted);margin:10px 0 6px;font-weight:700;";

    const nameInput = document.createElement("input");
    nameInput.id = "kindnessNickname";
    nameInput.type = "text";
    nameInput.maxLength = 24;
    nameInput.placeholder = "Leave blank to post anonymously";
    nameInput.autocomplete = "nickname";
    nameInput.style.cssText = "display:block;width:100%;box-sizing:border-box;background:#08061266;border:1px solid var(--line);border-radius:9px;padding:10px;color:var(--text);margin-bottom:9px;";
    promptBox.insertBefore(nameLabel, textarea);
    promptBox.insertBefore(nameInput, textarea);

    const status = document.createElement("p");
    status.id = "kindnessWallStatus";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.cssText = "font-size:11px;min-height:16px;color:var(--muted);margin:8px 0;";
    button.insertAdjacentElement("afterend", status);

    const setStatus = (message, error = false) => {
      status.textContent = message;
      status.style.color = error ? "#ff9eae" : "var(--muted)";
    };

    function render(messages) {
      if (!messages.length) {
        feed.innerHTML = '<p class="empty-state">The wall is waiting for its first little kindness. 💌</p>';
        return;
      }
      feed.innerHTML = messages.map(item => {
        const date = new Date(item.created_at);
        const dateText = Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
        const mine = currentUser && item.user_id === currentUser.id;
        return `
          <article class="kind-item" style="padding:12px;margin-top:9px;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
              <b style="color:var(--accent);">${escapeHTML(item.author_name || "Anonymous")}</b>
              ${mine ? `<button type="button" data-kind-delete="${item.id}" style="border:0;background:none;color:var(--muted);font-size:10px;padding:2px 0;">Delete</button>` : ""}
            </div>
            <p style="white-space:pre-wrap;overflow-wrap:anywhere;margin:7px 0;color:var(--text);">${escapeHTML(item.message)}</p>
            <small style="color:var(--muted);font-size:10px;">${escapeHTML(dateText)}</small>
          </article>`;
      }).join("");
    }

    async function loadWall() {
      const { data, error } = await client.from(table)
        .select("id,user_id,author_name,message,created_at")
        .order("created_at", { ascending: false }).limit(60);
      if (error) {
        setStatus("Couldn't load the kindness wall. Please try again.", true);
        console.error("Kindness wall load error:", error);
        return;
      }
      render(data || []);
    }

    async function refreshSession() {
      const { data, error } = await client.auth.getSession();
      if (error) {
        setStatus("Connecting to the community…", true);
        return;
      }
      currentUser = data.session?.user || null;
      button.disabled = !currentUser || loading;
      if (!currentUser) setStatus("Connecting you to the tambayan…");
      else {
        setStatus("Shared kindness wall · visible to everyone");
        await loadWall();
      }
    }

    button.onclick = async event => {
      event.preventDefault();
      if (loading) return;
      const message = textarea.value.trim();
      const nickname = nameInput.value.trim().slice(0, 24) || "Anonymous";
      if (!message) {
        setStatus("Write a little message first. 💜", true);
        textarea.focus();
        return;
      }
      if (message.length > 300) {
        setStatus("Please keep your message under 300 characters.", true);
        return;
      }
      if (!currentUser) {
        setStatus("Still connecting. Please try again in a moment.", true);
        return;
      }

      loading = true;
      button.disabled = true;
      setStatus("Pinning your kindness…");
      const { error } = await client.from(table).insert({
        user_id: currentUser.id, author_name: nickname, message
      });
      loading = false;
      button.disabled = false;
      if (error) {
        console.error("Kindness wall insert error:", error);
        setStatus("Your message couldn't be posted. Please try again.", true);
        return;
      }
      textarea.value = "";
      nameInput.value = "";
      setStatus("Your kindness is on the wall. 💌");
      await loadWall();
    };

    feed.addEventListener("click", async event => {
      const deleteButton = event.target.closest("[data-kind-delete]");
      if (!deleteButton || !currentUser) return;
      const id = Number(deleteButton.dataset.kindDelete);
      if (!Number.isSafeInteger(id)) return;
      if (!window.confirm("Delete your kindness message?")) return;
      const { error } = await client.from(table).delete()
        .eq("id", id).eq("user_id", currentUser.id);
      if (error) {
        setStatus("Couldn't delete that message. Please try again.", true);
        console.error("Kindness wall delete error:", error);
      } else {
        setStatus("Your message was removed.");
        await loadWall();
      }
    });

    client.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user || null;
      button.disabled = !currentUser || loading;
      if (currentUser) {
        setStatus("Shared kindness wall · visible to everyone");
        loadWall();
      }
    });

    client.channel("kindness-wall-live")
      .on("postgres_changes", { event: "*", schema: "public", table },
        () => loadWall())
      .subscribe();

    button.disabled = true;
    setStatus("Connecting to the tambayan…");
    refreshSession();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
      
