
"use strict";
(function(){
  const PREFIX="tanzania-companion:";
  function get(key,fallback){try{const raw=localStorage.getItem(PREFIX+key);return raw===null?fallback:JSON.parse(raw)}catch(e){console.error("Storage read failed",key,e);return fallback}}
  function set(key,value){try{localStorage.setItem(PREFIX+key,JSON.stringify(value));return true}catch(e){console.error("Storage write failed",key,e);return false}}
  window.TanzaniaCompanion={get,set,version:"19.1"};
  ["globalBar","globalText"].forEach(id=>{if(!document.getElementById(id)){const el=document.createElement("div");el.id=id;el.hidden=true;document.body.appendChild(el)}});
  const countdown=document.getElementById("tripCountdown");
  if(countdown){const start=new Date(2026,6,23);const today=new Date();today.setHours(0,0,0,0);const days=Math.ceil((start-today)/86400000);countdown.textContent=Number.isFinite(days)?(days>0?String(days):(days>=-14?"Now":"Done")):"—"}
  document.querySelectorAll("details").forEach(d=>d.removeAttribute("open"));
  const shopping=get("shopping",{});
  document.querySelectorAll("[data-shopping-check]").forEach(el=>{const key=el.dataset.shoppingCheck;el.checked=!!shopping[key];el.addEventListener("change",()=>{shopping[key]=el.checked;set("shopping",shopping)})});
  if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error))}
})();

try{

"use strict";
(function(){
  const PREFIX="tanzania-companion:";
  function get(key,fallback){try{const raw=localStorage.getItem(PREFIX+key);return raw===null?fallback:JSON.parse(raw)}catch(e){console.error("Storage read failed",key,e);return fallback}}
  function set(key,value){try{localStorage.setItem(PREFIX+key,JSON.stringify(value));return true}catch(e){document.documentElement.dataset.storageAvailable="false";console.error("Storage write failed",key,e);return false}}
  try{const k=PREFIX+"probe";localStorage.setItem(k,"1");localStorage.removeItem(k);document.documentElement.dataset.storageAvailable="true"}catch(e){document.documentElement.dataset.storageAvailable="false"}
  window.TanzaniaCompanion={get,set,version:"19.0"};
  const countdown=document.getElementById("tripCountdown");
  if(countdown){const tripStart=new Date(2026,6,23);const today=new Date();today.setHours(0,0,0,0);const days=Math.ceil((tripStart-today)/86400000);countdown.textContent=Number.isFinite(days)?(days>0?String(days):(days>=-14?"Now":"Done")):"—"}
  document.querySelectorAll("details").forEach(d=>d.removeAttribute("open"));
  const shopping=get("shopping",{});
  document.querySelectorAll("[data-shopping-check]").forEach(el=>{const key=el.dataset.shoppingCheck;el.checked=!!shopping[key];el.addEventListener("change",()=>{shopping[key]=el.checked;set("shopping",shopping)})});
  const fields=get("private-fields",{});
  document.querySelectorAll("[data-private-field]").forEach(el=>{const key=el.dataset.privateField;if(fields[key]!==undefined)el.value=fields[key];el.addEventListener("input",()=>{fields[key]=el.value;set("private-fields",fields)})});
  const links=[...document.querySelectorAll(".tc-subnav a[href^='#']")];
  const items=links.map(a=>({a,target:document.querySelector(a.getAttribute("href"))})).filter(x=>x.target);
  if("IntersectionObserver" in window&&items.length){const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>a.classList.remove("active"));const hit=items.find(x=>x.target===entry.target);if(hit)hit.a.classList.add("active")}})},{rootMargin:"-20% 0px -65% 0px"});items.forEach(x=>obs.observe(x.target))}
  if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error))}
})();


(function(){
  ["globalBar","globalText"].forEach(id=>{
    if(!document.getElementById(id)){
      const el=document.createElement("div");
      el.id=id;el.hidden=true;document.body.appendChild(el);
    }
  });
})();

try{

}catch(error){console.error('Legacy feature isolated:',error)}

}catch(error){console.error('Legacy feature isolated:',error)}
