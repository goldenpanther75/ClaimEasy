// auth_guard.js - Strict Global Authentication Enforcement

(function() {
    // Check if the user is currently on the login page or admin pages to prevent infinite loops
    // Also whitelist index.html so the main homepage is accessible without logging in
    const publicPages = ['login.html', 'admin_login.html', 'admin_dashboard.html', 'index.html', ''];
    const currentPage = window.location.pathname.split('/').pop();

    if (!publicPages.includes(currentPage)) {
        // Retrieve login status from localStorage
        const userStatus = localStorage.getItem('user');
        
        // If not logged in, block access and redirect
        if (!userStatus) {
            window.stop(); // Immediately stop the original page from loading

            // Inject a beautifully styled lock-screen into the document
            document.documentElement.innerHTML = `
            <head>
                <title>Secure Access - ClaimEasy</title>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap" rel="stylesheet">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #f4f7fa;
                        font-family: 'Outfit', -apple-system, sans-serif;
                    }
                    .auth-modal {
                        background: white;
                        padding: 40px;
                        border-radius: 16px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                        text-align: center;
                        max-width: 380px;
                        width: 90%;
                        animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        border-top: 5px solid #0065ff;
                    }
                    .icon-wrapper {
                        width: 70px;
                        height: 70px;
                        background: #e6f0ff;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 0 auto 20px auto;
                    }
                    .auth-title {
                        font-size: 22px;
                        font-weight: 600;
                        color: #1a2b4c;
                        margin: 0 0 12px 0;
                    }
                    .auth-msg {
                        color: #666;
                        margin-bottom: 25px;
                        line-height: 1.6;
                        font-size: 15px;
                    }
                    .auth-btn {
                        background: #0065ff;
                        color: white;
                        border: none;
                        padding: 14px 24px;
                        border-radius: 8px;
                        font-family: inherit;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        width: 100%;
                        display: block;
                    }
                    .auth-btn:hover {
                        background: #0056d6;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0,101,255,0.2);
                    }
                    @keyframes scaleUp {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                </style>
            </head>
            <body>
                <div class="auth-modal">
                    <div class="icon-wrapper">
                        <div style="font-size: 32px;">🔒</div>
                    </div>
                    <h2 class="auth-title">Authentication Required</h2>
                    <p class="auth-msg">To keep your data safe, please log in to your ClaimEasy account to access this page.</p>
                    <button class="auth-btn" id="loginRedirectBtn">Proceed to Login</button>
                </div>
            </body>
            `;

            // Attach event listener to the button
            document.getElementById('loginRedirectBtn').addEventListener('click', function() {
                window.location.replace('login.html');
            });

            // Redirect automatically after 3 seconds
            setTimeout(() => {
                window.location.replace('login.html');
            }, 3000);
        }
    }
})();
