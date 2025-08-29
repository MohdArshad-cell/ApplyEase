document.addEventListener('DOMContentLoaded', () => {
    // 1. Read the token and role from localStorage.
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');

    // 2. If the user isn't logged in, redirect them.
    if (!token || !userRole) {
        window.location.href = '/login.html';
        return;
    }

    // 3. Prepare variables to hold the file paths.
    let dashboardHtmlUrl;
    let dashboardScriptUrl;

    const contentArea = document.getElementById('dashboard-content');

    // 4. Determine which dashboard to load based on the user's role.
    // We check from most privileged (Admin) to least privileged.
    if (userRole.includes('ROLE_ADMIN')) {
        console.log("User is an Admin. Loading admin dashboard.");
        dashboardHtmlUrl = '/partials/dashboard-admin.html';
        //dashboardScriptUrl = '/js/admin-dashboard-logic.js';

    } else if (userRole.includes('ROLE_AGENT')) {
        console.log("User is an Agent. Loading agent dashboard.");
        dashboardHtmlUrl = '/partials/dashboard-agent.html';
        dashboardScriptUrl = '/js/agent-dashboard-logic.js';

    } else if (userRole.includes('ROLE_CLIENT')) {
        console.log("User is a Client. Loading client dashboard.");
        dashboardHtmlUrl = '/partials/dashboard-client.html';
        dashboardScriptUrl = '/js/client-dashboard-logic.js';

    } else if (userRole.includes('ROLE_GUEST')) {
        console.log("User is a Guest. Loading guest dashboard.");
        dashboardHtmlUrl = '/partials/dashboard-guest.html';
        //dashboardScriptUrl = '/js/guest-dashboard-logic.js';

    } else {
        // If the role is unknown, show an error.
        contentArea.innerHTML = '<h2>No dashboard available for your role.</h2>';
        return;
    }

    // 5. Fetch the determined HTML partial and then load its specific script.
    if (dashboardHtmlUrl) {
        fetch(dashboardHtmlUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${dashboardHtmlUrl}. Please ensure the file exists.`);
                }
                return response.text();
            })
            .then(html => {
                // Place the fetched HTML into the main content area.
                contentArea.innerHTML = html;
                
                // If a script is also defined, create a new script tag and add it to the page.
                // This ensures the logic for the dashboard runs after its HTML is ready.
                if (dashboardScriptUrl) {
                    const script = document.createElement('script');
                    script.src = dashboardScriptUrl;
                    document.body.appendChild(script);
                }
            })
            .catch(error => {
                console.error('Error loading dashboard:', error);
                contentArea.innerHTML = `<h2>Error loading dashboard: ${error.message}</h2>`;
            });
    }
});