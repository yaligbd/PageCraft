// TODO:

const BANNERS_KEY = "pc_banners";
let bannersIndex = 0;//0-1 two types of banners
let currentBg = "#fff";
let editingId = null;
let selectedEl = null;

const $id = (id) => document.getElementById(id);
const previewEl = () => $id("preview-content");

const banners = [
  // 250x250 Square Banner
  () => `
    <article id="banner" class="banner banner-250x250" data-style="banner-250" style="
      width:250px; height:250px;
      background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border-radius:12px; display:flex; flex-direction:column;
      align-items:center; justify-content:center; color:#fff; text-align:center;
      padding:16px; box-shadow:0 8px 24px rgba(0,0,0,.18);
      position:relative; overflow:hidden; margin:auto;
    ">
      <!-- soft highlight overlays -->
      <div style="
        position:absolute; inset:0; pointer-events:none;
        background:
          radial-gradient(120px 120px at 20% 10%, rgba(255,255,255,.25), transparent 60%),
          radial-gradient(160px 160px at 80% 110%, rgba(255,255,255,.10), transparent 60%);
      "></div>

      <!-- small badge -->
      <div class="preview-element" data-type="p" style="
        position:absolute; top:10px; left:10px;
        background:rgba(255,255,255,.85); color:#0a84ff;
        font-weight:700; font-size:.75rem; padding:4px 8px;
        border-radius:999px; box-shadow:0 2px 6px rgba(0,0,0,.15);
      ">Limited</div>

      <h3 class="preview-element" data-type="h3" style="
        margin:0; font-size:1.35rem; line-height:1.5; letter-spacing:.3px;
        text-shadow:0 1px 2px rgba(0,0,0,.2);
      ">Big Sale!</h3>

      <h4 class="preview-element" data-type="h4" style="
        margin:0; font-size:1.1rem; line-height:1.3; letter-spacing:.3px;
        text-shadow:0 1px 2px rgba(0,0,0,.2);
      ">On The Entire Store</h4>

      <p class="preview-element" data-type="p" style="
        margin:8px 0 14px; font-size:.95rem; opacity:.9;
      ">Up to 50% Off</p>

      <a class="preview-element" data-type="a"
         style="
           background:#fff; color:#0077ff; padding:10px 16px;
           border-radius:8px; text-decoration:none; font-weight:800;
           letter-spacing:.2px; display:inline-block;
           box-shadow:0 6px 16px rgba(0,0,0,.18);
           transition:transform .15s ease, box-shadow .15s ease;
         "
         onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 10px 24px rgba(0,0,0,.25)';"
         onmouseout="this.style.transform=''; this.style.boxShadow='0 6px 16px rgba(0,0,0,.18)';"
      >
        Shop Now
        <span style="margin-left:6px; display:inline-block; transform:translateY(1px)">➜</span>
      </a>
    </article>
  `,

  // 300x600 Skyscraper Banner
  () => `
    <article id="banner" class="banner banner-300x600" data-style="banner-300" style="
      width:300px; height:600px;
      background:linear-gradient(180deg, #ff9966 0%, #ff5e62 100%);
      border-radius:12px; display:flex; flex-direction:column;
      align-items:center; justify-content:space-around; color:#fff; padding:20px;
      text-align:center; margin:auto;
    ">
      <h1 class="preview-element" data-type="h1" style="margin:0; font-size:2rem;">Page Craft</h1>
      <h2 class="preview-element" data-type="h2" style="margin:0; font-size:1.2rem;">
        Everything from landing pages to the stars
      </h2>

      <img class="preview-element" data-type="img"
           src="../asssets/dog.png" alt="Product"
           width="220" height="220" loading="lazy" decoding="async" draggable="false"
           style=" 
             width:100%; max-width:220px; aspect-ratio:1/1; height:auto; object-fit:cover;
             border-radius:14px; border:2px solid rgba(255,255,255,.35);
             box-shadow:0 10px 25px rgba(0,0,0,.28); background:rgba(255,255,255,.08);
             margin:20px 0;
           " />

      <p class="preview-element" data-type="p" style="font-size:1rem; margin:0;">
        Experience innovation like never before.
      </p>

      <a class="preview-element" data-type="a"
         style="
           background:#fff; color:#ff5e62; padding:12px 20px;
           border-radius:6px; text-decoration:none; font-weight:bold;
           display:inline-block; box-shadow:0 6px 14px rgba(0,0,0,.2);
           transform:translateZ(0);
         ">
         Learn More
      </a>
    </article>
  `
];


function getBannerIdFromURL(){
  const params = new URLSearchParams(location.search); // built-in helper for query strings
  return params.get("id");                              // returns the id string or null
}


function loadBannerFromStorage(id){
  const list = getSavedBanners();                       // read localStorage "pc_banners"
  const item = list.find(x => x.id === id);             // find the record with this id
  if (!item) return false;                              // nothing found → signal failure

  const area = previewEl();                             // #preview-content (stable parent)
  area.innerHTML = item.html;                           // inject the FULL saved <article id="banner">…</article>

  const root = area.querySelector("#banner");           // the live banner root we just injected
  if (root && item.bg) root.style.background = item.bg; // ensure background is applied

  if (typeof item.style === "number") {                 // remember which template index was used
    bannersIndex = item.style;
  }
  currentBg = item.bg || currentBg;                     // keep bg snapshot in sync
  selectedEl = null;                                    // nothing selected yet

  wirePreviewSelection();                               // attach click-to-select on the NEW #banner
  return true;
}

function renderBanners() {
    const area = previewEl();
    area.innerHTML = banners[bannersIndex]();
    selectedEl = null;
    wirePreviewSelection();
}
function setBanner(mode){
    const map = { "small": 0, "big": 1};
    if(!(mode in map)) return;
    bannersIndex = map[mode];
    renderBanners();
}
function addImg(onReady){
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", () => {
        const file = input.files && input.files[0];//safely grabs the first file or gives undefined if none
        if(!file) return;
        const reader = new FileReader();// creates a FileReader, a browser API for reading file contents.
        reader.onload = () => onReady(String(reader.result));
        reader.readAsDataURL(file);
    });
    input.click();
}
function addElement(tag){
    const area = document.querySelector("#banner");
    if(!area) return;
    if(tag === "p"){
        const p = document.createElement("p");
        p.className = "preview-element";
        p.dataset.type = "p";
        p.textContent = "New paragraph text";
        area.appendChild(p);
        selectedEl = p;
        p.classList.add("selected");
    }else if(tag === "h2"){
        const h1 = document.createElement("h2");
        h1.className = "preview-element";
        h1.dataset.type = "h2";
        h1.textContent = "New Heading 2";
        area.appendChild(h1);
        selectedEl = h1;
        h1.classList.add("selected");
    }else if(tag === "h3"){
        const h3 = document.createElement("h3");
        h3.className = "preview-element";
        h3.dataset.type = "h3";
        h3.textContent = "New Heading 3";
        area.appendChild(h3);
        selectedEl = h3;
        h3.classList.add("selected");
    }else if(tag === "pic"){
        addImg((dataUrl) => {
            if(!dataUrl) return;
            const img = document.createElement("img");
            img.className = "preview-element";
            img.dataset.type = "img";
            img.src = dataUrl;
            img.style.maxWidth = "100%";
            img.style.maxHeight = "50vh";
            img.style.height = "auto";
            img.style.objectFit = "contain";
            img.style.borderRadius = "15px";
            img.style.margin = "14px 0";
            area.appendChild(img);
            selectedEl = img;
            img.classList.add("selected");
        });
    }

}
function deleteSelectedElement(){
    if(!selectedEl) return;
    selectedEl.remove();
}
function wirePreviewSelection(){
    const area = document.querySelector("#banner");
    if(!area) return;
    area.addEventListener("click" , function(e){
        let el = e.target;
        while(el && !el.classList.contains("preview-element")){
            el = el.parentElement;
        }
        if(selectedEl){
            selectedEl.classList.remove("selected");// unselect previous
        }
        if(!el){
            selectedEl = null;
            return;
        }
        selectedEl = el;
        selectedEl.classList.add("selected");
        console.log(selectedEl);

        const input = document.querySelector("#element-text");
        if(input){
            if(selectedEl.dataset.type === "img"){
                input.value = selectedEl.getAttribute("src") || "";
                input.placeholder = "Enter image URL";
            }else{
                input.value = selectedEl.textContent.trim();
            }
        }
    });
}
function deleteBanner(){
    const area = document.querySelector("#banner");
    if(!area) return;
    const answer = prompt("Are you sure you want to clear the entire page? enter yes procceed.");
    if(answer.toLowerCase() !== "yes") return;
    area.innerHTML = "";
    selectedEl = null;
}
function updateSelectedElement(){
    if(!selectedEl) return;
    const input = document.querySelector("#element-text");
    const colorSelect = document.querySelector("#element-color");
    if(input){
        const val = input.value.trim();
        if(selectedEl.dataset.type === "img"){
            if(val.startsWith("http") || val.startsWith("data:")){
                selectedEl.src = val;
                selectedEl.style.display = "block";
            }
        }else{
            if(val){
                selectedEl.textContent = val;
            }
        }
    }
    selectedEl.style.color = colorSelect?.value || "#232323ff";
}
function setBackground(color){
    const banner = document.querySelector("#banner");
    if(!banner) return;
    banner.style.background = color;
    currentBg = color;
}
function setCurrentBanner(){
  const area = document.querySelector("#banner");
  if(!area) return;
  const html = area.outerHTML;
  const bg = getComputedStyle(area).background || currentBg || "#ffffff";
  const id = "b_"+ Date.now();
  const style = (typeof bannersIndex === "number") ? bannersIndex : 0;
  const createdAt = new Date().toISOString(); 
  const list = getSavedBanners();
  const name = `Project${list.length + 1}`;
  return {html,bg,id,style,createdAt,name};
  
}
function getSavedBanners(){
  try{
  const raw = localStorage.getItem(BANNERS_KEY);
  return raw ? JSON.parse(raw) : [];
  }catch (err){
    console.error('getSavedBanners:', err);
    return [];
  }
}
function saveBanner(list){
  try{
    localStorage.setItem(BANNERS_KEY, JSON.stringify(list));
  }catch(err){
    alert("local storage is full delete projects or try using a different photo");
    throw err;
  }
}
function downloadBanner(){
  const project = setCurrentBanner();
  if(!project) return;
  const list = getSavedBanners();
  list.unshift(project);
  saveBanner(list);
  window.location.href = "../index.html#banners";
}

document.addEventListener("DOMContentLoaded", () => {
    const id = getBannerIdFromURL();
    const loaded = id ? loadBannerFromStorage(id) : false;
    if(!loaded){
    renderBanners();
    wirePreviewSelection();
    }
});
