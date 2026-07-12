const storeKey='z8-pwa-checks-v6';
const saved=JSON.parse(localStorage.getItem(storeKey)||'{}');
document.querySelectorAll('input[type=checkbox][data-task]').forEach((cb,i)=>{const k=cb.dataset.task+'-'+i;cb.checked=!!saved[k];cb.addEventListener('change',()=>{saved[k]=cb.checked;localStorage.setItem(storeKey,JSON.stringify(saved));updateProgress()})});
function updateProgress(){['global'].forEach(group=>{const boxes=[...document.querySelectorAll(`[data-task="${group}"]`)];const done=boxes.filter(x=>x.checked).length;document.getElementById(group+'Bar').style.width=(boxes.length?done/boxes.length*100:0)+'%';document.getElementById(group+'Text').textContent=`${done} of ${boxes.length} completed`})}
updateProgress();
document.querySelectorAll('.banktab').forEach(t=>t.querySelectorAll('button').forEach(b=>b.onclick=()=>{t.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const section=t.parentElement;section.querySelectorAll('.bankpanel').forEach(p=>p.classList.remove('active'));document.getElementById(b.dataset.target).classList.add('active')}));
const search=document.getElementById('search');search.oninput=()=>{const q=search.value.toLowerCase();document.querySelectorAll('.step:not(.header),.card,.resource,details').forEach(e=>e.classList.toggle('hide',q&&!e.innerText.toLowerCase().includes(q)))};
let deferredPrompt;const ib=document.getElementById('installBtn');window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;ib.classList.remove('hide')});ib.onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;ib.classList.add('hide')}};
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));

// Version 8: trip countdown and current-day highlighting
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

// Version 8: Shoot Now assistant
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

// Version 8: trip checklist persistence
const tripCheckKey='z8-trip-check-v8';
const tripSaved=JSON.parse(localStorage.getItem(tripCheckKey)||'{}');
document.querySelectorAll('[data-tripcheck]').forEach(cb=>{
  cb.checked=!!tripSaved[cb.dataset.tripcheck];
  cb.addEventListener('change',()=>{
    tripSaved[cb.dataset.tripcheck]=cb.checked;
    localStorage.setItem(tripCheckKey,JSON.stringify(tripSaved));
  });
});

// v8.1: force a one-time reload when a new service worker takes control.
if ('serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}


// Version 9: tipping-envelope checklist
const tipCheckKey='z8-tip-check-v9';
const tipSaved=JSON.parse(localStorage.getItem(tipCheckKey)||'{}');
document.querySelectorAll('[data-tipcheck]').forEach(cb=>{
  cb.checked=!!tipSaved[cb.dataset.tipcheck];
  cb.addEventListener('change',()=>{
    tipSaved[cb.dataset.tipcheck]=cb.checked;
    localStorage.setItem(tipCheckKey,JSON.stringify(tipSaved));
  });
});


// Version 10: Open-Meteo live weather with offline cache.
const WEATHER_LOCATIONS = {
  arusha: {name:'Arusha', lat:-3.3869, lon:36.6830},
  tarangire: {name:'Tarangire', lat:-3.8333, lon:36.0000},
  serengeti: {name:'Serengeti', lat:-2.3333, lon:34.8333},
  ngorongoro: {name:'Ngorongoro', lat:-3.2000, lon:35.5000},
  zanzibar: {name:'Zanzibar / Kiwengwa', lat:-5.9890, lon:39.3760}
};

function itineraryWeatherLocation(){
  const today = new Date().toISOString().slice(0,10);
  if(today <= '2026-07-26') return 'arusha';
  if(today === '2026-07-27') return 'tarangire';
  if(today >= '2026-07-28' && today <= '2026-07-30') return 'serengeti';
  if(today >= '2026-07-31' && today <= '2026-08-01') return 'ngorongoro';
  if(today >= '2026-08-02' && today <= '2026-08-05') return 'zanzibar';
  return 'arusha';
}

function weatherCodeText(code){
  const map = {
    0:'Clear sky',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',
    45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
    61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',
    80:'Rain showers',81:'Rain showers',82:'Heavy showers',95:'Thunderstorm'
  };
  return map[code] || 'Variable conditions';
}

function weatherPhotographyAdvice(current, daily){
  const wind = current.wind_speed_10m || 0;
  const code = current.weather_code;
  const rain = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
  const cloud = current.cloud_cover || 0;
  let advice = [];
  if(wind >= 30) advice.push('Strong wind: use 1/1600 or faster, SPORT VR, and secure the monopod.');
  else if(wind >= 18) advice.push('Moderate wind: raise shutter speed for birds, grass and handheld long lenses.');
  if(rain >= 40 || [51,53,55,61,63,65,80,81,82,95].includes(code)) advice.push('Rain risk: keep the rain cover accessible and avoid lens changes.');
  if(cloud >= 70) advice.push('Soft/cloudy light: excellent for portraits; use Auto ISO and protect shutter speed.');
  else if(cloud <= 25) advice.push('Bright light: use −0.3 EV and watch highlights on fur, sand and water.');
  if(code === 45 || code === 48) advice.push('Fog: use a smaller AF area, add contrast later, and create layered landscape frames.');
  if(!advice.length) advice.push('Balanced conditions: start with the destination’s normal bank and adjust after checking the histogram.');
  return advice.join(' ');
}

function renderWeather(payload, locationName, cached=false){
  const current = payload.current;
  const daily = payload.daily;
  const updated = new Date(payload._savedAt || Date.now());
  const status = document.getElementById('weatherStatus');
  const currentBox = document.getElementById('weatherCurrent');
  const dailyBox = document.getElementById('weatherDaily');
  const adviceBox = document.getElementById('photoWeatherAdvice');

  status.textContent = `${cached ? 'Saved forecast' : 'Live forecast'} · Updated ${updated.toLocaleString()}`;
  currentBox.innerHTML = `
    <div class="weather-current-card">
      <div class="weather-temp">${Math.round(current.temperature_2m)}°C</div>
      <div>
        <h3>${locationName}</h3>
        <p>${weatherCodeText(current.weather_code)}</p>
        <div class="weather-details">
          <div><strong>${Math.round(current.apparent_temperature)}°C</strong><small>Feels like</small></div>
          <div><strong>${Math.round(current.wind_speed_10m)} km/h</strong><small>Wind</small></div>
          <div><strong>${current.relative_humidity_2m}%</strong><small>Humidity</small></div>
          <div><strong>${current.cloud_cover}%</strong><small>Cloud</small></div>
        </div>
      </div>
    </div>`;

  dailyBox.innerHTML = daily.time.slice(0,7).map((date,i)=>`
    <div class="weather-day">
      <strong>${new Date(date+'T12:00:00').toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</strong>
      <span>${weatherCodeText(daily.weather_code[i])}</span>
      <span>${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°C</span>
      <span>Rain ${daily.precipitation_probability_max[i]}%</span>
      <span>Sunrise ${daily.sunrise[i].split('T')[1]}</span>
      <span>Sunset ${daily.sunset[i].split('T')[1]}</span>
    </div>`).join('');

  adviceBox.innerHTML = `<b>Photography guidance:</b> ${weatherPhotographyAdvice(current,daily)}`;
}

async function loadWeather(){
  const selector = document.getElementById('weatherLocation');
  if(!selector) return;
  const key = selector.value === 'auto' ? itineraryWeatherLocation() : selector.value;
  const loc = WEATHER_LOCATIONS[key];
  const status = document.getElementById('weatherStatus');
  const cacheKey = `z8-weather-${key}`;

  status.textContent = 'Loading weather…';
  const params = new URLSearchParams({
    latitude: loc.lat,
    longitude: loc.lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max',
    timezone: 'auto',
    forecast_days: '7'
  });

  try{
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {cache:'no-store'});
    if(!response.ok) throw new Error(`Weather request failed: ${response.status}`);
    const payload = await response.json();
    payload._savedAt = Date.now();
    localStorage.setItem(cacheKey, JSON.stringify(payload));
    renderWeather(payload, loc.name, false);
  }catch(error){
    const cached = localStorage.getItem(cacheKey);
    if(cached){
      renderWeather(JSON.parse(cached), loc.name, true);
      status.textContent += ' · Offline';
    }else{
      status.textContent = 'Weather unavailable and no saved forecast exists.';
      document.getElementById('weatherCurrent').innerHTML = '<div class="weather-placeholder">Connect to the internet and tap Refresh weather.</div>';
    }
  }
}

document.getElementById('weatherRefresh')?.addEventListener('click', loadWeather);
document.getElementById('weatherLocation')?.addEventListener('change', loadWeather);
if(document.getElementById('weatherLocation') && navigator.onLine) loadWeather();

// Version 10: Zanzibar activity checklist.
const zActivityKey='z8-zanzibar-activities-v10';
const zActivitySaved=JSON.parse(localStorage.getItem(zActivityKey)||'{}');
document.querySelectorAll('[data-zactivity]').forEach(cb=>{
  cb.checked=!!zActivitySaved[cb.dataset.zactivity];
  cb.addEventListener('change',()=>{
    zActivitySaved[cb.dataset.zactivity]=cb.checked;
    localStorage.setItem(zActivityKey,JSON.stringify(zActivitySaved));
  });
});


// Version 11: local-only private fields and contact actions.
const privateStoreKey='z8-private-fields-v11';
const privateStore=JSON.parse(localStorage.getItem(privateStoreKey)||'{}');

function savePrivate(){
  localStorage.setItem(privateStoreKey, JSON.stringify(privateStore));
}

document.querySelectorAll('[data-private-field]').forEach(el=>{
  const key=el.dataset.privateField;
  if(privateStore[key] !== undefined) el.value=privateStore[key];
  el.addEventListener('input',()=>{
    privateStore[key]=el.value;
    savePrivate();
  });
});

document.querySelectorAll('[data-private-check]').forEach(el=>{
  const key=el.dataset.privateCheck;
  el.checked=!!privateStore[key];
  el.addEventListener('change',()=>{
    privateStore[key]=el.checked;
    savePrivate();
  });
});

function valueFor(key){ return (privateStore[key]||'').trim(); }
document.querySelectorAll('[data-action-call]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const value=valueFor(btn.dataset.actionCall);
    if(value) location.href=`tel:${value.replace(/\s+/g,'')}`;
    else alert('Enter the phone number first.');
  });
});
document.querySelectorAll('[data-action-email]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const value=valueFor(btn.dataset.actionEmail);
    if(value) location.href=`mailto:${value}`;
    else alert('Enter the email address first.');
  });
});
document.querySelectorAll('[data-action-whatsapp]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const value=valueFor(btn.dataset.actionWhatsapp).replace(/[^\d]/g,'');
    if(value) window.open(`https://wa.me/${value}`,'_blank');
    else alert('Enter the WhatsApp number first, including country code.');
  });
});

// Version 11: custom to-do list.
const todoKey='z8-custom-todos-v11';
let todos=JSON.parse(localStorage.getItem(todoKey)||'[]');
let todoFilter='all';

function saveTodos(){
  localStorage.setItem(todoKey,JSON.stringify(todos));
}
function renderTodos(){
  const list=document.getElementById('todoList');
  if(!list) return;
  const shown=todos.filter(t=>todoFilter==='all'||(todoFilter==='done'?t.done:!t.done));
  list.innerHTML=shown.length?shown.map(t=>`
    <div class="todo-item ${t.done?'done':''}">
      <input type="checkbox" data-todo-toggle="${t.id}" ${t.done?'checked':''}>
      <div>
        <div class="todo-text">${t.text.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}</div>
        <div class="todo-meta">${t.category}${t.date?' · '+t.date:''}</div>
      </div>
      <button class="todo-delete" data-todo-delete="${t.id}" aria-label="Delete">×</button>
    </div>`).join(''):'<div class="callout">No tasks in this view.</div>';

  list.querySelectorAll('[data-todo-toggle]').forEach(el=>el.addEventListener('change',()=>{
    const t=todos.find(x=>x.id===el.dataset.todoToggle); if(t){t.done=el.checked;saveTodos();renderTodos();}
  }));
  list.querySelectorAll('[data-todo-delete]').forEach(el=>el.addEventListener('click',()=>{
    todos=todos.filter(x=>x.id!==el.dataset.todoDelete);saveTodos();renderTodos();
  }));
}
document.getElementById('addTodoBtn')?.addEventListener('click',()=>{
  const text=document.getElementById('newTodoText').value.trim();
  if(!text) return;
  todos.unshift({
    id:(crypto.randomUUID?crypto.randomUUID():Date.now().toString()),
    text,
    category:document.getElementById('newTodoCategory').value,
    date:document.getElementById('newTodoDate').value,
    done:false
  });
  saveTodos();
  document.getElementById('newTodoText').value='';
  renderTodos();
});
document.querySelectorAll('[data-todo-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  todoFilter=btn.dataset.todoFilter;
  document.querySelectorAll('[data-todo-filter]').forEach(b=>b.classList.toggle('active',b===btn));
  renderTodos();
}));
renderTodos();
