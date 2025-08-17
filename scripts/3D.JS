// === Shared Scene Setup ===
function initScene() {
  const container = document.getElementById("hero-3d-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55, // wider FOV to avoid clipping
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 9; // pull back slightly

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  // Resize handler to prevent cut-off on window resize
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  return { scene, camera, renderer, container };
}

// === Dashboard: Saturn Sphere ===
function dashboardOrb() {
  const { scene, camera, renderer, container } = initScene();

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0x82c5f5,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    })
  );
  scene.add(sphere);

  const bubbleGroup = new THREE.Group();
  for (let i = 0; i < 60; i++) {
    const bubble = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    const angle = (i / 60) * Math.PI * 2;
    bubble.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0);
    bubbleGroup.add(bubble);
  }
  scene.add(bubbleGroup);

  let speed = 0.01;
  container.addEventListener("mouseenter", () => (speed = 0.05));
  container.addEventListener("mouseleave", () => (speed = 0.01));

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += speed * 0.5;
    bubbleGroup.rotation.y += speed;
    bubbleGroup.rotation.x += speed * 0.3;
    renderer.render(scene, camera);
  }
  animate();
}

// === Pages: Floating Moving Thick Pages ===
function pageFloating() {
  const { scene, camera, renderer, container } = initScene();
  const pages = [];

  for (let i = 0; i < 6; i++) {
    const page = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.3, 0.15), // thicker
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${200 + i * 20}, 60%, 70%)`),
      })
    );
    page.position.set((i - 3) * 0.6, Math.random() * 2 - 1, Math.random() - 0.5);
    page.userData = { speed: 0.01 + Math.random() * 0.01 };
    pages.push(page);
    scene.add(page);
  }

  let speedMultiplier = 1;
  container.addEventListener("mouseenter", () => (speedMultiplier = 3));
  container.addEventListener("mouseleave", () => (speedMultiplier = 1));

  function animate() {
    requestAnimationFrame(animate);
    pages.forEach((p, idx) => {
      p.rotation.y += 0.01 * idx * speedMultiplier;
      p.rotation.x += 0.005 * speedMultiplier;
      p.position.y += Math.sin(Date.now() * 0.001 + idx) * 0.005 * speedMultiplier;
    });
    renderer.render(scene, camera);
  }
  animate();
}

// === Banners: Old-School Camera with Glow ===
function bannerCamera() {
  const { scene, camera, renderer, container } = initScene();
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1.2, 1),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.4, roughness: 0.6 })
  );
  group.add(body);

  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 1, 32),
    new THREE.MeshStandardMaterial({ color: 0x2222ff, emissive: 0x4444ff, emissiveIntensity: 0.6 })
  );
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 1;
  group.add(lens);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x4444ff, transparent: true, opacity: 0.25 })
  );
  glow.position.copy(lens.position);
  group.add(glow);

  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.2, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x555555 })
  );
  handle.position.y = 0.8;
  group.add(handle);

  scene.add(group);

  let speed = 0.01;
  container.addEventListener("mouseenter", () => (speed = 0.04));
  container.addEventListener("mouseleave", () => (speed = 0.01));

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += speed;
    group.rotation.x += speed * 0.3;
    glow.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.05);
    renderer.render(scene, camera);
  }
  animate();
}

// === Newsletters: Bubble Tunnel Fix (no cutoff) ===
function newsletterTunnel() {
  const { scene, camera, renderer, container } = initScene();
  const tunnelGroup = new THREE.Group();

  for (let i = 0; i < 150; i++) {
    const bubble = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 10, 10),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${i * 3}, 80%, 60%)`),
      })
    );
    const angle = (i / 20) * Math.PI * 2;
    const radius = 1.8; // slightly wider
    bubble.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, i * 0.18 - 15);
    tunnelGroup.add(bubble);
  }
  scene.add(tunnelGroup);

  let speed = 0.02;
  container.addEventListener("mouseenter", () => (speed = 0.06));
  container.addEventListener("mouseleave", () => (speed = 0.02));

  function animate() {
    requestAnimationFrame(animate);
    tunnelGroup.rotation.z += 0.01;
    tunnelGroup.position.z += speed;
    if (tunnelGroup.position.z > 6) tunnelGroup.position.z = -6;
    renderer.render(scene, camera);
  }
  animate();
}

// === Dispatcher ===
document.addEventListener("DOMContentLoaded", () => {
  const id = document.body.id;
  if (id === "dashboard") dashboardOrb();
  if (id === "pages") pageFloating(); // restored old animation
  if (id === "banners") bannerCamera();
  if (id === "newsletters") newsletterTunnel();
});
