/* scripts/page.js
   News-style page builder (updated for your 3 requests)
   - Color dots set the REAL page background (body + preview container)
   - Images capped to max-height: 50vh (responsive)
   - Arrows cycle 3 alignment stages for the SELECTED element: left → center → right
*/

let templateIndex = 0;       // 0..2 templates
let selectedEl = null;       // currently selected element
let currentBg = "#ffffff";   // actual page background color

const $id = (id) => document.getElementById(id);
const previewEl = () => $id("preview-content");
const previewContainer = () => $id("preview-container");

/* --------------------- TEMPLATES (news look) --------------------- */
const templates = [
  () => `
    <article class="news-article" data-style="s1">
      <h1 class="preview-element" data-type="h1">Breaking: New Page Builder Ships</h1>
      <h2 class="preview-element" data-type="h2">Simple tools. Powerful results.</h2>
      <p class="preview-element" data-type="p">
        Today we unveil a lightweight page builder for crafting clean, news-style landing pages.
        Click any heading or paragraph to edit and use the arrows to align left/center/right.
      </p>
      <img class="preview-element" data-type="img"
           src="" alt=""
           style="display:none; max-width:100%; max-height:50vh; height:auto; object-fit:contain; border-radius:10px; margin:14px 0;" />
      <p class="preview-element" data-type="p">
        You can add more text blocks and images. Each selected element can be moved to the left, centered, or right.
      </p>
    </article>
  `,
  () => `
    <article class="news-article" data-style="s2">
      <h1 class="preview-element" data-type="h1">Analysis: Design Like a Newsroom</h1>
      <p class="preview-element" data-type="p" style="opacity:.8; margin-top:4px;">
        By Staff Writer · ${new Date().toLocaleDateString()}
      </p>
      <h2 class="preview-element" data-type="h2" style="margin-top:12px;">
        Strong hierarchy, deliberate spacing, and readable lines.
      </h2>
      <p class="preview-element" data-type="p">
        Headlines should be clear. Subheads give context. Keep paragraphs short for scan-readers.
      </p>
      <img class="preview-element" data-type="img"
           src="" alt=""
           style="display:none; max-width:100%; max-height:50vh; height:auto; object-fit:contain; border-radius:10px; margin:14px 0;" />
      <p class="preview-element" data-type="p">
        Use the arrows to align content for left/center/right layouts.
      </p>
    </article>
  `,
  () => `
    <article class="news-article" data-style="s3">
      <img class="preview-element" data-type="img"
           src="" alt=""
           style="display:none; max-width:100%; max-height:50vh; height:auto; object-fit:contain; border-radius:10px; margin:6px 0 16px;" />
      <h1 class="preview-element" data-type="h1">Feature: Pictures Tell the Story</h1>
      <p class="preview-element" data-type="p">
        Visuals draw attention. Add a photo to lead your article, then align text with the arrows.
      </p>
      <h2 class="preview-element" data-type="h2">Solid typography + subtle motion</h2>
      <p class="preview-element" data-type="p">
        Every arrow click cycles the element: left → center → right (and back again).
      </p>
    </article>
  `
];

/* --------------------- STYLE-SPECIFIC FONTS --------------------- */
/* ---------- Unique fonts per style (Hebrew-friendly) ---------- */
const STYLE_FONTS = [
  {
    // Style 1 → classic news serif
    name: "Noto Serif Hebrew",
    css: '"Noto Serif Hebrew", Georgia, "Times New Roman", serif',
    href: "https://fonts.googleapis.com/css2?family=Noto+Serif+Hebrew:wght@400;700&display=swap"
  },
  {
    // Style 2 → clean sans
    name: "Heebo",
    css: '"Heebo", Arial, Helvetica, sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Heebo:wght@400;700&display=swap"
  },
  {
    // Style 3 → modern sans with nice headlines
    name: "Rubik",
    css: '"Rubik", Arial, Helvetica, sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap"
  }
];

function applyFontForStyle(idx) {
  const font = STYLE_FONTS[idx];
  if (!font) return;

  // 1) load the font link ONCE
  const linkId = `font-link-${idx}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = font.href;
    document.head.appendChild(link);
  }

  // 2) apply to the preview area (or switch to document.body if you want the whole page)
  const area = document.getElementById("preview-content");
  if (area) area.style.fontFamily = font.css;
  // If you prefer the entire page:
  // document.body.style.fontFamily = font.css;
}

/* --------------------- RENDER & STYLE SWITCHING --------------------- */
function renderTemplate() {
  const area = previewEl();
  if (!area) return;
  area.innerHTML = templates[templateIndex]();
  selectedEl = null;
  setArrowsActive(false);

  // NEW: apply the style-specific font
  applyFontForStyle(templateIndex);
}


function setPreviewMode(mode) {
  // your HTML calls setPreviewMode('Style 1'|'Style 2'|'Style 3')
  const map = { "Style 1": 0, "Style 2": 1, "Style 3": 2 };
  if (mode in map) {
    templateIndex = map[mode];
    renderTemplate();
  }
}
window.setPreviewMode = setPreviewMode;

/* --------------------- SELECT / EDIT --------------------- */
function setSelected(el) {
  const area = previewEl();
  if (!area) return;

  area.querySelectorAll(".preview-element").forEach(e => e.classList.remove("selected"));
  selectedEl = el || null;

  if (selectedEl) {
    selectedEl.classList.add("selected");
    setArrowsActive(true);
    const input = $id("element-text");
    if (input) {
      if (selectedEl.dataset.type === "img") {
        input.value = selectedEl.getAttribute("src") || "";
      } else {
        input.value = selectedEl.textContent.trim();
      }
    }
  } else {
    setArrowsActive(false);
  }
}

function updateSelectedElement() {
  if (!selectedEl) return alert("Select an element first.");
  const textInput = $id("element-text");
  const colorSel  = $id("element-color");
  const text  = textInput?.value ?? "";
  const color = colorSel?.value ?? "#333";

  const type = selectedEl.dataset.type;
  if (type === "img") {
    selectedEl.src = text || selectedEl.src;
    selectedEl.style.display = selectedEl.src ? "block" : "none";
    // ensure our size rules always apply
    selectedEl.style.maxWidth = "100%";
    selectedEl.style.maxHeight = "50vh";
    selectedEl.style.height = "auto";
    selectedEl.style.objectFit = "contain";
  } else {
    selectedEl.textContent = text || selectedEl.textContent;
    selectedEl.style.color = color;
  }
}

function deleteSelectedElement() {
  if (!selectedEl) return;
  const parent = selectedEl.parentElement;
  parent.removeChild(selectedEl);
  selectedEl = null;
  setArrowsActive(false);
}

function clearAllElements() {
  const area = previewEl();
  if (!area) return;
  area.innerHTML = "";
  selectedEl = null;
  setArrowsActive(false);
}

/* --------------------- ADD ELEMENTS --------------------- */
function addElement(tag) {
  const area = previewEl();
  if (!area) return;

  if (tag === "pic") {
    openImagePicker((dataUrl) => {
      const img = document.createElement("img");
      img.className = "preview-element";
      img.dataset.type = "img";
      img.src = dataUrl;
      img.alt = "";
      // smaller image sizing
      img.style.maxWidth = "100%";
      img.style.maxHeight = "50vh";
      img.style.height = "auto";
      img.style.objectFit = "contain";
      img.style.borderRadius = "10px";
      img.style.margin = "12px 0";
      area.appendChild(img);
      setSelected(img);
    });
    return;
  }

  let el;
  if (tag === "h1" || tag === "h2") {
    el = document.createElement(tag);
    el.textContent = tag === "h1" ? "Article Headline" : "Subheading";
  } else if (tag === "p") {
    el = document.createElement("p");
    el.textContent = "Your paragraph text…";
  } else {
    return;
  }
  el.className = "preview-element";
  el.dataset.type = tag;
  area.appendChild(el);
  setSelected(el);
}

// File picker → DataURL
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

/* --------------------- ARROWS: 3 STAGES (left/center/right) --------------------- */
function wireArrows() {
  const left  = $id("tpl-prev");
  const right = $id("tpl-next");
  if (left)  left.addEventListener("click", () => stepAlign("left"));
  if (right) right.addEventListener("click", () => stepAlign("right"));
}

function setArrowsActive(active) {
  const wrap = document.querySelector(".style-arrows");
  const left = $id("tpl-prev");
  const right= $id("tpl-next");
  if (!wrap || !left || !right) return;
  wrap.classList.toggle("active", !!active);
  left.disabled  = !active;
  right.disabled = !active;
}

// Get current stage: 0=left, 1=center, 2=right
function getStage(el) {
  const s = parseInt(el?.dataset.alignStage ?? "1", 10);
  return Number.isNaN(s) ? 1 : s;
}

// Apply alignment styles for a stage
function applyAlignment(el, stage) {
  if (!el) return;
  el.dataset.alignStage = String(stage);

  // Normalize base
  el.style.transform = "";
  el.style.marginLeft = "";
  el.style.marginRight = "";
  el.style.display = "block";

  // Images should stay responsive
  if (el.dataset.type === "img") {
    el.style.maxWidth = "100%";
    el.style.maxHeight = "50vh";
    el.style.height = "auto";
    el.style.objectFit = "contain";
  }

  // Text align (for text nodes)
  if (el.dataset.type !== "img") {
    el.style.textAlign = stage === 0 ? "left" : stage === 1 ? "center" : "right";
  }

  // Block alignment via margins
  if (stage === 0) {        // left
    el.style.marginLeft = "0";
    el.style.marginRight = "auto";
  } else if (stage === 1) { // center
    el.style.marginLeft = "auto";
    el.style.marginRight = "auto";
  } else {                  // right
    el.style.marginLeft = "auto";
    el.style.marginRight = "0";
  }
}

// Click ⟵ / ⟶ to move stage (wraps 0↔1↔2)
function stepAlign(direction) {
  if (!selectedEl) return;
  const cur = getStage(selectedEl);
  let next = cur;
  if (direction === "left")  next = (cur + 2) % 3; // left: -1 with wrap
  if (direction === "right") next = (cur + 1) % 3; // right: +1 with wrap
  applyAlignment(selectedEl, next);
}

/* --------------------- BACKGROUND COLOR: real page bg --------------------- */
// --- helper: read the REAL background the user sees (gradient or color) ---
function getDisplayedBackground(el) {
  const cs = getComputedStyle(el);
  // If it's a gradient, backgroundImage will be like "linear-gradient(...)"
  const bgImage = cs.backgroundImage;
  if (bgImage && bgImage !== "none") return bgImage;

  // Otherwise use the solid background color (rgb(...))
  const bgColor = cs.backgroundColor;
  if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") return bgColor;

  // Fallbacks (inline style, data-color, or white)
  return el.style.background || el.dataset.color || "#ffffff";
}

function wireColorPalette() {
  document.querySelectorAll(".color-option").forEach(opt => {
    opt.addEventListener("click", () => {
      const bg = getDisplayedBackground(opt);

      // Apply to the ACTUAL page background
      document.body.style.background = bg;

      // Keep the preview area in sync (optional but keeps it cohesive)
      const area = document.getElementById("preview-content");
      if (area) area.style.background = bg;

      // optional selection ring
      document.querySelectorAll(".color-option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });
}


/* --------------------- PREVIEW CLICK SELECTION --------------------- */
function wirePreviewSelection() {
  const area = previewEl();
  if (!area) return;
  area.addEventListener("click", (e) => {
    const el = e.target.closest(".preview-element");
    setSelected(el || null);
  });
}

/* --------------------- BOOT --------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderTemplate();        // Start with Style 1
  wireArrows();            // Enable ⟵ ⟶
  wireColorPalette();      // Real page background
  wirePreviewSelection();  // Click-to-select

  // Expose functions used by your HTML buttons:
  window.addElement = addElement;
  window.updateSelectedElement = updateSelectedElement;
  window.deleteSelectedElement = deleteSelectedElement;

  // Optional: wire a "Clear All" if you have a second delete button
  const delBtns = document.querySelectorAll(".control-group .delete-btn");
  if (delBtns.length >= 2) {
    const clearBtn = delBtns[1];
    if (!clearBtn.dataset.wired) {
      clearBtn.dataset.wired = "1";
      clearBtn.addEventListener("click", clearAllElements);
    }
  }
});
