(() => {
  "use strict";
  const root=document.getElementById("rageRoom");
  if(!root||root.dataset.ready)return;
  root.dataset.ready="1";
  const $=id=>root.querySelector("#"+id);
  const safeRead=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch(_){return fallback}};
  const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}};
  const journalKey="btRagePrivateJournalV1",draftKey="btRageAnonymousDraftsV1";
  let hits=0,pins=0,smashes=0;
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
  function updatePinCount(){const el=$("ragePinCount");if(el)el.textContent=pins+" "+(pins===1?"pin":"pins");}
  function updateSmashCount(){const el=$("rageSmashCount");if(el)el.textContent=smashes+" / 12 smashed";}
  function placePin(doll,event){
    const rect=doll.getBoundingClientRect();
    const x=event.clientX?((event.clientX-rect.left)/rect.width)*100:50;
    const y=event.clientY?((event.clientY-rect.top)/rect.height)*100:48;
    const pin=document.createElement("span");
    pin.className="rage-needle";
    pin.style.left=Math.max(8,Math.min(92,x))+"%";
    pin.style.top=Math.max(12,Math.min(88,y))+"%";
    pin.style.setProperty("--needle-tilt",(Math.random()*54-27)+"deg");
    pin.setAttribute("aria-hidden","true");
    $("ragePinboard").append(pin);
    pins++;updatePinCount();
    status("ragePinStatus",pins+" visible "+(pins===1?"needle":"needles")+" placed. Tap another spot or reset the doll.");
    doll.classList.remove("doll-tapped");void doll.offsetWidth;doll.classList.add("doll-tapped");
    setTimeout(()=>doll.classList.remove("doll-tapped"),220);
  }
  function punchBag(){
    hits++;
    const bag=$("ragePunchTarget");
    bag.classList.remove("punching");void bag.offsetWidth;bag.classList.add("punching");
    const impact=$("ragePunchImpact");
    impact.classList.remove("show");void impact.offsetWidth;impact.classList.add("show");
    $("ragePunchCount").textContent=hits+" "+(hits===1?"hit":"hits");
    $("ragePunchMeter").style.width=(hits%10||10)*10+"%";
    status("ragePunchStatus",hits%10===0?"10-hit combo! Take a breath, or keep going.":"Nice hit. The bag is swinging — tap again!");
    setTimeout(()=>{bag.classList.remove("punching");impact.classList.remove("show");},520);
  }
  function smashPlate(button){
    if(button.disabled)return;
    button.disabled=true;button.classList.add("shattered");smashes++;updateSmashCount();
    const remaining=12-smashes;
    status("rageSmashStatus",remaining?remaining+" plates left. Pick another one!":"Every plate is smashed. Bring in a fresh rack when you're ready.");
    if(!remaining){$("ragePlateEmpty").hidden=false;$("rageRefillPlates").hidden=false;}
  }
  function refillPlates(){
    root.querySelectorAll("[data-plate]").forEach((plate,i)=>{plate.disabled=false;plate.classList.remove("shattered");plate.setAttribute("aria-label","Smash plate "+(i+1));});
    smashes=0;updateSmashCount();$("ragePlateEmpty").hidden=true;$("rageRefillPlates").hidden=true;
    status("rageSmashStatus","12 fresh plates are ready. Pick your target.");
  }
  root.addEventListener("click",event=>{
    const doll=event.target.closest("#rageDoll");
    if(doll){placePin(doll,event);return;}
    const plate=event.target.closest("[data-plate]");
    if(plate){smashPlate(plate);return;}
    const b=event.target.closest("button");if(!b)return;
    if(b.id==="rageClearPins"){$("ragePinboard").innerHTML="";pins=0;updatePinCount();status("ragePinStatus","The doll is reset. Start again whenever you're ready.");return;}
    if(b.id==="ragePunchTarget"){punchBag();return;}
    if(b.id==="rageRefillPlates"){refillPlates();return;}
    if(b.id==="rageSaveJournal"){const text=$("rageJournalInput").value.trim();if(!text){status("rageJournalStatus","Write a little something first.");return;}const notes=safeRead(journalKey,[]);notes.unshift({text,date:new Date().toLocaleString()});if(!safeWrite(journalKey,notes)){status("rageJournalStatus","Storage is full. Copy your note somewhere safe.");return;}$("rageJournalInput").value="";status("rageJournalStatus","Saved privately on this device.");renderJournal();return;}
    if(b.id==="rageSaveDraft"){const text=$("rageVentInput").value.trim();if(!text){status("rageVentStatus","Write your vent first.");return;}const notes=safeRead(draftKey,[]);notes.unshift({text,date:Date.now()});if(!safeWrite(draftKey,notes)){status("rageVentStatus","Could not save. Device storage may be full.");return;}$("rageVentInput").value="";status("rageVentStatus","Saved as a private draft. It has NOT been published.");renderDrafts();return;}
    if(b.dataset.deleteJournal!==undefined){const notes=safeRead(journalKey,[]);notes.splice(Number(b.dataset.deleteJournal),1);safeWrite(journalKey,notes);renderJournal();return;}
    if(b.dataset.deleteDraft!==undefined){const notes=safeRead(draftKey,[]);notes.splice(Number(b.dataset.deleteDraft),1);safeWrite(draftKey,notes);renderDrafts();return;}
    if(b.id==="rageLetGo"){const text=$("rageVentInput").value.trim();if(!text){status("rageVentStatus","Write something first, then let it go.");return;}const paper=$("rageBurnPaper");paper.hidden=false;paper.textContent="🔥 "+text;paper.classList.remove("burning");void paper.offsetWidth;paper.classList.add("burning");$("rageVentInput").value="";status("rageVentStatus","Released. Your note was not posted or saved.");setTimeout(()=>{paper.hidden=true;paper.textContent="";},1800);return;}
  });
  updatePinCount();updateSmashCount();renderJournal();renderDrafts();
})();