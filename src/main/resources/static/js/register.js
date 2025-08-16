document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };

    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => response.text().then(text => ({ status: response.status, text })))
    .then(data => {
        const messageDiv = document.getElementById('message');
        if (data.status === 201) { // 201 Created - Success
            messageDiv.textContent = 'Registration successful! Redirecting to login...';
            messageDiv.style.color = 'green';
            
            // NEW: Wait 2 seconds, then redirect to the login page
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);

        } else { // Handle errors
            messageDiv.textContent = data.text;
            messageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'An error occurred during registration.';
        messageDiv.style.color = 'red';
    });
});