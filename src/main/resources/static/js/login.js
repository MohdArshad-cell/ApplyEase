document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    const loginData = { email: email, password: password };

    console.log("📤 Sending login request:", loginData);

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        console.log("📥 Raw response object:", response);
        if (!response.ok) { throw new Error('Invalid email or password.'); }
        return response.json();
    })
    .then(data => {
        console.log("✅ Parsed JSON response:", data);

        localStorage.setItem('accessToken', data.accessToken || data.token);
        localStorage.setItem('userFirstName', data.userFirstName || data.username);
        localStorage.setItem('userRole', data.userRole || (data.roles ? data.roles[0] : ''));

        window.location.href = '/dashboard.html';
    })
    .catch(error => {
        console.error("❌ Login error:", error);
        messageDiv.textContent = error.message;
        messageDiv.style.color = 'red';
    });
});
