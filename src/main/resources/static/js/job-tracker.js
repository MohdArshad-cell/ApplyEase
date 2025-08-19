// src/main/resources/static/js/job-tracker.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    const tableBody = document.getElementById('applications-table-body');

    // 1. Security Check: If no token, redirect to login
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // 2. Fetch data from the secure endpoint for clients
    fetch('/api/applications/my-applications', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (response.status === 401 || response.status === 403) {
            // Handle unauthorized access
            window.location.href = '/login.html';
            return;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch applications.');
        }
        return response.json();
    })
    .then(applications => {
        if (!applications || applications.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-10">No applications found.</td></tr>';
            return;
        }

        // 3. Build the HTML table rows from the data
        let tableHTML = '';
        applications.forEach(app => {
            tableHTML += `
                <tr class="border-b border-gray-800">
                    <td class="py-3 px-4">${app.companyName}</td>
                    <td class="py-3 px-4">${app.jobTitle}</td>
                    <td class="py-3 px-4">${app.applicationDate}</td>
                    <td class="py-3 px-4">${app.status || 'N/A'}</td>
                    <td class="py-3 px-4">${app.clientRemark || 'No remarks'}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = tableHTML;
    })
    .catch(error => {
        console.error('Error fetching applications:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-10 text-red-500">Could not load data.</td></tr>';
    });
});