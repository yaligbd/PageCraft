
function getUsers(){
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}
function getCurrentUser(){
    const username = localStorage.getItem("currentUser");
    if (!username) return null;
    return getUsers().find(user => user.username === username) || null;
}
function setCurrentUser(usernameOrNull) {
    if (usernameOrNull) {
        localStorage.setItem("currentUser", usernameOrNull);
    } else {
        localStorage.removeItem("currentUser");
    }
}
function computeHomeRedirect(){
    // if we're in /pages/ -> go up to index.html, else stay at ./index.html
    return /\/pages\//.test(location.pathname) ? "../index.html" : "./index.html";
}
function computeLoginRedirect(){
    // if we're in /pages/ already -> ./login.html, else go into /pages/
    return /\/pages\//.test(location.pathname) ? "./login.html" : "./pages/login.html";
}
function computeSignInRedirect(){
    // if we're in /pages/ already -> ./login.html, else go into /pages/
    return /\/pages\//.test(location.pathname) ? "./sign.html" : "./pages/sign.html";
}
function computeProfileRedirect(){
  const inPages = /\/pages\//.test(location.pathname);
  return inPages
    ? "../asssets/ChatGPT Image Aug 18, 2025, 09_11_20 PM.png"
    : "./asssets/ChatGPT Image Aug 18, 2025, 09_11_20 PM.png";
}
function seedDemoUserOnce() {
    const users = getUsers();
    if (users.length === 0) {
        const demo = {
            username: "demo",
            password: "demo1234",
            email: "",
            profilePic: computeProfileRedirect() 
        };
        saveUsers([demo]);
        
    }
}
function signUp(username, password, email){
    const users = getUsers();

    if(!username || !password) {
        alert("Please fill username and password.");
        return false;
    }
    const exists = users.some(user => user.username === username);//.some returns boolean
    if (exists) {
        alert("Username already taken.");
        return false;
    }

    const newUser = {
        username: username,
        password: password, 
        email: email || "",
        profilePic: computeProfileRedirect() // default avatar
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(username);
    protectActions();
    updateNavbar();
    updateMobileProfile();
    window.location.href = computeHomeRedirect();
    return true;
}
function logIn(username, password) {
    const users = getUsers();
    const foundUser = users.find(user => user.username === username && user.password === password);
    if(!foundUser) {
        console.log("Invalid username or password.");
        return false;
    }
    setCurrentUser(foundUser.username);
    protectActions();
    updateNavbar();
    updateMobileProfile();
    window.location.href = computeHomeRedirect();
    return true;
}
function logOut(){
    setCurrentUser(null);
    console.log("Logged out successfully.");
    updateNavbar();
    updateMobileProfile();
    window.location.href = computeLoginRedirect();
    protectActions();
}
function protectActions(){
    const buttons = document.querySelectorAll(".download-btn, .send-btn, #send");

    const isLoggedIn = Boolean(getCurrentUser());
    buttons.forEach(button => {
        if (!isLoggedIn){
            button.setAttribute("disabled", "true");
            button.style.opacity = "0.5";          
            button.style.cursor = "not-allowed";
            button.title = "You must be logged in to perform this action";
        } else {
            button.removeAttribute("disabled");
            button.style.opacity = "1";            // <-- keep as string
            button.style.cursor = "pointer";
            button.title = "";
        }

        // attach guard once
        if (!button.dataset.guardAttached) {
            button.dataset.guardAttached = "1";
            button.addEventListener("click", (e) => {
                if (!getCurrentUser()) {
                    e.preventDefault();
                    e.stopPropagation();
                    alert("You must log in to save or send.");
                }
            });
        }
    });
}
function updateNavbar() {
    const navActions = document.querySelector(".nav-actions");
    if(!navActions) return;

    const loginLink = navActions.querySelector("a.profile-btn");
    const signLink = navActions.querySelector("a.btn-gradient");

    // div that hold the profile 
    let profileDiv = document.getElementById("profileDiv");
    if (!profileDiv) {
        profileDiv = document.createElement("div");
        profileDiv.id = "profileDiv";
        navActions.appendChild(profileDiv); 
    }

    const user = getCurrentUser();
    if(user){
        if(loginLink){ loginLink.style.display = "none"; }
        if(signLink){ signLink.style.display = "none"; }
        profileDiv.style.display = "flex";
        profileDiv.style.alignItems = "center";
        profileDiv.style.gap = "8px";
        profileDiv.style.flexDirection = "row-reverse";//img on right
        profileDiv.style.background = "transparent";
        profileDiv.innerHTML = `
            <span>${user.username}</span>
            <img class="profile-avatar" alt="avatar"
                 src="${user.profilePic || computeProfileRedirect()}"
                 style="width:36px;height:36px;border-radius:50%;object-fit:cover;
                        border:2px solid rgba(255,255,255,.35);cursor:pointer;">
            <button id="logoutBtn" class="btn ghost" style="margin:6px; padding: 8px 16px;color:white;border:1px solid rgba(155, 155, 155, 1); border-radius:15px; background: linear-gradient(90deg, #c0392b 0%, #e17055 100%); cursor:pointer;">Logout</button>
        `;
        const logoutBtn = profileDiv.querySelector("#logoutBtn");
        if (logoutBtn && !logoutBtn.dataset.wired) {
            logoutBtn.dataset.wired = "1";          // attach once
            logoutBtn.addEventListener("click", () => {
                logOut();                             
            });
        }

        //img switch
        const img = profileDiv.querySelector(".profile-avatar");
        img.onclick = () => {
            const url = prompt("Enter new profile picture URL:");
            if (!url) return;
            const users = getUsers();
            const i = users.findIndex(u => u.username === user.username);// findIndex returns - the index of the first element in the array that satisfies the provided testing function, or -1 if no elements satisfy the testing function.
            if (i !== -1) {
                users[i].profilePic = url;
                saveUsers(users);
                updateNavbar();
                updateMobileProfile(); 
            }
        };
    }else{
        if (loginLink) loginLink.style.display = "inline-block";
        if (signLink)  signLink.style.display  = "inline-block";
        profileDiv.style.display = "none";
        profileDiv.innerHTML = "";
    }
}
function updateMobileProfile(){
    const menu = document.querySelector(".hamburger-menu");
    if(!menu) return;
    const nameEl = menu.querySelector(".profile-name");
    const img = menu.querySelector(".profile-avatar");
    const storageFill = menu.querySelector(".storage-fill");
    const storageText = menu.querySelector(".storage-text");
    const companyEl = menu.querySelector(".profile-company");
    const loginLink = menu.querySelector("a.profile-btn");
    const signLink = menu.querySelector("a.btn-gradient");
    const logoutBtn = menu.querySelector(".log-out");
    if(!nameEl || !img || !storageFill || !storageText || !companyEl) return;

    const user = getCurrentUser();
    if(user)
       {
            img.src = user.profilePic || computeProfileRedirect();
            nameEl.textContent = user.username;
            companyEl.textContent = user.email || "No Email";
            storageFill.style.width = "0%";
            storageText.textContent = "0% used";
            if(loginLink) {loginLink.style.display = "none";}
            if(signLink)  {signLink.style.display  = "none";}
            if(logoutBtn) {logoutBtn.style.display = "inline-block";}

        if (logoutBtn && !logoutBtn.dataset.wired) {
            logoutBtn.dataset.wired = "1";          // attach once
            logoutBtn.addEventListener("click", () => {
                logOut();                             
            });
        }

            // if avatar fails to load (bad URL), swap to your default once
            img.onerror = function () {
            this.onerror = null;
            this.src = computeProfileRedirect();
            };

            img.onclick = () => {
                const url = prompt("enter URL");
                if (!url) return;
                const users = getUsers();
                const i = users.findIndex(u => u.username === user.username);
                if (i !== -1) {
                    users[i].profilePic = url;
                    saveUsers(users);
                    updateNavbar();
                    updateMobileProfile(); 
                }
            };

            
        }else{
            img.src = computeProfileRedirect();
            nameEl.textContent = "";
            companyEl.textContent = "Guest Mode";
            storageFill.style.width = "0%";
            storageText.textContent = "Log in to get storage";
            if (loginLink) loginLink.style.display = "inline-block";//  show login
            if (signLink)  signLink.style.display  = "inline-block";//  show sign up
            if (logoutBtn) logoutBtn.style.display = "none";// hide logout

        }
    

}
function authFormHandler(){
    const form = document.querySelector("#auth-form");
    if(!form) return;

    // prevent double-binding
    if (form.dataset.wired === "1") return;
    form.dataset.wired = "1";
    
    const usernameEl = form.querySelector("input[name='username']");
    const passwordEl = form.querySelector("input[name='password']");
    const emailEl = form.querySelector("input[name='Email']"); // if present, we're in sign-up mode
        // login mode
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = usernameEl?.value.trim();
            const password = passwordEl?.value;
            const email = emailEl?.value?.trim();

            if(emailEl){
                signUp(username, password, email);
                console.log("sign up mode");
            }else{
                logIn(username, password);
                console.log("login mode");
            }
            
        });
    
}

document.addEventListener("DOMContentLoaded", function () {
    seedDemoUserOnce();
    authFormHandler();
    protectActions();
    updateNavbar();
    updateMobileProfile();
});
