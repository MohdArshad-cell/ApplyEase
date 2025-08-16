document.addEventListener("DOMContentLoaded", function() {
    // Function to load HTML content into an element
    const loadHTML = (filePath, elementId) => {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .then(() => {
                // This code runs AFTER the specific HTML has been loaded
                if (elementId === 'navbar-placeholder') {
                    setupNavbar(); // New function to set up navbar logic
                }
            });
    };

    // Load navbar and footer
    loadHTML('/partials/navbar.html', 'navbar-placeholder');
    loadHTML('/partials/footer.html', 'footer-placeholder');

    // Groups all navbar-related logic
    const setupNavbar = () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        // Toggle mobile menu on button click
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        checkLoginStatus(); // Check login status after navbar is set up
    };

    // Function to check login status and update buttons
    const checkLoginStatus = () => {
        const token = localStorage.getItem('accessToken');
        
        // Desktop buttons
        const loginBtnDesktop = document.getElementById('login-btn-desktop');
        const logoutBtnDesktop = document.getElementById('logout-btn-desktop');
        
        // Mobile buttons
        const loginBtnMobile = document.getElementById('login-btn-mobile');
        const logoutBtnMobile = document.getElementById('logout-btn-mobile');

        const handleLogout = () => {
            localStorage.removeItem('accessToken');
            window.location.href = '/login.html';
        };

        if (token) {
            loginBtnDesktop.style.display = 'none';
            logoutBtnDesktop.style.display = 'block';
            loginBtnMobile.style.display = 'none';
            logoutBtnMobile.style.display = 'block';

            logoutBtnDesktop.addEventListener('click', handleLogout);
            logoutBtnMobile.addEventListener('click', handleLogout);
        } else {
            loginBtnDesktop.style.display = 'block';
            logoutBtnDesktop.style.display = 'none';
            loginBtnMobile.style.display = 'block';
            logoutBtnMobile.style.display = 'none';
        }
    };
});