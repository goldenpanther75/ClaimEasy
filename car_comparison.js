const carPlansData = [
    {
        id: 1,
        provider: 'ClaimEasy',
        logoColor: '#6f42c1',
        logoIcon: 'fa-shield-cat',
        idv: '₹ 2,00,00,000',
        coverType: 'Comprehensive',
        garages: '3500+',
        features: ['Instant Policy', 'Zero Paperwork', 'Free Pick & Drop'],
        premium: 6250
    },
    {
        id: 2,
        provider: 'ClaimEasy',
        logoColor: '#e31e24',
        logoIcon: 'fa-umbrella',
        idv: '₹ 4,00,00,000',
        coverType: 'Comprehensive',
        garages: '6800+',
        features: ['Overnight Repair', 'Unlimited Claims', 'Doorstep Repair'],
        premium: 7100
    },
    {
        id: 3,
        provider: 'ClaimEasy',
        logoColor: '#f37021',
        logoIcon: 'fa-leaf',
        idv: '₹ 5,00,00,000',
        coverType: 'Comprehensive',
        garages: '5500+',
        features: ['Live Video Inspection', 'InstaProtect', 'Roadside Assistance'],
        premium: 6890
    },
    {
        id: 4,
        provider: 'ClaimEasy',
        logoColor: '#f9b92e',
        logoIcon: 'fa-handshake',
        idv: '₹ 6,00,00,000',
        coverType: 'Comprehensive',
        garages: '4500+',
        features: ['Smartphone Self-Inspection', 'Super Fast Claims', 'Advance Cash'],
        premium: 5999
    },
    {
        id: 5,
        provider: 'ClaimEasy',
        logoColor: '#0056b3',
        logoIcon: 'fa-landmark',
        idv: '₹ 8,00,00,000',
        coverType: 'Comprehensive',
        garages: '2000+',
        features: ['Govt. Owned', 'High Trust', 'Wide Network'],
        premium: 5500
    },

];

const container = document.getElementById('car-plans-container');
const planCountElem = document.getElementById('plan-count');

function renderCarPlans(plans = carPlansData) {
    container.innerHTML = '';

    if (planCountElem) {
        planCountElem.textContent = plans.length;
    }

    if (plans.length === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const maxBudget = urlParams.get('budget');
        const budgetMsg = maxBudget ? ` under ₹${maxBudget}` : '';

        const overlay = document.createElement('div');
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(255, 255, 255, 0.98); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100000; backdrop-filter: blur(8px);";
        overlay.innerHTML = `
            <i class="fas fa-search-minus" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
            <h1 style="font-size: 3.5rem; font-weight: 900; color: #111; margin-bottom: 20px; text-align: center;">There are no plans of this range!</h1>
            <p style="font-size: 1.5rem; font-weight: bold; color: #555; text-align: center; max-width: 600px;">We couldn't find any Car Insurance plans matching your filters${budgetMsg}.</p>
            <a href="car_comparison.html" style="margin-top: 40px; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; background: #0065ff; color: white; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 101, 255, 0.4);">View All Plans</a>
        `;
        document.body.appendChild(overlay);
        return;
    }

    plans.forEach(plan => {
        const card = document.createElement('div');
        card.className = 'comparison-card';
        card.setAttribute('role', 'listitem');

        const logoHtml = `
            <div class="insurer-logo-round" aria-hidden="true">
                <span class="logo-claim">Claim</span><span class="logo-easy">Easy</span>
            </div>
        `;

        card.innerHTML = `
            ${logoHtml}
            <div>
                <strong style="font-size:1.1rem; display:block; margin-bottom:5px;">${plan.provider}</strong>
                <span style="font-size:0.85rem; color:#666; background:#eee; padding:2px 8px; border-radius:4px;">${plan.coverType}</span>
            </div>
            <div>
                <span style="display:block; font-size:0.8rem; color:#888;">IDV (Insured Value)</span>
                <span class="idv-value" aria-label="IDV: ${plan.idv}">${plan.idv}</span>
            </div>
            <div class="plan-features">
                 <ul aria-label="Plan Features">
                    ${plan.features.map(f => `<li><i class="fas fa-check" aria-hidden="true"></i> ${f}</li>`).join('')}
                 </ul>
                 <div style="font-size:0.8rem; margin-top:5px; color:#555;"><i class="fas fa-wrench" style="color:var(--secondary-color);" aria-hidden="true"></i> ${plan.garages} Garages</div>
            </div>
            <div style="text-align:right;">
                <div class="premium-price" aria-label="Premium: ₹ ${plan.premium.toLocaleString()}">₹ ${plan.premium.toLocaleString()}</div>
                <button onclick="buyCarPlan(${plan.id})" class="btn btn-primary" style="margin-top:10px; width:100%;" aria-label="Buy ${plan.provider} plan for ₹ ${plan.premium}">Buy Now</button>
            </div>
        `;

        container.appendChild(card);
    });
}

function buyCarPlan(id) {
    const selectedPlan = carPlansData.find(plan => plan.id === id);
    if (selectedPlan) {
        localStorage.setItem('selected_car_plan', JSON.stringify(selectedPlan));
        window.location.href = 'car_application_form.html';
    } else {
        alert('Error selecting plan.');
    }
}

// Filters and Sort Logic
function filterAndSortPlans() {
    const sortValue = document.getElementById('sort-select').value;
    const planType = document.getElementById('plan-type-filter').value;
    const zeroDep = document.getElementById('zero-dep').checked;
    const roadSide = document.getElementById('roadside-assist').checked;

    // Parse URL parameter for budget
    const urlParams = new URLSearchParams(window.location.search);
    const maxBudget = urlParams.get('budget');

    let filtered = carPlansData.filter(plan => {
        // Budget Filter
        if (maxBudget && plan.premium > parseInt(maxBudget, 10)) {
            return false;
        }

        // Plan Type Filter
        if (planType !== 'All' && planType !== plan.coverType) {
            // Simple match for "Comprehensive" or "Third Party"
            // If user selected "Comprehensive", show only Comprehensive
            // If user selected "Third Party", show only Third Party
            // Note: In HTML I used "Comprehensive" and "Third Party" as values
            if (plan.coverType !== planType) return false;
        }

        // Feature Filters (Mock logic)
        // If Zero Dep is checked, maybe filter plans that have it?
        // For now, let's just assume plans with 'Comprehensive' might have it, or check features array
        if (zeroDep) {
            // Mock: Only odd IDs have zero dep for demo
            if (plan.id % 2 === 0) return false;
        }
        if (roadSide) {
            // Mock check features
            if (!plan.features.some(f => f.includes('Roadside') || f.includes('RSA') || f.includes('Help'))) return false;
        }

        return true;
    });

    // Sort
    if (sortValue === 'price-low') {
        filtered.sort((a, b) => a.premium - b.premium);
    } else if (sortValue === 'idv-high') {
        // Parse IDV string "₹ 8,50,000" -> 850000
        const getIdv = (s) => parseInt(s.replace(/₹/g, '').replace(/,/g, '').trim());
        filtered.sort((a, b) => getIdv(b.idv) - getIdv(a.idv));
    }

    renderCarPlans(filtered);
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    filterAndSortPlans(); // Calls render

    // Attach Listeners
    document.getElementById('sort-select').addEventListener('change', filterAndSortPlans);
    document.getElementById('plan-type-filter').addEventListener('change', filterAndSortPlans);
    document.getElementById('zero-dep').addEventListener('change', filterAndSortPlans);
    document.getElementById('roadside-assist').addEventListener('change', filterAndSortPlans);


    // Header Logic - Load Car Data
    const regNoElement = document.getElementById('vehicle-reg-no');
    const storedRegNo = localStorage.getItem('car_reg_no');

    if (storedRegNo) {
        regNoElement.textContent = storedRegNo;
    }

    // Modal Logic
    const editBtn = document.getElementById('edit-vehicle-btn');
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('close-edit-modal');
    const editForm = document.getElementById('edit-vehicle-form');
    const editInput = document.getElementById('edit-reg-input');

    if (editBtn && modal) {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            editInput.value = localStorage.getItem('car_reg_no') || regNoElement.textContent;
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Save
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newReg = editInput.value.toUpperCase();
            if (newReg) {
                localStorage.setItem('car_reg_no', newReg);
                regNoElement.textContent = newReg;
                modal.style.display = 'none';
            }
        });
    }
});
