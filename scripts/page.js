

const PAGES_KEY = "pc_pages";

let templateIndex = 0;       // 0-2 templates
let selectedEl = null;       // currently selected element
let currentBg = "#ffffff";   // actual page background color
let editingId = null;//old project

const $id = (id) => document.getElementById(id);
const previewEl = () => $id("preview-content");

/* --------------------- TEMPLATES (news look) --------------------- */
const templates = [
    // 1. Resume Website
    () => `
        <article class="resume-article" data-style="resume" style="height: 100hv; padding: 2vw 5vh; display:flex; flex-direction: column;">
            <h1 class="preview-element" data-type="h1">Sr. page crafter</h1>
                        <img class="preview-element" data-type="img"
                     src="../asssets/ChatGPT Image Aug 18, 2025, 09_11_20 PM.png" alt="Steve Jobs photo"
                     style=" max-width:180px; max-height:180px; height:auto; object-fit:cover; border-radius:50px; margin:14px 0;" />
            <h2 class="preview-element" data-type="h2">Co-founder, Apple Inc.</h2>
            <p class="preview-element" data-type="p">
                Visionary entrepreneur and innovator in personal computing, mobile devices, and digital media.
            </p>

            <h3 class="preview-element" data-type="h2">Skills</h3>
            <p class="preview-element" data-type="p">
                Product Design, Leadership, Marketing, Branding, User Experience
            </p>
            <h3 class="preview-element" data-type="h2">Experience</h3>
            <p class="preview-element" data-type="p">
                Apple Inc. (1976–2011)<br>
                Pixar Animation Studios (1986–2006)<br>
                NeXT Computer (1985–1997)
            </p>
            <h3 class="preview-element" data-type="h2">Contact</h3>
            <p class="preview-element" data-type="p">
                steve@apple.com · (not publicly listed)
            </p>
        </article>
    `,
    // 2. News Article
    () => `
        <article class="news-article" data-style="news" style="height: 100hv; padding: 10vw 5vh; display:flex; flex-direction: column;">
            <h1 class="preview-element" data-type="h1">Tech Conference 2024: Innovations Unveiled</h1>
            <p class="preview-element" data-type="p" style="opacity:.8; margin-top:4px;">
                By Alex Smith · ${new Date().toLocaleDateString()}
            </p>
            <h2 class="preview-element" data-type="h2" style="margin-top:12px;">
                AI, Web3, and the future of digital experiences.
            </h2>
             <img class="preview-element" data-type="img"
                     src="../asssets/snake.png" alt="snake photo"
                     style=" max-width:auto; max-height:300px; height:auto; object-fit:cover; border-radius:50px; margin:14px 0;" />
            <p class="preview-element" data-type="p">
                The annual Tech Conference showcased breakthroughs in artificial intelligence and blockchain technology, drawing thousands of attendees.
            </p>
            <img class="preview-element" data-type="img"
                     src="" alt="Conference photo"
                     style="display:none; max-width:100%; max-height:50vh; height:auto; object-fit:contain; border-radius:10px; margin:14px 0;" />
            <p class="preview-element" data-type="p">
                Experts discussed how these trends will shape the next decade of innovation.
            </p>
        </article>
    `,
    // 3. Publicity Landing Page
    () => `
        <article class="product-landing" data-style="product" style="height: 100hv; padding: 10vw 5vh; display:flex; flex-direction: column;">
            <img class="preview-element" data-type="img"
                     src="" alt="Product image"
                     style="display:none; max-width:100%; max-height:50vh; height:auto; object-fit:contain; border-radius:16px; margin:10px 0 18px;" />
            <h1 class="preview-element" data-type="h1">Introducing: SmartWatch Pro</h1>
            <h2 class="preview-element" data-type="h2">Your health, connected.</h2>
                         <img class="preview-element" data-type="img"
                     src="../asssets/clock.png" alt="snake photo"
                     style=" max-width:auto; max-height:300px; height:auto; object-fit:cover; border-radius:50px; margin:14px 0;" />
            <p class="preview-element" data-type="p">
                Track your fitness, monitor your heart rate, and stay connected with notifications—all from your wrist.
            </p>
            <p class="preview-element" data-type="p">
                Order now and get free shipping. Limited time offer!
            </p>
        </article>
    `
];
function getProjectIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // string or null
}
function loadProjectIfEditing(){
    if(!editingId) return null;
    const list = getPages();
    const i = list.findIndex(p => p.id === editingId);
    if(i === -1) return null;
    const project = list[i];
    return {project, index: i};
}
function renderTemplate() {
    const area = previewEl();
    area.innerHTML = templates[templateIndex]();
    selectedEl = null;
}
function setPreviewMode(mode){
    const map = { "Style 1": 0, "Style 2": 1, "Style 3": 2 };
    if(!(mode in map)) return;
    templateIndex = map[mode];
    renderTemplate();
}
function wirePreviewSelection(){
    const area = document.querySelector("#preview-content");
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
function getStage(el){
    const align = parseInt(el?.dataset.alignStage ?? "1", 10);
    if(isNaN(align) || align < 0 || align > 2) return 1;
    return align;
}
function applyAlignment(el, stage){
    if(!el) return;
    const s = Number.isFinite(stage) ? stage : getStage(el);
    el.dataset.alignStage = String(s);
    el.style.display = "block";
    if(el.dataset.type !== "img"){
        el.style.textAlign = (s === 0) ? "left" :
                           (s === 1) ? "center" : "right";
    }
    el.style.marginLeft = "";
    el.style.marginRight = "";
    if(s === 0){
        el.style.marginRight = "auto";
        el.style.marginLeft = "0";
    }else if(s === 2){
        el.style.marginLeft = "auto";
        el.style.marginRight = "0";
    }else{
        el.style.marginLeft = "auto";
        el.style.marginRight = "auto";
    }
}
function stepAlign(direction) {
  if (!selectedEl) return;
  const cur  = getStage(selectedEl);
  const next = (direction === "left") ? (cur + 2) % 3 : (cur + 1) % 3;
  applyAlignment(selectedEl, next);
}
function wireArrows() {
  document.getElementById("tpl-prev")?.addEventListener("click", () => stepAlign("left"));
  document.getElementById("tpl-next")?.addEventListener("click", () => stepAlign("right"));
}
function addElement(tag){
    const area = document.querySelector("#preview-content");
    if(!area) return;
    if(tag === "p"){
        const p = document.createElement("p");
        p.className = "preview-element";
        p.dataset.type = "p";
        p.textContent = "New paragraph text";
        area.appendChild(p);
        selectedEl = p;
        p.classList.add("selected");
        applyAlignment(p, 0);
    }else if(tag === "h1"){
        const h1 = document.createElement("h1");
        h1.className = "preview-element";
        h1.dataset.type = "h1";
        h1.textContent = "New Heading 1";
        area.appendChild(h1);
        selectedEl = h1;
        h1.classList.add("selected");
        applyAlignment(h1, 1);
    }else if(tag === "h3"){
        const h3 = document.createElement("h3");
        h3.className = "preview-element";
        h3.dataset.type = "h3";
        h3.textContent = "New Heading 3";
        area.appendChild(h3);
        selectedEl = h3;
        h3.classList.add("selected");
        applyAlignment(h3, 1);
    }else if(tag === "pic"){
        openImagePicker((dataUrl) => {
            if(!dataUrl) return;
            const img = document.createElement("img");
            img.className = "preview-element";
            img.dataset.type = "img";
            img.src = dataUrl;
            img.style.maxWidth = "100%";
            img.style.maxHeight = "50vh";
            img.style.height = "auto";
            img.style.objectFit = "contain";
            img.style.borderRadius = "10px";
            img.style.margin = "14px 0";
            area.appendChild(img);
            selectedEl = img;
            img.classList.add("selected");
            applyAlignment(img, 2);
        });
    }

}
function openImagePicker(onReady){
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
function changeBackground(color){
    const area = document.querySelector("#preview-content");
    if(!area) return;
    area.style.background = color;
    currentBg = color;
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
function deleteSelectedElement(){
    if(!selectedEl) return;
    selectedEl.remove();
}
function deletePage(){
    const answer = prompt("Are you sure you want to clear the entire page? enter yes procceed.");
    if(answer.toLowerCase() !== "yes") return;
    const area = document.querySelector("#preview-content");
    area.innerHTML = "";
    selectedEl = null;
}

function getPages(){
    const raw = localStorage.getItem(PAGES_KEY);//string or null
    return raw ? JSON.parse(raw) : []; //turns json into array
}
function setPages(list){
    try{
    localStorage.setItem(PAGES_KEY, JSON.stringify(list));
    } catch(err){
        alert("Could not save to local storage, try deleting projects or using smaller images");
        throw err;
    }
    
}
function buildProjectFromPreview() {
  const area = document.getElementById("preview-content"); // where your page lives
  if (!area) return null;                                  // guard
  const html = area.innerHTML;                             // snapshot of the page
  const createdAt = new Date().toISOString();              // time stamp string
  const style = (typeof templateIndex === "number") ? templateIndex : 0;
  const bg = getComputedStyle(area).background || currentBg || "#ffffff";
  const id = "p_" + Date.now(); // unique enough id
  const list = getPages();
  const name =`Project ${list.length + 1}`;
  return { id, name, html, style, bg, createdAt }; 
}
function downloadPage(){
    const project = buildProjectFromPreview();
    if(!project) return;
    const list = getPages();
    list.unshift(project);//add to start
    setPages(list);
}

document.addEventListener("DOMContentLoaded", () => {
    editingId = getProjectIdFromURL();
    console.log("editing id", editingId);
    const found = loadProjectIfEditing();
    if(found){
        templateIndex = (typeof found.project.style === "number") ? found.project.style : 0;
        const area = document.querySelector("#preview-content");
        if(area){
            area.innerHTML = found.project.html;
            area.style.background = found.project.bg || "#fff";
        }
        currentBg = found.project.bg || "#fff";
        selectedEl = null;
    }
    if(!found){renderTemplate();}
    wirePreviewSelection();
    wireArrows();
    document.querySelectorAll(".preview-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.dataset.mode;
            setPreviewMode(mode);
        });
    }); 
    document.querySelector("#send")?.addEventListener("click", (e) => {
    e.preventDefault();
    downloadPage();
    alert("Page saved!");
    window.location.href = "../index.html";
    });

});
