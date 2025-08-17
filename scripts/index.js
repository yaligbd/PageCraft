const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("hamburger-menu");
const navLinks = document.querySelector(".nav-links");

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


//navbar handeling
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
