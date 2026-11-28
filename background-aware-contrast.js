/* BADING TAMBAYAN — persistent, background-aware text contrast
   Re-applies contrast after theme changes and after other scripts update styles. */
(() => {
  "use strict";
  const DARK_TEXT = "#211b27";
  const LIGHT_TEXT = "#ffffff";
  const CHAT_SELECTOR = "#onlineTambayan";
  const SKIP_TAGS = new Set(["SCRIPT","STYLE","NOSCRIPT","SVG","PATH","CANVAS","IMG","VIDEO","IFRAME"]);
  const TRANSPARENT = c => !c || c === "transparent" || /rgba?\([^)]*,\s*0(?:\.0+)?\s*\)$/.test(c);

  function colorParts(value) {
    const found = [];
    const re = /rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)|#([\da-f]{3,8})\b/gi;
    let m;
    while ((m = re.exec(value || ""))) {
      let r,g,b,a=1;
      if (m[5]) {
        let h=m[5];
        if (h.length===3 || h.length===4) h=h.split("").map(x=>x+x).join("");
        r=parseInt(h.slice(0,2),16); g=parseInt(h.slice(2,4),16); b=parseInt(h.slice(4,6),16);
        if (h.length>=8) a=parseInt(h.slice(6,8),16)/255;
      } else {
        r=+m[1]; g=+m[2]; b=+m[3]; if (m[4]!==undefined) a=+m[4];
      }
      if ([r,g,b,a].every(Number.isFinite) && a>0.05) found.push({r,g,b,a});
    }
    return found;
  }

  function luminance(c) {
    const channel = v => { v/=255; return v<=0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
    return 0.2126*channel(c.r)+0.7152*channel(c.g)+0.0722*channel(c.b);
  }
  function composite(top,bottom) {
    const a=top.a;
    return {r:top.r*a+bottom.r*(1-a),g:top.g*a+bottom.g*(1-a),b:top.b*a+bottom.b*(1-a),a:1};
  }
  function backgroundColor(el) {
    let node=el;
    const layers=[];
    while(node && node.nodeType===1) {
      const cs=getComputedStyle(node);
      const image=cs.backgroundImage;
      const imageColors=colorParts(image);
      const solid=colorParts(cs.backgroundColor)[0];
      if (imageColors.length && image && image!=="none") {
        layers.push(imageColors.reduce((acc,c)=>({
          r:acc.r+c.r/imageColors.length,
          g:acc.g+c.g/imageColors.length,
          b:acc.b+c.b/imageColors.length,
          a:1
        }),{r:0,g:0,b:0,a:1}));
        break;
      }
      if (solid && !TRANSPARENT(cs.backgroundColor)) {
        layers.push(solid);
        if (solid.a>=0.98) break;
      }
      node=node.parentElement;
    }
    if (!layers.length) {
      const bodyColor=colorParts(getComputedStyle(document.body).backgroundColor)[0];
      layers.push(bodyColor || {r:255,g:255,b:255,a:1});
    }
    let base={r:255,g:255,b:255,a:1};
    for(let i=layers.length-1;i>=0;i--) base=composite(layers[i],base);
    return base;
  }
  function chooseForeground(el) {
    return luminance(backgroundColor(el)) > 0.43 ? DARK_TEXT : LIGHT_TEXT;
  }
  function hasOwnText(el) {
    if (el.matches("input,textarea,select,option,button")) return true;
    return Array.from(el.childNodes).some(n=>n.nodeType===3 && n.nodeValue.trim());
  }
  function setImportant(el, property, value) {
    if (el.style.getPropertyValue(property).trim() !== value ||
        el.style.getPropertyPriority(property) !== "important") {
      el.style.setProperty(property,value,"important");
    }
  }
  function updateOne(el) {
    if (!(el instanceof Element) || SKIP_TAGS.has(el.tagName) || el.closest(CHAT_SELECTOR)) return;
    if (el.isContentEditable || el.closest("[contenteditable='true']")) return;
    if (!hasOwnText(el)) return;

    const color=chooseForeground(el);
    setImportant(el,"color",color);
    setImportant(el,"-webkit-text-fill-color",color);

    // Some legacy world styles fade the text element itself with opacity.
    // Restore readability without changing disabled-control states.
    if (!el.matches(":disabled,[aria-disabled='true']")) {
      const opacity=parseFloat(getComputedStyle(el).opacity);
      if (Number.isFinite(opacity) && opacity < 0.9) setImportant(el,"opacity","1");
    }
  }
  let queued=false;
  function scan() {
    queued=false;
    if (!document.body) return;
    document.body.querySelectorAll("*").forEach(updateOne);
  }
  function schedule() {
    if (queued) return;
    queued=true;
    requestAnimationFrame(scan);
  }
  function start() {
    scan();
    const observer=new MutationObserver(schedule);
    observer.observe(document.body,{
      subtree:true,childList:true,characterData:true,attributes:true,
      attributeFilter:["class","style","data-theme","hidden","open","aria-disabled","disabled"]
    });
    window.addEventListener("resize",schedule,{passive:true});
    window.addEventListener("pageshow",schedule);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();