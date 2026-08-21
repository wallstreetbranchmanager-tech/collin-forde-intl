(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // AES-FP AES-7F3A9C2E · Apex Executive Studio / Paul Destocki 2026
  window.__AES__ = { studio:'Apex Executive Studio', builder:'Paul Destocki', year:2026, fp:'AES-7F3A9C2E', site:'collin-forde' };

  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if(toggle && links){
    toggle.addEventListener('click', ()=>{
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- forms: inquiry + scheduling → primary collin.forde.international@gmail.com + CC CollinsellsFlorida ----
  // Level 2: same Level 1 page — forms hit BOTH emails + API fallback
  async function postJSON(url, payload){
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if(!res.ok || !data.ok) throw new Error(data.error || "API failed");
    return data;
  }

  async function submitFormSubmit(payload){
    const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent("collin.forde.international@gmail.com"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: payload._subject,
        _template: "table",
        _cc: "CollinsellsFlorida@gmail.com",
        _captcha: "false",
        ...payload
      })
    });
    const data = await res.json().catch(() => ({}));
    if(!res.ok && data.success !== true && data.success !== "true"){
      if(typeof data.message === "string" && /confirm|email/i.test(data.message)) return data;
      throw new Error(data.message || "Submit failed. Please call (321) 208-2111.");
    }
    return data;
  }

  function wireInquiry(){
    const form = document.getElementById("inquiry-form");
    if(!form) return;
    const status = form.querySelector('[data-role="inquiry-status"]');
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      if(status) status.textContent = "Sending…";
      const fd = new FormData(form);
      const payload = {
        _subject: "Property Inquiry from " + fd.get("name"),
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        market: String(fd.get("market") || ""),
        message: String(fd.get("message") || ""),
        type: "inquiry"
      };
      try {
        try {
          await postJSON("/api/lead", payload);
        } catch {
          await submitFormSubmit(payload);
        }
        if(status) status.textContent = "Sent to both of Collin's inboxes. He usually replies within one business day.";
        form.reset();
      } catch (err) {
        if(status) status.textContent = (err && err.message) || "Send failed. Call (321) 208-2111.";
      }
    });
  }

  function wireSchedule(){
    const form = document.getElementById("schedule-form");
    if(!form) return;
    const status = form.querySelector('[data-role="schedule-status"]');
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      if(status) status.textContent = "Sending…";
      const fd = new FormData(form);
      const payload = {
        _subject: "Viewing / Call from " + fd.get("name"),
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        date: String(fd.get("date") || ""),
        time: String(fd.get("time") || ""),
        notes: String(fd.get("notes") || "")
      };
      try {
        try {
          await postJSON("/api/book", payload);
        } catch {
          await submitFormSubmit(payload);
        }
        if(status) status.textContent = "Request sent to both inboxes. Collin will confirm.";
        form.reset();
      } catch (err) {
        if(status) status.textContent = (err && err.message) || "Send failed. Call (321) 208-2111.";
      }
    });
  }

  wireInquiry();
  wireSchedule();

  // smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if(!id || id === '#') return;
      const el = document.querySelector(id);
      if(el){
        e.preventDefault();
        el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
})();
