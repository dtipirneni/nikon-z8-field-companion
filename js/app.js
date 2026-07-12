
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

  // Weather.
  const locations = {
    arusha:{name:"Arusha",lat:-3.3869,lon:36.6830},
    tarangire:{name:"Tarangire",lat:-3.8333,lon:36.0000},
    serengeti:{name:"Serengeti",lat:-2.3333,lon:34.8333},
    ngorongoro:{name:"Ngorongoro",lat:-3.1618,lon:35.5877},
    zanzibar:{name:"Zanzibar / Kiwengwa",lat:-5.989,lon:39.376}
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
      const advice = document.getElementById("photoWeatherAdvice");
      current.innerHTML = `<h3>${data.name}</h3><p><strong>${Math.round(data.current.temperature_2m)}°C</strong> · Wind ${Math.round(data.current.wind_speed_10m)} km/h</p>`;
      daily.innerHTML = data.daily.time.slice(0,7).map((date,i)=>{
        const label = new Date(date + "T12:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
        return `<div class="weather-card"><b>${label}</b><div>${Math.round(data.daily.temperature_2m_max[i])}° / ${Math.round(data.daily.temperature_2m_min[i])}°</div><small>Rain ${data.daily.precipitation_probability_max[i] ?? 0}%</small></div>`;
      }).join("");
      advice.textContent = (data.current.wind_speed_10m > 25 ? "Windy: raise shutter speed and stabilize long lenses. " : "") + "Protect highlights, keep Auto ISO available, and refresh closer to each travel day.";
    };
    const cached = safeGet("weather-cache", null);
    if (cached) renderWeather(cached);
    weatherBtn.addEventListener("click", async () => {
      const status = document.getElementById("weatherStatus");
      try {
        status.textContent = "Loading…";
        let key = document.getElementById("weatherLocation").value;
        if (key === "auto") key = autoLocation();
        const loc = locations[key];
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather request failed");
        const data = await response.json();
        data.name = loc.name;
        safeSet("weather-cache", data);
        renderWeather(data);
        status.textContent = "Updated " + new Date().toLocaleTimeString();
      } catch (e) {
        status.textContent = cached ? "Offline — showing saved forecast" : "Weather unavailable";
        console.error(e);
      }
    });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.error));
  }
})();
