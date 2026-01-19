// Terminal easter egg (help + shortcuts)
(function terminalEasterEgg(){
    const input = document.getElementById("terminalInput");
    const help = document.getElementById("terminalHelp");
    const out  = document.getElementById("terminalOutput");
    if (!input) return;
  
    const say = (html) => {
      if (!out) return;
      out.innerHTML = html;
      out.classList.remove("hidden");
    };
  
    function goTo(id){
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  
    input.addEventListener("focus", ()=> input.select());
  
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
  
      const cmd = (input.value || "").trim().toLowerCase();
  
      if (cmd === "help") {
        help?.classList.remove("hidden");
        say(`Commands:
          <span class="text-lime-300">help</span>, <span class="text-lime-300">p</span> projects,
          <span class="text-lime-300">a</span> about,
          <span class="text-lime-300">c</span> contact`);
        return;
      }
  
      if (cmd === "p") { say(`→ navigating to <span class="text-lime-300">/projects</span>`); goTo("projects"); return; }
      if (cmd === "a") { say(`→ navigating to <span class="text-lime-300">/whoami</span>`); goTo("whoami"); return; }
      if (cmd === "c") { say(`→ navigating to <span class="text-lime-300">/contact</span>`); goTo("contact"); return; }
  
      help?.classList.add("hidden");
      say(`Unknown command. Type <span class="text-lime-300">help</span>.`);
    });
  })();
  
  
  // Smooth draggable cards (rAF) + Prev/Next + Reset (single-pointer alternative)
  (function draggableCards(){
    const stage = document.getElementById('stage');
    if (!stage) return;
  
    const cards = Array.from(stage.querySelectorAll('.card'));
    let zBase = 10;
  
    // Fade in
    cards.forEach((card, i) => setTimeout(() => card.classList.add('loaded'), i * 110));
  
    const centerCard = (card) => {
      card.style.left = "50%";
      card.style.top = "50%";
      card.style.transform = "translate(-50%, -50%)";
    };
  
    const resetAll = () => {
      cards.forEach((c, idx) => {
        centerCard(c);
        c.style.zIndex = (6 - idx) + 2;
      });
    };
  
    cards.forEach(card => {
      let isDragging = false;
      let offsetX = 0, offsetY = 0;
      let targetX = 0, targetY = 0;
      let raf = null;
  
      const bringFront = () => {
        zBase++;
        card.style.zIndex = zBase;
      };
  
      const tick = () => {
        card.style.left = targetX + "px";
        card.style.top = targetY + "px";
        raf = null;
      };
  
      card.addEventListener('mousedown', (e) => {
        isDragging = true;
        card.style.cursor = 'grabbing';
        bringFront();
  
        const stageRect = stage.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
  
        // If centered transform is active, convert to px
        if (card.style.transform.includes('-50%') || card.style.transform === "") {
          card.style.transform = "translate(0,0)";
          card.style.left = (cardRect.left - stageRect.left) + "px";
          card.style.top  = (cardRect.top  - stageRect.top) + "px";
        }
  
        const left = parseFloat(card.style.left) || 0;
        const top  = parseFloat(card.style.top) || 0;
  
        offsetX = e.clientX - (stageRect.left + left);
        offsetY = e.clientY - (stageRect.top  + top);
      });
  
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
  
        const stageRect = stage.getBoundingClientRect();
        const x = e.clientX - stageRect.left - offsetX;
        const y = e.clientY - stageRect.top  - offsetY;
  
        const maxX = stage.clientWidth - card.offsetWidth;
        const maxY = stage.clientHeight - card.offsetHeight;
  
        targetX = Math.max(0, Math.min(x, maxX));
        targetY = Math.max(0, Math.min(y, maxY));
  
        if (!raf) raf = requestAnimationFrame(tick);
      });
  
      document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        card.style.cursor = 'grab';
      });
  
      // Double-click to re-center this card
      card.addEventListener('dblclick', () => {
        bringFront();
        centerCard(card);
      });
    });
  
    // Prev/Next: single-pointer alternative for dragging
    let activeIndex = 0;
    function bringToFront(i){
      activeIndex = (i + cards.length) % cards.length;
      zBase++;
      cards[activeIndex].style.zIndex = zBase;
    }
  
    document.getElementById('nextCard')?.addEventListener('click', () => bringToFront(activeIndex + 1));
    document.getElementById('prevCard')?.addEventListener('click', () => bringToFront(activeIndex - 1));
    document.getElementById('resetCards')?.addEventListener('click', resetAll);
  })();
  
  
  // Skills as modules (smooth panel)
  (function skillsModules(){
    const panel = document.getElementById("modulePanel");
    const title = document.getElementById("modulePanelTitle");
    const body = document.getElementById("modulePanelBody");
    const proof = document.getElementById("moduleProofLink");
    const close = document.getElementById("closeModule");
    const cards = document.querySelectorAll(".module-card");
    if (!panel || !title || !body || !proof || !close || cards.length === 0) return;
  
    // Replace these 3 links later with your real GitHub repo/file links
    const data = {
      api: {
        title: "module.api",
        body: "Build REST APIs with Flask/FastAPI, validation, structured error handling, and clean routing.",
        proofText: "Proof link → (add your repo link)",
        proofHref: "https://github.com/"
      },
      db: {
        title: "module.db",
        body: "Design schemas, write joins, handle CRUD, and build data-driven apps with SQL databases.",
        proofText: "Proof link → (add your schema/query file)",
        proofHref: "https://github.com/"
      },
      automation: {
        title: "module.automation",
        body: "Automation scripts, small CLIs, file processing, and workflow tools that reduce manual work.",
        proofText: "Proof link → (add your automation repo)",
        proofHref: "https://github.com/"
      }
    };
  
    function openModule(key){
      const m = data[key];
      if (!m) return;
  
      title.textContent = m.title;
      body.textContent = m.body;
      proof.textContent = m.proofText;
      proof.href = m.proofHref;
  
      panel.classList.remove("hidden");
      requestAnimationFrame(()=> panel.classList.add("show"));
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  
    cards.forEach(btn => btn.addEventListener("click", () => openModule(btn.dataset.module)));
  
    close.addEventListener("click", () => {
      panel.classList.remove("show");
      setTimeout(()=> panel.classList.add("hidden"), 180);
    });
  })();
  
  
  // API Playground (typewriter output)
  (function apiPlayground(){
    const out = document.getElementById("apiOutput");
    const btns = document.querySelectorAll(".endpoint-btn");
    if (!out || btns.length === 0) return;
  
    const payloads = {
      projects: {
        ok: true,
        endpoint: "GET /projects",
        data: [
          { name: "Project One", stack: ["Python", "Flask", "SQL"], status: "in_progress" },
          { name: "Project Two", stack: ["Python", "Automation"], status: "planned" }
        ]
      },
      skills: {
        ok: true,
        endpoint: "GET /skills",
        data: {
          api: ["Flask/FastAPI", "Validation", "Error Handling"],
          db: ["MySQL/Postgres", "Schema", "Joins"],
          automation: ["CLI tools", "File processing", "Schedulers"]
        }
      },
      contact: {
        ok: true,
        endpoint: "GET /contact",
        data: {
          email: "sadubey1122@gmail.com",
          linkedin: "/in/shreyanshdubey"
        }
      }
    };
  
    function typeOut(text){
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) { out.textContent = text; return; }
  
      out.textContent = "";
      let i = 0;
      const step = () => {
        out.textContent += text[i++] || "";
        if (i < text.length) requestAnimationFrame(step);
      };
      step();
    }
  
    btns.forEach(b => {
      b.addEventListener("click", () => {
        const key = b.dataset.endpoint;
        typeOut(JSON.stringify(payloads[key], null, 2));
      });
    });
  })();
  