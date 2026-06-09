// State Management
const formState = {
    currentStep: 1,
    totalSteps: 6,
    userData: {
        occupation: '',
        education: '',
        income: '',
        tobacco: '',
        city: '',
        canContact: ''
    }
};

// DOM Elements
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.querySelector('.progress-fill');
const stepIndicator = document.getElementById('step-indicator-text');
const steps = document.querySelectorAll('.step-content');

// Init
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    setupEventListeners();
});

function setupEventListeners() {
    // Navigation Buttons
    nextBtn.addEventListener('click', () => nextStep());
    prevBtn.addEventListener('click', () => prevStep());

    // Step 1: Occupation
    const occOptions = document.querySelectorAll('.occupation-option');
    occOptions.forEach(opt => {
        opt.addEventListener('click', function () {
            // Remove active class from others
            occOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            formState.userData.occupation = this.dataset.value;
            validateAndEnableNext();
            // Auto advance for better UX
            setTimeout(() => nextStep(), 300);
        });
    });

    // Step 2: Education
    const eduOptions = document.querySelectorAll('input[name="education"]');
    eduOptions.forEach(opt => {
        opt.addEventListener('change', function () {
            formState.userData.education = this.value;
            validateAndEnableNext();
            setTimeout(() => nextStep(), 300);
        });
    });

    // Step 3: Income
    const incOptions = document.querySelectorAll('.income-card');
    incOptions.forEach(opt => {
        opt.addEventListener('click', function () {
            incOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            formState.userData.income = this.dataset.value;
            validateAndEnableNext();
            setTimeout(() => nextStep(), 300);
        });
    });

    // Step 4: Tobacco
    const tobOptions = document.querySelectorAll('.tobacco-btn');
    tobOptions.forEach(opt => {
        opt.addEventListener('click', function () {
            tobOptions.forEach(o => {
                o.classList.remove('selected');
                o.style.borderColor = '#e0e0e0';
                o.style.color = '#333';
            });
            this.classList.add('selected');
            this.style.borderColor = '#0065ff';
            this.style.color = '#0065ff';
            formState.userData.tobacco = this.dataset.value;
            validateAndEnableNext();
            setTimeout(() => nextStep(), 300);
        });
    });

    // Step 5: City Autocomplete
    const cityInput = document.getElementById('city-input');
    const cityList = document.getElementById('city-list');
    const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara"];

    cityInput.addEventListener('input', function () {
        const val = this.value.toLowerCase();
        cityList.innerHTML = '';
        if (!val) {
            cityList.style.display = 'none';
            return;
        }

        const matches = cities.filter(c => c.toLowerCase().includes(val));
        if (matches.length > 0) {
            cityList.style.display = 'block';
            matches.forEach(city => {
                const div = document.createElement('div');
                div.className = 'city-option';
                div.textContent = city;
                div.addEventListener('click', () => {
                    cityInput.value = city;
                    formState.userData.city = city;
                    cityList.style.display = 'none';
                    validateAndEnableNext();
                });
                cityList.appendChild(div);
            });
        } else {
            cityList.style.display = 'none';
        }
    });

    // Step 6: Contact Permission
    const contactOptions = document.querySelectorAll('.contact-btn');
    contactOptions.forEach(opt => {
        opt.addEventListener('click', async function () {
            contactOptions.forEach(o => {
                o.classList.remove('selected');
                o.style.borderColor = '#e0e0e0';
            });
            this.classList.add('selected');
            this.style.borderColor = '#0065ff';
            formState.userData.canContact = this.dataset.value;

            // Save to LocalStorage for Comparison Page
            localStorage.setItem('termLife_data', JSON.stringify(formState.userData));

            // Final Submission
            const submitBtn = this;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...';
            submitBtn.disabled = true;

            // Simulate redirect to comparison immediately for smooth UX
            // In real app, we might wait for backend, but for "Edit" feature, we rely on LocalStorage
            setTimeout(() => {
                window.location.href = 'TermLife_easyclaim.html';
            }, 500);
        });
    });
}

function nextStep() {
    if (formState.currentStep < formState.totalSteps) {
        if (!validateStep(formState.currentStep)) return;
        formState.currentStep++;
        updateUI();
    }
}

function prevStep() {
    if (formState.currentStep > 1) {
        formState.currentStep--;
        updateUI();
    }
}

function updateUI() {
    // Update Steps Visibility
    steps.forEach((step, index) => {
        if (index + 1 === formState.currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update Progress Bar
    const progress = ((formState.currentStep - 1) / (formState.totalSteps - 1)) * 100;
    progressFill.style.width = `${progress}%`;

    // Update Indicator Text
    stepIndicator.textContent = `Step ${formState.currentStep}/${formState.totalSteps}`;

    // Button States
    prevBtn.style.visibility = formState.currentStep === 1 ? 'hidden' : 'visible';

    // Hide Next button on last step where we use custom buttons
    if (formState.currentStep === formState.totalSteps) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
        validateAndEnableNext(); // Re-check validation state
    }
}

function validateAndEnableNext() {
    const isValid = validateStep(formState.currentStep);
    nextBtn.disabled = !isValid;
}

function validateStep(step) {
    const data = formState.userData;
    switch (step) {
        case 1: return !!data.occupation;
        case 2: return !!data.education;
        case 3: return !!data.income;
        case 4: return !!data.tobacco;
        case 5: return data.city.length > 2;
        case 6: return !!data.canContact;
        default: return false;
    }
}
