// js/login.js
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    const loginData = { email: email, password: password };

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
        // Step 1: Save the token.
        localStorage.setItem('accessToken', data.accessToken);
        
        // Step 2: Also save the user's name for the navbar greeting.
        // We need to fetch it before redirecting.
        return fetch('/api/user/me', {
            headers: { 'Authorization': 'Bearer ' + data.accessToken }
        });
    })
    .then(response => response.json())
    .then(user => {
        if (user && user.firstName) {
            localStorage.setItem('userFirstName', user.firstName);
        }
        // Step 3: ALWAYS redirect to the main dashboard.
        window.location.href = '/dashboard.html';
    })
    .catch(error => {
        messageDiv.textContent = error.message;
        messageDiv.style.color = 'red';
    });
});