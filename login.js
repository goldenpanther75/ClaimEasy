document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const step1Form = document.getElementById('step-1-form');
    const step2Form = document.getElementById('step-2-otp');
    const step3Form = document.getElementById('step-3-register');

    const phoneGroup = document.getElementById('phone-group');
    const emailGroup = document.getElementById('email-group');

    const googleBtn = document.getElementById('google-btn');
    const emailBtn = document.getElementById('email-btn');
    const getEmailOtpBtn = document.getElementById('get-email-otp-btn');

    const alertBox = document.getElementById('alert-box');
    const otpSentTo = document.getElementById('otp-sent-to');

    let currentMode = 'email'; // only email now
    let currentIdentifier = '';

    // Helper: Show Alert
    const showAlert = (msg, type = 'error') => {
        alertBox.textContent = msg;
        alertBox.className = type === 'success' ? 'success-msg' : 'error-msg';
        alertBox.classList.remove('hidden');
        setTimeout(() => alertBox.classList.add('hidden'), 5000);
    };

    // Google Sign-In Mock
    googleBtn.addEventListener('click', () => {
        const originalText = googleBtn.innerHTML;
        googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to Google...';
        googleBtn.disabled = true;

        // Simulate OAuth Popup Delay
        setTimeout(() => {
            googleBtn.innerHTML = originalText;
            googleBtn.disabled = false;
            showAlert('Google Sign-In is mocked. Please use Email OTP instead.', 'success');
        }, 1500);
    });

    // Step 1: Send OTP
    step1Form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email-input').value;

        if (!emailInput || !emailInput.includes('@')) {
            showAlert('Please enter a valid email address.');
            return;
        }
        currentIdentifier = emailInput;

        const isSignupModal = document.getElementById('header-text').textContent.includes('Create an account');

        try {
            const res = await fetch('http://13.126.167.8:5000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: currentIdentifier, isSignup: isSignupModal })
            });
            const data = await res.json();

            if (data.success) {
                showAlert(`OTP sent successfully! Please check your ${currentMode === 'phone' ? 'phone' : 'email'}.`, 'success');
                step1Form.classList.add('hidden');
                step2Form.classList.remove('hidden');
                otpSentTo.textContent = currentIdentifier;
            } else {
                showAlert(data.message || 'Failed to send OTP.');
            }
        } catch (err) {
            showAlert('Server error. Is the backend running?');
        }
    });

    // Change Contact
    document.getElementById('change-contact').addEventListener('click', (e) => {
        e.preventDefault();
        step2Form.classList.add('hidden');
        step1Form.classList.remove('hidden');
    });

    // Resend OTP
    document.getElementById('resend-otp').addEventListener('click', async (e) => {
        e.preventDefault();
        // Re-use logic or just call API again
        showAlert('Resending OTP...', 'success');
        try {
            const res = await fetch('http://13.126.167.8:5000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: currentIdentifier })
            });
            const data = await res.json();
            if (data.success) {
                showAlert(`OTP resent successfully! Please check your ${currentMode === 'phone' ? 'phone' : 'email'}.`, 'success');
            } else {
                showAlert(data.message || 'Failed to resend OTP.');
            }
        } catch (err) {
            showAlert('Server error. Is the backend running?');
        }
    });

    // Step 2: Verify OTP
    step2Form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const otp = document.getElementById('otp-input').value.replace(/\s/g, '');

        if (!otp || otp.length !== 6) {
            showAlert('Please enter a valid 6-digit OTP.');
            return;
        }

        try {
            const res = await fetch('http://13.126.167.8:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: currentIdentifier, otp })
            });
            const data = await res.json();

            if (data.success) {
                if (data.isNewUser) {
                    // Go to Registration
                    showAlert('OTP Verified. Please create your account.', 'success');
                    step2Form.classList.add('hidden');
                    step3Form.classList.remove('hidden');

                    // Pre-fill known data
                    if (currentMode === 'phone') {
                        document.getElementById('reg-phone').value = currentIdentifier;
                        document.getElementById('reg-phone').disabled = true; // Lock verified input
                    } else {
                        document.getElementById('reg-email').value = currentIdentifier;
                        document.getElementById('reg-email').disabled = true; // Lock verified input
                    }
                } else {
                    // Login Success
                    loginSuccess(data.user);
                }
            } else {
                showAlert(data.message || 'Invalid OTP.');
            }
        } catch (err) {
            showAlert('Verification failed.');
        }
    });

    // Step 3: Register
    step3Form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const dobStr = document.getElementById('reg-dob').value;
        const gender = document.getElementById('reg-gender').value;
        const address = document.getElementById('reg-address').value;
        const city = document.getElementById('reg-city').value;
        const state = document.getElementById('reg-state').value;
        const pincode = document.getElementById('reg-pincode').value;

        // Date logic: check if at least 18 years old
        if (dobStr) {
            const dob = new Date(dobStr);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 18) {
                showAlert('You must be 18 years or older to register.');
                return;
            }
        }

        const regPhone = document.getElementById('reg-phone').value;
        const regEmail = document.getElementById('reg-email').value;

        // Use verified identifier first, else use user input from form
        const finalPhone = (currentMode === 'phone' && currentIdentifier) ? currentIdentifier : regPhone;
        const finalEmail = (currentMode === 'email' && currentIdentifier) ? currentIdentifier : regEmail;

        const payload = {
            name,
            dob: dobStr,
            gender,
            address: {
                line: address, city, state, pincode
            },
            phone: finalPhone,
            email: finalEmail
        };

        try {
            const res = await fetch('http://13.126.167.8:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                loginSuccess(data.user);
            } else {
                showAlert(data.message || 'Registration failed.');
            }
        } catch (err) {
            showAlert('Registration error.');
        }
    });

    function loginSuccess(user) {
        localStorage.setItem('user', JSON.stringify(user));
        // Redirect with flag to show welcome message
        window.location.href = 'index.html?login_success=true';
    }
    // Signup Link Logic
    document.getElementById('signup-link').addEventListener('click', (e) => {
        e.preventDefault();
        // Reset forms
        step1Form.classList.remove('hidden');
        step2Form.classList.add('hidden');
        step3Form.classList.add('hidden');

        // Update UI to look like "Signup"
        document.getElementById('header-text').textContent = 'Create an account to get started.';
        
        if (getEmailOtpBtn) getEmailOtpBtn.textContent = 'Sign up with Email OTP';

        // Focus the appropriate input
        document.getElementById('email-input').focus();
    });
});
