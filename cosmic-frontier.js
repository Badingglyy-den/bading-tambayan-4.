(() => {
  "use strict";
  const root=document.getElementById("cosmicFrontier");
  if(!root || root.dataset.ready==="true") return;
  root.dataset.ready="true";
  const destinations={
    lunara:{name:"Lunara",tag:"CRYSTAL WORLD",title:"The singing crystal forest",text:"A violet world of glowing trees, luminous caves and crystal formations. Your first task is to locate the source of a strange signal beneath the forest."},
    verdantia:{name:"Verdantia",tag:"LIVING WORLD",title:"The overgrown frontier",text:"A lush planet filled with ancient roots, floating spores and unfamiliar life. Scan the jungle canopy for signs of a newly discovered species."},
    solara:{name:"Solara",tag:"DESERT WORLD",title:"Secrets beneath the golden dunes",text:"A sunlit desert hides the remains of a civilization. Your expedition begins with an artifact reading near the edge of the old ruins."},
    cryon:{name:"Cryon",tag:"FROZEN WORLD",title:"Signals beneath the ice",text:"An icy ocean glows beneath the frozen surface. Trace the aurora signal and investigate what is moving below the glacial shelf."}
  };
  root.addEventListener("click",event=>{
    const card=event.target.closest("[data-cosmic-planet]");
    if(!card || !root.contains(card)) return;
    const data=destinations[card.dataset.cosmicPlanet];
    if(!data) return;
    root.querySelectorAll("[data-cosmic-planet]").forEach(button=>button.setAttribute("aria-pressed",String(button===card)));
    root.querySelector("#cosmicMissionTitle").textContent=data.title;
    root.querySelector("#cosmicMissionText").textContent=data.text;
    root.querySelector("#cosmicSelectedPlanet").textContent="DESTINATION: "+data.name.toUpperCase();
    root.querySelector("#cosmicSelectionStatus").textContent=data.name+" selected — "+data.tag+". Your expedition briefing is ready. Planet exploration and collectible systems will be added in the next build stage.";
  });
})();