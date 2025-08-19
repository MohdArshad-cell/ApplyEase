// js/home.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    const welcomeMessage = document.getElementById('welcome-message');

    // If there's no token, the user isn't logged in. Redirect them.
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Fetch the current user's details from our new secure endpoint
    fetch('/api/user/me', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            // If the token is invalid or expired, redirect to login
            window.location.href = '/login.html';
            return;
        }
        return response.json();
    })
    .then(user => {
        // Update the h1 tag with a personalized greeting
        if (user && user.firstName) {
            welcomeMessage.textContent = `Welcome Back, ${user.firstName}!`;
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        // If anything goes wrong, it's safest to send them to the login page
        window.location.href = '/login.html';
    });
});