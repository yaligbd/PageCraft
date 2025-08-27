
// TODO:
// make the storage bar display some sort of data(preferly the actual data left in local storage) -1
// fixing navbar highlits -3

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("hamburger-menu");
const navLinks = document.querySelector(".nav-links");
const STORAGE_QUOTA = 5 * 1024 * 1024;
const PAGES_KEY = "pc_pages";


function getPages(){
  const pages = localStorage.getItem(PAGES_KEY);
  return pages ? JSON.parse(pages) : [];
}
function renderSavedPages(){
  const grid = document.querySelector("#pages .card-grid");
  if(!grid) return; 

  const slots = Array.from(grid.querySelectorAll(".empty-card"));
  const pages = getPages();

  if(pages.length === 0) return;

  const count = Math.min(pages.length, slots.length);
  for(let i = 0; i < count; i++){
  const project = pages[i];
  const firstSlot = slots[i];
  if(!firstSlot || !project) continue;

  // replace the empty slot markup with a simple saved-card
  firstSlot.classList.add("saved-card");
  firstSlot.innerHTML = `
     <div class="card-body">
       <div class="card-title" contenteditable="true" data-id="${project.id}" title="Click to rename">${project.name}</div>
        <div class="card-date">${new Date(project.createdAt).toLocaleString()}</div>
        <div class="card-actions">
        <button class="control-btn edit-btn" data-id="${project.id}">Edit Project</button>
        <button class="download-btn" data-id="${project.id}">Download</button>
        <button class="control-btn delete-btn" data-id="${project.id}">Delete Project</button>
       </div>
     </div>`;
  firstSlot.style.background = project.bg || "#ffffff";
  }    
  //project name handeling      
grid.addEventListener("blur", (e) => {
  const t = e.target;
  if (!t.classList.contains("card-title")) return;

  const id = t.dataset.id;
  const list = getPages();
  const i = list.findIndex(x => x.id === id);
  if (i !== -1) {
    const newName = t.textContent.trim();
    if (newName) {
      list[i].name = newName;
      localStorage.setItem(PAGES_KEY, JSON.stringify(list));
    }
  }
}, true); 


grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  if (btn.classList.contains("edit-btn")) {
    // go to builder with ?id=...
    location.href = `./pages/page.html?id=${encodeURIComponent(id)}`;
  } else if (btn.classList.contains("download-btn")) {
    const list = getPages();
    const pg = list.find(x => x.id === id);
    if (!pg) return false;

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${pg.name}</title></head>
      <body style="background:${pg.bg || "#fff"};">
        <div>${pg.html}</div>
      </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${pg.name.replace(/\s+/g,"_")}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  }else if(btn.classList.contains("delete-btn")){
    const id = btn.dataset.id;
    if(!id) return;

    const list = getPages();
    const i = list.findIndex(p => p.id === id);
    if(i !== -1){
      list.splice(i, 1);//removes 1 item rfom index i
      localStorage.setItem(PAGES_KEY, JSON.stringify(list));
    }
    const card = btn.closest(".empty-card");
    if(card){
      card.classList.remove("saved-card");
      card.style.background = "";
      card.textContent = "Empty Project Slot";
    }

  }
});
  console.log("Rendering pages:", pages);

}
function PBN(key) {
  // Map the click to the right tab + section
  const map = {
    p: { tab: '#tab-pages',   section: '#pages' },
    b: { tab: '#tab-banners', section: '#banners' },
    n: { tab: '#tab-news',    section: '#newsletters' } // <-- actual section id
  };
  const target = map[key];
  if (!target) return;

  // 1) Tabs: toggle the .active underline/colour
  document.querySelectorAll('.dashboard-buttons .dashboard-tab')
    .forEach(el => el.classList.remove('active'));
  const tabEl = document.querySelector(target.tab);
  if (tabEl) tabEl.classList.add('active');

  // 2) Sections: hide all, then show the chosen one
  document.querySelectorAll('.category-section')
    .forEach(sec => sec.classList.add('hidden'));
  const secEl = document.querySelector(target.section);
  if (secEl) secEl.classList.remove('hidden');
}


//navbar+hamburger handeling 
if (hamburger && menu) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  // Close when clicking outside the menu
  document.addEventListener("click", (e) => {
    const clickedOutside =
      !menu.contains(e.target) &&
      !hamburger.contains(e.target) &&
      !(navLinks && navLinks.contains(e.target));

    if (clickedOutside) {
      menu.classList.remove("show");
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const allLinks = Array.from(
    document.querySelectorAll(".nav-links a, .hamburger-menu .menu-links a")
  );

  // Normalize a pathname so `/`, `/index`, `/index.html` all match
  const normalizePath = (pathname) => {
    try {
      // Ensure it starts with a slash and strip query/hash
      let p = pathname;
      if (!p.startsWith("/")) p = new URL(pathname, location.origin).pathname;

      // Treat directory path as its index.html
      if (p.endsWith("/")) p += "index.html";

      // Some servers serve `/index` without extension
      if (/\/index$/i.test(p)) p = p + ".html";

      return p.toLowerCase();
    } catch {
      return pathname.toLowerCase();
    }
  };

  const current = normalizePath(location.pathname);

  // Fallback: if your site mixes relative paths, keep the last clicked link
  // so it highlights even during quick redirects.
  const lastClicked = sessionStorage.getItem("lastNavClick");
  const candidatePath = lastClicked ? normalizePath(lastClicked) : current;

  // Clear any previous state
  allLinks.forEach((a) => {
    a.classList.remove("active");
    a.removeAttribute("aria-current");
  });

  // Mark the best match
  let marked = false;
  for (const a of allLinks) {
    const linkPath = normalizePath(new URL(a.getAttribute("href"), location.href).pathname);
    if (linkPath === candidatePath) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
      marked = true;
    }
  }

  // If nothing matched exactly, try a softer “endsWith filename” match
  if (!marked) {
    const file = candidatePath.split("/").pop(); // e.g., banner.html
    for (const a of allLinks) {
      const linkPath = new URL(a.getAttribute("href"), location.href).pathname.toLowerCase();
      if (linkPath.endsWith("/" + file)) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    }
  }

  // Persist the click before navigating (helps with mixed relative paths)
  allLinks.forEach((a) => {
    a.addEventListener("click", () => {
      try {
        const targetPath = new URL(a.getAttribute("href"), location.href).pathname;
        sessionStorage.setItem("lastNavClick", targetPath);
      } catch {}
    });
  });
});
document.addEventListener("DOMContentLoaded", renderSavedPages);

document.addEventListener('DOMContentLoaded', () => {
  PBN('p');
});
// expose for inline onclick handlers (because index.js is a module)
window.PBN = PBN;




