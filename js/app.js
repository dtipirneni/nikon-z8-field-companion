const storeKey='z8-pwa-checks-v6';
const saved=JSON.parse(localStorage.getItem(storeKey)||'{}');
document.querySelectorAll('input[type=checkbox][data-task]').forEach((cb,i)=>{const k=cb.dataset.task+'-'+i;cb.checked=!!saved[k];cb.addEventListener('change',()=>{saved[k]=cb.checked;localStorage.setItem(storeKey,JSON.stringify(saved));updateProgress()})});
function updateProgress(){['global'].forEach(group=>{const boxes=[...document.querySelectorAll(`[data-task="${group}"]`)];const done=boxes.filter(x=>x.checked).length;document.getElementById(group+'Bar').style.width=(boxes.length?done/boxes.length*100:0)+'%';document.getElementById(group+'Text').textContent=`${done} of ${boxes.length} completed`})}
updateProgress();
document.querySelectorAll('.banktab').forEach(t=>t.querySelectorAll('button').forEach(b=>b.onclick=()=>{t.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const section=t.parentElement;section.querySelectorAll('.bankpanel').forEach(p=>p.classList.remove('active'));document.getElementById(b.dataset.target).classList.add('active')}));
const search=document.getElementById('search');search.oninput=()=>{const q=search.value.toLowerCase();document.querySelectorAll('.step:not(.header),.card,.resource,details').forEach(e=>e.classList.toggle('hide',q&&!e.innerText.toLowerCase().includes(q)))};
let deferredPrompt;const ib=document.getElementById('installBtn');window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;ib.classList.remove('hide')});ib.onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;ib.classList.add('hide')}};
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));

// Version 6: trip countdown and current-day highlighting
(function(){
  const tripStart = new Date('2026-07-23T00:00:00-07:00');
  const now = new Date();
  const diff = Math.ceil((tripStart - now) / 86400000);
  const countdown = document.getElementById('tripCountdown');
  if(countdown) countdown.textContent = diff > 0 ? diff : (diff >= -14 ? 'Now' : 'Done');

  const isoToday = now.toLocaleDateString('en-CA');
  document.querySelectorAll('.trip-day').forEach(day=>{
    if(day.dataset.date === isoToday) day.classList.add('today');
  });
})();

// Version 6: Shoot Now assistant
const subjectEl = document.getElementById('shootSubject');
const motionEl = document.getElementById('shootMotion');
const lightEl = document.getElementById('shootLight');
const resultEl = document.getElementById('shootResult');
const recommendBtn = document.getElementById('recommendBtn');

function recommendation(subject, motion, light){
  let bank='B', shutter='1/1000', aperture='Wide open', af='Wide-area AF S', detection='Animals', burst='8 fps', note='Place the focus box over the eye or head.';
  if(subject==='bird'){ detection='Birds'; shutter=motion==='fast'?'1/3200':'1/2000'; af=motion==='still'?'Wide-area AF S':'Wide-area AF C1'; bank=motion==='still'?'B':'A'; burst=motion==='still'?'8 fps':'15 fps';}
  if(subject==='lion'){ shutter=motion==='fast'?'1/2500':motion==='moving'?'1/1600':'1/1000'; af=motion==='fast'?'Wide-area AF C1':'Wide-area AF S'; bank=motion==='fast'?'A':'B'; burst=motion==='fast'?'15 fps':'8 fps';}
  if(subject==='elephant'){ shutter=motion==='fast'?'1/2000':motion==='moving'?'1/1250':'1/800'; aperture=motion==='still'?'f/6.3–f/8':'Wide open'; af=motion==='fast'?'Wide-area AF C1':'Wide-area AF S'; bank=motion==='fast'?'A':'C';}
  if(subject==='people'){ detection='People'; shutter=motion==='fast'?'1/1600':motion==='moving'?'1/800':'1/500'; aperture='f/2.8–f/5.6'; af='Wide-area AF S'; bank='B'; burst='Single / low burst'; note='Ask permission for close portraits and simplify the background.';}
  if(subject==='landscape'){ detection='Off'; shutter=motion==='fast'?'1/1000':'1/500'; aperture='f/8–f/11'; af='Single-point AF'; bank='C'; burst='Single frame'; note='Use the lowest practical ISO and protect highlights.';}
  if(subject==='zanzibar'){ detection=motion==='fast'?'Birds / Auto':'Off or People'; shutter=motion==='fast'?'1/2500':motion==='moving'?'1/1000':'1/500'; aperture=motion==='still'?'f/8':'f/5.6–f/8'; af=motion==='fast'?'Wide-area AF C1':'Single-point / Wide S'; bank=motion==='fast'?'A':'C'; burst=motion==='fast'?'15 fps':'Single / low burst'; note='Watch bright sand and water; start around −0.3 EV.';}
  let iso = light==='bright'?'Auto ISO · expect ISO 64–400':light==='soft'?'Auto ISO · expect ISO 400–1600':'Auto ISO · allow up to ISO 12800';
  if(light==='low' && subject==='landscape'){ iso='ISO 64–400 on stable support'; shutter='Use the slowest safe shutter';}
  return {bank, shutter, aperture, af, detection, burst, iso, note};
}

if(recommendBtn){
  recommendBtn.addEventListener('click', ()=>{
    const r = recommendation(subjectEl.value,motionEl.value,lightEl.value);
    resultEl.innerHTML = `<h3>Use Photo Bank ${r.bank}</h3>
      <div class="rec-grid">
        <div><strong>${r.shutter}</strong><span>Shutter</span></div>
        <div><strong>${r.aperture}</strong><span>Aperture</span></div>
        <div><strong>${r.iso}</strong><span>ISO</span></div>
        <div><strong>${r.af}</strong><span>AF area</span></div>
        <div><strong>${r.detection}</strong><span>Detection</span></div>
        <div><strong>${r.burst}</strong><span>Release</span></div>
      </div><p>${r.note}</p>`;
  });
}

// Version 6: trip checklist persistence
const tripCheckKey='z8-trip-check-v6';
const tripSaved=JSON.parse(localStorage.getItem(tripCheckKey)||'{}');
document.querySelectorAll('[data-tripcheck]').forEach(cb=>{
  cb.checked=!!tripSaved[cb.dataset.tripcheck];
  cb.addEventListener('change',()=>{
    tripSaved[cb.dataset.tripcheck]=cb.checked;
    localStorage.setItem(tripCheckKey,JSON.stringify(tripSaved));
  });
});
