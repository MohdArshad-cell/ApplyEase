// js/agent-dashboard-logic.js (Fully Corrected with Absolute URLs)
console.log("✅ agent-dashboard-logic.js loaded");
let allApplications = [];
// --- NEW: Define a single base URL for all API calls ---
// AFTER (Correct for production)
const API_BASE_URL = '';

// Single token check and redirect
const token = localStorage.getItem('accessToken');
if (!token) {
    window.location.href = '/login.html';
}
// At the top of your script, with other const declarations
const clientFilter = document.getElementById('client-filter');
const ownershipFilter = document.getElementById('ownership-filter');
const statusFilter = document.getElementById('status-filter');
const searchInput = document.querySelector('.table-filters input[type="search"]');

// This object will hold the current state of our filters
let currentFilters = {
    clientId: '',
    ownership: 'mine', // 'mine' or 'all'
    status: '',
    search: ''
};
// DOM Elements (assuming they are found after the partial is loaded)
// These will be re-initialized inside initAgentDashboard

// --- UTILITY FUNCTIONS ---
/**
 * A centralized function to handle API errors. 
 * It specifically checks for authorization errors to log the user out.
 */
function handleApiError(response, defaultMessage = 'An error occurred') {
    if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        alert('Your session has expired or you are unauthorized. Please log in again.');
        window.location.href = '/login.html';
        return; // Stop further execution
    }
    // For other errors, throw a new error to be caught by the calling function's catch block.
    throw new Error(`${defaultMessage} (Status: ${response.status})`);
}

/**
 * Displays a loading message inside a table.
 */
function showLoading(element, message = 'Loading...') {
    element.innerHTML = `<tr><td colspan="10" class="table-state-cell">${message}</td></tr>`;
}

/**
 * Displays an empty state message (e.g., "No data found") inside a table.
 */
function showEmptyState(element, message) {
    element.innerHTML = `<tr><td colspan="10" class="table-state-cell">${message}</td></tr>`;
}

/**
 * Displays an error message inside a table.
 */
function showError(element, message) {
    element.innerHTML = `<tr><td colspan="10" class="table-state-cell" style="color: #ff6b6b;">${message}</td></tr>`;
}
// --- CORE FUNCTIONS ---
async function fetchAndRenderApplications() {
    // Build the URL with query parameters from our filter object
    const params = new URLSearchParams({
        clientId: currentFilters.clientId,
        ownership: currentFilters.ownership,
        status: currentFilters.status,
        search: currentFilters.search
    }).toString();

    const url = `/api/applications?${params}`;

	try {
	    const response = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
	    if (!response.ok) throw new Error('Failed to fetch applications');
	    
	    const applications = await response.json();
	    allApplications = applications; // Store the data in our new variable
	    renderAgentApplicationsTable(applications); 
	}catch (error) {
        console.error('Error fetching applications:', error);
        tableBody.innerHTML = `<tr><td colspan="12" style="text-align: center; padding: 2rem;">Error loading applications.</td></tr>`;
    }
}
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/applications/agent-stats`, { // Corrected URL
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const stats = await response.json();
        document.getElementById('stats-total-applications').textContent = String(stats.totalApplications).padStart(2, '0');
        document.getElementById('stats-apps-this-week').textContent = `+${stats.applicationsThisWeek} this week`;
        document.getElementById('stats-in-progress').textContent = String(stats.inProgressCount).padStart(2, '0');
        document.getElementById('stats-success-rate').textContent = `${stats.successRate.toFixed(0)}%`;
        document.getElementById('stats-earnings').textContent = `$${stats.totalEarnings.toFixed(2)}`;
    } catch (error) {
        console.error("❌ Error loading dashboard stats:", error);
    }
}

async function loadClients() {
    const clientSelect = document.getElementById('client-select');
    try {
        // --- CHANGE THIS URL ---
        const response = await fetch(`${API_BASE_URL}/api/users/clients`, { 
            headers: { 'Authorization': 'Bearer ' + token }
        });
        // -------------------------

        if (!response.ok) handleApiError(response, 'Failed to fetch clients');
        
        const clients = await response.json(); // Renamed variable for clarity
        
        clientSelect.innerHTML = '<option value="">Select a client</option>';
        
        if (clients && clients.length > 0) {
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = `${client.firstName} ${client.lastName}`;
                clientSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.disabled = true;
            option.textContent = 'No clients available';
            clientSelect.appendChild(option);
        }
    } catch (err) {
        console.error("❌ Error fetching clients:", err);
        clientSelect.innerHTML = '<option value="">Error loading clients</option>';
    }
}

async function loadApplications(clientId) {
    const tableBody = document.getElementById('applications-table-body');
    if (!clientId) {
        showEmptyState(tableBody, 'Select a client to view applications.');
        return;
    }
    showLoading(tableBody, 'Loading applications...');
    try {
        // --- THIS IS THE CORRECTED LINE ---
        const response = await fetch(`${API_BASE_URL}/api/applications?clientId=${clientId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!response.ok) {
            handleApiError(response, 'Failed to fetch applications');
            return; // Stop execution if there's an error
        }
        
        const applications = await response.json();
        renderAgentApplicationsTable(applications);

    } catch (error) {
        console.error('Error fetching applications:', error);
        showError(tableBody, 'Error loading applications: ' + error.message);
    }
}

// Add this new function to agent-dashboard-logic.js
function toggleActionsMenu(button) {
    // First, remove any existing menus
    const existingMenu = document.querySelector('.actions-menu');
    if (existingMenu) {
        existingMenu.remove();
        // If we clicked the same button, just close the menu and stop
        if (existingMenu.dataset.id === button.dataset.id) return;
    }

    const appId = button.dataset.id;
    const app = allApplications.find(a => a.id == appId);
    if (!app) return;

    // Create the menu element
    const menu = document.createElement('div');
    menu.className = 'actions-menu';
    menu.dataset.id = appId; // Keep track of which menu this is

    // Build menu items
    let menuItems = `
        <button class="edit-btn" data-id="${app.id}">Edit</button>
        <button class="delete-btn" data-id="${app.id}">Delete</button>
        <div class="menu-divider"></div>
    `;
    if (app.jobLink) menuItems += `<a href="${app.jobLink}" target="_blank" rel="noopener noreferrer">Job Link</a>`;
    if (app.jobPageUrl) menuItems += `<a href="${app.jobPageUrl}" target="_blank" rel="noopener noreferrer">Job Page</a>`;
    if (app.resumeLink) menuItems += `<a href="${app.resumeLink}" target="_blank" rel="noopener noreferrer">Resume</a>`;
    if (app.additionalLink) menuItems += `<a href="${app.additionalLink}" target="_blank" rel="noopener noreferrer">Additional Link</a>`;
    
    menu.innerHTML = menuItems;
    document.body.appendChild(menu);

    // Position the menu next to the button
    const rect = button.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.right = `${window.innerWidth - rect.right}px`;
}


function renderAgentApplicationsTable(applications) {
    const tableBody = document.getElementById('applications-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    if (!applications || applications.length === 0) {
        showEmptyState(tableBody, 'No applications found.');
        return;
    }

    applications.forEach(app => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', app.id);
        
        const formattedDate = app.applicationDate 
            ? new Date(app.applicationDate).toLocaleDateString('en-CA') // Format as YYYY-MM-DD
            : 'N/A';

        const clientName = app.clientUser 
            ? `${app.clientUser.firstName || ''} ${app.clientUser.lastName || ''}`.trim()
            : 'N/A';

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${app.agentUser.firstName} ${app.agentUser.lastName || ''}</td>
            <td>${clientName}</td>
            <td>${app.jobTitle || 'N/A'}</td>
            <td>${app.companyName || 'N/A'}</td>
            <td>${app.location || 'N/A'}</td>
            <td>${app.jobPortal || 'N/A'}</td>
            <td>
                <select class="status-dropdown status-${(app.status || 'unknown').toLowerCase()}" data-id="${app.id}">
                    <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
                    <option value="Interviewing" ${app.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                    <option value="Offer" ${app.status === 'Offer' ? 'selected' : ''}>Offer</option>
                    <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
            <td>${app.mailSent ? 'Yes' : 'No'}</td>
            <td class="action-icons">
                ${app.clientRemark ? `<button class="view-remark-btn" data-remark="${app.clientRemark}" title="View Remark"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></button>` : ''}
            </td>
            <td class="action-icons td-actions">
                <button class="actions-menu-btn" data-id="${app.id}" title="More Actions">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}
// --- EVENT HANDLERS ---
// Add this new function to agent-dashboard-logic.js
async function handleStatusChange(event) {
    const dropdown = event.target;
    // Ensure the event was triggered by our status dropdown
    if (!dropdown.classList.contains('status-dropdown')) {
        return;
    }

    const applicationId = dropdown.dataset.id;
    const newStatus = dropdown.value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Failed to update status.');
        }

        console.log(`✅ Status for application ${applicationId} updated to ${newStatus}`);
        // Optionally, add a visual confirmation (e.g., a temporary highlight)
        dropdown.parentElement.style.transition = 'background-color 0.2s';
        dropdown.parentElement.style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
        setTimeout(() => {
            dropdown.parentElement.style.backgroundColor = '';
        }, 1000);

    } catch (error) {
        console.error('Error updating status:', error);
        alert('❌ Could not update status. Please try again.');
        // Revert the dropdown to its original value on failure
        fetchAndRenderApplications(); // A simple way to revert is to just reload the table
    }
}


async function handleTableClick(event) {
    const button = event.target.closest('button');
    if (!button) return;

    // --- Handle the actions menu button ---
    if (button.classList.contains('actions-menu-btn')) {
        toggleActionsMenu(button);
        return;
    }

    // --- Handle the remark button ---
    if (button.classList.contains('view-remark-btn')) {
        const remarkText = button.dataset.remark;
        openRemarkModal(remarkText);
        return; 
    }

    // --- Actions below this point require a data-id ---
    const appId = button.dataset.id;
    if (!appId) return; 

    // Handle Delete Button
    if (button.classList.contains('delete-btn')) {
        if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/applications/${appId}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (!response.ok) {
                handleApiError(response, 'Failed to delete application');
            }
            button.closest('tr').remove();
            alert('✅ Application deleted successfully!');
        } catch (err) {
            alert('❌ Error deleting application: ' + err.message);
        }
        return; 
    }

    // Handle Edit Button
    if (button.classList.contains('edit-btn')) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/applications/${appId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (!response.ok) {
                handleApiError(response, 'Failed to fetch application details');
            }

            const app = await response.json();
            
            const remarkContainer = document.getElementById('client-remark-container');
			const remarkDisplay = document.getElementById('client-remark-display');
			if (app.clientRemark) {
			    remarkDisplay.textContent = app.clientRemark;
			    remarkContainer.style.display = 'block';
			} else {
			    remarkContainer.style.display = 'none';
			}
            
            document.getElementById('edit-application-id').value = app.id || '';
            document.getElementById('edit-application-date').value = app.applicationDate 
                ? new Date(app.applicationDate).toISOString().split('T')[0] 
                : '';
            document.getElementById('edit-job-title').value = app.jobTitle || '';
            document.getElementById('edit-company-name').value = app.companyName || '';
            document.getElementById('edit-location').value = app.location || '';
            document.getElementById('edit-job-portal').value = app.jobPortal || '';
            document.getElementById('edit-job-link').value = app.jobLink || '';
			document.getElementById('edit-job-page').value = app.jobPageUrl || '';
            document.getElementById('edit-resume-link').value = app.resumeLink || '';
            document.getElementById('edit-additional-link').value = app.additionalLink || '';
            document.getElementById('edit-notes').value = app.notes || '';
            document.getElementById('edit-mail-sent').checked = Boolean(app.mailSent);
            
            const editModal = document.getElementById('edit-modal');
			if (editModal) {
			    editModal.classList.add('visible');
			}
            
        } catch (err) {
            alert('❌ Error loading application details: ' + err.message);
        }
    }
}
// In agent-dashboard-logic.js

async function handleAddFormSubmit(e) {
    e.preventDefault();
    
    const selectedClientId = document.getElementById('client-select').value;
    if (!selectedClientId) {
        alert('Please select a client from the dropdown.');
        return;
    }

    // --- THIS BLOCK NOW GATHERS ALL FIELDS ---
    const data = {
        clientId: selectedClientId,
        applicationDate: document.getElementById('application-date').value,
        jobTitle: document.getElementById('job-title').value.trim(),
        companyName: document.getElementById('company-name').value.trim(),
        location: document.getElementById('location').value.trim(),
        jobPortal: document.getElementById('job-portal').value.trim(),
        jobLink: document.getElementById('job-link').value.trim(),
		jobPageUrl: document.getElementById('job-page').value.trim(),
        resumeLink: document.getElementById('resume-link').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        additionalLink: document.getElementById('additional-link').value.trim(),
        mailSent: document.getElementById('mail-sent').checked
    };

    // Basic validation
    if (!data.jobTitle || !data.companyName || !data.applicationDate) {
        alert('Please fill out all required fields: Client, Date, Job Title, and Company.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/applications`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + token 
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to add application. Check server logs for details.');
        }

        alert('✅ Application added successfully!');
        document.getElementById('add-application-form').reset();
        loadApplications(selectedClientId);
        
    } catch (err) {
        console.error('Add application error:', err);
        alert('❌ Error adding application: ' + err.message);
    }
}

// In agent-dashboard-logic.js

/**
 * Handles the submission of the "Edit Application" popup form.
 */
async function handleEditFormSubmit(e) {
    e.preventDefault();
    
    // Get the ID of the application being edited from the hidden form field
    const appId = document.getElementById('edit-application-id').value;
    if (!appId) {
        alert('Invalid application ID.');
        return;
    }

    // Collect all the updated data from the edit form fields
    const updatedData = {
        applicationDate: document.getElementById('edit-application-date').value,
        jobTitle: document.getElementById('edit-job-title').value.trim(),
        companyName: document.getElementById('edit-company-name').value.trim(),
        location: document.getElementById('edit-location').value.trim(),
        jobPortal: document.getElementById('edit-job-portal').value.trim(),
		jobPageUrl: document.getElementById('edit-job-page').value.trim(),
        jobLink: document.getElementById('edit-job-link').value.trim(),
        resumeLink: document.getElementById('edit-resume-link').value.trim(),
        additionalLink: document.getElementById('edit-additional-link').value.trim(),
        notes: document.getElementById('edit-notes').value.trim(),
        mailSent: document.getElementById('edit-mail-sent').checked,
        // You can also add a field for status if you have a dropdown for it in your modal
        // status: document.getElementById('edit-status').value 
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/applications/${appId}`, {
            method: 'PUT', // Use PUT for updates
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + token 
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update application: ${errorText}`);
        }

        alert('✅ Application updated successfully!');
        closeModal(); // Close the popup
        
        // Reload applications for the currently selected client to show the changes
        const selectedClientId = document.getElementById('client-select').value;
        if (selectedClientId) {
            loadApplications(selectedClientId);
        }
        
    } catch (err) {
        console.error('Update application error:', err);
        alert('❌ Error updating application: ' + err.message);
    }
}


function closeModal() {
    console.log("Debugger triggered: closeModal() was called!"); // We're adding this log
    debugger; // This line will pause the code execution

    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.classList.remove('visible');
    }
}
async function loadClientsForFilter() {
    const clientFilterSelect = document.getElementById('client-filter');
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/clients`, { 
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!response.ok) handleApiError(response, 'Failed to fetch clients for filter');
        
        const clients = await response.json();
        
        clientFilterSelect.innerHTML = '<option value="">All Clients</option>'; // Default option
        
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.firstName} ${client.lastName}`;
            clientFilterSelect.appendChild(option);
        });
        
    } catch (err) {
        console.error("❌ Error fetching clients for filter:", err);
        clientFilterSelect.innerHTML = '<option value="">Error</option>';
    }
}
// In agent-dashboard-logic.js

function openRemarkModal(remark) {
    const remarkModal = document.getElementById('remark-modal');
    const remarkBody = document.getElementById('remark-modal-body');
    if (remarkModal && remarkBody) {
        remarkBody.textContent = remark;
        remarkModal.classList.add('visible');
    }
}

function closeRemarkModal() {
    const remarkModal = document.getElementById('remark-modal');
    if (remarkModal) {
        remarkModal.classList.remove('visible');
    }
}
// --- INITIALIZATION ---

// In agent-dashboard-logic.js

async function initAgentDashboard() {
    console.log("🚀 Initializing Agent Dashboard...");
    
    // --- Get DOM Elements (do this once at the top) ---
    const clientSelect = document.getElementById('client-select');
    const editModal = document.getElementById('edit-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const remarkModal = document.getElementById('remark-modal');
    const closeRemarkModalBtn = document.getElementById('close-remark-modal-btn');

    // --- Load Initial Data ---
    loadDashboardStats();
    await loadClients();
    await loadClientsForFilter();
    fetchAndRenderApplications();

    // --- Set up Filter Listeners ---
    clientFilter.addEventListener('change', (e) => {
        currentFilters.clientId = e.target.value;
        fetchAndRenderApplications();
    });
    ownershipFilter.addEventListener('change', (e) => {
        currentFilters.ownership = e.target.value;
        fetchAndRenderApplications();
    });
    statusFilter.addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        fetchAndRenderApplications();
    });
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        fetchAndRenderApplications();
    });

    // --- Set up Modal Close Button Listeners ---
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeModal);
    if (closeRemarkModalBtn) closeRemarkModalBtn.addEventListener('click', closeRemarkModal);

    // --- CONSOLIDATED LISTENERS for clicks and keys ---
    window.addEventListener('click', (e) => {
        // Close actions menu if clicking outside
        if (!e.target.closest('.actions-menu-btn')) {
            const existingMenu = document.querySelector('.actions-menu');
            if (existingMenu) existingMenu.remove();
        }
        // Close modals if clicking on the overlay
        if (e.target === editModal) closeModal();
        if (e.target === remarkModal) closeRemarkModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (editModal && editModal.classList.contains('visible')) closeModal();
            if (remarkModal && remarkModal.classList.contains('visible')) closeRemarkModal();
        }
    });

    // --- Set up Main Page Action Listeners ---
    document.getElementById('add-application-form').addEventListener('submit', handleAddFormSubmit);
    clientSelect.addEventListener('change', (e) => loadApplications(e.target.value));

    // --- Table Event Listeners ---
    const tableBody = document.getElementById('applications-table-body');
    // For button clicks (Edit, Delete, Remark, Actions Menu)
    document.addEventListener('click', handleTableClick);
    // For status dropdown changes
    tableBody.addEventListener('change', handleStatusChange);
    
    console.log("✅ Dashboard initialization complete");
}

// Call the initialization function
initAgentDashboard();