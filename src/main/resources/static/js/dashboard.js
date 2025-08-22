// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    const dashboardContent = document.getElementById('dashboard-content');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const loadDashboardPartial = (partialPath) => {
        fetch(partialPath)
            .then(response => response.text())
            .then(html => dashboardContent.innerHTML = html)
            .catch(error => console.error(`Error loading partial: ${partialPath}`, error));
    };

    fetch('/api/user/me', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => {
        if (!response.ok) { throw new Error('Session expired.'); }
        return response.json();
    })
    .then(user => {
        if (!user) return;
        
        // --- NEW PRIORITY-BASED ROLE CHECK ---
        if (user.roles.includes('ROLE_ADMIN')) {
            loadDashboardPartial('/partials/dashboard-agent.html'); // Admins see the agent view for now
        } else if (user.roles.includes('ROLE_AGENT')) {
            loadDashboardPartial('/partials/dashboard-agent.html');
        } else if (user.roles.includes('ROLE_CLIENT')) {
            loadDashboardPartial('/partials/dashboard-client.html');
        } else if (user.roles.includes('ROLE_GUEST')) {
            // This will only run if none of the other roles are present
            loadDashboardPartial('/partials/dashboard-guest.html');
        } else {
            dashboardContent.innerHTML = `<p>Welcome! Your dashboard is being set up.</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        localStorage.removeItem('accessToken');
        window.location.href = '/login.html';
    });
});