//======================================================================
// INITIALIZATION & CONFIG
//======================================================================
const API_BASE_URL = 'http://localhost:8080';
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
    // MODIFIED: Listener is now attached to the whole document for reliability
    document.addEventListener('click', (event) => {
        const button = event.target.closest('.action-btn, .add-new-user-btn');
        if (!button) return; // Exit if the click wasn't on a relevant button

        const action = button.title;
        const parentTd = button.closest('.td-actions'); // Find the parent table cell
        
        // --- Handle Add New User Button ---
        if (button.matches('.add-new-user-btn')) {
            openUserModal();
            return; // Action handled, exit
        }

        // The rest of the logic requires an ID from the table row
        if (!parentTd) return;
        const id = parentTd.dataset.id;

        // --- Handle Application Actions ---
        if (button.closest('#applications-panel')) {
            if (action === 'Edit Application') openEditModal(id);
            else if (action === 'Delete Application') deleteApplication(id);
            else if (action === 'View Details') openViewModal(id);
        }

        // --- Handle User Actions ---
        if (button.closest('#usermgmt-panel')) {
            const isActive = parentTd.dataset.active === 'true';
            if (action === 'Edit User') openUserModal(id);
            else if (action === 'Toggle Status') toggleUserStatus(id, isActive);
        }
    });
}

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
    loadDashboardStats();
    loadAllApplications();
    loadAllUsers();
    
    const tabs = document.querySelectorAll('.tab-link');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.dataset.tab);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    setupFilters();
    setupActionListeners();

    // Event listeners for Edit Application Modal
    document.getElementById('close-modal-btn').addEventListener('click', closeEditModal);
    document.getElementById('cancel-edit-btn').addEventListener('click', closeEditModal);
    editForm.addEventListener('submit', handleEditFormSubmit);

    // Event listeners for View Application Modal
	document.getElementById('close-view-modal-btn').addEventListener('click', closeViewModal);

    // Event listeners for Add/Edit User Modal
	document.getElementById('close-user-modal-btn').addEventListener('click', closeUserModal);
	document.getElementById('cancel-user-btn').addEventListener('click', closeUserModal);
	userForm.addEventListener('submit', handleUserFormSubmit);
	   
    // Ensure the "Add New User" button has the correct class for the listener
	const addNewUserBtn = document.querySelector('#usermgmt-panel .btn-outline');
	if (addNewUserBtn) {
	    addNewUserBtn.classList.add('add-new-user-btn');
	}
}

// --- Run the App ---
initAdminDashboard();