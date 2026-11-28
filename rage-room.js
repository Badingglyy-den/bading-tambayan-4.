(() => {
  "use strict";
  const root=document.getElementById("rageRoom");
  if(!root||root.dataset.ready)return;
  root.dataset.ready="1";
  const $=id=>root.querySelector("#"+id);
  const safeRead=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch(_){return fallback}};
  const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}};
  const journalKey="btRagePrivateJournalV1";
  const draftKey="btRageAnonymousDraftsV1";
  let hits=0,pins=0,shards=0;
  const status=(id,msg)=>{const el=$(id);if(el)el.textContent=msg};
  const escapeHTML=value=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function renderJournal(){
    const list=$("rageJournalList");if(!list)return;
    const notes=safeRead(journalKey,[]);
    list.innerHTML=notes.length?notes.map((n,i)=>'<article class="rage-note">'+escapeHTML(n.text)+'<small>'+escapeHTML(n.date)+' · Private to this browser <button class="rage-btn secondary" data-delete-journal="'+i+'" type="button">Delete</button></small></article>').join(""):'<p class="rage-muted">Your private pages will appear here. Nobody else can see them.</p>';
  }
  function renderDrafts(){
    const list=$("rageDraftList");if(!list)return;
    const notes=safeRead(draftKey,[]);
    list.innerHTML=notes.length?notes.map((n,i)=>'<article class="rage-note">'+escapeHTML(n.text)+'<small>Unpublished anonymous draft · saved on this device <button class="rage-btn secondary" data-delete-draft="'+i+'" type="button">Delete</button></small></article>').join(""):'<p class="rage-muted">No saved drafts yet.</p>';
  }
  root.addEventListener("click",event=>{
    const b=event.target.closest("button");if(!b)return;
    if(b.dataset.rageTab){root.querySelectorAll("[data-rage-panel]").forEach(p=>p.hidden=p.dataset.ragePanel!==b.dataset.rageTab);root.querySelectorAll("[data-rage-tab]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));return;}
    if(b.hasAttribute("data-pin")){pins++;const pin=document.createElement("span");pin.textContent=["📌","🪡","📍"][pins%3];pin.title="A frustration you chose to release";$("ragePinboard").append(pin);status("ragePinStatus",pins+" pins placed. You can remove them with Clear.");return;}
    if(b.id==="rageClearPins"){$("ragePinboard").innerHTML="";pins=0;status("ragePinStatus","The doll is reset. Take a breath.");return;}
    if(b.id==="rageSmash"){shards++;const target=$("rageSmashTarget");target.textContent=["🍽️","💥","🧩","✨","🫧"][shards%5];target.classList.add("hit");setTimeout(()=>target.classList.remove("hit"),140);$("rageSmashCount").textContent=shards+" objects smashed";status("rageSmashStatus","Satisfying, right? All safely virtual.");return;}
    if(b.id==="ragePunch"){hits++;$("ragePunchMeter").style.width=Math.min(100,hits*10)+"%";$("ragePunchCount").textContent=hits+" hits";$("ragePunchTarget").textContent=hits%3===0?"🥊":"🥊";$("ragePunchTarget").classList.add("hit");setTimeout(()=>$("ragePunchTarget").classList.remove("hit"),140);if(hits>=10){hits=0;status("ragePunchStatus","Combo complete. Resetting your stress meter.");}else status("ragePunchStatus","Keep it virtual. Take a pause whenever you need.");return;}
    if(b.id==="rageSaveJournal"){const text=$("rageJournalInput").value.trim();if(!text){status("rageJournalStatus","Write a little something first.");return;}const notes=safeRead(journalKey,[]);notes.unshift({text,date:new Date().toLocaleString()});if(!safeWrite(journalKey,notes)){status("rageJournalStatus","Storage is full. Copy your note somewhere safe.");return;}$("rageJournalInput").value="";status("rageJournalStatus","Saved privately on this device.");renderJournal();return;}
    if(b.id==="rageSaveDraft"){const text=$("rageVentInput").value.trim();if(!text){status("rageVentStatus","Write your vent first.");return;}const notes=safeRead(draftKey,[]);notes.unshift({text,date:Date.now()});if(!safeWrite(draftKey,notes)){status("rageVentStatus","Could not save. Device storage may be full.");return;}$("rageVentInput").value="";status("rageVentStatus","Saved as a private draft. It has NOT been published.");renderDrafts();return;}
    if(b.dataset.deleteJournal!==undefined){const notes=safeRead(journalKey,[]);notes.splice(Number(b.dataset.deleteJournal),1);safeWrite(journalKey,notes);renderJournal();return;}
    if(b.dataset.deleteDraft!==undefined){const notes=safeRead(draftKey,[]);notes.splice(Number(b.dataset.deleteDraft),1);safeWrite(draftKey,notes);renderDrafts();return;}
    if(b.id==="rageLetGo"){const text=$("rageVentInput").value.trim();if(!text){status("rageVentStatus","Write something first, then let it go.");return;}const paper=$("rageBurnPaper");paper.hidden=false;paper.textContent="🔥 "+text;paper.classList.remove("burning");void paper.offsetWidth;paper.classList.add("burning");$("rageVentInput").value="";status("rageVentStatus","Released. Your note was not posted or saved.");setTimeout(()=>{paper.hidden=true;paper.textContent="";},1800);return;}
  });
  renderJournal();renderDrafts();
})();