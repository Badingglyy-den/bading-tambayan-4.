(() => {
"use strict";
const root=document.getElementById("whatsNew");
if(!root)return;
const toggle=root.querySelector("#whatsNewToggle");
const content=root.querySelector("#whatsNewContent");
const dot=root.querySelector("#whatsNewDot");
const STORAGE_KEY="bt_whats_new_seen_v1";
// Change this ID and add a note whenever a new release is published.
const UPDATE_ID="2026-11-28-pwa-launch";
const notes=[
{icon:"📲",title:"Bading Tambayan can now live on your home screen",text:"Install the website as an app-like shortcut on your phone. It still opens the same Tambayanverse, with the same account and features."},
{icon:"🌱",title:"The Community Garden has more places to explore",text:"Visit the Wish Tree, Little Acts, Big Blooms, Garden Notes, Firefly Moments, and Seasonal Greenhouse."},
{icon:"📖",title:"The Diary has new keepsake rooms",text:"Try the Random Drawer, unsent letters, Message in a Bottle, Museum of Me, Red Thread, and hidden page notes."},
{icon:"🎵",title:"The Forgotten Attic Music Box can play melodies",text:"Listen to its original little music-box tunes, then replay or stop the sound whenever you like."}
];
let seen="";
try{seen=localStorage.getItem(STORAGE_KEY)||"";}catch(_){}
if(seen===UPDATE_ID)dot.hidden=true;
toggle.addEventListener("click",()=>{
const opening=content.hidden;
content.hidden=!opening;
toggle.setAttribute("aria-expanded",String(opening));
toggle.querySelector(".whats-new-label").textContent=opening?"Hide updates":"See what's new";
if(opening){dot.hidden=true;try{localStorage.setItem(STORAGE_KEY,UPDATE_ID);}catch(_){}}
});
const list=root.querySelector("#whatsNewList");
notes.forEach(note=>{
const item=document.createElement("article");item.className="whats-new-item";
const icon=document.createElement("span");icon.className="whats-new-icon";icon.setAttribute("aria-hidden","true");icon.textContent=note.icon;
const copy=document.createElement("div");const heading=document.createElement("h3");heading.textContent=note.title;
const paragraph=document.createElement("p");paragraph.textContent=note.text;copy.append(heading,paragraph);item.append(icon,copy);list.append(item);
});
})();
