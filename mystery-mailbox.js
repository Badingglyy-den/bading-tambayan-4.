(() => {
  "use strict";
  const KEY = "bt_mystery_mailbox_v1";
  const letters = {
    bloomtide: [
      {id:"bloom-pochi-1",from:"Pochi",icon:"🌱",title:"A tiny beginning",message:"I found a little green shoot near the garden path today. It was so small I almost missed it.\n\nIt made me think: maybe not every new beginning needs to announce itself. Some things simply start, quietly, and keep growing.\n\nIs there something small you'd like to begin?",replies:["I'll start with one small step.","I'm still figuring it out.","I'll make room for something new."]},
      {id:"bloom-momo-1",from:"Momo",icon:"📝",title:"The first blank page",message:"I opened my notebook and stared at the first page for a while. No brilliant idea arrived, of course. So I wrote down one ordinary thing I noticed.\n\nThat was enough to get the ink moving. What's one thought you've been carrying around?",replies:["I have a thought to let out.","Maybe I'll write it down.","Today, noticing is enough."]},
      {id:"bloom-olli-1",from:"Olli",icon:"🌼",title:"A little room to grow",message:"A garden doesn't ask every seed to bloom at once. I think people deserve that same patience.\n\nYou can take your time. What would you like to give a little care to this week?",replies:["Something I've been putting off.","My own little routine.","Someone or something I care about."]},
      {id:"bloom-sora-1",from:"Sora",icon:"🪁",title:"An idea on the breeze",message:"An idea flew past me today. I couldn't catch all of it, but I kept one little piece. Maybe that's how ideas work: you don't need the whole picture to begin.\n\nWhat's been on your mind lately?",replies:["A project I'd love to try.","A place I'd like to explore.","A question I want to follow."]}
    ],
    suncrest: [
      {id:"sun-pippa-1",from:"Pippa",icon:"☀️",title:"A pocket of sunshine",message:"I saved you a little pocket of sunshine. Not the kind that asks you to be productive every minute—just the kind that reminds you to stretch, drink some water, and enjoy being here.\n\nWhat's one bright spot in your day?",replies:["A person made me smile.","I finished a small task.","I'm glad I got a quiet moment."]},
      {id:"sun-aki-1",from:"Aki",icon:"🍋",title:"A cheerful challenge",message:"Today's tiny challenge: make one ordinary thing feel a little more fun. Put on a song, take a different route, or add a silly name to your to-do list.\n\nWhat will you choose?",replies:["I'll make a boring task fun.","I'll try something different.","I'll invent my own tiny challenge."]},
      {id:"sun-lumi-1",from:"Lumi",icon:"✨",title:"One thing at a time",message:"The sun is doing that thing where it makes everything look possible. I made a short list, then crossed out everything except the one thing that matters most right now.\n\nWhat's your one thing?",replies:["I'll choose my top priority.","I'll finish what I've started.","I'll give myself a proper break."]},
      {id:"sun-bibi-1",from:"Bibi",icon:"🧩",title:"The missing piece",message:"I used to think progress meant solving the whole puzzle. Now I just look for the next piece that fits.\n\nIf a big thing is on your mind, what's one small piece you can handle today?",replies:["I'll break it into smaller steps.","I'll ask someone for help.","I'll begin with what I know."]}
    ],
    leafwhisper: [
      {id:"leaf-yuki-1",from:"Yuki",icon:"🍂",title:"What is worth keeping?",message:"A leaf landed on my notebook today. I pressed it between two pages—not because it was perfect, but because I wanted to remember that moment.\n\nWhat's one little thing from lately that you'd like to keep?",replies:["A memory with someone.","A moment I felt proud.","A small thing that made me laugh."]},
      {id:"leaf-kiko-1",from:"Kiko",icon:"📎",title:"A gentle sort-out",message:"I tidied one tiny corner of my desk. Not the whole room, just one corner. It felt surprisingly good.\n\nIs there a little thing you'd like to clear up or let go of?",replies:["A task that's been lingering.","Some clutter around me.","A thought taking up too much space."]},
      {id:"leaf-remy-1",from:"Remy",icon:"🔎",title:"A question worth following",message:"I noticed that the best discoveries often begin with a very ordinary question. Mine today was: why do some memories feel warmer than others?\n\nWhat's something you've been curious about?",replies:["Something I want to learn.","Something about the world.","Something about myself."]},
      {id:"leaf-nubi-1",from:"Nubi",icon:"☕",title:"Rest belongs on the list",message:"I made a cup of tea and sat down before everything was finished. The world did not fall apart.\n\nJust a reminder from me: rest can be part of the plan, too. Have you given yourself a pause lately?",replies:["Yes, and I needed it.","Not yet, but I will.","I'm learning not to feel guilty about it."]}
    ],
    frostveil: [
      {id:"frost-nubi-1",from:"Nubi",icon:"❄️",title:"A quiet kind of progress",message:"The world feels a little quieter today. I used to mistake quiet days for days when nothing happened. Now I think some progress is simply gathering strength where nobody can see it.\n\nWhat would you like to be patient with?",replies:["A goal that's taking time.","My own pace.","A situation I can't rush."]},
      {id:"frost-ruru-1",from:"Ruru",icon:"🕯️",title:"A question like a lantern",message:"I brought a little lantern to the window and thought of a question: what would you try if you didn't need to get it perfect on the first attempt?\n\nYou don't have to answer out loud. Just let the question keep you company.",replies:["I'd try something creative.","I'd finally ask a question.","I'd give myself permission to learn."]},
      {id:"frost-olli-1",from:"Olli",icon:"🌙",title:"Growing underneath",message:"The garden looks still, but I know there's life underneath the soil. I think that's worth remembering about ourselves, too.\n\nYou don't have to show progress every day for it to count.",replies:["I needed that reminder.","I'll trust my small steps.","I'll be kinder to myself today."]},
      {id:"frost-sora-1",from:"Sora",icon:"🦊",title:"Leave room for wonder",message:"I saw the sky turn a deep blue just before evening. Nothing special happened. I just stopped and watched.\n\nMaybe that's a good little plan for today: leave room for one thing that doesn't need to become a task.",replies:["I'll take a moment to look around.","I'll do something just for fun.","I'll see where curiosity takes me."]}
    ]
  };
  const $ = id => document.getElementById(id);
  const season = document.body.dataset.season || "bloomtide";
  const seasonNames = {bloomtide:"BLOOMTIDE LETTER",suncrest:"SUNCREST LETTER",leafwhisper:"LEAFWHISPER LETTER",frostveil:"FROSTVEIL LETTER"};
  const today = new Date();
  const day = Math.floor(Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate())/86400000);
  const pool = letters[season] || letters.bloomtide;
  const letter = pool[((day % pool.length)+pool.length)%pool.length];
  let state = {opened:[]};
  try { const saved=JSON.parse(localStorage.getItem(KEY)||"null"); if(saved&&Array.isArray(saved.opened)) state.opened=saved.opened.filter(x=>x&&typeof x.id==="string"); } catch (_) {}
  const save = () => { try { localStorage.setItem(KEY,JSON.stringify(state)); } catch (_) {} };
  const opened = () => state.opened.some(x=>x.id===letter.id);
  const showLetter = () => {
    $("mailboxLetter").hidden=false;
    $("mailboxLetterSeason").textContent=seasonNames[season]||"A LITTLE NOTE";
    $("mailboxLetterDate").textContent="DAY "+day;
    $("mailboxSenderIcon").textContent=letter.icon;
    $("mailboxSender").textContent=letter.from;
    $("mailboxLetterTitle").textContent=letter.title;
    $("mailboxLetterMessage").textContent=letter.message;
    $("mailboxReplies").replaceChildren();
    const previous=state.opened.find(x=>x.id===letter.id);
    letter.replies.forEach(reply=>{
      const button=document.createElement("button");
      button.type="button"; button.textContent=reply;
      if(previous&&previous.reply){button.disabled=true;}
      button.addEventListener("click",()=>{
        const record=state.opened.find(x=>x.id===letter.id);
        if(record){record.reply=reply;} else {state.opened.push({id:letter.id,reply,date:new Date().toISOString().slice(0,10)});}
        save(); button.parentElement.querySelectorAll("button").forEach(b=>b.disabled=true);
        $("mailboxReplyStatus").textContent="Your reply has been tucked safely into this little memory. 💌";
        renderArchive();
      });
      $("mailboxReplies").append(button);
    });
    $("mailboxReplyStatus").textContent=previous&&previous.reply?"You replied: “"+previous.reply+"”":"Choose a little reply if you'd like. No pressure.";
    $("mailboxOpenButton").textContent="Letter opened ✓";
    $("mailboxOpenButton").disabled=true;
    if(!previous){state.opened.push({id:letter.id,reply:"",date:new Date().toISOString().slice(0,10)});save();}
    renderArchive();
  };
  const renderArchive=()=>{
    const list=$("mailboxArchiveList"); list.replaceChildren();
    const records=state.opened.slice().reverse();
    $("mailboxArchiveCount").textContent=records.length?records.length+" "+(records.length===1?"letter":"letters")+" opened and kept on this device.":"Your little collection of opened letters will live here.";
    if(!records.length){const p=document.createElement("p");p.className="mailbox-archive-empty";p.textContent="Your first opened letter will find a home here.";list.append(p);return;}
    const lookup={};Object.values(letters).flat().forEach(item=>lookup[item.id]=item);
    records.forEach(record=>{
      const item=lookup[record.id]; if(!item)return;
      const row=document.createElement("div");row.className="mailbox-archive-item";
      const title=document.createElement("span");title.textContent=item.icon+" "+item.title+" — "+item.from;
      const date=document.createElement("small");date.textContent=record.date||"Saved";
      row.append(title,date);list.append(row);
    });
  };
  $("mailboxSeasonLabel").textContent=seasonNames[season]||"A NOTE FROM THE TAMBAYANVERSE";
  $("mailboxArrivalTitle").textContent=opened()?"Your letter from "+letter.from+" is ready to revisit.":"A letter from "+letter.from+" is waiting.";
  $("mailboxArrivalHint").textContent=opened()?"You've already opened today's note. You can read it again anytime.":"A small note for "+(season==="bloomtide"?"a fresh beginning":season==="suncrest"?"a bright day":season==="leafwhisper"?"a golden moment":"a quiet moment")+".";
  $("mailboxOpenButton").addEventListener("click",showLetter);
  $("mailboxArchiveToggle").addEventListener("click",()=>{
    const panel=$("mailboxArchive");const willOpen=panel.hidden;panel.hidden=!willOpen;
    $("mailboxArchiveToggle").setAttribute("aria-expanded",String(willOpen));
    $("mailboxArchiveToggle").innerHTML=willOpen?'Hide opened letters <span aria-hidden="true">↑</span>':'View opened letters <span aria-hidden="true">↓</span>';
  });
  if(opened()) showLetter();
  renderArchive();
})();
