// js/client-dashboard-logic.js

// Store all applications in a global scope to enable filtering without re-fetching
let allApplications = [];

// Base URL for the API
const API_BASE_URL = '';

// --- INITIALIZATION ---
function initClientDashboard() {
    console.log("🚀 Initializing Client Dashboard...");
    const token = localStorage.getItem('accessToken');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const headers = { 'Authorization': 'Bearer ' + token };

    // Fetch all necessary data when the page loads
    fetch(`${API_BASE_URL}/api/applications/my-applications`, { headers })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch application data.');
            return response.status === 204 ? [] : response.json(); // Handle empty response
        })
        .then(applications => {
            allApplications = applications; // Store the master list
            updateStats(allApplications);
            renderApplicationsTable(allApplications);
            setupEventListeners(); // Set up search and modal listeners
            console.log("✅ Client dashboard data loaded.");
        })
        .catch(error => {
            console.error('Error loading dashboard data:', error);
            const tableBody = document.getElementById('applications-table-body');
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 4rem; color: #ff6b6b;">${error.message}</td></tr>`;
        });
    
    // You can add the fetch for user details here if needed for the plan badge
    fetch(`${API_BASE_URL}/api/users/me`, { headers })
        .then(res => res.ok ? res.json() : null)
        .then(user => updatePlanDisplay(user));
}

// --- UI UPDATE FUNCTIONS ---

function updatePlanDisplay(user) {
    const planBadge = document.querySelector('#current-plan-display .plan-badge');
    if (user && user.subscriptionPlan && planBadge) {
        planBadge.textContent = user.subscriptionPlan;
    } else if (planBadge) {
        planBadge.textContent = 'Free Tier'; // Default text
    }
}

function updateStats(applications) {
    document.getElementById('stats-total').textContent = applications.length;
    // Corrected logic for pending status
    document.getElementById('stats-pending').textContent = applications.filter(app => app.status === 'Applied').length;
    document.getElementById('stats-interviews').textContent = applications.filter(app => app.status === 'Interviewing').length;
    document.getElementById('stats-offers').textContent = applications.filter(app => app.status === 'Offer').length;
}

function renderApplicationsTable(applications) {
    const tableBody = document.getElementById('applications-table-body');
    tableBody.innerHTML = '';

    if (applications.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 4rem;">No applications match your search.</td></tr>';
        return;
    }

    applications.forEach(app => {
        const row = document.createElement('tr');
        const formattedDate = new Date(app.applicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        // Handle potentially null agent data gracefully
        const agentName = app.agentUser ? `${app.agentUser.firstName} ${app.agentUser.lastName || ''}`.trim() : 'N/A';

        // Updated row structure to match new HTML
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${app.companyName || 'N/A'}</td>
            <td>${app.jobTitle || 'N/A'}</td>
            <td>${app.jobPortal || 'N/A'}</td>
            <td>${agentName}</td>
            <td><span class="status-badge status-${(app.status || 'unknown').toLowerCase()}">${app.status || 'Unknown'}</span></td>
            <td class="action-icons">
                <a href="#" class="view-details-btn" data-id="${app.id}" title="View Details">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </a>
                ${app.jobLink ? `<a href="${app.jobLink}" target="_blank" rel="noopener noreferrer" title="View Job Posting">
                    <svg xmlns="http://www.w.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
                </a>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// --- EVENT LISTENERS & MODAL LOGIC ---

// In client-dashboard-logic.js

function setupEventListeners() {
    console.log("✅ setupEventListeners function is running."); // LOG 1

    const searchInput = document.getElementById('search-input');
    const tableBody = document.getElementById('applications-table-body');
    const modal = document.getElementById('details-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // 1. Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredApps = allApplications.filter(app => 
            app.companyName.toLowerCase().includes(searchTerm) ||
            app.jobTitle.toLowerCase().includes(searchTerm)
        );
        renderApplicationsTable(filteredApps);
    });

    // 2. Modal open functionality (with debugging logs)
    tableBody.addEventListener('click', (e) => {
        console.log("🖱️ Click detected on the table body."); // LOG 2

        const viewBtn = e.target.closest('.view-details-btn');
        console.log("🔍 Searching for '.view-details-btn'. Found:", viewBtn); // LOG 3

        if (viewBtn) {
            e.preventDefault();
            const appId = viewBtn.dataset.id;
            const appData = allApplications.find(app => app.id == appId);
            
            console.log(`🧠 Looking for application with ID '${appId}'. Found data:`, appData); // LOG 4
            
            if (appData) {
                openDetailsModal(appData);
            }
        }
    });

    // 3. Modal close functionality
    closeModalBtn.addEventListener('click', () => modal.classList.remove('visible'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });
}

// In client-dashboard-logic.js

// In client-dashboard-logic.js

// In client-dashboard-logic.js

function openDetailsModal(app) {
    const modal = document.getElementById('details-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');

    // Hide the generic header title, as we have a more detailed one inside the body
    modalTitle.style.display = 'none';
    
    // Safely get agent name
    const agentName = app.agentUser ? `${app.agentUser.firstName} ${app.agentUser.lastName || ''}`.trim() : 'N/A';

    // Generate the links list dynamically (with the "..." typo fixed)
    let linksHtml = '';
    if (app.resumeLink) linksHtml += `<li><a href="${app.resumeLink}" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>Resume Used</a></li>`;
    if (app.jobPageUrl) linksHtml += `<li><a href="${app.jobPageUrl}" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>Company Careers Page</a></li>`;
    if (app.additionalLink) linksHtml += `<li><a href="${app.additionalLink}" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>Additional Link</a></li>`;

    // Populate the modal with the full, polished structure
    modalBody.innerHTML = `
        <div class="modal-header-details">
            <div class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
            <div>
                <h2 id="modal-job-title">${app.jobTitle || 'N/A'}</h2>
                <p id="modal-company-name">${app.companyName || 'N/A'}</p>
            </div>
        </div>
        
        <hr class="modal-divider">

        <div class="modal-details-grid">
            <div class="detail-item">
                <div class="detail-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
                <div>
                    <div class="label">Date Applied</div>
                    <div class="value">${new Date(app.applicationDate).toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
                <div>
                    <div class="label">Applied By</div>
                    <div class="value">${agentName}</div>
                </div>
            </div>
             <div class="detail-item">
                <div class="detail-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg></div>
                <div>
                    <div class="label">Status</div>
                    <div class="value"><span class="status-badge status-${(app.status || 'unknown').toLowerCase()}">${app.status || 'Unknown'}</span></div>
                </div>
            </div>
        </div>

        ${linksHtml ? `<hr class="modal-divider"><div class="detail-group"><div class="label">Links</div><ul class="links-list">${linksHtml}</ul></div>` : ''}

        <hr class="modal-divider">

        <div class="detail-group">
            <div class="label">My Remark for the Agent</div>
            <textarea id="client-remark-textarea" class="form-control" rows="4" placeholder="e.g., Please prioritize this application, the role is a perfect fit.">${app.clientRemark || ''}</textarea>
            <button id="save-remark-btn" class="btn btn-primary" style="margin-top: 1rem;">Save Remark</button>
            <div id="remark-status" style="margin-top: 0.5rem; font-size: 0.9rem;"></div>
        </div>
    `;

    document.getElementById('save-remark-btn').addEventListener('click', () => {
        const remarkText = document.getElementById('client-remark-textarea').value;
        const statusDiv = document.getElementById('remark-status');
        const token = localStorage.getItem('accessToken');

        statusDiv.textContent = 'Saving...';
        statusDiv.style.color = '#ffc107';

        fetch(`${API_BASE_URL}/api/applications/${app.id}/remark`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ remark: remarkText })
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to save.');
            statusDiv.textContent = '✅ Remark saved successfully!';
            statusDiv.style.color = '#25D366';
            app.clientRemark = remarkText; 
        })
        .catch(error => {
            statusDiv.textContent = '❌ Error saving remark.';
            statusDiv.style.color = '#ef4444';
        });
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background-color: var(--dark-bg);
            color: var(--text-primary);
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }
    `;
    document.head.appendChild(style);

	// AFTER
	modal.classList.add('visible');
}
// Run the initialization function
initClientDashboard();