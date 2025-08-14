// scripts/login.js
// PageCraft - Login Script

'use strict';

document.addEventListener('DOMContentLoaded', initApp);

//Application entry point
function initApp() {
    initSampleUser(); // create demo user if needed
    const form = document.querySelector('#auth-form');
    form.addEventListener('submit', handleLogin)
     // wire up the login button
     document.querySelector('btn-sign-up')
        .addEventListener('click', () => {
            window.location.href = '../pages/signup.html'; // Redirect to signup page
        });
}
function getUsers(){
    // Fetch users from localStorage or return an empty array if not found
    return JSON.parse(localStorage.getItem('users')) || [];
}
function saveUsers(users) {
   // Save the users array to localStorage
    localStorage.setItem('users', JSON.stringify(users));

}

function initSampleUser(){
    const users = getUsers();
    if (users.length === 0) {
        const demoUser = {
            username : 'demo',
            password: 'demo123',
            email: 'demo@gmail.com'
        }
        users.push(demoUser);
        saveUsers(users);
        console.log('Demo user created:', demoUser);
    }
}
function validateUser(username, password) {
    // Check if the user exists in localStorage
    const users = getUsers();
    return users.some(user => user.username === username && user.password === password);
}

function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    //read inputs
    const form = event.target;
    const username = form.username.value.trim();
    const password = form.password.value;
    const errorMsg = document.getElementById('error-msg');

    //clear previous error message
    errorMsg.textContent = '';
    errorMsg.classList.remove('visible');

    // Validate inputs
    if(!validateUser(username, password)) {
        errorMsg.textContent = 'Invalid username or password';
        errorMsg.classList.add('visible');
        return;
    }
    localStorage.setItem('currentUser', username);
    console.log('User logged in:', username);
    // If validation passes, redirect to the welcome page
    window.location.href = './index.html';
}
