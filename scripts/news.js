
const NEWS_KEY = "pc_news";

let templateIndex = 0;     
let selectedEl = null;     
let currentBg = "#ffffff"; 
let editingId = null;      

const $id = (id) => document.getElementById(id);
const previewEl = () => $id("preview-content");


const templates = [
  // 1) Announcement / Launch
  () => `
  <article class="nl-announcement" data-style="announce" style="padding: 32px; height:100vh; max-width: 720px; margin: 0 auto;">
    <header style="text-align:center; margin-bottom: 18px;">
      <h1 class="preview-element" data-type="h1" style="margin:0 0 4px;">We’re Launching Something New 🚀</h1>
      <p class="preview-element" data-type="p" style="opacity:.85; margin:0;">${new Date().toLocaleDateString()}</p>
    </header>

    <img class="preview-element" data-type="img"
         src="" alt="Hero"
         style="display:none; width:100%; max-height:320px; height:auto; object-fit:cover; border-radius:12px; margin:16px 0;" />

    <p class="preview-element" data-type="p" style="line-height:1.55;">
      Big news! We’re excited to share the next step in our journey with you.
    </p>

    <a href="#" class="preview-element" data-type="cta"
       style="display:inline-block; background:#111; color:#fff; padding:12px 18px; border-radius:8px; text-decoration:none; font-weight:700; margin:14px 0;">
       Learn More
    </a>

    <!-- Simple lead form (name+email) -->
    <form class="nl-lead" style="margin-top:20px; display:grid; gap:10px; grid-template-columns:1fr 1fr; align-items:center;">
      <input type="text" placeholder="Your name"  style="padding:10px 12px; border:1px solid #e5e7eb; border-radius:8px;">
      <input type="email" placeholder="Your email" style="padding:10px 12px; border:1px solid #e5e7eb; border-radius:8px;">
      <button type="button" style="grid-column:1/-1; padding:12px 16px; border:none; border-radius:8px; background:#2563eb; color:#fff; font-weight:700;">
        Subscribe
      </button>
    </form>

    <footer style="margin-top:24px; opacity:.7; font-size:.9rem;">
      <p class="preview-element" data-type="p">You’re receiving this because you signed up for updates. <a href="#" style="color:inherit;">Unsubscribe</a></p>
    </footer>
  </article>
  `,

  // 2) Editorial / Digest
  () => `
  <article class="nl-digest" data-style="digest" style="padding: 32px; height:100vh; max-width: 720px; margin: 0 auto;">
    <header style="text-align:center; margin-bottom: 18px;">
      <h1 class="preview-element" data-type="h1" style="margin:0;">Monthly Product Digest</h1>
      <p class="preview-element" data-type="p" style="opacity:.85; margin:6px 0 0;">Highlights, tips, and community picks</p>
    </header>

    <section style="display:grid; gap:14px; margin-top:14px;">
      <h2 class="preview-element" data-type="h2" style="margin:0;">What’s new</h2>
      <p class="preview-element" data-type="p">Feature A now supports real-time collaboration.</p>
      <p class="preview-element" data-type="p">We improved performance on mobile by 35%.</p>
    </section>

    <hr style="margin:18px 0; border:none; border-top:1px solid #e5e7eb;">

    <section style="display:grid; gap:12px;">
      <h2 class="preview-element" data-type="h2" style="margin:0;">From the blog</h2>
      <p class="preview-element" data-type="p">5 ways to turn readers into customers.</p>
      <a href="#" class="preview-element" data-type="cta"
         style="display:inline-block; align-self:start; background:#111; color:#fff; padding:10px 14px; border-radius:8px; text-decoration:none; font-weight:700;">
         Read the article
      </a>
    </section>

    <footer style="margin-top:24px; opacity:.7; font-size:.9rem;">
      <p class="preview-element" data-type="p">Change your preferences or <a href="#" style="color:inherit;">unsubscribe</a>.</p>
    </footer>
  </article>
  `,

  // 3) Promo / Ecommerce
  () => `
  <article class="nl-promo" data-style="promo" style="padding: 32px; height:100vh; max-width: 650px; margin: 0 auto;">
    <header style="text-align:center; margin-bottom: 16px;">
      <h1 class="preview-element" data-type="h1" style="margin:0;">Summer Sale — Up to 50% Off</h1>
      <p class="preview-element" data-type="p" style="opacity:.85; margin:6px 0 0;">Limited time • While supplies last</p>
    </header>

    <img class="preview-element" data-type="img"
         src="" alt="Featured product"
         style="display:none; width:100%; max-height:320px; height:auto; object-fit:cover; border-radius:12px; margin:14px 0;" />

    <p class="preview-element" data-type="p" style="line-height:1.55;">
      Grab your favorites with exclusive discounts for subscribers.
    </p>

    <a href="#" class="preview-element" data-type="cta"
       style="display:inline-block; background:#ef4444; color:#fff; padding:12px 18px; border-radius:10px; text-decoration:none; font-weight:800; letter-spacing:.2px;">
       Shop Now
    </a>

    <section style="margin-top:18px; padding:14px; border:1px dashed #fecaca; border-radius:10px;">
      <p class="preview-element" data-type="p" style="margin:0;"><strong>Use code:</strong> SUMMER25 at checkout</p>
    </section>

    <footer style="margin-top:24px; opacity:.7; font-size:.9rem;">
      <p class="preview-element" data-type="p">Don’t want promos? <a href="#" style="color:inherit;">Unsubscribe</a>.</p>
    </footer>
  </article>
  `,
];


function getBannerIdFromURL(){
  const params = new URLSearchParams(location.search); // built-in helper for query strings
  return params.get("id");                              // returns the id string or null
}


function loadBannerFromStorage(id){
  const list = getSavedBanners();                       
  const item = list.find(x => x.id === id);             
  if (!item) return false;                             

  const area = previewEl();                             
  area.innerHTML = item.html;                          

  const root = area.querySelector("#banner");           
  if (root && item.bg) root.style.background = item.bg; 

  if (typeof item.style === "number") {                
    bannersIndex = item.style;
  }
  currentBg = item.bg || currentBg;                     
  selectedEl = null;                                   

  wirePreviewSelection();                              
  return true;
}

function getProjectIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}
function getNews() {
  const raw = localStorage.getItem(NEWS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function setNews(list) {
  try {
    localStorage.setItem(NEWS_KEY, JSON.stringify(list));
  } catch (err) {
    alert("Could not save to local storage, try deleting projects or using smaller images");
    throw err;
  }
}
function loadProjectIfEditing() {
  if (!editingId) return null;
  const list = getNews();
  const i = list.findIndex(p => p.id === editingId);
  if (i === -1) return null;
  return { project: list[i], index: i };
}

function renderTemplate() {
  const area = previewEl();
  area.innerHTML = templates[templateIndex]();
  selectedEl = null;
}
function setPreviewMode(mode) {
  const map = { "Style 1": 0, "Style 2": 1, "Style 3": 2 };
  if (!(mode in map)) return;
  templateIndex = map[mode];
  renderTemplate();
}

function wirePreviewSelection() {
  const area = document.querySelector("#preview-content");
  if (!area) return;
  area.addEventListener("click", function (e) {
    let el = e.target;
    while (el && !el.classList.contains("preview-element")) {
      el = el.parentElement;
    }
    if (selectedEl) selectedEl.classList.remove("selected");
    if (!el) { selectedEl = null; return; }
    selectedEl = el;
    selectedEl.classList.add("selected");

    const input = document.querySelector("#element-text");
    if (input) {
      if (selectedEl.dataset.type === "img") {
        input.value = selectedEl.getAttribute("src") || "";
        input.placeholder = "Enter image URL";
      } else {
        input.value = selectedEl.textContent.trim();
      }
    }
  });
}

function getStage(el) {
  const align = parseInt(el?.dataset.alignStage ?? "1", 10);
  if (isNaN(align) || align < 0 || align > 2) return 1;
  return align;
}
function applyAlignment(el, stage) {
  if (!el) return;
  const s = Number.isFinite(stage) ? stage : getStage(el);
  el.dataset.alignStage = String(s);
  el.style.display = "block";
  if (el.dataset.type !== "img") {
    el.style.textAlign = (s === 0) ? "left" : (s === 1) ? "center" : "right";
  }
  el.style.marginLeft = "";
  el.style.marginRight = "";
  if (s === 0) { el.style.marginRight = "auto"; el.style.marginLeft = "0"; }
  else if (s === 2) { el.style.marginLeft = "auto"; el.style.marginRight = "0"; }
  else { el.style.marginLeft = "auto"; el.style.marginRight = "auto"; }
}
function stepAlign(direction) {
  if (!selectedEl) return;
  const cur = getStage(selectedEl);
  const next = (direction === "left") ? (cur + 2) % 3 : (cur + 1) % 3;
  applyAlignment(selectedEl, next);
}
function wireArrows() {
  document.getElementById("tpl-prev")?.addEventListener("click", () => stepAlign("left"));
  document.getElementById("tpl-next")?.addEventListener("click", () => stepAlign("right"));
}


function addElement(tag) {
  const area = document.querySelector("#preview-content");
  if (!area) return;
  if (tag === "p") {
    const p = document.createElement("p");
    p.className = "preview-element";
    p.dataset.type = "p";
    p.textContent = "New paragraph text";
    area.appendChild(p);
    selectedEl = p; p.classList.add("selected");
    applyAlignment(p, 0);
  } else if (tag === "h1") {
    const h1 = document.createElement("h1");
    h1.className = "preview-element";
    h1.dataset.type = "h1";
    h1.textContent = "New Heading 1";
    area.appendChild(h1);
    selectedEl = h1; h1.classList.add("selected");
    applyAlignment(h1, 1);
  } else if (tag === "h3") {
    const h3 = document.createElement("h3");
    h3.className = "preview-element";
    h3.dataset.type = "h3";
    h3.textContent = "New Heading 3";
    area.appendChild(h3);
    selectedEl = h3; h3.classList.add("selected");
    applyAlignment(h3, 1);
  } else if (tag === "pic") {
    openImagePicker((dataUrl) => {
      if (!dataUrl) return;
      const img = document.createElement("img");
      img.className = "preview-element";
      img.dataset.type = "img";
      img.src = dataUrl;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "50vh";
      img.style.height = "auto";
      img.style.objectFit = "cover";
      img.style.borderRadius = "12px";
      img.style.margin = "14px 0";
      area.appendChild(img);
      selectedEl = img; img.classList.add("selected");
      applyAlignment(img, 1);
    });
  } else if (tag === "cta") {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = "Call to Action";
    a.className = "preview-element";
    a.dataset.type = "cta";
    a.style.cssText = "display:inline-block; background:#111; color:#fff; padding:12px 18px; border-radius:8px; text-decoration:none; font-weight:700; margin:12px 0;";
    area.appendChild(a);
    selectedEl = a; a.classList.add("selected");
    applyAlignment(a, 1);
  }
}
function openImagePicker(onReady) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onReady(String(reader.result));
    reader.readAsDataURL(file);
  });
  input.click();
}


function changeBackground(color) {
  const area = document.querySelector("#preview-content");
  if (!area) return;
  area.style.background = color;
  currentBg = color;
}
function updateSelectedElement() {
  if (!selectedEl) return;
  const input = document.querySelector("#element-text");
  const colorSelect = document.querySelector("#element-color");
  if (input) {
    const val = input.value.trim();
    if (selectedEl.dataset.type === "img") {
      if (val.startsWith("http") || val.startsWith("data:")) {
        selectedEl.src = val;
        selectedEl.style.display = "block";
      }
    } else {
      if (val) selectedEl.textContent = val;
    }
  }
  selectedEl.style.color = colorSelect?.value || "#232323ff";
}
function deleteSelectedElement() {
  if (!selectedEl) return;
  selectedEl.remove();
}
function deletePage() {
  const answer = prompt("Are you sure you want to clear the entire page? enter yes procceed.");
  if (!answer || answer.toLowerCase() !== "yes") return;
  const area = document.querySelector("#preview-content");
  area.innerHTML = "";
  selectedEl = null;
}

/* ======================= build + save ======================= */
function buildProjectFromPreview() {
  const area = document.getElementById("preview-content");
  if (!area) return null;
  const html = area.innerHTML;
  const createdAt = new Date().toISOString();
  const style = (typeof templateIndex === "number") ? templateIndex : 0;
  const bg = getComputedStyle(area).background || currentBg || "#ffffff";
  const id = "n_" + Date.now();
  const list = getNews();
  const name = `Newsletter ${list.length + 1}`;
  return { id, name, html, style, bg, createdAt };
}
function saveNewsletter() {
  const project = buildProjectFromPreview();
  if (!project) return;
  const list = getNews();
  list.unshift(project);
  setNews(list);
}

/* ======================= boot ======================= */
document.addEventListener("DOMContentLoaded", () => {
  // support editing via ?id=...
  editingId = getProjectIdFromURL();
  const found = loadProjectIfEditing();
  if (found) {
    templateIndex = (typeof found.project.style === "number") ? found.project.style : 0;
    const area = document.querySelector("#preview-content");
    if (area) {
      area.innerHTML = found.project.html;
      area.style.background = found.project.bg || "#fff";
    }
    currentBg = found.project.bg || "#fff";
    selectedEl = null;
  }
  if (!found) renderTemplate();

  wirePreviewSelection();
  wireArrows();

  // template style buttons (Style 1/2/3)
  document.querySelectorAll(".preview-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      setPreviewMode(mode);
    });
  });

  // Save
  document.querySelector("#send")?.addEventListener("click", (e) => {
    e.preventDefault();
    saveNewsletter();
    alert("Newsletter saved!");
    window.location.href = "../index.html#news";
  });
});

// Expose a tiny API if you want to call from inline handlers
window.addElement = addElement;
window.changeBackground = changeBackground;
window.updateSelectedElement = updateSelectedElement;
window.deleteSelectedElement = deleteSelectedElement;
window.deletePage = deletePage;
