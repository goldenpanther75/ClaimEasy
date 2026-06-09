// Mock Data for Health Insurance Plans
const healthPlansData = [
    {
        id: 1,
        provider: "ClaimEasy",
        planName: "ReAssure 2.0",
        sumInsured: "50L",
        tenure: "1",
        cashlessHospitals: "10,000+",
        monthlyPremium: 850,
        features: ["Unlimited Restoration", "Lock the Clock Age"],
        discount: "10% OFF",
        isBestValue: true,
        logoColor: "#005baa"
    },
    {
        id: 2,
        provider: "ClaimEasy",
        planName: "Young Star",
        sumInsured: "1Cr",
        tenure: "1",
        cashlessHospitals: "14,000+",
        monthlyPremium: 720,
        features: ["No Pre-policy Checkup", "Auto-Restoration"],
        discount: "5% Online Disc.",
        isBestValue: false,
        logoColor: "#008ac9"
    },
    {
        id: 3,
        provider: "ClaimEasy",
        planName: "Optima Secure",
        sumInsured: "2Cr",
        tenure: "1",
        cashlessHospitals: "12,000+",
        monthlyPremium: 980,
        features: ["4X Coverage", "No Claim Bonus"],
        discount: null,
        isBestValue: false,
        logoColor: "#e21c23"
    },
    {
        id: 4,
        provider: "ClaimEasy",
        planName: "Care Supreme",
        sumInsured: "3Cr",
        tenure: "2",
        cashlessHospitals: "11,000+",
        monthlyPremium: 790,
        features: ["Cumulative Bonus", "Unlimited Recharge"],
        discount: "7.5% OFF",
        isBestValue: true,
        logoColor: "#ec6608"
    },
    {
        id: 5,
        provider: "ClaimEasy",
        planName: "Activ Health",
        sumInsured: "4Cr",
        tenure: "1",
        cashlessHospitals: "9,000+",
        monthlyPremium: 550,
        features: ["Health Returns", "Chronic Management"],
    },

];

const container = document.getElementById('plans-container');
const planCountSpan = document.getElementById('plan-count');

// Function to Render Cards
function renderPlans(plans) {
    container.innerHTML = '';
    planCountSpan.textContent = plans.length;

    if (plans.length === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const maxBudget = urlParams.get('budget');
        const budgetMsg = maxBudget ? ` under ₹${maxBudget}` : '';

        const overlay = document.createElement('div');
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(255, 255, 255, 0.98); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100000; backdrop-filter: blur(8px);";
        overlay.innerHTML = `
            <i class="fas fa-search-minus" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
            <h1 style="font-size: 3.5rem; font-weight: 900; color: #111; margin-bottom: 20px; text-align: center;">There are no plans of this range!</h1>
            <p style="font-size: 1.5rem; font-weight: bold; color: #555; text-align: center; max-width: 600px;">We couldn't find any Health Insurance plans matching your filters${budgetMsg}.</p>
            <a href="health_comparison.html" style="margin-top: 40px; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; background: #0065ff; color: white; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 101, 255, 0.4);">View All Plans</a>
        `;
        document.body.appendChild(overlay);
        return;
    }

    plans.forEach(plan => {
        const card = document.createElement('div');
        card.className = 'comparison-card';

        const bestValueBadge = plan.isBestValue ? '<div class="best-value-badge">Best Value</div>' : '';


        card.innerHTML = `
            ${bestValueBadge}
                <div class="insurer-logo-round" aria-hidden="true">
                     <span class="logo-claim">Claim</span><span class="logo-easy">Easy</span>
                </div>
            </div>

            <div>
                <strong style="font-size:1.1rem; display:block; margin-bottom:5px;">${plan.provider}</strong>
                <span style="font-size:0.85rem; color:#666; background:#eee; padding:2px 8px; border-radius:4px;">${plan.planName}</span>
            </div>

            <div>
                <span style="display:block; font-size:0.8rem; color:#888;">Sum Insured</span>
                <span class="idv-value" style="font-weight:700; font-size:1.1rem; color:#333;">${formatMoney(plan.sumInsured)}</span>
            </div>

            <div class="plan-features">
                 <ul aria-label="Plan Features">
                    ${plan.features.map(f => `<li><i class="fas fa-check" aria-hidden="true"></i> ${f}</li>`).join('')}
                 </ul>
                 ${plan.discount ? `<div class="discount-tag" style="font-size:0.75rem; color:#e65100; margin-top:5px; font-weight:600;"><i class="fas fa-tag"></i> ${plan.discount}</div>` : ''}
            </div>

            <div style="text-align:right;">
                <div class="premium-price">₹ ${plan.monthlyPremium} <span style="font-size:0.8rem; font-weight:400; color:#666;">/mo</span></div>
                <button onclick="buyPlan(${plan.id})" class="btn btn-buy" style="margin-top:10px; width:100%;">Buy Now</button>
            </div>
        `;

        container.appendChild(card);
    });
}

function formatMoney(val) {
    if (val === '4Cr') return '4 Crores';
    if (val === '3Cr') return '3 Crores';
    if (val === '2Cr') return '2 Crores';
    if (val === '1Cr') return '1 Crore';
    if (val === '50L') return '50 Lakhs';
    if (val === '25L') return '25 Lakhs';
    if (val === '10L') return '10 Lakhs';
    if (val === '5L') return '5 Lakhs';
    return val;
}

function buyPlan(id) {
    const selectedPlan = healthPlansData.find(plan => plan.id === id);
    if (selectedPlan) {
        localStorage.setItem('selected_health_plan', JSON.stringify(selectedPlan));
        window.location.href = 'health_application_form.html';
    } else {
        alert('Error selecting plan.');
    }
}

// Initial Render
applyFilters();

// Filtering Logic
const coverFilter = document.getElementById('cover-filter');
const tenureFilter = document.getElementById('tenure-filter');

function applyFilters() {
    const selectedCover = coverFilter.value;
    const selectedTenure = tenureFilter.value;

    const urlParams = new URLSearchParams(window.location.search);
    const maxBudget = urlParams.get('budget');

    let filtered = healthPlansData.filter(p => {
        // Filter by Budget
        if (maxBudget && p.monthlyPremium > parseInt(maxBudget, 10)) {
            return false;
        }

        // Filter by Sum Insured
        if (selectedCover !== p.sumInsured && selectedCover !== 'all' && selectedCover !== 'All') { // Assume 'all' if we had one, but we have defaults
            // For demo, if strict match isn't found, we might want to be loose, but let's be strict for now.
            // Actually, let's allow '1Cr' to show '1Cr' plans.
            if (p.sumInsured !== selectedCover) return false;
        }

        // Filter by Tenure - Mock data mainly has 1 year, some 2. 
        // If user selects 2 Years, show plans with tenure '2' OR maybe plans that support it? 
        // For simplicity: strict match on mock data property.
        // Most mock data is 1 year. Let's make it flexible: if mock data says '1', it implies 1 year base. 
        // But for strict filtering:
        if (selectedTenure === '2' && p.tenure !== '2') return false;
        if (selectedTenure === '3' && p.tenure !== '3') return false;

        return true;
    });

    // Fallback for demo if empty:
    if (filtered.length === 0) {
        // Just show all to avoid empty state in demo, or maybe show a message?
        // Let's show a message (handled in renderPlans)
    }

    renderPlans(filtered);
}

coverFilter.addEventListener('change', applyFilters);
tenureFilter.addEventListener('change', applyFilters);

// Sorting Logic
const sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', () => {
    const sortVal = sortSelect.value;
    let sorted = [...healthPlansData];

    if (sortVal === 'premium-low') {
        sorted.sort((a, b) => a.monthlyPremium - b.monthlyPremium);
    } else if (sortVal === 'hospitals') {
        // Parse "10,000+" -> 10000
        const getCount = (str) => parseInt(str.replace(/,/g, '').replace('+', ''));
        sorted.sort((a, b) => getCount(b.cashlessHospitals) - getCount(a.cashlessHospitals));
    }

    renderPlans(sorted);
});

// Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-health-btn');
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('close-edit-modal');
    const editForm = document.getElementById('edit-health-form');

    // Display Elements
    const dispMembers = document.getElementById('health-members');
    const dispAge = document.getElementById('health-age');
    const dispPincode = document.getElementById('health-pincode');

    // Input Elements
    const inputMembers = document.getElementById('edit-members-input');
    const inputAge = document.getElementById('edit-age-input');
    const inputPincode = document.getElementById('edit-pincode-input');

    if (editBtn && modal) {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';

            // Prefill
            inputMembers.value = localStorage.getItem('health_members') || 'Self, Spouse, 1 Child';
            inputAge.value = parseInt(dispAge.textContent) || 32;
            inputPincode.value = parseInt(dispPincode.textContent) || 400001;
        });

        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const m = inputMembers.value;
            const a = inputAge.value;
            const p = inputPincode.value;

            if (m && a && p) {
                // Update Display
                dispMembers.textContent = m;
                dispAge.textContent = a + ' Years';
                dispPincode.textContent = p;

                // Save
                localStorage.setItem('health_members', m);
                localStorage.setItem('health_age', a);
                localStorage.setItem('health_pincode', p);

                modal.style.display = 'none';

                // Simulate refresh
                alert('Updating plans based on new details...');
                renderPlans(healthPlansData);
            }
        });
    }
});
