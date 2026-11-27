(() => {
  "use strict";
  const $ = (tag, attrs = {}, text = "") => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "className") el.className = value;
      else if (key === "text") el.textContent = value;
      else if (key.startsWith("on") && typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
      else el.setAttribute(key, value);
    });
    if (text) el.textContent = text;
    return el;
  };
  const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(new Date());
  const residents = [
    ["lumi","Focus Keeper","Set your three most important priorities.","🎯"],
    ["bibi","Task Breaker","Turn a big task into small, doable steps.","🧩"],
    ["momo","Writing Muse","Find a starting point and save a draft.","✍️"],
    ["pochi","Routine Keeper","Build a small habit and check it off daily.","🌿"],
    ["nubi","Reset Coach","Choose a realistic reset based on your energy.","☁️"],
    ["ruru","Learning Explorer","Try a quick knowledge check.","🧠"],
    ["yuki","Reflection Guide","Record a thought and notice your progress.","🌙"],
    ["tavi","Study Buddy","Plan a study session and run a focus sprint.","📚"],
    ["kiko","Little Organizer","Build a checklist and clear it as you go.","🗂️"],
    ["sora","Idea Architect","Turn an idea into a first action.","🪁"],
    ["pippa","Timekeeper","Run a focused work timer.","⏳"],
    ["remy","Curious Researcher","Capture a question, findings, and source notes.","🔎"],
    ["olli","Goal Gardener","Set a goal and grow it through milestones.","🌱"],
    ["aki","Challenge Maker","Complete a small practical challenge.","🏁"]
  ];
  const quiz = [
    { q:"Which habit is most likely to make a large task feel manageable?", a:["Break it into smaller steps","Wait for a free whole day","Do every part at once"], correct:0, why:"Smaller steps make it easier to begin and track progress." },
    { q:"What is a useful first step when researching a topic?", a:["Collect random links","Write a clear question","Start with the conclusion"], correct:1, why:"A focused question gives your research direction." },
    { q:"Which is the strongest study check?", a:["Reread without pausing","Highlight every sentence","Explain the idea from memory"], correct:2, why:"Retrieval practice helps reveal what you actually understand." },
    { q:"What makes a goal easier to act on?", a:["A specific next action","A very long description","Keeping it only in your head"], correct:0, why:"A clear next action turns intention into something you can do." }
  ];
  let data = null;
  let selected = "lumi";
  let timerId = null, secondsLeft = 0;
  function load() {
    try {
      data = window.tambayanProgress?.getNPCWorkshop?.() || {};
    } catch (_) { data = {}; }
    data = {
      priorities: Array.isArray(data.priorities) ? data.priorities : [],
      habits: Array.isArray(data.habits) ? data.habits : [],
      notes: Array.isArray(data.notes) ? data.notes : [],
      goals: Array.isArray(data.goals) ? data.goals : [],
      organizer: Array.isArray(data.organizer) ? data.organizer : [],
      quizScore: Number(data.quizScore) || 0,
      completedChallenges: Array.isArray(data.completedChallenges) ? data.completedChallenges : []
    };
  }
  function persist() {
    try {
      if (window.tambayanProgress?.setNPCWorkshop) data = window.tambayanProgress.setNPCWorkshop(data);
      else localStorage.setItem("tambayan_npc_workshop_fallback", JSON.stringify(data));
    } catch (error) { console.warn("NPC progress could not be saved", error); }
  }
  function addStyles() {
    if (document.getElementById("npcWorkshopStyles")) return;
    const style = $("style", { id:"npcWorkshopStyles" });
    style.textContent = `
      .npc-workshop { margin-top:22px; padding-top:18px; border-top:1px solid var(--line,rgba(150,130,180,.25)); text-align:left; }
      .npc-workshop-head { display:flex; align-items:flex-end; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:12px; }
      .npc-workshop-head h4 { margin:0; font-size:1.08rem; }
      .npc-workshop-head p { margin:4px 0 0; color:var(--muted); font-size:.85rem; }
      .npc-resident-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; }
      .npc-resident { display:flex; flex-direction:column; align-items:flex-start; gap:4px; min-width:0; padding:10px; border:1px solid var(--line); border-radius:13px; background:var(--panel); color:var(--text); text-align:left; cursor:pointer; font:inherit; }
      .npc-resident[aria-pressed="true"] { border-color:var(--accent); background:var(--panel2); box-shadow:inset 0 0 0 1px var(--accent); }
      .npc-resident span:first-child { font-size:1.25rem; }
      .npc-resident strong { font-size:.82rem; }
      .npc-resident small { color:var(--muted); font-size:.7rem; line-height:1.3; }
      .npc-tool { margin-top:12px; padding:16px; border:1px solid var(--line); border-radius:16px; background:var(--panel); }
      .npc-tool h5 { margin:0 0 5px; font-size:1rem; }
      .npc-tool > p { margin:0 0 13px; color:var(--muted); font-size:.85rem; }
      .npc-tool label { display:block; margin:10px 0 5px; font-size:.8rem; font-weight:700; color:var(--text); }
      .npc-tool input,.npc-tool textarea,.npc-tool select { width:100%; min-width:0; padding:10px 11px; border:1px solid var(--line); border-radius:10px; background:var(--bg); color:var(--text); font:inherit; }
      .npc-tool textarea { min-height:90px; resize:vertical; }
      .npc-tool-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:11px; }
      .npc-tool-actions button,.npc-tool button { cursor:pointer; }
      .npc-tool .npc-action { padding:9px 13px; border:1px solid var(--accent); border-radius:10px; background:var(--accent); color:white; font:inherit; font-size:.82rem; font-weight:700; }
      .npc-tool .npc-secondary { padding:9px 13px; border:1px solid var(--line); border-radius:10px; background:transparent; color:var(--text); font:inherit; font-size:.82rem; }
      .npc-result { margin-top:12px; padding:12px; border-radius:11px; background:var(--panel2); color:var(--text); font-size:.88rem; line-height:1.55; white-space:pre-wrap; }
      .npc-list { display:grid; gap:7px; margin:12px 0 0; padding:0; list-style:none; }
      .npc-list li { display:flex; align-items:center; gap:8px; padding:9px 10px; border:1px solid var(--line); border-radius:10px; font-size:.86rem; }
      .npc-list li span { flex:1; min-width:0; overflow-wrap:anywhere; }
      .npc-list li.done span { text-decoration:line-through; opacity:.58; }
      .npc-progress-note { margin-top:10px; color:var(--muted); font-size:.75rem; }
      .npc-timer { margin:12px 0; font-size:2rem; font-weight:800; font-variant-numeric:tabular-nums; text-align:center; }
      .npc-quiz-options { display:grid; gap:7px; }
      .npc-quiz-options button { padding:10px; border:1px solid var(--line); border-radius:10px; background:var(--bg); color:var(--text); text-align:left; font:inherit; }
      .npc-resident:focus-visible,.npc-tool button:focus-visible { outline:3px solid var(--accent); outline-offset:2px; }
      @media(max-width:620px) { .npc-resident-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .npc-tool { padding:13px; } }
      @media(prefers-reduced-motion:reduce) { .npc-resident,.npc-tool button { transition:none!important; } }
    `;
    document.head.append(style);
  }
  const button = (label, action, secondary=false) => {
    const b = $("button", { type:"button", className:secondary?"npc-secondary":"npc-action" }, label);
    b.addEventListener("click", action); return b;
  };
  const input = (placeholder, type="text") => $("input", { type, placeholder, maxlength:"180" });
  function list(container, items, onToggle, onRemove) {
    const ul = $("ul", { className:"npc-list" });
    items.forEach((item,index) => {
      const li = $("li", { className:item.done?"done":"" });
      if (onToggle) {
        const check = $("input", { type:"checkbox" }); check.checked=!!item.done;
        check.addEventListener("change",()=>onToggle(index,check.checked)); li.append(check);
      }
      li.append($("span",{},item.text || String(item)));
      if (onRemove) li.append(button("×",()=>onRemove(index),true));
      ul.append(li);
    });
    container.append(ul);
  }
  function saveNote(kind,title,body) {
    data.notes.unshift({kind,title,body,at:new Date().toISOString()});
    data.notes=data.notes.slice(0,50); persist();
  }
  function renderTool(host,id) {
    host.replaceChildren();
    const resident=residents.find(x=>x[0]===id)||residents[0];
    const heading=$("h5",{},resident[3]+" "+resident[1]);
    const desc=$("p",{},resident[2]);
    host.append(heading,desc);
    if(id==="lumi") {
      const fields=[0,1,2].map(i=>{const f=input("Priority "+(i+1));f.value=data.priorities[i]||"";return f;});
      fields.forEach((f,i)=>{host.append($("label",{}, "Priority "+(i+1)),f);});
      host.append(button("Save my priorities",()=>{data.priorities=fields.map(f=>f.value.trim()).filter(Boolean).slice(0,3);persist();result(host,"Your top priorities are saved. Start with the one that matters most.");}));
    } else if(id==="bibi") {
      const task=input("What feels too big right now?"); host.append($("label",{},"The task"),task);
      host.append(button("Break it down",()=>{const v=task.value.trim();if(!v)return result(host,"Add a task first.");const steps=["Define what finished looks like for: "+v,"Gather the things or information you need.","Work on the first small piece for 15 minutes."];result(host,steps.map((x,i)=>(i+1)+". "+x).join("\n"));saveNote("task-breakdown",v,steps.join("\n"));}));
    } else if(id==="momo") {
      const topic=input("What do you want to write about?"); const draft=$("textarea",{placeholder:"Your draft starts here…"});
      host.append($("label",{},"Writing topic"),topic,$("label",{},"Draft"),draft,button("Give me a starting line",()=>{const v=topic.value.trim();if(!v)return result(host,"Give Momo a topic first.");draft.value="I keep thinking about "+v+" because…\n\nOne thing I want to say is…\n\nWhat I hope someone understands is…";}),button("Save draft",()=>{if(!draft.value.trim())return result(host,"Write a little something before saving.");saveNote("writing",topic.value.trim()||"Untitled draft",draft.value.trim());result(host,"Draft saved in your NPC notebook.");},true));
    } else if(id==="pochi") {
      const habit=input("A small habit you want to build");host.append($("label",{},"New habit"),habit,button("Add habit",()=>{const v=habit.value.trim();if(!v)return;if(data.habits.some(x=>x.text.toLowerCase()===v.toLowerCase()))return result(host,"That habit is already on your list.");data.habits.push({text:v,doneOn:[]});data.habits=data.habits.slice(-30);persist();renderTool(host,id);}));
      const items=data.habits.map(x=>({text:x.text,done:(x.doneOn||[]).includes(today())}));
      list(host,items,(i,checked)=>{const h=data.habits[i];h.doneOn=h.doneOn||[];h.doneOn=h.doneOn.filter(d=>d!==today());if(checked)h.doneOn.push(today());persist();renderTool(host,id);},i=>{data.habits.splice(i,1);persist();renderTool(host,id);});
      host.append($("p",{className:"npc-progress-note"}, "Checked habits today: "+items.filter(x=>x.done).length+" / "+items.length));
    } else if(id==="nubi") {
      const energy=$("select");["Low","A little","Good"].forEach(v=>energy.append($("option",{value:v},v)));
      host.append($("label",{},"How much energy do you have?"),energy,button("Make a gentle reset plan",()=>{const plans={Low:["Drink some water.","Clear one tiny surface or close one open tab.","Choose one thing that can wait."],"A little":["Set a 10-minute timer.","Finish one small pending task.","Take a short break after."],Good:["Choose your most meaningful task.","Work in one focused 25-minute block.","Write down the next step before stopping."]};result(host,plans[energy.value].map((x,i)=>(i+1)+". "+x).join("\n"));}));
    } else if(id==="ruru") {
      const q=quiz[Math.floor(Math.random()*quiz.length)];host.append($("strong",{},q.q));const opts=$("div",{className:"npc-quiz-options"});q.a.forEach((answer,i)=>opts.append(button(answer,()=>{const correct=i===q.correct;if(correct){data.quizScore+=1;persist();}result(host,(correct?"Correct! ":"Not quite. ")+q.why+"\nYour learning score: "+data.quizScore);} ,true)));host.append(opts,$("p",{className:"npc-progress-note"},"Correct answers recorded: "+data.quizScore));
    } else if(id==="yuki") {
      const prompts=["What did I handle better than I expected?","What is taking up space in my mind?","What would make next week feel a little easier?"];
      const fields=prompts.map(p=>{const area=$("textarea",{placeholder:p});host.append($("label",{},p),area);return area;});
      host.append(button("Save reflection",()=>{const body=fields.map((f,i)=>prompts[i]+"\n"+f.value.trim()).filter(x=>!x.endsWith("\n")).join("\n\n");if(!body)return result(host,"Write at least one reflection before saving.");saveNote("reflection","Personal reflection",body);result(host,"Reflection saved in your NPC notebook.");}));
    } else if(id==="tavi") {
      const subject=input("Subject or chapter");const minutes=$("select");[15,25,45].forEach(v=>minutes.append($("option",{value:v},v+" minutes")));
      host.append($("label",{},"What are you studying?"),subject,$("label",{},"Session length"),minutes,button("Start study sprint",()=>{if(!subject.value.trim())return result(host,"Choose a subject first.");startTimer(host,Number(minutes.value), "Study: "+subject.value.trim());}));
    } else if(id==="kiko") {
      const item=input("Something to remember or organize");host.append($("label",{},"Add to your checklist"),item,button("Add item",()=>{const v=item.value.trim();if(!v)return;data.organizer.push({text:v,done:false});data.organizer=data.organizer.slice(-50);persist();renderTool(host,id);}));
      list(host,data.organizer,(i,checked)=>{data.organizer[i].done=checked;persist();renderTool(host,id);},i=>{data.organizer.splice(i,1);persist();renderTool(host,id);});
      host.append($("p",{className:"npc-progress-note"},data.organizer.filter(x=>x.done).length+" of "+data.organizer.length+" items completed."));
    } else if(id==="sora") {
      const idea=input("The idea you want to develop");const next=input("What's one action you can take?");host.append($("label",{},"Your idea"),idea,$("label",{},"First action"),next,button("Save idea plan",()=>{if(!idea.value.trim())return result(host,"Add your idea first.");saveNote("idea",idea.value.trim(),"First action: "+(next.value.trim()||"Explore the smallest possible first step."));result(host,"Idea saved. Your first action is written down.");}));
    } else if(id==="pippa") {
      const mins=$("select");[5,10,15,25,45].forEach(v=>mins.append($("option",{value:v},v+" minutes")));
      host.append($("label",{},"Choose a focus block"),mins,button("Start focus timer",()=>startTimer(host,Number(mins.value),"Focus block")));
    } else if(id==="remy") {
      const question=input("What do you want to find out?");const findings=$("textarea",{placeholder:"What did you learn? Add source names or links in your notes."});
      host.append($("label",{},"Research question"),question,$("label",{},"Findings and source notes"),findings,button("Save research note",()=>{if(!question.value.trim()||!findings.value.trim())return result(host,"Add both a question and some findings.");saveNote("research",question.value.trim(),findings.value.trim());result(host,"Research note saved in your NPC notebook.");}));
    } else if(id==="olli") {
      const goal=input("A goal you want to work toward");const step=input("First milestone");host.append($("label",{},"Your goal"),goal,$("label",{},"First milestone"),step,button("Plant this goal",()=>{if(!goal.value.trim())return result(host,"Give your goal a name first.");data.goals.push({text:goal.value.trim(),milestones:[{text:step.value.trim()||"Choose a first small action",done:false}]});data.goals=data.goals.slice(-30);persist();renderTool(host,id);}));
      list(host,data.goals.map(g=>({text:g.text+" — "+(g.milestones?.[0]?.text||"First step") ,done:!!g.milestones?.[0]?.done})),(i,checked)=>{data.goals[i].milestones[0].done=checked;persist();renderTool(host,id);},i=>{data.goals.splice(i,1);persist();renderTool(host,id);});
    } else if(id==="aki") {
      const challenges=["Learn five new words and use one in a sentence.","Clear ten unnecessary photos or files from your device.","Write a 100-word explanation of something you learned.","Organize one small area for ten minutes.","Practice a useful skill for fifteen minutes."];
      const challenge=challenges[(Math.floor(Date.now()/86400000)+2)%challenges.length];const key=today()+":"+challenge;host.append($("div",{className:"npc-result"},challenge));
      const done=data.completedChallenges.includes(key);host.append(button(done?"Completed today ✓":"Mark challenge complete",()=>{if(!data.completedChallenges.includes(key))data.completedChallenges.push(key);persist();renderTool(host,id);},done));
    }
  }
  function result(host,text) { const old=host.querySelector(".npc-result");if(old)old.remove();host.append($("div",{className:"npc-result",role:"status"},text)); }
  function startTimer(host,minutes,label) {
    clearInterval(timerId);secondsLeft=minutes*60;
    const display=$("div",{className:"npc-timer"});const status=$("p",{className:"npc-progress-note"},"In progress: "+label);
    const render=()=>display.textContent=String(Math.floor(secondsLeft/60)).padStart(2,"0")+":"+String(secondsLeft%60).padStart(2,"0");
    const controls=$("div",{className:"npc-tool-actions"});
    const pause=button("Pause",()=>{clearInterval(timerId);timerId=null;status.textContent="Paused: "+label;});
    const resume=button("Resume",()=>{if(timerId)return;timerId=setInterval(tick,1000);status.textContent="In progress: "+label;},true);
    const stop=button("End session",()=>{clearInterval(timerId);timerId=null;status.textContent="Session ended. Take a short break and note what you finished.";},true);
    function tick(){secondsLeft--;render();if(secondsLeft<=0){clearInterval(timerId);timerId=null;status.textContent="Session complete! Take a break and note what you accomplished.";}}
    controls.append(pause,resume,stop);host.append(status,display,controls);render();timerId=setInterval(tick,1000);
  }
  function setup() {
    const card=[...document.querySelectorAll(".tool-card")].find(el=>el.querySelector("h3")?.textContent.trim().toLowerCase()==="npc of the day");
    if(!card||card.dataset.npcWorkshopReady==="true")return;
    const source=card.querySelector(".npc-day-card");if(!source)return;
    card.dataset.npcWorkshopReady="true";load();addStyles();
    const wrap=$("section",{className:"npc-workshop"});
    const head=$("div",{className:"npc-workshop-head"});
    const heading=$("div");heading.append($("h4",{},"Meet the Residents"),$("p",{},"Choose a companion and use their little workbench."));
    head.append(heading,$("span",{className:"npc-progress-note"},"14 residents · your tools save to your account"));
    const grid=$("div",{className:"npc-resident-grid"});
    residents.forEach(r=>{const b=$("button",{type:"button",className:"npc-resident","aria-pressed":"false"});b.append($("span",{},r[3]),$("strong",{},r[0].charAt(0).toUpperCase()+r[0].slice(1)),$("small",{},r[1]));b.addEventListener("click",()=>{selected=r[0];grid.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.id===selected)));renderTool(tool,selected);});b.dataset.id=r[0];grid.append(b);});
    const tool=$("div",{className:"npc-tool", "aria-live":"polite"});
    wrap.append(head,grid,tool);card.append(wrap);
    const todayName=card.querySelector(".npc-day-name")?.textContent.trim().toLowerCase();
    const found=residents.find(r=>r[0]===todayName);
    if(found)selected=found[0];
    grid.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.id===selected)));
    renderTool(tool,selected);
  }
  function start() {
    setup();let attempts=0;
    const observer=new MutationObserver(()=>{setup();if(document.querySelector('[data-npc-workshop-ready="true"]')||++attempts>40)observer.disconnect();});
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),12000);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();