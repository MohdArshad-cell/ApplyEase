// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Get references to all the elements we need to change
    const welcomeMessage = document.getElementById('welcome-message');
    const welcomeSubtitle = document.getElementById('welcome-subtitle');
    const subscribeCard = document.getElementById('subscribe-card');
    const trackerCard = document.getElementById('tracker-card');
    const addAppCard = document.getElementById('add-app-card'); // New card reference

    fetch('/api/user/me', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => {
        if (!response.ok) { return window.location.href = '/login.html'; }
        return response.json();
    })
    .then(user => {
        if (user && user.firstName) {
            welcomeMessage.textContent = `Welcome Back, ${user.firstName}!`;
        }

        // --- Role-Based Logic ---
        if (user.roles.includes('ROLE_GUEST')) {
            welcomeSubtitle.textContent = 'You are on a guest plan. Upgrade to unlock more features!';
            subscribeCard.style.display = 'block';
        } 
        
        if (user.roles.includes('ROLE_CLIENT')) {
            welcomeSubtitle.textContent = 'View the status of your applications.';
            trackerCard.style.display = 'block';
        }
        
        // UPDATED LOGIC: Show tracker and add cards for AGENT or ADMIN
        if (user.roles.includes('ROLE_AGENT') || user.roles.includes('ROLE_ADMIN')) {
             welcomeSubtitle.textContent = 'What would you like to do today?';
            trackerCard.style.display = 'block';
            addAppCard.style.display = 'block'; // Show the "Add Application" card
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        window.location.href = '/login.html';
    });
});