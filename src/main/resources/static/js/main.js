document.addEventListener("DOMContentLoaded", function() {
    /**
     * Loads HTML content from a file into a specified element.
     * @param {string} filePath - The path to the HTML partial file.
     * @param {string} elementId - The ID of the element to load the HTML into.
     */
    const loadHTML = (filePath, elementId) => {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                // Ensure the placeholder element exists before trying to set its content
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                }
            })
            .then(() => {
                // After the navbar is loaded, set up its interactive parts
                if (elementId === 'navbar-placeholder') {
                    setupNavbar();
                }
            });
    };

    /**
     * Sets up all the interactive logic for the navbar.
     */
    const setupNavbar = () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        // Make the hamburger button toggle the mobile menu's visibility
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('active'); // The 'active' class is controlled by our CSS
            });
        }

        // Check the user's login status to show the correct buttons
        checkLoginStatus();
    };

    /**
     * Checks for a token in localStorage and updates the UI accordingly.
     */
    const checkLoginStatus = () => {
        const token = localStorage.getItem('accessToken');
        
        // Get all login and logout buttons for both desktop and mobile views
        const loginBtnDesktop = document.getElementById('login-btn-desktop');
        const logoutBtnDesktop = document.getElementById('logout-btn-desktop');
        const loginBtnMobile = document.getElementById('login-btn-mobile');
        const logoutBtnMobile = document.getElementById('logout-btn-mobile');

        // The function to run when a logout button is clicked
        const handleLogout = () => {
            localStorage.removeItem('accessToken');
            window.location.href = '/login.html'; // Redirect to login
        };
        
        // Ensure all button elements exist before trying to modify them
        if (loginBtnDesktop && logoutBtnDesktop && loginBtnMobile && logoutBtnMobile) {
            if (token) {
                // If logged in, show logout buttons and hide login buttons
                loginBtnDesktop.style.display = 'none';
                logoutBtnDesktop.style.display = 'block';
                loginBtnMobile.style.display = 'none';
                logoutBtnMobile.style.display = 'block';

                // Attach the logout event listener
                logoutBtnDesktop.addEventListener('click', handleLogout);
                logoutBtnMobile.addEventListener('click', handleLogout);
            } else {
                // If not logged in, show login buttons and hide logout buttons
                loginBtnDesktop.style.display = 'block';
                logoutBtnDesktop.style.display = 'none';
                loginBtnMobile.style.display = 'block';
                logoutBtnMobile.style.display = 'none';
            }
        }
    };

    // --- SCRIPT EXECUTION STARTS HERE ---
    loadHTML('/partials/navbar.html', 'navbar-placeholder');
    loadHTML('/partials/footer.html', 'footer-placeholder');
});