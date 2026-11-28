(() => {
  "use strict";
  const root=document.getElementById("cosmicFrontier");
  if(!root || root.dataset.ready==="true") return;
  root.dataset.ready="true";
  const KEY="btCosmicFrontierProgressV1";
  const destinations={
    lunara:{name:"Lunara",tag:"CRYSTAL WORLD",title:"The singing crystal forest",text:"A violet world of glowing trees, luminous caves and crystal formations. Your first task is to locate the source of a strange signal beneath the forest.",intro:"A violet twilight settles over the crystal groves. Strange light pulses beneath the surface.",scene:"lunara",finds:[["💎","Moonlit crystal","A clear crystal humming with a faint violet glow.","crystal",2],["🪷","Lumen blossom","A flower that opens only under the moonlight.","bio",1],["🪨","Singing shard","A tiny shard resonates when you hold it.","relic",1],["🦋","Prism moth","A delicate creature with wings like stained glass.","bio",2]]},
    verdantia:{name:"Verdantia",tag:"LIVING WORLD",title:"The overgrown frontier",text:"A lush planet filled with ancient roots, floating spores and unfamiliar life. Scan the jungle canopy for signs of a newly discovered species.",intro:"The air is warm and full of drifting spores. Something rustles in the giant leaves.",scene:"verdantia",finds:[["🍄","Glowcap cluster","A soft bioluminescent fungus growing near an old root.","bio",2],["🌿","Ancient seedpod","A seed from a plant older than the forest itself.","bio",1],["🪲","Mossback crawler","A tiny six-legged creature wearing a coat of moss.","bio",2],["🪵","Rootbound relic","A carved token held inside the roots of a giant tree.","relic",1]]},
    solara:{name:"Solara",tag:"DESERT WORLD",title:"Secrets beneath the golden dunes",text:"A sunlit desert hides the remains of a civilization. Your expedition begins with an artifact reading near the edge of the old ruins.",intro:"Golden dunes stretch to the horizon. Half-buried stonework hints at a lost civilization.",scene:"solara",finds:[["🏺","Sunken urn","A sealed vessel uncovered by the shifting sand.","relic",2],["🦂","Dune skitter","A curious little desert creature with shimmering plates.","bio",1],["☀️","Solar glass","A warm piece of glass that stores sunlight.","crystal",2],["🗿","Ruins medallion","A worn medallion marked with an unfamiliar constellation.","relic",1]]},
    cryon:{name:"Cryon",tag:"FROZEN WORLD",title:"Signals beneath the ice",text:"An icy ocean glows beneath the frozen surface. Trace the aurora signal and investigate what is moving below the glacial shelf.",intro:"Auroras ripple across a frozen sea. Beneath the ice, a soft blue light answers your scanner.",scene:"cryon",finds:[["🧊","Aurora ice","A translucent shard that glows in shifting colors.","crystal",2],["🐧","Frostling","A round, curious creature leaving tiny glowing tracks.","bio",2],["🐚","Icebound shell","A shell preserved inside a sheet of ancient ice.","relic",1],["🫧","Blue bubble","A pocket of warm air trapped beneath the frozen shelf.","bio",1]]}
  };
  const fresh=()=>({found:{},totals:{crystal:0,bio:0,relic:0},log:[]});
  let progress=fresh();
  try{const saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved&&saved.found&&saved.totals&&Array.isArray(saved.log))progress=saved;}catch(_){}
  let activePlanet=null;
  const $=id=>root.querySelector("#"+id);
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(progress));$("cosmicSaveNote").textContent="✦ Expedition progress saved on this device.";}catch(_){$("cosmicSaveNote").textContent="Your browser could not save progress. Check available device storage."; }};
  const foundFor=planet=>Object.keys(progress.found).filter(key=>key.startsWith(planet+":")).length;
  const updateInventory=()=>{
    $("cosmicCrystalCount").textContent=progress.totals.crystal;
    $("cosmicBioCount").textContent=progress.totals.bio;
    $("cosmicRelicCount").textContent=progress.totals.relic;
    $("cosmicLogCount").textContent=progress.log.length+" found";
    const log=$("cosmicDiscoveryLog");
    if(!progress.log.length){log.innerHTML="<p>No discoveries yet. Your first find is waiting.</p>";return;}
    log.innerHTML=progress.log.slice().reverse().map(item=>'<article class="cosmic-log-entry"><span>'+item.icon+'</span><div><strong>'+escapeText(item.name)+'</strong><small>'+escapeText(item.planet)+' · '+escapeText(item.description)+'</small></div><b>+'+item.amount+'</b></article>').join("");
  };
  const escapeText=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const updatePlanetProgress=()=>{
    const total=destinations[activePlanet].finds.length, count=foundFor(activePlanet);
    $("cosmicPlanetProgress").textContent=count+" / "+total+" discoveries";
    $("cosmicPlanetProgressBar").style.width=(count/total*100)+"%";
    $("cosmicPlanetProgressHint").textContent=count===total?"Survey complete! This planet has revealed all its current secrets.":(total-count)+" hidden discoveries remain in this landing zone.";
    $("cosmicLandingStatus").textContent=count===total?"SURVEY COMPLETE":"EXPLORING";
  };
  const renderPlanet=planet=>{
    activePlanet=planet;const data=destinations[planet];
    $("cosmicExplore").hidden=false;
    $("cosmicExploreTitle").textContent=data.name+" · Landing zone";
    $("cosmicExploreIntro").textContent=data.intro;
    $("cosmicLandscape").className="cosmic-landscape scene-"+data.scene;
    $("cosmicDiscoveryGrid").innerHTML=data.finds.map((item,index)=>{
      const id=planet+":"+index,found=!!progress.found[id];
      return '<button type="button" class="cosmic-find '+(found?"is-found":"")+'" data-cosmic-find="'+index+'" '+(found?'disabled aria-label="'+escapeText(item[1])+' already collected':'aria-label="Investigate hidden discovery '+(index+1)+'"')+'><span class="cosmic-find-icon">'+(found?"✓":item[0])+'</span><strong>'+(found?escapeText(item[1]):"Unknown signal")+'</strong><small>'+(found?"Added to field log":"Tap to investigate")+'</small></button>';
    }).join("");
    updatePlanetProgress();
    $("cosmicExplore").scrollIntoView({behavior:"smooth",block:"start"});
  };
  updateInventory();
  root.addEventListener("click",event=>{
    const card=event.target.closest("[data-cosmic-planet]");
    if(card&&root.contains(card)){
      const planet=card.dataset.cosmicPlanet,data=destinations[planet];if(!data)return;
      root.querySelectorAll("[data-cosmic-planet]").forEach(button=>button.setAttribute("aria-pressed",String(button===card)));
      $("cosmicMissionTitle").textContent=data.title;
      $("cosmicMissionText").textContent=data.text;
      $("cosmicSelectedPlanet").textContent="DESTINATION: "+data.name.toUpperCase();
      $("cosmicSelectionStatus").textContent=data.name+" selected — "+data.tag+". Your landing zone is ready below.";
      renderPlanet(planet);return;
    }
    const find=event.target.closest("[data-cosmic-find]");
    if(find&&root.contains(find)&&activePlanet){
      const index=Number(find.dataset.cosmicFind),item=destinations[activePlanet].finds[index],id=activePlanet+":"+index;
      if(!item||progress.found[id])return;
      progress.found[id]=true;progress.totals[item[3]]+=item[4];
      progress.log.push({planet:destinations[activePlanet].name,icon:item[0],name:item[1],description:item[2],amount:item[4],type:item[3]});
      save();updateInventory();renderPlanet(activePlanet);
      $("cosmicSelectionStatus").textContent="Discovery secured: "+item[1]+". Added to your field pack!";
    }
  });
  Object.keys(destinations).forEach(planet=>{
    const count=foundFor(planet);
    if(count===destinations[planet].finds.length){
      const button=root.querySelector('[data-cosmic-planet="'+planet+'"]');
      if(button)button.classList.add("survey-complete");
    }
  });
})();