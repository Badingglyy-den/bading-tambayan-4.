(() => {
"use strict";
const KEY="bt_diary_keepsakes_v1";
const $=id=>document.getElementById(id);
const prompts=[
["A tiny thing that made today better","It was small, but I want to remember..."],
["A version of me I'm quietly proud of","I don't always give myself credit for..."],
["Something I wish people understood","If I could explain one thing, it would be..."],
["A moment I want to freeze","For a second, everything felt like..."],
["A thought I keep carrying around","Lately, I have been thinking about..."],
["A little promise to tomorrow-me","Tomorrow, I hope I remember to..."],
["Something ordinary that felt special","Maybe it mattered because..."],
["A plot twist I never saw coming","I didn't expect that..."]
];
const fresh=()=>({unsent:[],bottles:[],artifacts:[],threads:[],secrets:{},daily:{date:"",index:0}});
let data=fresh();
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||"null");if(v&&typeof v==="object")data={...fresh(),...v,secrets:v.secrets&&typeof v.secrets==="object"?v.secrets:{}};}catch{}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));}catch{$("diaryRandomStatus").textContent="This browser couldn't save the keepsake. Check available storage.";}}
function mini(id,html){const el=$(id);if(el)el.innerHTML=html||'<p class="diary-mini-empty">Nothing here yet. This little shelf is waiting.</p>';}
function dateLabel(s){const d=new Date(s+"T12:00:00");return Number.isNaN(d.getTime())?s:d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});}
function getEntries(){try{let x=JSON.parse(localStorage.getItem("tambayanverse_42_progress")||"null");if(x?.data)x=x.data;return Array.isArray(x?.entries)?x.entries:[];}catch{return[];}}
function refreshEntryOptions(){
 const entries=getEntries().filter(e=>e&&e.id);
 ["diaryThreadFirst","diaryThreadSecond","diarySecretEntry"].forEach(id=>{
  const el=$(id);if(!el)return;const old=el.value;
  el.innerHTML='<option value="">Choose an entry</option>'+entries.map(e=>'<option value="'+esc(e.id)+'">'+esc(e.title||"Untitled page")+'</option>').join("");
  if(entries.some(e=>e.id===old))el.value=old;
 });
}
function render(){
 mini("diaryUnsentList",data.unsent.slice().reverse().map(x=>'<article class="diary-mini-item"><b>To: '+esc(x.to)+'</b><p>'+esc(x.body)+'</p><small>Sealed '+esc(dateLabel(x.date))+'</small></article>').join(""));
 mini("diaryBottleList",data.bottles.slice().reverse().map((x,i)=>{
  const opened=x.opened||x.unlock<=today();
  return '<article class="diary-mini-item"><b>'+(opened?"🍾 Washed ashore":"🌊 Still drifting")+' · '+esc(dateLabel(x.unlock))+'</b><p>'+(opened?esc(x.message):"This message is still sealed until its chosen day.")+'</p>'+(opened&&!x.opened?'<button type="button" class="diary-room-button" data-bottle-open="'+esc(x.id)+'">Open bottle</button>':"")+'</article>';
 }).join(""));
 mini("diaryArtifactList",data.artifacts.slice().reverse().map(x=>'<article class="diary-mini-item"><b>✦ '+esc(x.name)+' <small>· '+esc(x.type)+'</small></b><p>'+esc(x.story)+'</p></article>').join(""));
 mini("diaryThreadList",data.threads.slice().reverse().map(x=>'<article class="diary-mini-item"><b>🧵 '+esc(x.aTitle)+' ↔ '+esc(x.bTitle)+'</b><p>'+esc(x.note)+'</p></article>').join(""));
 const secrets=Object.entries(data.secrets);
 mini("diarySecretList",secrets.slice().reverse().map(([id,x])=>'<article class="diary-mini-item"><b>🗝️ '+esc(x.title)+' · Hidden footnote</b><p>'+esc(x.note)+'</p></article>').join(""));
 refreshEntryOptions();
}
function init(){
 load();
 const day=today();
 if(data.daily.date!==day){
  const n=Number(day.replaceAll("-",""));
  data.daily={date:day,index:(n*17+Math.floor(n/7))%prompts.length};
  save();
 }
 const p=prompts[data.daily.index]||prompts[0];
 $("diaryRandomPrompt").textContent=p[0];
 $("diaryRandomOpen").addEventListener("click",()=>{
  $("diaryRandomPrompt").textContent=p[0]+" — "+p[1];
  $("diaryRandomStatus").textContent="Your prompt is ready. Use it whenever you feel like writing.";
  let use=$("diaryRandomUse");
  if(!use){use=document.createElement("button");use.type="button";use.id="diaryRandomUse";use.className="diary-room-button";use.textContent="Write about this";$("diaryRandomRoom").appendChild(use);}
  use.onclick=()=>{$("entryType").value="journal";$("entryTitle").value=p[0];$("entryBody").value=p[1]+"\n\n";$("diaryForm").scrollIntoView({behavior:"smooth",block:"center"});$("entryBody").focus({preventScroll:true});};
 });
 $("diaryUnsentSave").addEventListener("click",()=>{
  const to=$("diaryUnsentTo").value.trim(),body=$("diaryUnsentBody").value.trim();
  if(!to||!body)return;
  data.unsent.push({id:"u"+Date.now(),to,body,date:today()});save();$("diaryUnsentTo").value="";$("diaryUnsentBody").value="";render();
 });
 $("diaryBottleDate").min=today();
 $("diaryBottleSave").addEventListener("click",()=>{
  const message=$("diaryBottleMessage").value.trim(),unlock=$("diaryBottleDate").value;
  if(!message||!unlock||unlock<today())return;
  data.bottles.push({id:"b"+Date.now(),message,unlock,opened:false});save();$("diaryBottleMessage").value="";$("diaryBottleDate").value="";render();
 });
 $("diaryArtifactSave").addEventListener("click",()=>{
  const name=$("diaryArtifactName").value.trim(),story=$("diaryArtifactStory").value.trim();
  if(!name||!story)return;
  data.artifacts.push({id:"a"+Date.now(),name,type:$("diaryArtifactType").value,story,date:today()});save();$("diaryArtifactName").value="";$("diaryArtifactStory").value="";render();
 });
 $("diaryThreadSave").addEventListener("click",()=>{
  const entries=getEntries(),a=entries.find(e=>e.id===$("diaryThreadFirst").value),b=entries.find(e=>e.id===$("diaryThreadSecond").value),note=$("diaryThreadNote").value.trim();
  if(!a||!b||a.id===b.id||!note)return;
  data.threads.push({id:"t"+Date.now(),aTitle:a.title||"Untitled page",bTitle:b.title||"Untitled page",note,date:today()});save();$("diaryThreadNote").value="";render();
 });
 $("diarySecretSave").addEventListener("click",()=>{
  const id=$("diarySecretEntry").value,note=$("diarySecretNote").value.trim(),entry=getEntries().find(e=>e.id===id);
  if(!entry||!note)return;
  data.secrets[id]={title:entry.title||"Untitled page",note,date:today()};save();$("diarySecretNote").value="";render();
 });
 $("diaryBottleList").addEventListener("click",e=>{
  const b=e.target.closest("[data-bottle-open]");if(!b)return;
  const item=data.bottles.find(x=>x.id===b.dataset.bottleOpen);if(!item||item.unlock>today())return;
  item.opened=true;save();render();
 });
 document.querySelectorAll("#diaryKeepsakes details").forEach(d=>d.addEventListener("toggle",()=>{if(d.open)refreshEntryOptions();}));
 render();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();