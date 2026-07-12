// Version 15 startup guard. Load before app.js.
(function () {
  function ensure(id) {
    if (document.getElementById(id)) return;
    const el = document.createElement('div');
    el.id = id;
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }
  ensure('globalBar');
  ensure('globalText');
})();
