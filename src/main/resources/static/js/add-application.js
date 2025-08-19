// js/add-application.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    const form = document.getElementById('add-application-form');
    const clientSelect = document.getElementById('client-select');
    const messageDiv = document.getElementById('message');

    // Security Check
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // --- 1. Fetch clients and populate the dropdown ---
    fetch('/api/user/clients', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to load clients.');
        return response.json();
    })
    .then(clients => {
        clientSelect.innerHTML = '<option value="">-- Select a Client --</option>'; // Clear loading text
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.firstName} ${client.lastName} (${client.email})`;
            clientSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        clientSelect.innerHTML = '<option value="">Could not load clients</option>';
    });

    // --- 2. Handle form submission ---
    form.addEventListener('submit', event => {
        event.preventDefault();
        
        const applicationData = {
            clientId: document.getElementById('client-select').value,
            companyName: document.getElementById('company-name').value,
            jobTitle: document.getElementById('job-title').value,
            location: document.getElementById('location').value,
            status: document.getElementById('status').value,
            applicationDate: document.getElementById('application-date').value,
            jobPortal: document.getElementById('job-portal').value,
            jobLink: document.getElementById('job-link').value,
            resumeLink: document.getElementById('resume-link').value,
            mailSent: false // Default value
        };

        fetch('/api/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(applicationData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Submission failed.');
            return response.json();
        })
        .then(data => {
            messageDiv.textContent = 'Application submitted successfully!';
            messageDiv.style.color = 'green';
            form.reset();
        })
        .catch(error => {
            messageDiv.textContent = 'Error: ' + error.message;
            messageDiv.style.color = 'red';
        });
    });
});