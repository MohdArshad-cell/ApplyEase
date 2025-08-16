document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: email,
        password: password
    };

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid email or password.');
        }
        return response.json();
    })
    .then(data => {
        // SUCCESS!
        // Save the token to the browser's local storage
        localStorage.setItem('accessToken', data.accessToken);
        
        // NEW: Redirect the user to the main homepage
        window.location.href = '/'; // '/' is the URL for the homepage (index.html)
    })
    .catch(error => {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = error.message;
        messageDiv.style.color = 'red';
    });
});