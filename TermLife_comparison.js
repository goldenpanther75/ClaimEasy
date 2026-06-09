// Mock Data for Insurance Plans
const plansData = [
    {
        id: 1,
        provider: "ClaimEasy",
        planName: "Click 2 Protect Super",
        cover: "1Cr",
        age: "60",
        csr: "99.2%",
        monthlyPremium: 490,
        features: ["Claim Decision in 1 Day", "Waiver of Premium"],
        discount: "15% OFF",
        isBestValue: true,
        logoColor: "#ED1C24"
    },
    {
        id: 2,
        provider: "ClaimEasy",
        planName: "iProtect Smart",
        cover: "1Cr",
        age: "60",
        csr: "98.6%",
        monthlyPremium: 520,
        features: ["Terminal Illness Cover", "Tax Benefits"],
        discount: "10% OFF",
        isBestValue: false,
        logoColor: "#F37021"
    },
    {
        id: 3,
        provider: "ClaimEasy",
        planName: "Smart Secure Plus",
        cover: "2Cr",
        age: "70",
        csr: "99.5%",
        monthlyPremium: 950,
        features: ["Return of Premium", "Joint Life Option"],
        discount: "Online Spl Price",
        isBestValue: false,
        logoColor: "#0065ff"
    },
    {
        id: 4,
        provider: "ClaimEasy",
        planName: "Sampoorna Raksha",
        cover: "1Cr",
        age: "80",
        csr: "99.0%",
        monthlyPremium: 610,
        features: ["Whole Life Cover", "Lower Premium"],
        discount: "5% OFF",
        isBestValue: false,
        logoColor: "#D31145"
    },
    {
        id: 5,
        provider: "ClaimEasy",
        planName: "Jeevan Amar",
        cover: "50L",
        age: "60",
        csr: "98.5%",
        monthlyPremium: 380,
        features: ["Govt Backed", "Reliable Brand"],
        discount: null,
        isBestValue: false,
        logoColor: "#FFCC00"
    },

];

const container = document.getElementById('plans-container');
const planCountSpan = document.getElementById('plan-count');

// --- Load User Data ---
let userData = JSON.parse(localStorage.getItem('termLife_data')) || {
    occupation: 'Salaried',
    income: '5L-7L',
    tobacco: 'No',
    city: 'Mumbai'
};

function updateEditBar() {
    const occupations = document.getElementById('display-occupation');
    const income = document.getElementById('display-income');
    const tobacco = document.getElementById('display-tobacco');
    const city = document.getElementById('display-city');

    if (occupations) occupations.textContent = userData.occupation;
    if (income) income.textContent = userData.income;
    if (tobacco) tobacco.textContent = userData.tobacco;
    if (city) city.textContent = userData.city;
}

// Initial Load
updateEditBar();
renderPlans(plansData);

// --- Edit Modal Logic ---
function openEditModal() {
    document.getElementById('edit-occupation').value = userData.occupation;
    document.getElementById('edit-income').value = userData.income;
    document.getElementById('edit-tobacco').value = userData.tobacco;
    document.getElementById('edit-city').value = userData.city;
    document.getElementById('edit-modal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

function saveDetails() {
    userData.occupation = document.getElementById('edit-occupation').value;
    userData.income = document.getElementById('edit-income').value;
    userData.tobacco = document.getElementById('edit-tobacco').value;
    userData.city = document.getElementById('edit-city').value;

    localStorage.setItem('termLife_data', JSON.stringify(userData));
    updateEditBar();
    closeEditModal();

    // Simulate Plan Refresh (e.g. Premium adjustment based on Tobacco/Age)
    alert("Plans updated based on new details!");
    renderPlans(plansData); // Re-render to potentially apply new logic
}


// Function to Render Cards
function renderPlans(plans) {
    container.innerHTML = '';

    // Simulate Premium Calculation based on Tobacco
    const multiplier = userData.tobacco === 'Yes' ? 1.4 : 1.0;

    // Filter logic
    const coverFilter = document.getElementById('cover-filter').value;
    const ageFilter = document.getElementById('age-filter').value;

    const urlParams = new URLSearchParams(window.location.search);
    const maxBudget = urlParams.get('budget');

    // Apply Filters & Calculations
    const finalPlans = plans.map(p => {
        return {
            ...p,
            monthlyPremium: Math.round(p.monthlyPremium * multiplier)
        };
    }).filter(p => {
        // Filter by Budget
        if (maxBudget && p.monthlyPremium > parseInt(maxBudget, 10)) {
            return false;
        }

        // Simple filter: Only show if cover matches OR if cover is 1Cr default
        // Also filtering by age if it matches mock data, else ignoring for demo if not exact match
        const coverMatch = coverFilter === 'All' || p.cover === coverFilter || (coverFilter === '1Cr' && p.cover === '1Cr' && coverFilter !== 'All');
        // const ageMatch = p.age === ageFilter; // Strict age match? maybe not for demo
        return coverMatch;
    });

    planCountSpan.textContent = finalPlans.length;

    if (finalPlans.length === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const maxBudget = urlParams.get('budget');
        const budgetMsg = maxBudget ? ` under ₹${maxBudget}` : '';

        const overlay = document.createElement('div');
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(255, 255, 255, 0.98); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100000; backdrop-filter: blur(8px);";
        overlay.innerHTML = `
            <i class="fas fa-search-minus" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
            <h1 style="font-size: 3.5rem; font-weight: 900; color: #111; margin-bottom: 20px; text-align: center;">There are no plans of this range!</h1>
            <p style="font-size: 1.5rem; font-weight: bold; color: #555; text-align: center; max-width: 600px;">We couldn't find any Term Life plans matching your filters${budgetMsg}.</p>
            <a href="TermLife_comparison.html" style="margin-top: 40px; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; background: #0065ff; color: white; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 101, 255, 0.4);">View All Plans</a>
        `;
        document.body.appendChild(overlay);
        return;
    }

    finalPlans.forEach(plan => {
        const card = document.createElement('div');
        // Using health-plan-card class to pick up styling from health_comparison.css (or copied styles)
        card.className = 'comparison-card';
        card.style.borderLeftColor = "#0065ff"; // Force Term Blue

        let bestValueBadge = plan.isBestValue
            ? `<div class="best-value-badge" style="background:#fff3e0; color:#e65100; border:1px solid #ffe0b2;">Best Value</div>`
            : '';



        card.innerHTML = `
            ${bestValueBadge}
                <div class="insurer-logo-round" aria-hidden="true">
                     <span class="logo-claim">Claim</span><span class="logo-easy">Easy</span>
                </div>
            </div>

            <div>
                <strong style="font-size:1.1rem; display:block; margin-bottom:5px;">${plan.provider}</strong>
                <span style="font-size:0.85rem; color:#666; background:#f0f4f9; padding:2px 8px; border-radius:4px;">${plan.planName}</span>
            </div>

            <div>
                <span style="display:block; font-size:0.8rem; color:#888;">Life Cover</span>
                <span class="idv-value" style="font-weight:700; font-size:1.1rem; color:#333;">${formatCover(plan.cover)}</span>
                <div style="font-size:0.8rem; color:#2e7d32; margin-top:3px;"><i class="fas fa-check-circle"></i> CSR: ${plan.csr}</div>
            </div>

            <div class="plan-features">
                 <ul aria-label="Plan Features">
                    ${plan.features.map(f => `<li><i class="fas fa-check" aria-hidden="true"></i> ${f}</li>`).join('')}
                 </ul>
                 ${plan.discount ? `<div class="discount-tag"><i class="fas fa-tag"></i> ${plan.discount}</div>` : ''}
            </div>

            <div style="text-align:right;">
                <div class="premium-price">₹ ${plan.monthlyPremium} <span style="font-size:0.8rem; font-weight:400; color:#666;">/mo</span></div>
                <div style="font-size:0.75rem; color:#999; margin-bottom:8px;">(incl. GST)</div>
                <button onclick="buyTermPlan(${plan.id})" class="btn btn-primary" style="width:100%; border-radius:6px;">Buy Now</button>
            </div>
        `;

        container.appendChild(card);
    });
}

function formatCover(val) {
    if (val === '1Cr') return '1 Crore';
    if (val === '2Cr') return '2 Crores';
    if (val === '50L') return '50 Lakhs';
    return val;
}

function buyTermPlan(id) {
    // Save selected plan with calculated premium
    // We need to find the plan again to get base details, but apply current multiplier
    const basePlan = plansData.find(p => p.id === id);
    const multiplier = userData.tobacco === 'Yes' ? 1.4 : 1.0;

    const selectedPlan = {
        ...basePlan,
        monthlyPremium: Math.round(basePlan.monthlyPremium * multiplier)
    };

    if (selectedPlan) {
        localStorage.setItem('selected_termlife_plan', JSON.stringify(selectedPlan));
        window.location.href = 'TermLife_application_form.html';
    } else {
        alert('Error selecting plan.');
    }
}

// Filtering Logic
const coverFilter = document.getElementById('cover-filter');
const ageFilter = document.getElementById('age-filter');

coverFilter.addEventListener('change', () => renderPlans(plansData));
ageFilter.addEventListener('change', () => renderPlans(plansData));

// Sorting Logic
const sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', () => {
    // Sort logic would go here, re-sorting userPlans and calling renderPlans
    // For now, simpler to just re-render or sort filtered list
    renderPlans(plansData);
});
