(() => {
  "use strict";
  const root = document.getElementById("dopamineDistrict");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";
  const $ = selector => root.querySelector(selector);
  const $$ = selector => Array.from(root.querySelectorAll(selector));
  const STORE = "btDopamineDistrictV1";
  const read = () => { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (_) { return {}; } };
  let saved = read();
  const write = () => { try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch (_) {} };
  const setText = (selector, value) => { const el = $(selector); if (el) el.textContent = value; };
  const shuffle = items => { const a = items.slice(); for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  let activePanel = null;
  function openPanel(id) {
    activePanel = id;
    $("#dopamineHub").hidden = true;
    $$(".dopamine-attraction").forEach(panel => { panel.hidden = panel.dataset.dopPanel !== id; });
    if (id === "hunt" && !huntTargets.length) newHunt();
    if (id === "focus") renderRoom();
    if (id === "sensory") applySensory();
  }
  function showHub() {
    activePanel = null;
    $("#dopamineHub").hidden = false;
    $$(".dopamine-attraction").forEach(panel => panel.hidden = true);
  }
  root.addEventListener("click", event => {
    const open = event.target.closest("[data-dop-open]");
    if (open) openPanel(open.dataset.dopOpen);
    if (event.target.closest("[data-dop-back]")) showHub();
  });

  // Quick arcade: reaction test.
  let reactionTimer = null, reactionStarted = 0, reactionState = "idle";
  let best = Number(saved.reactionBest || 0);
  const reactionLight = $("#dopReactionLight");
  function resetReaction(message) {
    clearTimeout(reactionTimer); reactionState = "idle";
    reactionLight.classList.remove("is-wait","is-go");
    reactionLight.textContent = "WAIT FOR GREEN";
    $("#dopReactionStart").disabled = false;
    setText("#dopReactionStatus", message || (best ? "Best: "+best+" ms" : "Best: —"));
  }
  $("#dopReactionStart").addEventListener("click", () => {
    if (reactionState === "waiting" || reactionState === "ready") return;
    reactionState = "waiting";
    reactionLight.classList.add("is-wait"); reactionLight.classList.remove("is-go");
    reactionLight.textContent = "WAIT…";
    $("#dopReactionStart").disabled = true;
    setText("#dopReactionStatus","Wait for green. Don't tap early!");
    reactionTimer = setTimeout(() => {
      if (reactionState !== "waiting") return;
      reactionState = "ready"; reactionStarted = performance.now();
      reactionLight.classList.remove("is-wait"); reactionLight.classList.add("is-go");
      reactionLight.textContent = "TAP NOW!";
    }, 1200 + Math.random()*2600);
  });
  function hitReaction() {
    if (reactionState === "waiting") { resetReaction("Too early! Try another round."); return; }
    if (reactionState === "ready") {
      const elapsed = Math.round(performance.now()-reactionStarted);
      if (!best || elapsed < best) { best=elapsed; saved.reactionBest=best; write(); }
      resetReaction("Your time: "+elapsed+" ms · Best: "+best+" ms");
    }
  }
  reactionLight.addEventListener("click", hitReaction);
  reactionLight.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" "){e.preventDefault();hitReaction();} });

  // Number blink.
  let memoryAnswer = "";
  $("#dopMemoryStart").addEventListener("click", () => {
    memoryAnswer = String(Math.floor(100+Math.random()*900));
    setText("#dopMemoryNumber",memoryAnswer);
    $("#dopMemoryInput").value="";
    setText("#dopMemoryStatus","Memorize it…");
    setTimeout(() => { if ($("#dopMemoryNumber")) { setText("#dopMemoryNumber","•••"); setText("#dopMemoryStatus","Now enter the number you saw."); } },1700);
  });
  $("#dopMemoryCheck").addEventListener("click", () => {
    if (!memoryAnswer) { setText("#dopMemoryStatus","Show a number first."); return; }
    const ok=$("#dopMemoryInput").value.trim()===memoryAnswer;
    setText("#dopMemoryStatus",ok?"You got it! ✨":"Not quite. Try another round.");
    if(ok){saved.memoryWins=(saved.memoryWins||0)+1;write();}
    memoryAnswer="";
  });

  // Color match.
  const colors=["coral","mint","lilac","sun"]; let colorTarget="coral", colorScore=0;
  function nextColor(){
    colorTarget=colors[Math.floor(Math.random()*colors.length)];
    setText("#dopColorPrompt","Find: "+colorTarget);
    const host=$("#dopColorOptions");
    shuffle(colors).forEach(color=>{
      const b=host.querySelector('[data-dop-color="'+color+'"]');
      host.appendChild(b);
    });
  }
  $("#dopColorOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-dop-color]"); if(!b)return;
    if(b.dataset.dopColor===colorTarget){colorScore++;setText("#dopColorStatus","Correct! Score: "+colorScore);}
    else setText("#dopColorStatus","Not that one. Score: "+colorScore);
    nextColor();
  });
  nextColor();

  // Sensory room preferences.
  const moods={
    lavender:"radial-gradient(circle at 50% 50%,#cbb9ff,transparent 45%),linear-gradient(140deg,#1c244c,#392c68 55%,#243e5d)",
    ocean:"radial-gradient(circle at 50% 50%,#9fe5ee,transparent 45%),linear-gradient(140deg,#102b49,#245d78 55%,#1c4561)",
    peach:"radial-gradient(circle at 50% 50%,#ffd4bd,transparent 45%),linear-gradient(140deg,#55364c,#9b6172 55%,#6e5269)",
    forest:"radial-gradient(circle at 50% 50%,#b9e6c3,transparent 45%),linear-gradient(140deg,#173b36,#315e4d 55%,#203d39)"
  };
  function applySensory(){
    const room=$("#dopSensoryRoom"), mood=$("#dopMood").value, glow=$("#dopGlow").value;
    room.style.background=moods[mood]||moods.lavender;
    room.style.setProperty("--dop-glow",glow+"%");
    $("#dopGlowValue").textContent=glow+"%";
    room.classList.toggle("no-motion",!$("#dopMotion").checked);
    room.classList.toggle("is-breathing",$("#dopBreathing").checked);
    setText("#dopBreathText",$("#dopBreathing").checked?"Breathe gently":"Take your time");
    saved.sensory={mood,glow,motion:$("#dopMotion").checked,breathing:$("#dopBreathing").checked};write();
  }
  const sensory=saved.sensory||{};
  $("#dopMood").value=sensory.mood||"lavender";
  $("#dopGlow").value=sensory.glow||55;
  $("#dopMotion").checked=sensory.motion!==false;
  $("#dopBreathing").checked=!!sensory.breathing;
  ["#dopMood","#dopGlow","#dopMotion","#dopBreathing"].forEach(sel=>$(sel).addEventListener("input",applySensory));
  ["#dopMood","#dopGlow","#dopMotion","#dopBreathing"].forEach(sel=>$(sel).addEventListener("change",applySensory));
  applySensory();

  // Hidden object hunt.
  const huntPool=["🔑","🍓","🧸","⭐","🪴","📎","🧦","🎧","🕯️","🐸","📚","🪙","🧁","🧩","🪄","🌼","🧢","🫧","🖊️","🐱"];
  let huntTargets=[];
  function newHunt(){
    huntTargets=shuffle(huntPool).slice(0,4);
    const decoys=shuffle(huntPool.filter(x=>!huntTargets.includes(x))).slice(0,16);
    const objects=shuffle([...huntTargets,...decoys]);
    const found=[];
    $("#dopHuntTargets").innerHTML=huntTargets.map(x=>'<span class="dop-hunt-target" data-target="'+x+'">'+x+'</span>').join("");
    $("#dopHuntScene").innerHTML=objects.map((x,n)=>'<button class="dop-hunt-object" type="button" data-object="'+x+'" aria-label="Inspect object '+(n+1)+'">'+x+'</button>').join("");
    setText("#dopHuntStatus","0 / 4 found");
  }
  $("#dopHuntNew").addEventListener("click",newHunt);
  $("#dopHuntScene").addEventListener("click",e=>{
    const b=e.target.closest("[data-object]");if(!b||b.classList.contains("found"))return;
    const item=b.dataset.object;
    if(huntTargets.includes(item)){
      b.classList.add("found");b.disabled=true;
      const tag=$("#dopHuntTargets").querySelector('[data-target="'+item+'"]');if(tag)tag.classList.add("found");
      const count=$("#dopHuntTargets .found").length;
      setText("#dopHuntStatus",count+" / 4 found"+(count===4?" · Hunt complete! 🎉":""));
      if(count===4){saved.hunts=(saved.hunts||0)+1;write();}
    } else {
      b.animate([{transform:"translateX(0)"},{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(0)"}],{duration:180});
    }
  });
  newHunt();

  // Hyperfocus room builder.
  const roomItems=["🪴","🧸","💡","📚","🖼️","🐈","🪩","🍓"];
  let roomState=saved.room||{color:"lilac",items:[]};
  function renderRoom(){
    const room=$("#dopFocusRoom");room.dataset.roomColor=roomState.color||"lilac";
    room.querySelectorAll(".dop-focus-object").forEach(x=>x.remove());
    roomItems.forEach((item,index)=>{
      if((roomState.items||[]).filter(x=>x===item).length){
        // Each saved object is represented individually below.
      }
    });
    (roomState.items||[]).forEach((item,index)=>{
      const b=document.createElement("button");b.type="button";b.className="dop-focus-object";b.textContent=item;b.setAttribute("aria-label","Remove "+item+" from room");b.title="Tap to remove";
      b.addEventListener("click",()=>{roomState.items.splice(index,1);saveRoom();renderRoom();});
      room.appendChild(b);
    });
    $("#dopRoomColor").value=roomState.color||"lilac";
  }
  function saveRoom(){saved.room=roomState;write();setText("#dopFocusStatus","Room saved on this device. ✨");}
  $("#dopFocusItems").addEventListener("click",e=>{
    const b=e.target.closest("[data-focus-item]");if(!b)return;
    roomState.items.push(b.dataset.focusItem);saveRoom();renderRoom();
  });
  $("#dopRoomColor").addEventListener("change",e=>{roomState.color=e.target.value;saveRoom();renderRoom();});
  $("#dopFocusClear").addEventListener("click",()=>{roomState.items=[];saveRoom();renderRoom();});
  $("#dopFocusSave").addEventListener("click",saveRoom);
  renderRoom();

  // Respect the site's existing sound system; use a soft UI confirmation if available.
  root.addEventListener("click",e=>{
    if(e.target.closest(".dopamine-door,.dop-action,.dop-quiet-action")){
      try{if(window.btSound&&typeof window.btSound.play==="function")window.btSound.play("tap");}catch(_){}
    }
  });
})();