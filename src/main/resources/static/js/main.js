document.addEventListener("DOMContentLoaded", function() {
    const loadHTML = (filePath, elementId) => {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) element.innerHTML = data;
            })
            .then(() => {
                if (elementId === 'navbar-placeholder') {
                    setupNavbar();
                }
            });
    };

    const setupNavbar = () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }
        checkLoginStatus();
    };

	// Replace the existing checkLoginStatus function in js/main.js

	// Replace the existing checkLoginStatus function in js/main.js
	const checkLoginStatus = () => {
	    const token = localStorage.getItem('accessToken');
	    const firstName = localStorage.getItem('userFirstName');

	    const loggedOutView = document.getElementById('logged-out-view-desktop');
	    const loggedInView = document.getElementById('logged-in-view-desktop');
	    // We will add mobile logic back later if needed

	    if (token && firstName) {
	        // --- LOGGED IN STATE ---
	        if (loggedOutView) loggedOutView.style.display = 'none';
	        if (loggedInView) loggedInView.style.display = 'flex';

	        document.getElementById('profile-firstname-desktop').textContent = firstName;
	        
	        // Dropdown Logic with CORRECT IDs
	        const trigger = document.getElementById('dropdown-trigger-desktop'); // Corrected ID
	        const menu = document.getElementById('dropdown-menu-desktop');       // Corrected ID
	        const logoutBtn = document.getElementById('logout-btn-desktop');

	        if (trigger && menu && logoutBtn) {
	            trigger.addEventListener('click', (e) => {
	                e.stopPropagation();
	                menu.classList.toggle('active');
	            });
	            
	            window.addEventListener('click', () => {
	                if (menu.classList.contains('active')) {
	                    menu.classList.remove('active');
	                }
	            });

	            logoutBtn.addEventListener('click', () => {
	                localStorage.removeItem('accessToken');
	                localStorage.removeItem('userFirstName');
	                window.location.href = '/login.html';
	            });
	        }

	    } else {
	        // --- LOGGED OUT STATE ---
	        if (loggedOutView) loggedOutView.style.display = 'flex';
	        if (loggedInView) loggedInView.style.display = 'none';
	    }
	};

    loadHTML('/partials/navbar.html', 'navbar-placeholder');
    loadHTML('/partials/footer.html', 'footer-placeholder');
});