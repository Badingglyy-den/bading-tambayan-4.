(() => {
  "use strict";
  const root=document.getElementById("cosmicFrontier");
  if(!root || root.dataset.ready==="true") return;
  root.dataset.ready="true";
  const KEY="btCosmicFrontierProgressV1";
  const destinations={
    lunara:{name:"Lunara",tag:"CRYSTAL WORLD",title:"The singing crystal forest",text:"A violet world of glowing trees, luminous caves and crystal formations. Locate the source of the strange signal beneath the forest.",intro:"A violet twilight settles over the crystal groves. Strange light pulses beneath the surface.",scene:"lunara",creature:3,life:["🦋","Prism moth","A delicate night-flyer with stained-glass wings. It follows the rhythm of nearby crystals."],finds:[["💎","Moonlit crystal","A clear crystal humming with a faint violet glow.","crystal",2],["🪷","Lumen blossom","A flower that opens only under the moonlight.","bio",1],["🪨","Singing shard","A tiny shard resonates when you hold it.","relic",1],["🦋","Prism moth","A delicate creature with wings like stained glass.","bio",2]]},
    verdantia:{name:"Verdantia",tag:"LIVING WORLD",title:"The overgrown frontier",text:"A lush planet filled with ancient roots, floating spores and unfamiliar life. Scan the jungle canopy for a newly discovered species.",intro:"The air is warm and full of drifting spores. Something rustles in the giant leaves.",scene:"verdantia",creature:2,life:["🪲","Mossback crawler","A gentle six-legged wanderer carrying a miniature garden of moss."],finds:[["🍄","Glowcap cluster","A soft bioluminescent fungus growing near an old root.","bio",2],["🌿","Ancient seedpod","A seed from a plant older than the forest itself.","bio",1],["🪲","Mossback crawler","A tiny six-legged creature wearing a coat of moss.","bio",2],["🪵","Rootbound relic","A carved token held inside the roots of a giant tree.","relic",1]]},
    solara:{name:"Solara",tag:"DESERT WORLD",title:"Secrets beneath the golden dunes",text:"A sunlit desert hides the remains of a civilization. Investigate the ruins and follow the movement beneath the sand.",intro:"Golden dunes stretch to the horizon. Half-buried stonework hints at a lost civilization.",scene:"solara",creature:1,life:["🦂","Dune skitter","A curious desert creature with shimmering heat-reflective plates."],finds:[["🏺","Sunken urn","A sealed vessel uncovered by the shifting sand.","relic",2],["🦂","Dune skitter","A curious little desert creature with shimmering plates.","bio",1],["☀️","Solar glass","A warm piece of glass that stores sunlight.","crystal",2],["🗿","Ruins medallion","A worn medallion marked with an unfamiliar constellation.","relic",1]]},
    cryon:{name:"Cryon",tag:"FROZEN WORLD",title:"Signals beneath the ice",text:"An icy ocean glows beneath the frozen surface. Trace the aurora signal and investigate what is moving below the glacial shelf.",intro:"Auroras ripple across a frozen sea. Beneath the ice, a soft blue light answers your scanner.",scene:"cryon",creature:1,life:["🐧","Frostling","A round, curious creature that leaves tiny glowing tracks across the ice."],finds:[["🧊","Aurora ice","A translucent shard that glows in shifting colors.","crystal",2],["🐧","Frostling","A round, curious creature leaving tiny glowing tracks.","bio",2],["🐚","Icebound shell","A shell preserved inside a sheet of ancient ice.","relic",1],["🫧","Blue bubble","A pocket of warm air trapped beneath the frozen shelf.","bio",1]]}
  };
  const fresh=()=>({found:{},totals:{crystal:0,bio:0,relic:0},log:[],creatures:{},missions:{}});
  let progress=fresh(),activePlanet=null;
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||"null");
    if(saved&&saved.found&&saved.totals&&Array.isArray(saved.log)){
      progress={...fresh(),...saved,creatures:saved.creatures||{},missions:saved.missions||{}};
    }
  }catch(_){}
  const $=id=>root.querySelector("#"+id);
  const escapeText=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(progress));$("cosmicSaveNote").textContent="✦ Expedition progress saved privately on this device.";}catch(_){$("cosmicSaveNote").textContent="Your browser could not save progress. Check available device storage."; }};
  const foundFor=planet=>Object.keys(progress.found).filter(key=>key.startsWith(planet+":")).length;
  const creatureFor=planet=>progress.creatures[planet]||null;
  const updateInventory=()=>{
    $("cosmicCrystalCount").textContent=progress.totals.crystal;
    $("cosmicBioCount").textContent=progress.totals.bio;
    $("cosmicRelicCount").textContent=progress.totals.relic;
    $("cosmicLogCount").textContent=progress.log.length+" found";
    const log=$("cosmicDiscoveryLog");
    log.innerHTML=progress.log.length?progress.log.slice().reverse().map(item=>'<article class="cosmic-log-entry"><span>'+escapeText(item.icon)+'</span><div><strong>'+escapeText(item.name)+'</strong><small>'+escapeText(item.planet)+' · '+escapeText(item.description)+'</small></div><b>+'+Number(item.amount||0)+'</b></article>').join(""):"<p>No discoveries yet. Your first find is waiting.</p>";
    renderArchive();
  };
  const renderArchive=()=>{
    const entries=Object.keys(destinations).filter(planet=>creatureFor(planet));
    $("cosmicCreatureCount").textContent=entries.length+" / 4 archived";
    $("cosmicCreatureArchive").innerHTML=entries.length?entries.map(planet=>{
      const life=destinations[planet].life,record=creatureFor(planet);
      return '<article class="cosmic-creature-card"><span class="cosmic-creature-art">'+life[0]+'</span><div><strong>'+escapeText(record.nickname||life[1])+'</strong><small>'+escapeText(life[1])+' · '+escapeText(destinations[planet].name)+'</small><label>Give it a nickname<input maxlength="20" data-creature-name="'+planet+'" value="'+escapeText(record.nickname||"")+'" placeholder="Optional nickname"></label><button type="button" class="cosmic-rename-button" data-creature-save="'+planet+'">Save nickname</button></div></article>';
    }).join(""):"<p>No life-forms archived yet. Your first encounter is out there.</p>";
  };
  const updatePlanetProgress=()=>{
    const data=destinations[activePlanet],count=foundFor(activePlanet),total=data.finds.length;
    $("cosmicPlanetProgress").textContent=count+" / "+total+" discoveries";
    $("cosmicPlanetProgressBar").style.width=(count/total*100)+"%";
    $("cosmicPlanetProgressHint").textContent=count===total?"Survey complete! This planet has revealed all its current secrets.":(total-count)+" hidden discoveries remain in this landing zone.";
    $("cosmicLandingStatus").textContent=count===total?"SURVEY COMPLETE":"EXPLORING";
    const archived=!!creatureFor(activePlanet),steps=(count/total)+(archived?1:0),ratio=steps/2;
    $("cosmicMissionBar").style.width=(ratio*100)+"%";
    $("cosmicMissionStatus").textContent=progress.missions[activePlanet]?"COMPLETED":(ratio===1?"READY TO CLAIM":"IN PROGRESS");
    $("cosmicMissionObjective").textContent=progress.missions[activePlanet]?"Mission complete! Your field report has been filed.":"Survey all 4 discoveries ("+count+"/4) and scan the native life-form ("+(archived?"archived":"not archived")+") to complete this planet's mission.";
    $("cosmicClaimMission").disabled=ratio<1||!!progress.missions[activePlanet];
    $("cosmicClaimMission").textContent=progress.missions[activePlanet]?"Mission reward claimed ✓":(ratio===1?"Claim +3 field crystals":"Mission reward locked");
    const button=root.querySelector('[data-cosmic-planet="'+activePlanet+'"]');
    if(button)button.classList.toggle("survey-complete",count===total);
  };
  const updateEncounter=()=>{
    const data=destinations[activePlanet],creatureFound=!!progress.found[activePlanet+":"+data.creature],archived=!!creatureFor(activePlanet),life=data.life;
    $("cosmicEncounterStatus").textContent=archived?"ARCHIVED":creatureFound?"LIFE-FORM DETECTED":"NO SIGNAL";
    $("cosmicEncounterText").textContent=archived?"This species is safely recorded in your creature archive. You can revisit its record below.":creatureFound?"Your discovery has moved! A living signal is responding. Scan it to document the species and add it to your archive.":"Explore the landing zone. A native life-form may reveal itself when you find the right signal.";
    $("cosmicEncounterCard").innerHTML=creatureFound?'<span class="cosmic-encounter-art">'+life[0]+'</span><div><strong>'+escapeText(life[1])+'</strong><small>'+escapeText(life[2])+'</small></div>':'<span class="cosmic-encounter-art">📡</span><div><strong>Scanner on standby</strong><small>Your scanner is waiting for a life-form signal.</small></div>';
    $("cosmicScanCreature").disabled=!creatureFound||archived;
    $("cosmicScanCreature").textContent=archived?"Species archived ✓":creatureFound?"Scan & add to creature archive":"Awaiting life-form signal";
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
    updatePlanetProgress();updateEncounter();
    $("cosmicExplore").scrollIntoView({behavior:"smooth",block:"start"});
  };
  updateInventory();
  root.addEventListener("click",event=>{
    const card=event.target.closest("[data-cosmic-planet]");
    if(card&&root.contains(card)){
      const planet=card.dataset.cosmicPlanet,data=destinations[planet];if(!data)return;
      root.querySelectorAll("[data-cosmic-planet]").forEach(button=>button.setAttribute("aria-pressed",String(button===card)));
      $("cosmicMissionTitle").textContent=data.title;$("cosmicMissionText").textContent=data.text;
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
      return;
    }
    const scan=event.target.closest("#cosmicScanCreature");
    if(scan&&activePlanet&&!scan.disabled){
      const data=destinations[activePlanet],life=data.life;
      progress.creatures[activePlanet]={nickname:"",species:life[1]};
      progress.log.push({planet:data.name,icon:life[0],name:life[1]+" · archived",description:"Native life-form scanned and added to the creature archive.",amount:0,type:"life"});
      save();updateInventory();updateEncounter();updatePlanetProgress();return;
    }
    const claim=event.target.closest("#cosmicClaimMission");
    if(claim&&activePlanet&&!claim.disabled){
      progress.missions[activePlanet]=true;progress.totals.crystal+=3;
      progress.log.push({planet:destinations[activePlanet].name,icon:"🏅",name:"Planet mission completed",description:"Field survey and native life-form report filed.",amount:3,type:"crystal"});
      save();updateInventory();updatePlanetProgress();return;
    }
    const rename=event.target.closest("[data-creature-save]");
    if(rename){
      const planet=rename.dataset.creatureSave,input=root.querySelector('[data-creature-name="'+planet+'"]');
      if(!input||!progress.creatures[planet])return;
      progress.creatures[planet].nickname=input.value.trim().slice(0,20);
      save();renderArchive();return;
    }
  });
  Object.keys(destinations).forEach(planet=>{
    if(foundFor(planet)===destinations[planet].finds.length){
      const button=root.querySelector('[data-cosmic-planet="'+planet+'"]');
      if(button)button.classList.add("survey-complete");
    }
  });
})();