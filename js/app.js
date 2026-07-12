
"use strict";
(() => {
  const PREFIX = "tanzania-companion:";
  const safeGet = (key, fallback) => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      console.error("Storage read failed", key, e);
      return fallback;
    }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { console.error("Storage write failed", key, e); }
  };

  // All expandable sections start collapsed.
  document.querySelectorAll("details").forEach(el => el.removeAttribute("open"));

  // Search current page.
  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll(".searchable,.step:not(.header),.card,.resource,details").forEach(el => {
        el.classList.toggle("hide", !!q && !el.innerText.toLowerCase().includes(q));
      });
    });
  }

  // Install prompt.
  let deferredPrompt = null;
  const installBtn = document.getElementById("installBtn");
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    if (installBtn) installBtn.classList.remove("hide");
  });
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.classList.add("hide");
    });
  }

  // Countdown and itinerary highlight.
  const now = new Date();
  const tripStart = new Date(2026, 6, 23);
  const countdown = document.getElementById("tripCountdown");
  if (countdown) {
    const today = new Date(now); today.setHours(0,0,0,0);
    const days = Math.ceil((tripStart - today) / 86400000);
    countdown.textContent = days > 0 ? String(days) : (days >= -14 ? "Now" : "Done");
  }
  const isoToday = now.toLocaleDateString("en-CA");
  document.querySelectorAll(".trip-day").forEach(el => {
    if (el.dataset.date === isoToday) el.classList.add("today");
  });

  // Bank tabs.
  document.querySelectorAll(".banktab").forEach(tab => {
    tab.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        tab.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        const section = tab.parentElement;
        section.querySelectorAll(".bankpanel").forEach(panel => panel.classList.remove("active"));
        const target = document.getElementById(button.dataset.target);
        if (target) target.classList.add("active");
      });
    });
  });

  // Generic persistent checkboxes.
  const checkGroups = [
    ["input[data-task]", "setup-checks", el => `${el.dataset.task}-${[...document.querySelectorAll(`input[data-task="${el.dataset.task}"]`)].indexOf(el)}`],
    ["[data-tripcheck]", "trip-checks", el => el.dataset.tripcheck],
    ["[data-tipcheck]", "tip-checks", el => el.dataset.tipcheck],
    ["[data-zactivity]", "zanzibar-activities", el => el.dataset.zactivity],
    ["[data-private-check]", "private-checks", el => el.dataset.privateCheck],
    ["[data-shopping-check]", "shopping-checks", el => el.dataset.shoppingCheck],
    ["[data-shopcheck]", "shopping-v20", el => el.dataset.shopcheck]
  ];
  checkGroups.forEach(([selector, storageKey, keyFn]) => {
    const state = safeGet(storageKey, {});
    document.querySelectorAll(selector).forEach(el => {
      const key = keyFn(el);
      el.checked = !!state[key];
      el.addEventListener("change", () => {
        state[key] = el.checked;
        safeSet(storageKey, state);
        updateProgress();
      });
    });
  });

  // Private fields.
  const privateFields = safeGet("private-fields", {});
  document.querySelectorAll("[data-private-field]").forEach(el => {
    const key = el.dataset.privateField;
    if (Object.prototype.hasOwnProperty.call(privateFields, key)) el.value = privateFields[key];
    el.addEventListener("input", () => {
      privateFields[key] = el.value;
      safeSet("private-fields", privateFields);
    });
  });

  function updateProgress() {
    ["global"].forEach(group => {
      const boxes = [...document.querySelectorAll(`[data-task="${group}"]`)];
      const bar = document.getElementById(group + "Bar");
      const text = document.getElementById(group + "Text");
      if (!bar || !text) return;
      const done = boxes.filter(x => x.checked).length;
      bar.style.width = (boxes.length ? done / boxes.length * 100 : 0) + "%";
      text.textContent = `${done} of ${boxes.length} completed`;
    });
  }
  updateProgress();

  // Shoot Now.
  const recommendBtn = document.getElementById("recommendBtn");
  if (recommendBtn) {
    recommendBtn.addEventListener("click", () => {
      const subject = document.getElementById("shootSubject").value;
      const motion = document.getElementById("shootMotion").value;
      const light = document.getElementById("shootLight").value;
      let bank="B", shutter="1/1000", aperture="Wide open", af="Wide-area AF S", detection="Animals", burst="8 fps";
      if (motion === "fast") { bank="A"; shutter="1/2500–1/3200"; af="Wide-area AF C1"; burst="15–20 fps"; }
      else if (motion === "moving") { bank="A"; shutter="1/1600–1/2000"; af="Wide-area AF C1"; burst="15 fps"; }
      if (subject === "bird") detection="Birds";
      if (subject === "people") { detection="People"; aperture="f/2.8–f/5.6"; shutter=motion==="still"?"1/500":shutter; }
      if (subject === "landscape") { bank="C"; detection="Off"; aperture="f/8–f/11"; shutter="1/500 or stable support"; af="Single-point AF"; burst="Single frame"; }
      if (subject === "zanzibar" && motion === "still") { bank="C"; detection="Off / People"; aperture="f/8"; shutter="1/500"; af="Single-point / Wide S"; burst="Single / low"; }
      const iso = light==="low" ? "Auto ISO up to 12,800" : light==="soft" ? "Auto ISO 400–1600" : "Auto ISO 64–400";
      document.getElementById("shootResult").innerHTML =
        `<h3>Use Photo Bank ${bank}</h3><div class="rec-grid">
        <div><strong>${shutter}</strong><span>Shutter</span></div>
        <div><strong>${aperture}</strong><span>Aperture</span></div>
        <div><strong>${iso}</strong><span>ISO</span></div>
        <div><strong>${af}</strong><span>AF area</span></div>
        <div><strong>${detection}</strong><span>Detection</span></div>
        <div><strong>${burst}</strong><span>Release</span></div></div>`;
    });
  }

  // To-do list.
  const todoList = document.getElementById("todoList");
  if (todoList) {
    let todos = safeGet("todos", []);
    let filter = "all";
    const render = () => {
      todoList.innerHTML = "";
      todos.filter(t => filter==="all" || (filter==="done" ? t.done : !t.done)).forEach(todo => {
        const row = document.createElement("div");
        row.className = "todo-item" + (todo.done ? " done" : "");
        row.innerHTML = `<input type="checkbox" ${todo.done ? "checked" : ""}>
          <div><div class="todo-text">${todo.text}</div><small>${todo.category || ""}${todo.date ? " · "+todo.date : ""}</small></div>
          <button type="button">Delete</button>`;
        row.querySelector('input').addEventListener("change", e => {
          todo.done = e.target.checked; safeSet("todos", todos); render();
        });
        row.querySelector('button').addEventListener("click", () => {
          todos = todos.filter(t => t.id !== todo.id); safeSet("todos", todos); render();
        });
        todoList.appendChild(row);
      });
    };
    const add = document.getElementById("addTodoBtn");
    if (add) add.addEventListener("click", () => {
      const input = document.getElementById("newTodoText");
      if (!input.value.trim()) return;
      todos.push({id:Date.now(),text:input.value.trim(),category:document.getElementById("newTodoCategory").value,date:document.getElementById("newTodoDate").value,done:false});
      input.value=""; safeSet("todos", todos); render();
    });
    document.querySelectorAll("[data-todo-filter]").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll("[data-todo-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active"); filter=btn.dataset.todoFilter; render();
    }));
    render();
  }

  // Dynamic call and WhatsApp buttons for editable guide fields.
  document.querySelectorAll("[data-action-call]").forEach(btn => btn.addEventListener("click", () => {
    const field = document.querySelector(`[data-private-field="${btn.dataset.actionCall}"]`);
    if (field && field.value.trim()) location.href = "tel:" + field.value.trim();
  }));
  document.querySelectorAll("[data-action-whatsapp]").forEach(btn => btn.addEventListener("click", () => {
    const field = document.querySelector(`[data-private-field="${btn.dataset.actionWhatsapp}"]`);
    if (field && field.value.trim()) {
      const number = field.value.replace(/\D/g,"");
      window.open("https://wa.me/" + number, "_blank", "noopener");
    }
  }));

  // Premium weather dashboard.
  const locations = {
    arusha:{name:"Arusha",lat:-3.3869,lon:36.6830,type:"safari"},
    tarangire:{name:"Tarangire",lat:-3.8333,lon:36.0000,type:"safari"},
    serengeti:{name:"Serengeti",lat:-2.3333,lon:34.8333,type:"safari"},
    ngorongoro:{name:"Ngorongoro",lat:-3.1618,lon:35.5877,type:"safari"},
    zanzibar:{name:"Zanzibar / Kiwengwa",lat:-5.989,lon:39.376,type:"beach"}
  };

  const weatherCode = code => {
    if(code === 0) return {icon:"☀️",label:"Clear sky"};
    if([1,2].includes(code)) return {icon:"🌤️",label:"Partly cloudy"};
    if(code === 3) return {icon:"☁️",label:"Overcast"};
    if([45,48].includes(code)) return {icon:"🌫️",label:"Fog"};
    if([51,53,55,56,57].includes(code)) return {icon:"🌦️",label:"Drizzle"};
    if([61,63,65,66,67,80,81,82].includes(code)) return {icon:"🌧️",label:"Rain"};
    if([71,73,75,77,85,86].includes(code)) return {icon:"🌨️",label:"Snow"};
    if([95,96,99].includes(code)) return {icon:"⛈️",label:"Thunderstorms"};
    return {icon:"🌤️",label:"Variable conditions"};
  };

  const starRating = score => {
    const full = Math.max(1,Math.min(5,Math.round(score)));
    return "★".repeat(full) + "☆".repeat(5-full);
  };

  const parseLocalTime = value => value ? new Date(value) : null;
  const shiftMinutes = (date, minutes) => date ? new Date(date.getTime() + minutes * 60000) : null;
  const formatLocalTime = date => date
    ? date.toLocaleTimeString([], {hour:"numeric", minute:"2-digit"})
    : "—";

  const lightWindows = (sunriseValue, sunsetValue) => {
    const sunriseDate = parseLocalTime(sunriseValue);
    const sunsetDate = parseLocalTime(sunsetValue);
    return {
      morningBlueStart: shiftMinutes(sunriseDate, -30),
      morningBlueEnd: sunriseDate,
      morningGoldenStart: sunriseDate,
      morningGoldenEnd: shiftMinutes(sunriseDate, 60),
      eveningGoldenStart: shiftMinutes(sunsetDate, -60),
      eveningGoldenEnd: sunsetDate,
      eveningBlueStart: sunsetDate,
      eveningBlueEnd: shiftMinutes(sunsetDate, 30)
    };
  };

  const autoLocation = () => {
    const d = now.toISOString().slice(0,10);
    if (d >= "2026-08-02") return "zanzibar";
    if (d >= "2026-07-31") return "ngorongoro";
    if (d >= "2026-07-28") return "serengeti";
    if (d >= "2026-07-27") return "tarangire";
    return "arusha";
  };

  const weatherBtn = document.getElementById("weatherRefresh");
  if (weatherBtn) {
    const renderWeather = data => {
      const current = document.getElementById("weatherCurrent");
      const daily = document.getElementById("weatherDaily");
      const photo = document.getElementById("photoWeatherAdvice");
      const safari = document.getElementById("safariWeatherAdvice");
      const zanzibar = document.getElementById("zanzibarWeatherAdvice");

      const c = data.current;
      const condition = weatherCode(c.weather_code);
      const todayRain = data.daily.precipitation_probability_max?.[0] ?? 0;
      const todayCloud = data.daily.cloud_cover_mean?.[0] ?? c.cloud_cover ?? 0;
      const uv = data.daily.uv_index_max?.[0] ?? 0;
      const sunriseValue = data.daily.sunrise?.[0] || null;
      const sunsetValue = data.daily.sunset?.[0] || null;
      const windows = lightWindows(sunriseValue, sunsetValue);
      const sunrise = formatLocalTime(parseLocalTime(sunriseValue));
      const sunset = formatLocalTime(parseLocalTime(sunsetValue));
      const wind = Math.round(c.wind_speed_10m || 0);
      const gust = Math.round(c.wind_gusts_10m || wind);
      const humidity = Math.round(c.relative_humidity_2m || 0);

      current.innerHTML = `
        <div class="weather-hero-main">
          <div class="weather-icon-large" aria-hidden="true">${condition.icon}</div>
          <div>
            <div class="weather-location">${data.name}</div>
            <div class="weather-temperature">${Math.round(c.temperature_2m)}°C</div>
            <div class="weather-condition">${condition.label} · Feels like ${Math.round(c.apparent_temperature)}°C</div>
          </div>
        </div>
        <div class="weather-metrics">
          <div><span>💧</span><b>${humidity}%</b><small>Humidity</small></div>
          <div><span>🌬️</span><b>${wind} km/h</b><small>Wind</small></div>
          <div><span>💨</span><b>${gust} km/h</b><small>Gusts</small></div>
          <div><span>☔</span><b>${todayRain}%</b><small>Rain</small></div>
          <div><span>☀️</span><b>${uv.toFixed(1)}</b><small>UV max</small></div>
          <div><span>☁️</span><b>${Math.round(todayCloud)}%</b><small>Cloud cover</small></div>
        </div>`;

      daily.innerHTML = data.daily.time.slice(0,7).map((date,i)=>{
        const wc = weatherCode(data.daily.weather_code[i]);
        const label = new Date(date + "T12:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
        return `<article class="weather-day-card">
          <div class="weather-day-name">${label}</div>
          <div class="weather-day-icon">${wc.icon}</div>
          <div class="weather-day-condition">${wc.label}</div>
          <div class="weather-day-temp">${Math.round(data.daily.temperature_2m_max[i])}° <span>${Math.round(data.daily.temperature_2m_min[i])}°</span></div>
          <div class="weather-day-rain">☔ ${data.daily.precipitation_probability_max[i] ?? 0}%</div>
        </article>`;
      }).join("");

      let photoScore = 5;
      if(todayRain > 60) photoScore -= 1.5;
      if(wind > 25) photoScore -= 1;
      if(todayCloud > 85) photoScore -= .5;
      if(uv > 8) photoScore -= .5;
      const photoBank = wind > 25 || todayRain > 50 ? "Bank A — Action / weather" : todayCloud > 55 ? "Bank B — Portraits" : "Bank C — Environmental";
      const photoAdvice = [
        wind > 25 ? "Use a faster shutter and stabilize the long lens." : "Wind should be manageable for the monopod setup.",
        todayCloud > 45 ? "Cloud cover may soften contrast and help portraits." : "Protect highlights in direct sun.",
        uv > 7 ? "Strong UV: avoid harsh midday light when possible." : "Light should be easier to manage."
      ].join(" ");

      const lens = wind > 28 || gust > 38
        ? "70–180 mm — easier to stabilize in wind"
        : todayCloud > 65
          ? "70–180 mm for portraits; 180–600 mm for distant behavior"
          : "180–600 mm — primary safari lens";
      const cpl = uv > 5 && todayCloud < 55 && wind < 30
        ? "Recommended selectively for glare and skies; remove at dawn, dusk and low light"
        : "Usually remove it to preserve shutter speed and light";
      const dustRisk = todayRain > 45
        ? "Low — recent or expected moisture may suppress dust"
        : gust > 40
          ? "High — avoid lens changes and protect openings"
          : wind > 25
            ? "Moderate — minimize lens changes"
            : "Low to moderate";
      const wildlifeMorningStart = windows.morningGoldenStart;
      const wildlifeMorningEnd = shiftMinutes(windows.morningGoldenStart, 150);
      const wildlifeEveningStart = shiftMinutes(windows.eveningGoldenStart, -60);
      const wildlifeEveningEnd = windows.eveningGoldenEnd;

      photo.innerHTML = `<h3>📷 Photography & light</h3>
        <div class="condition-rating">${starRating(photoScore)}</div>
        <div class="light-window-grid">
          <div><small>🌅 Morning blue hour</small><b>${formatLocalTime(windows.morningBlueStart)}–${formatLocalTime(windows.morningBlueEnd)}</b></div>
          <div><small>☀️ Morning golden hour</small><b>${formatLocalTime(windows.morningGoldenStart)}–${formatLocalTime(windows.morningGoldenEnd)}</b></div>
          <div><small>🌇 Evening golden hour</small><b>${formatLocalTime(windows.eveningGoldenStart)}–${formatLocalTime(windows.eveningGoldenEnd)}</b></div>
          <div><small>🌌 Evening blue hour</small><b>${formatLocalTime(windows.eveningBlueStart)}–${formatLocalTime(windows.eveningBlueEnd)}</b></div>
        </div>
        <p><b>Suggested Nikon bank:</b> ${photoBank}</p>
        <p><b>Lens:</b> ${lens}</p>
        <p><b>95 mm CPL:</b> ${cpl}</p>
        <p><b>Dust risk:</b> ${dustRisk}</p>
        <p>${photoAdvice}</p>
        <div class="condition-times"><span>🌅 Sunrise ${sunrise}</span><span>🌇 Sunset ${sunset}</span></div>`;

      const wildlifeWindows = {
        morning:`${formatLocalTime(wildlifeMorningStart)}–${formatLocalTime(wildlifeMorningEnd)}`,
        evening:`${formatLocalTime(wildlifeEveningStart)}–${formatLocalTime(wildlifeEveningEnd)}`
      };

      let safariScore = 5;
      if(todayRain > 70) safariScore -= 1.5;
      if(c.temperature_2m > 30) safariScore -= 1;
      if(wind > 30) safariScore -= .5;
      const safariLabel = safariScore >= 4.5 ? "Excellent" : safariScore >= 3.5 ? "Very good" : safariScore >= 2.5 ? "Mixed" : "Challenging";
      safari.innerHTML = `<h3>🦁 Safari conditions</h3>
        <div class="condition-rating">${starRating(safariScore)} <span>${safariLabel}</span></div>
        <p><b>Best wildlife-light windows:</b> ${wildlifeWindows.morning} and ${wildlifeWindows.evening}.</p>
        <p>${todayRain > 50 ? "Allow for wet roads and protect camera gear." : "Generally favorable for game drives."} ${c.temperature_2m > 28 ? "Animal activity may be lower around midday." : "Temperatures should support comfortable viewing."}</p>`;

      let beachScore = 5;
      if(todayRain > 55) beachScore -= 1.5;
      if(wind > 25) beachScore -= 1;
      if(uv > 9) beachScore -= .5;
      const beachLabel = beachScore >= 4.5 ? "Excellent" : beachScore >= 3.5 ? "Very good" : beachScore >= 2.5 ? "Fair" : "Poor";
      zanzibar.innerHTML = `<h3>🏝 Zanzibar conditions</h3>
        <div class="condition-rating">${starRating(beachScore)} <span>${beachLabel}</span></div>
        <p><b>Beach:</b> ${todayRain < 35 ? "Favorable" : "Showers possible"} · <b>Wind:</b> ${wind < 20 ? "Light" : wind < 30 ? "Moderate" : "Strong"}</p>
        <p><b>Sunset:</b> ${sunset}. ${uv > 7 ? "Use strong sun protection." : "UV is moderate."} Swimming and snorkeling conditions should still be confirmed locally.</p>`;
    };

    const cached = safeGet("weather-cache-v21", null);
    if (cached) {
      renderWeather(cached);
      const status = document.getElementById("weatherStatus");
      status.textContent = `Saved forecast · ${new Date(cached.savedAt || Date.now()).toLocaleString()}`;
    }

    weatherBtn.addEventListener("click", async () => {
      const status = document.getElementById("weatherStatus");
      weatherBtn.disabled = true;
      try {
        status.textContent = "Loading forecast…";
        let key = document.getElementById("weatherLocation").value;
        if (key === "auto") key = autoLocation();
        const loc = locations[key];
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,cloud_cover_mean,uv_index_max,sunrise,sunset&timezone=auto`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather request failed");
        const data = await response.json();
        data.name = loc.name;
        data.locationType = loc.type;
        data.savedAt = Date.now();
        safeSet("weather-cache-v21", data);
        renderWeather(data);
        status.textContent = "Updated " + new Date().toLocaleTimeString();
      } catch (error) {
        status.textContent = cached ? "Offline — showing saved forecast" : "Weather unavailable";
        console.error(error);
      } finally {
        weatherBtn.disabled = false;
      }
    });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.error));
  }
})();
