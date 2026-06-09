/**
 * validation.js - Indian Standard Document Format Validation
 * 
 * Enforces formats for:
 * - Aadhaar: 12 digits
 * - Engine No: 11-17 alphanumeric
 * - Chassis No: 17 alphanumeric
 * - PUC: 7-10 digits
 * - Driving License: 16 characters (SS-RR-YYYY-NNNNNNNN)
 * - PAN: 5 letters + 4 digits + 1 letter
 * - Passport: 1 letter + 7 digits
 */

const ClaimEasyValidators = {
    aadhaarNumber: {
        pattern: /^\d{12}$/,
        label: 'Aadhaar Card Number',
        example: '1234 5678 9123',
        description: '12 digits (numeric), no letters'
    },
    engineNumber: {
        pattern: /^[A-Z0-9]{11,17}$/,
        label: 'Engine Number',
        example: 'HYDG4FC21123456',
        description: '11-17 characters (letters + digits)'
    },
    chassisNumber: {
        pattern: /^[A-Z0-9]{17}$/,
        label: 'Chassis Number (VIN)',
        example: 'MA3EKEB1500A12345',
        description: 'Exactly 17 characters (letters + digits)'
    },
    pucNumber: {
        pattern: /^\d{7,10}$/,
        label: 'PUC Certificate Number',
        example: '1234567',
        description: '7-10 digits (numeric)'
    },
    licenseNumber: {
        pattern: /^[A-Z]{2}-\d{13}$/,
        label: 'Driving License Number',
        example: 'MH-1420110012345',
        description: '16 characters (Format: SS-13Digits)'
    },
    panNumber: {
        pattern: /^[A-Z]{5}\d{4}[A-Z]{1}$/,
        label: 'PAN Card Number',
        example: 'ABCDE1234F',
        description: '10 characters (5 letters + 4 digits + 1 letter)'
    },
    passport: {
        pattern: /^[A-Z]{1}\d{7}$/,
        label: 'Passport Number',
        example: 'K1234567',
        description: '8 characters (1 letter + 7 digits)'
    },
    t1Passport: { alias: 'passport' },
    t2Passport: { alias: 'passport' }
};

/**
 * Validates all standard IDs on the page.
 * returns { isValid: boolean, errors: Array }
 */
function validateIndianFormats() {
    const errors = [];
    const fieldsToValidate = Object.keys(ClaimEasyValidators);

    fieldsToValidate.forEach(id => {
        const fieldConfig = ClaimEasyValidators[id];
        const el = document.getElementById(id);
        
        if (el && el.value.trim() !== '') {
            const config = fieldConfig.alias ? ClaimEasyValidators[fieldConfig.alias] : fieldConfig;
            const value = el.value.trim().toUpperCase();
            
            if (!config.pattern.test(value)) {
                // Find section name (form-card header)
                const section = el.closest('.form-card');
                const sectionName = section ? (section.querySelector('h4')?.innerText || 'this section') : 'this section';
                
                errors.push({
                    field: config.label,
                    section: sectionName,
                    expected: config.description,
                    example: config.example
                });
                
                // Add visual error state if main.js validation logic is present
                el.parentElement.classList.add('invalid');
            } else {
                el.parentElement.classList.remove('invalid');
                el.parentElement.classList.add('valid');
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Shows the grouped alert as requested.
 */
function showValidationErrorAlert(validationResult) {
    if (validationResult.isValid) return;

    let alertMsg = "please fill corect information\n\n";
    
    // Group by section
    const grouped = {};
    validationResult.errors.forEach(err => {
        if (!grouped[err.section]) grouped[err.section] = [];
        grouped[err.section].push(err);
    });

    for (const section in grouped) {
        alertMsg += `📍 Section: ${section}\n`;
        grouped[section].forEach(err => {
            alertMsg += `   - ${err.field}: ${err.expected} (Ex: ${err.example})\n`;
        });
        alertMsg += "\n";
    }

    alert(alertMsg);
}

// Export for use in form scripts
window.ClaimEasyValidation = {
    validate: validateIndianFormats,
    showAlert: showValidationErrorAlert
};
