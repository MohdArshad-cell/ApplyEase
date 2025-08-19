// src/main/resources/static/js/login.js
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    const loginData = { email: email, password: password };

    // Step 1: Attempt to log in and get the token
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) { throw new Error('Invalid email or password.'); }
        return response.json();
    })
    .then(data => {
        // Step 2: Login was successful, save the token
        const token = data.accessToken;
        localStorage.setItem('accessToken', token);

        // Step 3: Immediately use the new token to find out the user's role
        return fetch('/api/user/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
    })
    .then(response => response.json())
    .then(user => {
        // Step 4: Redirect based on the role
        if (user.roles.includes('ROLE_GUEST')) {
            window.location.href = '/guest-dashboard.html';
        } else {
            // For CLIENT, AGENT, or ADMIN
            window.location.href = '/dashboard.html';
        }
    })
    .catch(error => {
        messageDiv.textContent = error.message;
        messageDiv.style.color = 'red';
    });
});