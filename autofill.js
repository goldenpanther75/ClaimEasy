/**
 * autofill.js - Auto-fills application forms with logged-in user's profile data.
 * Include this script in all application form pages.
 * 
 * Reads from localStorage key 'user' which is set by login.js after login/registration.
 * 
 * Supported field IDs (present across various forms):
 *   ownerName, fullName, proposerName, insuredName, holderName  -> user.name
 *   mobileNumber, mobile, phone                                  -> user.phone
 *   emailAddress, email                                          -> user.email
 *   dateOfBirth, dob, ownerDob, birthDate                       -> user.dob
 *   gender, ownerGender                                          -> user.gender
 *   address, ownerAddress                                        -> user.address.line
 *   city, ownerCity                                              -> user.address.city
 *   state, ownerState                                            -> user.address.state
 *   pincode, ownerPincode, pin                                   -> user.address.pincode
 */

(function autoFillFromProfile() {
    const raw = localStorage.getItem('user');
    if (!raw) return; // Not logged in, nothing to fill

    let user;
    try { user = JSON.parse(raw); } catch (e) { return; }

    // Helper: try to fill a field by its ID
    function fill(id, value) {
        if (!value) return;
        const el = document.getElementById(id);
        if (el && !el.readOnly && !el.disabled && el.value === '') {
            el.value = value;
            // Trigger change events so any reactive validation picks up the pre-filled value
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // Wait for DOM to be ready
    function runFill() {
        const addr = user.address || {};

        // Full Name fields
        ['ownerName', 'fullName', 'proposerName', 'insuredName', 'holderName', 'applicantName', 'policyHolderName'].forEach(id => fill(id, user.name));

        // Mobile fields
        ['mobileNumber', 'mobile', 'phone', 'ownerPhone', 'contactNumber'].forEach(id => fill(id, user.phone));

        // Email fields
        ['emailAddress', 'email', 'ownerEmail', 'proposerEmail'].forEach(id => fill(id, user.email));

        // Date of Birth fields
        ['dateOfBirth', 'dob', 'ownerDob', 'birthDate', 'proposerDob'].forEach(id => fill(id, user.dob));

        // Gender fields (only for select elements too)
        ['gender', 'ownerGender', 'proposerGender'].forEach(id => {
            if (!user.gender) return;
            const el = document.getElementById(id);
            if (el && !el.disabled && (el.value === '' || el.value === undefined)) {
                // Handle both input and select
                const g = user.gender.toLowerCase();
                if (el.tagName === 'SELECT') {
                    for (let opt of el.options) {
                        if (opt.value.toLowerCase() === g || opt.text.toLowerCase() === g) {
                            el.value = opt.value;
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            break;
                        }
                    }
                } else {
                    el.value = user.gender;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });

        // Address fields
        ['address', 'ownerAddress', 'residentialAddress'].forEach(id => fill(id, addr.line));
        ['city', 'ownerCity', 'proposerCity'].forEach(id => fill(id, addr.city));
        ['state', 'ownerState', 'proposerState'].forEach(id => fill(id, addr.state));
        ['pincode', 'ownerPincode', 'pin', 'zipCode'].forEach(id => fill(id, addr.pincode));

        // Show a subtle notification badge if any fill happened
        const anyFilled = document.querySelectorAll('input[data-autofilled]').length > 0;
        // (silently filled - no alert needed)
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runFill);
    } else {
        runFill();
    }
})();
