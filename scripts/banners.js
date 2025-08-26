

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
    <div class="banner banner-250x250" style="
        width:250px; height:250px; 
        background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        border-radius:12px; display:flex; flex-direction:column; 
        align-items:center; justify-content:center; color:#fff; text-align:center;
    ">
      <h3 style="margin:0; font-size:1.4rem;">Big Sale!</h3>
      <p style="margin:10px 0; font-size:0.9rem;">Up to 50% Off</p>
      <a href="#" style="background:#fff; color:#0077ff; padding:8px 14px;
         border-radius:6px; text-decoration:none; font-weight:bold;">
         Shop Now
      </a>
    </div>
  `,

  // 300x600 Skyscraper Banner
  () => `
    <div class="banner banner-300x600" style="
        width:300px; height:600px; 
        background:linear-gradient(180deg, #ff9966 0%, #ff5e62 100%);
        border-radius:12px; display:flex; flex-direction:column; 
        align-items:center; justify-content:space-around; color:#fff; padding:20px;
        text-align:center;
    ">
      <h2 style="margin:0; font-size:2rem;">New Product</h2>
      <img src="https://via.placeholder.com/200x200" alt="Product" 
           style="border-radius:10px; margin:20px 0;">
      <p style="font-size:1rem;">Experience innovation like never before.</p>
      <a href="#" style="background:#fff; color:#ff5e62; padding:12px 20px;
         border-radius:6px; text-decoration:none; font-weight:bold;">
         Learn More
      </a>
    </div>
  `
];

function renderBanners() {
    const area = previewEl();
    area.innerHTML = banners[bannersIndex]();
    selectedEl = null;
}

function setBanner(mode){
    const map = { "small": 0, "big": 1};
    if(!(mode in map)) return;
    bannersIndex = map[mode];
    renderBanners();
}
function setBannerSize(){
    
}
document.addEventListener("DOMContentLoaded", () => {
    renderBanners();
    setBannerSize();
});