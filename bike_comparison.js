const bikePlansData = [
    {
        id: 1,
        provider: 'ClaimEasy',
        logoColor: '#6f42c1',
        logoIcon: 'fa-shield-cat',
        idv: '₹ 45,000',
        coverType: 'Comprehensive',
        garages: '1500+',
        features: ['Instant Policy', 'Zero Paperwork'],
        premium: 850
    },
    {
        id: 2,
        provider: 'ClaimEasy',
        logoColor: '#e31e24',
        logoIcon: 'fa-umbrella',
        idv: '₹ 48,000',
        coverType: 'Comprehensive',
        garages: '3000+',
        features: ['Unlimited Claims', 'Doorstep Repair'],
        premium: 920
    },
    {
        id: 3,
        provider: 'ClaimEasy',
        logoColor: '#f37021',
        logoIcon: 'fa-leaf',
        idv: '₹ 46,500',
        coverType: 'Comprehensive',
        garages: '2500+',
        features: ['InstaProtect', 'Roadside Assistance'],
        premium: 890
    },
    {
        id: 4,
        provider: 'ClaimEasy',
        logoColor: '#f9b92e',
        logoIcon: 'fa-handshake',
        idv: '₹ 44,000',
        coverType: 'Comprehensive',
        garages: '2000+',
        features: ['Smartphone Self-Inspection', 'Super Fast Claims'],
        premium: 799
    },
    {
        id: 5,
        provider: 'ClaimEasy',
        logoColor: '#0056b3',
        logoIcon: 'fa-landmark',
        idv: '₹ 40,000',
        coverType: 'Comprehensive',
        garages: '1000+',
        features: ['Govt. Owned', 'High Trust'],
        premium: 750
    },

];

const container = document.getElementById('car-plans-container'); // Keeps ID from HTML to avoid breaking if not updated, but HTML uses same ID? Yes, car-plans-container used in bike html.
const planCountElem = document.getElementById('plan-count');

function renderBikePlans(plans = bikePlansData) {
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
            <p style="font-size: 1.5rem; font-weight: bold; color: #555; text-align: center; max-width: 600px;">We couldn't find any Bike Insurance plans matching your filters${budgetMsg}.</p>
            <a href="bike_comparison.html" style="margin-top: 40px; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; background: #0065ff; color: white; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 101, 255, 0.4);">View All Plans</a>
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
                 <div style="font-size:0.8rem; margin-top:5px; color:#555;"><i class="fas fa-wrench" style="color:var(--bike-orange);" aria-hidden="true"></i> ${plan.garages} Garages</div>
            </div>
            <div style="text-align:right;">
                <div class="premium-price" aria-label="Premium: ₹ ${plan.premium}">₹ ${plan.premium}</div>
                <button onclick="buyBikePlan(${plan.id})" class="btn btn-buy" style="margin-top:10px; width:100%;" aria-label="Buy ${plan.provider} plan for ₹ ${plan.premium}">Buy Now</button>
            </div>
        `;

        container.appendChild(card);
    });
}

function buyBikePlan(id) {
    const selectedPlan = bikePlansData.find(plan => plan.id === id);
    if (selectedPlan) {
        localStorage.setItem('selected_bike_plan', JSON.stringify(selectedPlan));
        window.location.href = 'bike_application_form.html';
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

    const urlParams = new URLSearchParams(window.location.search);
    const maxBudget = urlParams.get('budget');

    let filtered = bikePlansData.filter(plan => {
        // Filter by Budget
        if (maxBudget && plan.premium > parseInt(maxBudget, 10)) {
            return false;
        }

        // Plan Type Filter
        if (planType !== 'All' && planType !== plan.coverType) {
            if (plan.coverType !== planType) return false;
        }

        // Feature Filters (Mock logic)
        if (zeroDep) {
            if (plan.id % 2 === 0) return false;
        }
        if (roadSide) {
            if (!plan.features.some(f => f.includes('Roadside') || f.includes('RSA') || f.includes('Help'))) return false;
        }

        return true;
    });

    // Sort
    if (sortValue === 'price-low') {
        filtered.sort((a, b) => a.premium - b.premium);
    } else if (sortValue === 'idv-high') {
        const getIdv = (s) => parseInt(s.replace(/₹/g, '').replace(/,/g, '').trim());
        filtered.sort((a, b) => getIdv(b.idv) - getIdv(a.idv));
    }

    renderBikePlans(filtered);
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    filterAndSortPlans();

    // Attach Listeners
    document.getElementById('sort-select').addEventListener('change', filterAndSortPlans);
    document.getElementById('plan-type-filter').addEventListener('change', filterAndSortPlans);
    document.getElementById('zero-dep').addEventListener('change', filterAndSortPlans);
    document.getElementById('roadside-assist').addEventListener('change', filterAndSortPlans);

    // Header Logic - Load Bike Data
    const regNoElement = document.getElementById('vehicle-reg-no');
    const storedRegNo = localStorage.getItem('bike_reg_no');

    if (storedRegNo) {
        regNoElement.textContent = storedRegNo;
    }

    // Modal Logic (Keeping existing)
    const editBtn = document.getElementById('edit-vehicle-btn');
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('close-edit-modal');
    const editForm = document.getElementById('edit-vehicle-form');

    // Inputs
    const editRegInput = document.getElementById('edit-reg-input');
    const editModelInput = document.getElementById('edit-model-input');
    const editFuelInput = document.getElementById('edit-fuel-input');
    const editNcbInput = document.getElementById('edit-ncb-input');
    const editExpiryInput = document.getElementById('edit-expiry-input');

    // Display Elements
    const dispModel = document.getElementById('vehicle-model');
    const dispFuel = document.getElementById('vehicle-fuel');
    const dispNcb = document.getElementById('vehicle-ncb');
    const dispExpiry = document.getElementById('vehicle-expiry');

    if (editBtn && modal) {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';

            // Pre-fill with current display values
            editRegInput.value = localStorage.getItem('bike_reg_no') || regNoElement.textContent;
            editModelInput.value = dispModel.textContent;
            editFuelInput.value = dispFuel.textContent;

            // Clean NCB value
            let ncbVal = dispNcb.textContent.split(' ')[0];
            editNcbInput.value = ncbVal;

            editExpiryInput.value = dispExpiry.textContent;
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

            // Capture New Values
            const newReg = editRegInput.value.toUpperCase();
            const newModel = editModelInput.value;
            const newFuel = editFuelInput.value;
            const newNcb = editNcbInput.value;
            const newExpiry = editExpiryInput.value;

            if (newReg) {
                // Save to LocalStorage
                localStorage.setItem('bike_reg_no', newReg);

                // Update UI
                regNoElement.textContent = newReg;
                dispModel.textContent = newModel;
                dispFuel.textContent = newFuel;
                dispNcb.textContent = `${newNcb} (Yes)`;
                dispExpiry.textContent = newExpiry;

                if (newExpiry === 'Expired') dispExpiry.style.color = '#dc3545';
                else dispExpiry.style.color = '#e31e24';

                modal.style.display = 'none';
            }
        });
    }
});
