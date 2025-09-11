//======================================================================
// INITIALIZATION & CONFIG
//======================================================================
const API_BASE_URL = '';
let allApplications = [];
let allUsers = [];
let usersLoaded = false;

//======================================================================
// HELPER & UTILITY FUNCTIONS
//======================================================================
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error("Authentication token not found. Redirecting to login.");
        window.location.href = '/login.html';
        return Promise.reject(new Error('No token'));
    }
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...options.headers };
    const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        alert('Session expired or unauthorized. Please log in again.');
        window.location.href = '/login.html';
    }
    return response;
}

function showTableMessage(tableBody, message, colspan = 8) {
    if(tableBody) {
        tableBody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding: 2rem;">${message}</td></tr>`;
    }
}

//======================================================================
// DATA FETCHING & RENDERING
//======================================================================
async function loadDashboardStats() {
    try {
        const response = await fetchWithAuth('/api/admin/stats');
        if (!response.ok) throw new Error('Failed to load stats');
        const stats = await response.json();
        
        document.getElementById('stats-total-applications').textContent = stats.totalApplications || 0;
        document.getElementById('stats-total-clients').textContent = stats.totalClients || 0;
        document.getElementById('stats-total-agents').textContent = stats.totalAgents || 0;
        document.getElementById('stats-placements').textContent = stats.successfulPlacements || 0;
    } catch (error) { 
        console.error('Error loading stats:', error); 
    }
}

async function loadAllApplications() {
    const tableBody = document.getElementById('applications-table-body');
    showTableMessage(tableBody, 'Loading applications...');
    try {
        const response = await fetchWithAuth('/api/admin/applications/all');
        if (!response.ok) throw new Error('Failed to load applications');
        allApplications = await response.json();
        renderApplicationsTable(allApplications);
    } catch (error) {
        console.error('Error loading applications:', error);
        showTableMessage(tableBody, 'Failed to load applications.');
    }
}

function renderApplicationsTable(applications) {
    const tableBody = document.getElementById('applications-table-body');
    tableBody.innerHTML = '';
    if (!applications || applications.length === 0) {
        showTableMessage(tableBody, 'No applications found.');
        return;
    }
    applications.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${app.dateApplied}</td>
            <td>${app.agentName || 'N/A'}</td>
            <td>${app.clientName || 'N/A'}</td>
            <td>${app.jobTitle}</td>
            <td>${app.company}</td>
            <td>${app.location || 'N/A'}</td>
            <td>${app.status}</td>
            <td class="td-actions" data-id="${app.id}">
                <button class="action-btn" title="Edit Application"><i class="fa-solid fa-pencil"></i></button>
                <button class="action-btn" title="View Details"><i class="fa-solid fa-eye"></i></button>
                <button class="action-btn" title="Delete Application"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function loadAllUsers() {
    if (usersLoaded) return;
    try {
        const response = await fetchWithAuth('/api/admin/users/all');
        if (!response.ok) throw new Error('Failed to load users');
        allUsers = await response.json();
        
        populateFilterDropdowns(allUsers);
        const userTableBody = document.getElementById('users-table-body');
        if(userTableBody) renderUsersTable(allUsers);
        usersLoaded = true;
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsersTable(users) {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (users.length === 0) {
        showTableMessage(tableBody, 'No users found.', 6);
        return;
    }
    users.forEach(user => {
        const row = document.createElement('tr');
        const statusClass = user.active ? 'active' : 'inactive';
        row.innerHTML = `
            <td>#${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.roles.join(', ')}</td>
            <td><span class="status-pill status-${statusClass}">${user.active ? 'Active' : 'Inactive'}</span></td>
            <td class="td-actions" data-id="${user.id}" data-active="${user.active}">
                <button class="action-btn" title="Edit User"><i class="fa-solid fa-pencil"></i></button>
                <button class="action-btn" title="Toggle Status"><i class="fa-solid fa-power-off"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


//======================================================================
// MODAL & ACTION LOGIC
//======================================================================
// --- Application Modal Elements ---
const editModal = document.getElementById('edit-modal');
const viewModal = document.getElementById('view-modal');
const editForm = document.getElementById('edit-application-form');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelModalBtn = document.getElementById('cancel-edit-btn');
const modalErrorMessage = document.getElementById('modal-error-message');

// --- NEW: User Modal Elements ---
const userModal = document.getElementById('user-modal');
const userForm = document.getElementById('user-form');
const userModalTitle = document.getElementById('user-modal-title');
const userFormSubmitBtn = document.getElementById('user-form-submit-btn');
const passwordGroup = document.getElementById('password-group');
const userModalError = document.getElementById('user-modal-error');

function openEditModal(applicationId) {
    const app = allApplications.find(a => a.id == applicationId);
    if (!app) return;

    // Populate the new comprehensive form
    document.getElementById('edit-application-id').value = app.id;
 document.getElementById('edit-application-date').value = app.dateApplied;
    document.getElementById('edit-job-title').value = app.jobTitle;
    document.getElementById('edit-company-name').value = app.company;
    document.getElementById('edit-location').value = app.location;
   document.getElementById('edit-job-portal').value = app.jobPortal || '';
    document.getElementById('edit-status').value = app.status;
    document.getElementById('edit-job-link').value = app.jobLink || '';
    document.getElementById('edit-job-page').value = app.jobPageUrl || '';
    document.getElementById('edit-resume-link').value = app.resumeLink || '';
    document.getElementById('edit-additional-link').value = app.additionalLink || '';
    document.getElementById('edit-client-remark').value = app.clientRemark || '';
    document.getElementById('edit-notes').value = app.notes || '';
    document.getElementById('edit-mail-sent').checked = app.mailSent;

    modalErrorMessage.style.display = 'none';
    editModal.classList.add('visible');
}

async function handleEditFormSubmit(event) {
    event.preventDefault();
    const saveButton = editForm.querySelector('button[type="submit"]');
    saveButton.classList.add('loading');
    modalErrorMessage.style.display = 'none';

    const applicationId = document.getElementById('edit-application-id').value;
    
    // Gather all data from the new form
    const updatedData = {
        applicationDate: document.getElementById('edit-application-date').value,
        jobTitle: document.getElementById('edit-job-title').value,
        companyName: document.getElementById('edit-company-name').value,
        location: document.getElementById('edit-location').value,
        jobPortal: document.getElementById('edit-job-portal').value,
        status: document.getElementById('edit-status').value,
        jobLink: document.getElementById('edit-job-link').value,
        jobPageUrl: document.getElementById('edit-job-page').value,
        resumeLink: document.getElementById('edit-resume-link').value,
        additionalLink: document.getElementById('edit-additional-link').value,
        clientRemark: document.getElementById('edit-client-remark').value,
        notes: document.getElementById('edit-notes').value,
        mailSent: document.getElementById('edit-mail-sent').checked
    };

    try {
        const response = await fetchWithAuth(`/api/admin/applications/${applicationId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Update failed.' }));
            throw new Error(errorData.message);
        }

        const savedApp = await response.json();
        const appIndex = allApplications.findIndex(app => app.id == applicationId);
        if (appIndex !== -1) allApplications[appIndex] = savedApp;
        renderApplicationsTable(allApplications);
        
        closeEditModal();
        showToast("Application updated successfully!");

    } catch (error) {
        modalErrorMessage.textContent = error.message;
        modalErrorMessage.style.display = 'block';
    } finally {
        saveButton.classList.remove('loading');
    }
}



function closeEditModal() {
    const editModal = document.getElementById('edit-modal');
    editModal.classList.remove('visible');
}

// --- NEW: View Details Modal Functions ---
function openViewModal(applicationId) {
    const app = allApplications.find(a => a.id == applicationId);
    if (!app) return;

    const modalBody = document.getElementById('view-modal-body');
    
    // Create clickable links for URL fields
    const jobLink = app.jobLink ? `<a href="${app.jobLink}" target="_blank">View Link</a>` : 'N/A';
    const jobPageUrl = app.jobPageUrl ? `<a href="${app.jobPageUrl}" target="_blank">View Page</a>` : 'N/A';
    const resumeLink = app.resumeLink ? `<a href="${app.resumeLink}" target="_blank">View Resume</a>` : 'N/A';
    
    modalBody.innerHTML = `
        <div class="detail-item"><strong>Job Title</strong><span>${app.jobTitle}</span></div>
        <div class="detail-item"><strong>Company</strong><span>${app.company}</span></div>
        <div class="detail-item"><strong>Date Applied</strong><span>${app.dateApplied}</span></div>
        <div class="detail-item"><strong>Status</strong><span>${app.status}</span></div>
        <div class="detail-item"><strong>Agent</strong><span>${app.agentName || 'N/A'}</span></div>
        <div class="detail-item"><strong>Client</strong><span>${app.clientName || 'N/A'}</span></div>
        <div class="detail-item"><strong>Location</strong><span>${app.location || 'N/A'}</span></div>
        <div class="detail-item"><strong>Portal</strong><span>${app.jobPortal || 'N/A'}</span></div>
        <div class="detail-item"><strong>Job Link</strong><span>${jobLink}</span></div>
        <div class="detail-item"><strong>Job Page</strong><span>${jobPageUrl}</span></div>
        <div class="detail-item"><strong>Resume Link</strong><span>${resumeLink}</span></div>
        <div class="detail-item"><strong>Mail Sent</strong><span>${app.mailSent ? 'Yes' : 'No'}</span></div>
        <div class="detail-item full-width"><strong>Notes</strong><span>${app.notes || 'N/A'}</span></div>
    `;

    viewModal.classList.add('visible');
}

function closeViewModal() {
    viewModal.classList.remove('visible');
}


async function deleteApplication(applicationId) {
    if (!confirm(`Are you sure you want to delete application #${applicationId}?`)) return;

    try {
        const response = await fetchWithAuth(`/api/admin/applications/${applicationId}`, { method: 'DELETE' });
        
        if (!response.ok) throw new Error('Failed to delete application.');

        allApplications = allApplications.filter(app => app.id != applicationId);
        renderApplicationsTable(allApplications);
        showToast("Application deleted successfully!");
    } catch (error) {
        console.error('Delete failed:', error);
        alert('Could not delete the application. Please try again.');
    }
}

function showToast(message) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


function openUserModal(userId = null) {
    userForm.reset(); // Clear previous form data
    userModalError.style.display = 'none';
    document.getElementById('edit-user-id').value = '';

    if (userId) {
        // --- EDIT MODE ---
        userModalTitle.textContent = 'Edit User';
        userFormSubmitBtn.textContent = 'Save Changes';
        passwordGroup.classList.add('hidden'); // Hide password field
        document.getElementById('user-password').required = false;

        const user = allUsers.find(u => u.id == userId);
        if (user) {
            document.getElementById('edit-user-id').value = user.id;
            document.getElementById('user-first-name').value = user.firstName;
            document.getElementById('user-last-name').value = user.lastName;
            document.getElementById('user-email').value = user.email;
            // Assuming roles is an array, get the first role
            document.getElementById('user-role').value = user.roles[0];
        }
    } else {
        // --- ADD MODE ---
        userModalTitle.textContent = 'Add New User';
        userFormSubmitBtn.textContent = 'Add User';
        passwordGroup.classList.remove('hidden'); // Show password field
        document.getElementById('user-password').required = true;
    }
    userModal.classList.add('visible');
}

function closeUserModal() {
    userModal.classList.remove('visible');
}

async function handleUserFormSubmit(event) {
    event.preventDefault();
    userFormSubmitBtn.classList.add('loading');
    userModalError.style.display = 'none';

    const userId = document.getElementById('edit-user-id').value;
    const isEditMode = !!userId;

    const userData = {
        firstName: document.getElementById('user-first-name').value,
        lastName: document.getElementById('user-last-name').value,
        email: document.getElementById('user-email').value,
        role: document.getElementById('user-role').value,
    };

    if (!isEditMode) {
        userData.password = document.getElementById('user-password').value;
    }
    
    const url = isEditMode ? `/api/admin/users/${userId}` : '/api/admin/users';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetchWithAuth(url, {
            method: method,
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
            throw new Error(errorData.message);
        }

        // Refresh user list and re-render table
        await loadAllUsers();
        closeUserModal();
        showToast(`User ${isEditMode ? 'updated' : 'added'} successfully!`);

    } catch (error) {
        userModalError.textContent = error.message;
        userModalError.style.display = 'block';
    } finally {
        userFormSubmitBtn.classList.remove('loading');
    }
}

async function toggleUserStatus(userId, currentIsActive) {
    const action = currentIsActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this user?`)) {
        return;
    }

    try {
        const response = await fetchWithAuth(`/api/admin/users/${userId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ isActive: !currentIsActive })
        });

        if (!response.ok) {
            throw new Error('Failed to update user status.');
        }

        // --- Update the UI instantly ---
        // 1. Find the user in our local data array
        const user = allUsers.find(u => u.id == userId);
        if (user) {
            // 2. Flip their active status
            user.active = !currentIsActive;
        }
        // 3. Redraw the entire user table with the new data
        renderUsersTable(allUsers);
        showToast("User status updated successfully!");

    } catch (error) {
        console.error('Status toggle failed:', error);
        alert('Could not update user status. Please try again.');
    }
}
function setupActionListeners() {
    document.addEventListener('click', (event) => {
        // --- First, check for a click on an Action Button or Add User Button ---
        const button = event.target.closest('.action-btn, .add-new-user-btn');
        if (button) {
            const action = button.title;
            const parentTd = button.closest('.td-actions');
            
            // Handle Add New User button specifically
            if (button.matches('.add-new-user-btn')) {
                openUserModal();
                return; // Action handled, exit
            }

            // Handle actions within table rows
            if (parentTd) {
                const id = parentTd.dataset.id;
                if (button.closest('#applications-panel')) {
                    if (action === 'Edit Application') openEditModal(id);
                    else if (action === 'Delete Application') deleteApplication(id);
                    else if (action === 'View Details') openViewModal(id);
                } else if (button.closest('#usermgmt-panel')) {
                    const isActive = parentTd.dataset.active === 'true';
                    if (action === 'Edit User') openUserModal(id);
                    else if (action === 'Toggle Status') toggleUserStatus(id, isActive);
                }
            }
            return; // A button was clicked, so we are done.
        }

        // --- If no button was clicked, check for a click on an Analytics Table Row ---
        const analyticsRow = event.target.closest('#employee-panel tbody tr');
        if (analyticsRow && analyticsRow.dataset.agentId) {
            const agentId = analyticsRow.dataset.agentId;
            openAgentDrillDownModal(agentId);
        }
    });
}

// --- Agent Analytics Table ---
// MODIFIED: The function now accepts a 'period' parameter with a default value.
async function loadAgentAnalytics(period = 'ALL_TIME') {
    const tableBody = document.getElementById('analytics-table-body');
    showTableMessage(tableBody, 'Loading analytics...', 4); // Colspan is 4

    try {
        // The 'period' variable is now correctly defined and used here.
        const response = await fetchWithAuth(`/api/admin/analytics/agents?period=${period}`);
        if (!response.ok) throw new Error('Failed to load analytics');
        const analyticsData = await response.json();
        renderAgentAnalyticsTable(analyticsData);
    } catch (error) {
        console.error('Error loading agent analytics:', error);
        showTableMessage(tableBody, 'Failed to load analytics.', 4);
    }
}

function renderAgentAnalyticsTable(analyticsData) {
    const tableBody = document.getElementById('analytics-table-body');
    tableBody.innerHTML = '';
    if (!analyticsData || analyticsData.length === 0) {
        showTableMessage(tableBody, 'No agent data found.', 5); // Colspan is now 5
        return;
    }

    // Sort by success rate to determine rank
    analyticsData.sort((a, b) => b.successRate - a.successRate);

    analyticsData.forEach((agent, index) => {
        const row = document.createElement('tr');
		row.dataset.agentId = agent.agentId; 
		    const rank = index + 1;
        const successRate = agent.successRate.toFixed(1);

        // Determine color class for progress bar
        let rateColorClass = 'low';
        if (successRate >= 75) {
            rateColorClass = 'high';
        } else if (successRate >= 40) {
            rateColorClass = 'medium';
        }

        // Generate agent initials for the avatar
        const nameParts = agent.agentName.split(' ');
        const initials = (nameParts[0] ? nameParts[0][0] : '') + (nameParts[1] ? nameParts[1][0] : '');

        row.innerHTML = `
            <td><div class="rank rank-${rank}">${rank}</div></td>
            <td>
                <div class="agent-info">
                    <div class="avatar">${initials.toUpperCase()}</div>
                    <span class="name">${agent.agentName}</span>
                </div>
            </td>
            <td>${agent.totalApplications}</td>
            <td>${agent.totalOffers}</td>
            <td>
                <div style="display: flex; align-items: center;">
                    <div class="progress-bar">
                        <div class="progress-bar-fill ${rateColorClass}" style="width: ${successRate}%;"></div>
                    </div>
                    <span class="success-rate-text">${successRate}%</span>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
// Add these new functions to your JS file


// --- NEW, REFACTORED AGENT REPORT MODAL LOGIC ---

async function openAgentReportModal(agentId) {
    const reportModal = document.getElementById('agent-report-modal');
    if (!reportModal) return;

    reportModal.classList.add('visible');
    const modalBody = document.getElementById('agent-report-body');
    modalBody.innerHTML = '<p>Loading agent report...</p>';

    try {
        const response = await fetchWithAuth(`/api/admin/analytics/agent/${agentId}`);
        if (!response.ok) throw new Error('Could not load agent report.');
        
        const data = await response.json();

        // Set the title
        document.getElementById('agent-report-title').textContent = `${data.agentName}'s Report`;
        
        // Build the full modal content
        const statsHTML = `
            <div class="stats-grid">
                <div class="stat-card glass-card"><p class="label">Total Applications</p><p class="value">${data.totalApplications}</p></div>
                <div class="stat-card glass-card"><p class="label">Total Offers</p><p class="value">${data.totalOffers}</p></div>
                <div class="stat-card glass-card"><p class="label">Success Rate</p><p class="value">${data.successRate.toFixed(1)}%</p></div>
            </div>`;
            
        const recentAppsHTML = (data.recentApplications && data.recentApplications.length > 0)
            ? data.recentApplications.map(app => `
                <tr>
                    <td>${app.applicationDate}</td>
                    <td>${app.jobTitle}</td>
                    <td>${app.companyName}</td>
                    <td>${app.status}</td>
                </tr>`).join('')
            : '<tr><td colspan="4" style="text-align:center; padding: 2rem;">No recent applications found.</td></tr>';

        const tableHTML = `
            <h4 class="sub-header">Recent Applications</h4>
            <div class="table-wrapper">
                <table class="applications-table">
                    <thead><tr><th>Date</th><th>Job Title</th><th>Company</th><th>Status</th></tr></thead>
                    <tbody>${recentAppsHTML}</tbody>
                </table>
            </div>`;

        modalBody.innerHTML = statsHTML + tableHTML;

    } catch (error) {
        console.error(error);
        modalBody.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function closeAgentReportModal() {
    const reportModal = document.getElementById('agent-report-modal');
    if (reportModal) {
        reportModal.classList.remove('visible');
    }
}
async function openAgentDrillDownModal(agentId) {
    const drilldownModal = document.getElementById('agent-report-modal');
    if (!drilldownModal) return;

    drilldownModal.classList.add('visible');
    const modalBody = document.getElementById('agent-report-body');
    modalBody.innerHTML = '<p>Loading agent report...</p>';

    try {
        const response = await fetchWithAuth(`/api/admin/analytics/agent/${agentId}`);
        if (!response.ok) throw new Error('Could not load agent report.');
        
        const data = await response.json();

        // Set the title
        document.getElementById('agent-report-title').textContent = `${data.agentName}'s Report`;
        
        // Build the full modal content
        const statsHTML = `
            <div class="stats-grid">
                <div class="stat-card glass-card"><p class="label">Total Applications</p><p class="value">${data.totalApplications}</p></div>
                <div class="stat-card glass-card"><p class="label">Total Offers</p><p class="value">${data.totalOffers}</p></div>
                <div class="stat-card glass-card"><p class="label">Success Rate</p><p class="value">${data.successRate.toFixed(1)}%</p></div>
            </div>`;
            
        const recentAppsHTML = (data.recentApplications && data.recentApplications.length > 0)
            ? data.recentApplications.map(app => `
                <tr>
                    <td>${app.applicationDate}</td>
                    <td>${app.jobTitle}</td>
                    <td>${app.companyName}</td>
                    <td>${app.status}</td>
                </tr>`).join('')
            : '<tr><td colspan="4" style="text-align:center; padding: 2rem;">No recent applications found.</td></tr>';

        const tableHTML = `
            <h4 class="sub-header">Recent Applications</h4>
            <div class="table-wrapper">
                <table class="applications-table">
                    <thead><tr><th>Date</th><th>Job Title</th><th>Company</th><th>Status</th></tr></thead>
                    <tbody>${recentAppsHTML}</tbody>
                </table>
            </div>`;

        modalBody.innerHTML = statsHTML + tableHTML;

    } catch (error) {
        console.error(error);
        modalBody.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function closeAgentDrillDownModal() {
    const drilldownModal = document.getElementById('agent-report-modal');
    if (drilldownModal) {
        drilldownModal.classList.remove('visible');
    }
}

// Add these at the top of your file with the other chart variables
let applicationsChartInstance = null;
let successRateChartInstance = null;

// REPLACE your old loadAgentAnalytics function with this
async function loadEmployeeDashboard() {
    const analyticsPanel = document.getElementById('employee-panel');
    analyticsPanel.classList.add('loading'); // Optional: for a loading state

    try {
        const response = await fetchWithAuth('/api/admin/analytics/employee-dashboard');
        if (!response.ok) throw new Error('Failed to load analytics dashboard.');
        
        const data = await response.json();

        // Populate Stat Cards
        document.getElementById('stats-payout').textContent = `$${data.totalPayout.toFixed(2)}`;
        document.getElementById('stats-active-employees').textContent = `${data.activeEmployees} active employees`;
        document.getElementById('stats-this-week').textContent = data.thisWeekSubmissions;
        document.getElementById('stats-today').textContent = data.todaySubmissions;
        document.getElementById('stats-daily-avg').textContent = data.dailyAverage.toFixed(1);

        // Render Charts
        renderApplicationsChart(data.performanceList);
        renderSuccessRateChart(data.performanceList);

    } catch (error) {
        console.error("Error loading employee dashboard:", error);
    } finally {
        analyticsPanel.classList.remove('loading');
    }
}

// REPLACE your old render...Chart functions with these
function renderApplicationsChart(performanceData) {
    const ctx = document.getElementById('applications-chart')?.getContext('2d');
    if (!ctx) return;
    if (applicationsChartInstance) applicationsChartInstance.destroy();

    applicationsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: performanceData.map(p => p.agentName),
            datasets: [{
                label: 'Applications Submitted',
                data: performanceData.map(p => p.totalSubmissions),
                backgroundColor: 'rgba(0, 246, 255, 0.6)',
                borderColor: 'rgba(0, 246, 255, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
             scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { grid: { color: 'rgba(255,255,255,0.1)' } } },
             plugins: { legend: { display: false } }
        }
    });
}


function renderSuccessRateChart(performanceData) {
    const ctx = document.getElementById('success-rate-chart')?.getContext('2d');
    if (!ctx) return;
    if (successRateChartInstance) successRateChartInstance.destroy();

    successRateChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: performanceData.map(p => p.agentName),
            datasets: [{
                label: 'Success Rate (%)',
                data: performanceData.map(p => p.successRate),
                backgroundColor: 'rgba(37, 211, 102, 0.6)',
                borderColor: 'rgba(37, 211, 102, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { grid: { color: 'rgba(255,255,255,0.1)' } } },
            plugins: { legend: { display: false } }
        }
    });
}

// In your initAdminDashboard function, UPDATE the tab switching logic
// to call the new loadEmployeeDashboard function

//======================================================================
// FILTERS & EVENT LISTENERS
//======================================================================
function populateFilterDropdowns(users) {
    const agentFilter = document.getElementById('agent-filter');
    const clientFilter = document.getElementById('client-filter');

    if (!agentFilter || !clientFilter) return;

    // Clear any existing options except the first "All" option
    agentFilter.innerHTML = '<option value="">All Agents</option>';
    clientFilter.innerHTML = '<option value="">All Clients</option>';

    // Loop through all users and add them to the correct dropdown
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.firstName} ${user.lastName}`;

        if (user.roles.includes('ROLE_AGENT')) {
            agentFilter.appendChild(option.cloneNode(true));
        }
        if (user.roles.includes('ROLE_CLIENT')) {
            clientFilter.appendChild(option.cloneNode(true));
        }
    });
}
function setupFilters() {
    // --- Application Filters ---
    const appPanel = document.getElementById('applications-panel');
    if (appPanel) {
        const appSearch = appPanel.querySelector('input[type="search"]');
        const statusFilter = appPanel.querySelector('#status-filter');
        const agentFilter = appPanel.querySelector('#agent-filter');
        const clientFilter = appPanel.querySelector('#client-filter');

        const filterApplications = () => {
            const searchTerm = appSearch.value.toLowerCase();
            const status = statusFilter.value;
            const agentId = agentFilter.value;
            const clientId = clientFilter.value;

            const filteredApps = allApplications.filter(app => {
                const matchesSearch = searchTerm === '' || 
                    (app.jobTitle && app.jobTitle.toLowerCase().includes(searchTerm)) ||
                    (app.company && app.company.toLowerCase().includes(searchTerm)) ||
                    (app.clientName && app.clientName.toLowerCase().includes(searchTerm));
                
                const matchesStatus = status === '' || app.status === status;
                const matchesAgent = agentId === '' || app.agentId == agentId;
                const matchesClient = clientId === '' || app.clientId == clientId;

                return matchesSearch && matchesStatus && matchesAgent && matchesClient;
            });
            renderApplicationsTable(filteredApps);
        };
        
        appSearch.addEventListener('input', filterApplications);
        statusFilter.addEventListener('change', filterApplications);
        agentFilter.addEventListener('change', filterApplications);
        clientFilter.addEventListener('change', filterApplications);
    }

    // --- User Filters ---
    const userPanel = document.getElementById('usermgmt-panel');
    if (userPanel) {
        const userSearch = userPanel.querySelector('#user-search');
        const roleFilter = userPanel.querySelector('#role-filter');

        const filterUsers = () => {
            const searchTerm = userSearch.value.toLowerCase();
            // 1. Get the selected role from the dropdown
            const selectedRole = roleFilter.value;

            // 2. Filter the master user list
            const filteredUsers = allUsers.filter(user => {
                const matchesSearch = searchTerm === '' ||
                    (user.firstName.toLowerCase().includes(searchTerm)) ||
                    (user.lastName.toLowerCase().includes(searchTerm)) ||
                    (user.email.toLowerCase().includes(searchTerm));
                
                // 3. Check if the user's roles array includes the selected role
                const matchesRole = selectedRole === '' || user.roles.includes(selectedRole);

                return matchesSearch && matchesRole;
            });
            
            // 4. Redraw the user table with the filtered results
            renderUsersTable(filteredUsers);
        };

        userSearch.addEventListener('input', filterUsers);
        roleFilter.addEventListener('change', filterUsers);
    }
}


//======================================================================
// INITIALIZATION
//======================================================================
function initAdminDashboard() {
    // 1. Initial Data Loading
    loadDashboardStats();
    loadAllApplications();
    loadAllUsers();
    
    // 2. Flag for Lazy Loading Analytics
    let analyticsLoaded = false;

    // 3. Tab Switching & Lazy Loading Logic
    const tabs = document.querySelectorAll('.tab-link');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // This is the click handler where the 'tab' variable exists.

            // Switch active tab visuals
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.dataset.tab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Lazy-load analytics data when that tab is clicked for the first time.
            // This logic MUST be inside the click handler.
            if (tab.dataset.tab === 'employee-panel' && !analyticsLoaded) {
                loadAgentAnalytics();
                analyticsLoaded = true;
            }
			
			if (tab.dataset.tab === 'employee-panel' && !analyticsLoaded) {
			            loadEmployeeAnalytics(); // Call the new, correct function
			            analyticsLoaded = true;
			        }
        });
    });

    // 4. Setup Filters and Action Listeners
    setupFilters();
    setupActionListeners();

    // 5. Event Listeners for Modals
    // (Assuming all your modal elements exist in the HTML)
    const editForm = document.getElementById('edit-application-form');
    const userForm = document.getElementById('user-form');
    
    document.getElementById('close-modal-btn')?.addEventListener('click', closeEditModal);
    document.getElementById('cancel-edit-btn')?.addEventListener('click', closeEditModal);
    if(editForm) editForm.addEventListener('submit', handleEditFormSubmit);

    document.getElementById('close-view-modal-btn')?.addEventListener('click', closeViewModal);
    
    document.getElementById('close-user-modal-btn')?.addEventListener('click', closeUserModal);
    document.getElementById('cancel-user-btn')?.addEventListener('click', closeUserModal);
    if(userForm) userForm.addEventListener('submit', handleUserFormSubmit);

    document.getElementById('close-agent-report-btn')?.addEventListener('click', closeAgentReportModal);
    
    const periodFilter = document.getElementById('analytics-period-filter');
    if (periodFilter) {
        periodFilter.addEventListener('change', () => {
            const selectedPeriod = periodFilter.value;
            loadAgentAnalytics(selectedPeriod);
        });
    }
	
}
// --- Run the App ---
initAdminDashboard();