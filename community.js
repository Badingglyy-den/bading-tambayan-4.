(() => {
  "use strict";

  const SUPABASE_URL = "https://lieisalrqexbqvgjwekv.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sDPQI0S05ykOaMye6_CrzA_zMOskR0P";

  if (!window.supabase || document.getElementById("publicCommunity")) return;

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const style = document.createElement("style");

  style.textContent = `
    #publicCommunity { margin: 28px 0 42px; }
    #publicCommunity .community-panel {
      background: var(--panel, #21183b);
      border: 1px solid var(--line, #ffffff18);
      border-radius: 22px;
      padding: 22px;
      color: var(--text, #fff);
      margin-bottom: 14px;
      min-width: 0;
    }
    #publicCommunity h2, #publicCommunity h3 { margin-top: 0; }
    #publicCommunity p { line-height: 1.55; }
    #publicCommunity .community-muted { color: var(--muted, #b9aecb); font-size: 12px; }
    #publicCommunity input, #publicCommunity textarea, #publicCommunity button {
      font: inherit;
    }
    #publicCommunity input, #publicCommunity textarea {
      width: 100%; box-sizing: border-box; border-radius: 11px;
      border: 1px solid var(--line, #ffffff25); padding: 11px;
      background: rgba(8,6,18,.45); color: inherit; margin: 5px 0;
    }
    #publicCommunity textarea { min-height: 90px; resize: vertical; }
    #publicCommunity button {
      cursor: pointer; border: 0; border-radius: 11px;
      padding: 10px 14px; margin: 5px 5px 5px 0;
      background: var(--accent, #c6a5ff); color: #1b1231;
      font-weight: 800; font-size: 12px;
    }
    #publicCommunity button.secondary {
      background: rgba(255,255,255,.09); color: inherit;
      border: 1px solid var(--line, #ffffff25);
    }
    #publicCommunity button:disabled { opacity: .5; cursor: not-allowed; }
    #publicCommunity .community-top {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 14px; flex-wrap: wrap;
    }
    #publicCommunity .community-columns {
      display: grid; grid-template-columns: minmax(0,1.5fr) minmax(220px,.7fr);
      gap: 14px; align-items: start;
    }
    #publicCommunity .community-post {
      border: 1px solid var(--line, #ffffff20); border-radius: 15px;
      padding: 15px; margin: 12px 0; background: rgba(255,255,255,.035);
      overflow-wrap: anywhere;
    }
    #publicCommunity .community-author {
      display: flex; align-items: center; gap: 9px; margin-bottom: 9px;
    }
    #publicCommunity .community-avatar {
      width: 36px; height: 36px; flex: 0 0 36px; border-radius: 50%;
      display: grid; place-items: center; background: rgba(255,255,255,.1);
      font-size: 20px;
    }
    #publicCommunity .community-author small {
      display: block; color: var(--muted, #b9aecb); font-size: 10px; margin-top: 2px;
    }
    #publicCommunity .community-post-content {
      white-space: pre-wrap; font-size: 13px; line-height: 1.6;
    }
    #publicCommunity .community-actions {
      display: flex; flex-wrap: wrap; align-items: center; gap: 4px;
      margin-top: 9px;
    }
    #publicCommunity .community-actions button { margin: 0; }
    #publicCommunity .community-comment {
      border-top: 1px solid var(--line, #ffffff18); padding: 9px 0;
      font-size: 11px; overflow-wrap: anywhere;
    }
    #publicCommunity .community-comment small {
      color: var(--muted, #b9aecb); display: block; margin-top: 3px;
    }
    #publicCommunity .community-member {
      display: flex; align-items: center; gap: 9px;
      padding: 9px 0; border-bottom: 1px solid var(--line, #ffffff18);
      font-size: 12px;
    }
    #publicCommunity .community-member:last-child { border-bottom: 0; }
    #publicCommunity .community-status {
      min-height: 18px; color: var(--accent, #c6a5ff); font-size: 11px;
    }
    #publicCommunity .community-empty {
      color: var(--muted, #b9aecb); font-size: 12px; padding: 14px 0;
    }
    #publicCommunity .community-join-box {
      border: 1px dashed var(--line, #ffffff35); border-radius: 14px;
      padding: 15px; margin-top: 12px;
    }
    @media(max-width:700px) {
      #publicCommunity .community-columns { grid-template-columns: 1fr; }
      #publicCommunity .community-panel { padding: 16px; }
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement("section");
  section.id = "publicCommunity";
  section.innerHTML = `
    <div class="community-panel">
      <div class="community-top">
        <div>
          <p class="eyebrow">OPEN TO EVERY TAMBAYAN VISITOR</p>
          <h2>🌟 The Public Tambayan</h2>
          <p class="community-muted">Browse conversations and meet the community. You only need to join if you want to participate.</p>
        </div>
        <div><strong id="communityMemberCount">—</strong><div class="community-muted">community members</div></div>
      </div>
      <div id="communityJoinArea" class="community-join-box">
        <h3 id="communityJoinTitle">Join the Community 💜</h3>
        <p id="communityJoinDescription" class="community-muted">Joining is optional. Choose the nickname and avatar that other members will see.</p>
        <div id="communityJoinFields">
          <input id="communityName" maxlength="24" placeholder="Your public nickname">
          <input id="communityAvatar" maxlength="8" value="💜" aria-label="Your public avatar emoji">
          <button id="communityJoinButton" type="button">Join the Community</button>
        </div>
        <div id="communityMemberActions" hidden>
          <span class="community-muted">You're a member! You can now post, comment, and react.</span>
          <button id="communityLeaveButton" class="secondary" type="button">Leave community</button>
        </div>
        <p id="communityStatus" class="community-status" role="status"></p>
      </div>
    </div>

    <div class="community-columns">
      <div class="community-panel">
        <div class="community-top">
          <div><p class="eyebrow">THE COMMUNITY FEED</p><h3>Latest tambay thoughts</h3></div>
          <button id="communityRefresh" class="secondary" type="button">↻ Refresh</button>
        </div>
        <div id="communityComposer" hidden>
          <textarea id="communityPostText" maxlength="1000" placeholder="What's on your mind, sis? (1,000 characters max)"></textarea>
          <button id="communityPostButton" type="button">Share with the community ✦</button>
        </div>
        <div id="communityFeed"><p class="community-empty">Loading public posts...</p></div>
      </div>

      <aside class="community-panel">
        <p class="eyebrow">THE PEOPLE OF TAMBAYAN</p>
        <h3>Community members</h3>
        <p class="community-muted">Public nicknames and avatars only.</p>
        <div id="communityDirectory"><p class="community-empty">Loading members...</p></div>
      </aside>
    </div>
  `;

  const anchor = document.getElementById("onlineTambayan") ||
    document.querySelector(".hangout-layout");
  if (anchor) anchor.insertAdjacentElement("afterend", section);
  else document.querySelector("main.shell")?.appendChild(section);

  const $ = id => document.getElementById(id);
  let currentUser = null;
  let membership = null;
  let busy = false;

  function status(message, isError = false) {
    $("communityStatus").textContent = message || "";
    $("communityStatus").style.color = isError ? "#ff9eae" : "";
  }

  function escapeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleString([], {
      dateStyle: "medium", timeStyle: "short"
    });
  }

  function setMemberUI() {
    const joined = !!membership;
    $("communityJoinFields").hidden = joined;
    $("communityMemberActions").hidden = !joined;
    $("communityJoinTitle").textContent = joined
      ? "You're part of the tambayan! 💜"
      : "Join the Community 💜";
    $("communityJoinDescription").textContent = joined
      ? "Your public nickname and avatar are visible in the member directory."
      : "Joining is optional. Choose the nickname and avatar that other members will see.";
    $("communityComposer").hidden = !joined;
    $("communityName").value = membership?.display_name || "";
    $("communityAvatar").value = membership?.avatar || "💜";
  }

  async function loadMembership() {
    if (!currentUser) return;
    const { data, error } = await client
      .from("community_members")
      .select("user_id,display_name,avatar,joined_at")
      .eq("user_id", currentUser.id)
      .maybeSingle();
    if (error) throw error;
    membership = data || null;
    setMemberUI();
  }

  async function loadDirectory() {
    const { data, error } = await client
      .from("community_members")
      .select("display_name,avatar,joined_at")
      .order("joined_at", { ascending: false })
      .limit(60);
    if (error) throw error;
    $("communityMemberCount").textContent = data.length;
    $("communityDirectory").innerHTML = data.length
      ? data.map(member => `
        <div class="community-member">
          <span class="community-avatar">${escapeText(member.avatar || "💜")}</span>
          <span>${escapeText(member.display_name)}</span>
        </div>`).join("")
      : '<p class="community-empty">No members yet. Be the first to join!</p>';
  }

  async function loadFeed() {
    const { data: posts, error } = await client
      .from("community_posts")
      .select("id,user_id,author_name,author_avatar,content,created_at")
      .order("created_at", { ascending: false })
      .limit(40);
    if (error) throw error;

    if (!posts.length) {
      $("communityFeed").innerHTML = '<p class="community-empty">No posts yet. The first tambay thought is waiting to be shared.</p>';
      return;
    }

    const ids = posts.map(post => post.id);
    const [commentsResult, reactionsResult] = await Promise.all([
      client.from("community_comments")
        .select("id,post_id,user_id,author_name,author_avatar,content,created_at")
        .in("post_id", ids).order("created_at", { ascending: true }),
      client.from("community_reactions")
        .select("id,post_id,user_id,reaction")
        .in("post_id", ids)
    ]);
    if (commentsResult.error) throw commentsResult.error;
    if (reactionsResult.error) throw reactionsResult.error;

    const comments = commentsResult.data || [];
    const reactions = reactionsResult.data || [];
    $("communityFeed").innerHTML = posts.map(post => {
      const postComments = comments.filter(item => item.post_id === post.id);
      const postReactions = reactions.filter(item => item.post_id === post.id);
      const reactionCounts = ["💜", "😂", "🥹", "🔥", "👏", "✨"].map(emoji => {
        const count = postReactions.filter(item => item.reaction === emoji).length;
        return count ? `<span>${emoji} ${count}</span>` : "";
      }).join(" ");
      const myReaction = postReactions.find(item => item.user_id === currentUser?.id);
      const deleteButton = post.user_id === currentUser?.id
        ? `<button class="secondary" data-delete-post="${post.id}" type="button">Delete</button>` : "";
      const commentMarkup = postComments.map(comment => `
        <div class="community-comment">
          <b>${escapeText(comment.author_avatar || "💜")} ${escapeText(comment.author_name)}</b>
          ${escapeText(comment.content)}
          <small>${escapeText(formatDate(comment.created_at))}</small>
        </div>`).join("");
      return `
        <article class="community-post">
          <div class="community-author">
            <span class="community-avatar">${escapeText(post.author_avatar || "💜")}</span>
            <span><b>${escapeText(post.author_name)}</b><small>${escapeText(formatDate(post.created_at))}</small></span>
          </div>
          <div class="community-post-content">${escapeText(post.content)}</div>
          <div class="community-actions">
            <button class="secondary" data-react="${post.id}" type="button">${myReaction ? "Reacted " + escapeText(myReaction.reaction) : "💜 React"}</button>
            <span class="community-muted">${reactionCounts}</span>
            ${deleteButton}
          </div>
          <div class="community-comments">${commentMarkup || '<p class="community-muted">No comments yet.</p>'}</div>
          ${membership ? `
            <form class="community-comment-form" data-comment-form="${post.id}">
              <input maxlength="500" name="comment" placeholder="Write a comment..." required>
              <button type="submit">Comment</button>
            </form>` : ""}
        </article>`;
    }).join("");
  }

  async function refreshAll() {
    $("communityRefresh").disabled = true;
    try {
      await Promise.all([loadFeed(), loadDirectory()]);
    } catch (error) {
      console.error("Community refresh failed:", error);
      $("communityFeed").innerHTML = `<p class="community-empty">Couldn't load the community feed: ${escapeText(error.message)}</p>`;
      status(error.message || "Couldn't refresh community.", true);
    } finally {
      $("communityRefresh").disabled = false;
    }
  }

  $("communityJoinButton").addEventListener("click", async () => {
    if (!currentUser || busy) return;
    const name = $("communityName").value.trim();
    const avatar = $("communityAvatar").value.trim() || "💜";
    if (!name) return status("Please choose a public nickname first.", true);
    if (name.length > 24) return status("Nickname must be 24 characters or fewer.", true);
    busy = true;
    $("communityJoinButton").disabled = true;
    try {
      const { data, error } = await client.from("community_members").upsert({
        user_id: currentUser.id,
        display_name: name,
        avatar: avatar.slice(0, 8)
      }, { onConflict: "user_id" }).select().single();
      if (error) throw error;
      membership = data;
      setMemberUI();
      status("Welcome to the community! You can post, comment, and react now. 💜");
      await refreshAll();
    } catch (error) {
      status(error.message || "Couldn't join the community.", true);
    } finally {
      busy = false;
      $("communityJoinButton").disabled = false;
    }
  });

  $("communityLeaveButton").addEventListener("click", async () => {
    if (!currentUser || !membership || busy) return;
    if (!window.confirm("Leave the public community? Your existing posts and comments will remain visible.")) return;
    busy = true;
    try {
      const { error } = await client.from("community_members")
        .delete().eq("user_id", currentUser.id);
      if (error) throw error;
      membership = null;
      setMemberUI();
      status("You left the community. Your existing posts remain visible.");
      await refreshAll();
    } catch (error) {
      status(error.message || "Couldn't leave the community.", true);
    } finally {
      busy = false;
    }
  });

  $("communityPostButton").addEventListener("click", async () => {
    const content = $("communityPostText").value.trim();
    if (!membership || !currentUser || !content || busy) return;
    busy = true;
    $("communityPostButton").disabled = true;
    try {
      const { error } = await client.from("community_posts").insert({
        user_id: currentUser.id,
        author_name: membership.display_name,
        author_avatar: membership.avatar || "💜",
        content
      });
      if (error) throw error;
      $("communityPostText").value = "";
      status("Your post is live! ✨");
      await refreshAll();
    } catch (error) {
      status(error.message || "Couldn't publish your post.", true);
    } finally {
      busy = false;
      $("communityPostButton").disabled = false;
    }
  });

  $("communityFeed").addEventListener("click", async event => {
    const reactButton = event.target.closest("[data-react]");
    const deleteButton = event.target.closest("[data-delete-post]");
    if (!currentUser || !membership || busy) return;
    busy = true;
    try {
      if (reactButton) {
        const postId = Number(reactButton.dataset.react);
        const { data: existing, error: findError } = await client
          .from("community_reactions").select("id,reaction")
          .eq("post_id", postId).eq("user_id", currentUser.id).maybeSingle();
        if (findError) throw findError;
        if (existing) {
          const { error } = await client.from("community_reactions")
            .delete().eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await client.from("community_reactions").insert({
            post_id: postId, user_id: currentUser.id, reaction: "💜"
          });
          if (error) throw error;
        }
        await refreshAll();
      } else if (deleteButton) {
        if (!window.confirm("Delete this post? Its comments and reactions will also be removed.")) return;
        const { error } = await client.from("community_posts")
          .delete().eq("id", Number(deleteButton.dataset.deletePost))
          .eq("user_id", currentUser.id);
        if (error) throw error;
        status("Post deleted.");
        await refreshAll();
      }
    } catch (error) {
      status(error.message || "That action couldn't be completed.", true);
    } finally {
      busy = false;
    }
  });

  $("communityFeed").addEventListener("submit", async event => {
    const form = event.target.closest("[data-comment-form]");
    if (!form || !membership || !currentUser || busy) return;
    event.preventDefault();
    const input = form.elements.comment;
    const content = input.value.trim();
    if (!content) return;
    busy = true;
    try {
      const { error } = await client.from("community_comments").insert({
        post_id: Number(form.dataset.commentForm),
        user_id: currentUser.id,
        author_name: membership.display_name,
        author_avatar: membership.avatar || "💜",
        content
      });
      if (error) throw error;
      status("Comment added.");
      await refreshAll();
    } catch (error) {
      status(error.message || "Couldn't add your comment.", true);
    } finally {
      busy = false;
    }
  });

  $("communityRefresh").addEventListener("click", refreshAll);

  async function startWithSession(session) {
    currentUser = session?.user || null;
    if (!currentUser) {
      status("Connecting to the tambayan account…");
      return;
    }
    try {
      await loadMembership();
      await refreshAll();
      if (!membership) status("You're browsing as a visitor. Join if you'd like to participate.");
    } catch (error) {
      console.error("Community initialization failed:", error);
      status(error.message || "Community couldn't initialize.", true);
    }
  }

  client.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      currentUser = session.user;
      setTimeout(() => startWithSession(session), 0);
    }
  });

  client.auth.getSession().then(({ data, error }) => {
    if (error) status(error.message, true);
    else if (data.session) startWithSession(data.session);
    else status("Connecting to the tambayan account…");
  });
})();

