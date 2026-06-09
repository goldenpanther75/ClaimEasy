const travelPlansData = [
    {
        id: 1,
        provider: 'ClaimEasy',
        logoColor: '#6f42c1',
        logoIcon: 'fa-plane',
        sumInsured: '₹ 50 Lakhs',
        visaType: 'Tourist',
        features: ['Medical Expenses', 'Trip Cancellation'],
        premium: 950
    },
    {
        id: 2,
        provider: 'ClaimEasy',
        logoColor: '#e31e24',
        logoIcon: 'fa-passport',
        sumInsured: '₹ 1 Crore',
        visaType: 'Tourist',
        features: ['Baggage Loss', 'Flight Delay'],
        premium: 1200
    },
    {
        id: 3,
        provider: 'ClaimEasy',
        logoColor: '#f37021',
        logoIcon: 'fa-globe-americas',
        sumInsured: '₹ 2 Crores',
        visaType: 'Business',
        features: ['Medical Evacuation', 'Adventure Sports'],
        premium: 2500
    },
    {
        id: 4,
        provider: 'ClaimEasy',
        logoColor: '#f9b92e',
        logoIcon: 'fa-suitcase-rolling',
        sumInsured: '₹ 3 Crores',
        visaType: 'Student',
        features: ['Study Interruption', 'Sponsor Protection'],
        premium: 1500
    },
    {
        id: 5,
        provider: 'ClaimEasy',
        logoColor: '#0056b3',
        logoIcon: 'fa-plane-departure',
        sumInsured: '₹ 4 Crores',
        visaType: 'Tourist',
        features: ['Covid-19 Cover', 'Pre-existing Disease'],
        premium: 3200
    },

];

const container = document.getElementById('travel-plans-container');
const planCountElem = document.getElementById('plan-count');

function renderTravelPlans(plans = travelPlansData) {
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
            <p style="font-size: 1.5rem; font-weight: bold; color: #555; text-align: center; max-width: 600px;">We couldn't find any Travel Insurance plans matching your filters${budgetMsg}.</p>
            <a href="travel_comparison.html" style="margin-top: 40px; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; background: #0065ff; color: white; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 101, 255, 0.4);">View All Plans</a>
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
                <span style="font-size:0.85rem; color:#666; background:#eee; padding:2px 8px; border-radius:4px;">${plan.visaType} Visa</span>
            </div>
            <div>
                <span style="display:block; font-size:0.8rem; color:#888;">Sum Insured</span>
                <strong style="font-size:1.1rem; color:#333;">${plan.sumInsured}</strong>
            </div>
            <div class="plan-features">
                 <ul aria-label="Plan Features">
                    ${plan.features.map(f => `<li><i class="fas fa-check" aria-hidden="true"></i> ${f}</li>`).join('')}
                 </ul>
                 <span class="discount-tag">15 Days Trip</span>
            </div>
            <div style="text-align:right;">
                <div class="premium-price" aria-label="Premium: ₹ ${plan.premium}">₹ ${plan.premium}</div>
                <button onclick="buyTravelPlan(${plan.id})" class="btn btn-primary" style="margin-top:10px; width:100%;" aria-label="Buy ${plan.provider} plan for ₹ ${plan.premium}">Buy Now</button>
            </div>
        `;

        container.appendChild(card);
    });
}

function buyTravelPlan(id) {
    const selectedPlan = travelPlansData.find(plan => plan.id === id);
    if (selectedPlan) {
        localStorage.setItem('selected_travel_plan', JSON.stringify(selectedPlan));
        window.location.href = 'travel_application_form.html';
    } else {
        alert('Error selecting plan.');
    }
}

// Filters and Sort Logic
function filterAndSortPlans() {
    const sortValue = document.getElementById('sort-select').value;
    const sumInsured = document.getElementById('sum-insured-filter').value; // 50k, 100k
    const visaType = document.getElementById('visa-type-filter').value;
    const adventure = document.getElementById('adventure-sports').checked;
    const preExisting = document.getElementById('pre-existing').checked;

    const urlParams = new URLSearchParams(window.location.search);
    const maxBudget = urlParams.get('budget');

    let filtered = travelPlansData.filter(plan => {
        // Filter by Budget
        if (maxBudget && plan.premium > parseInt(maxBudget, 10)) {
            return false;
        }

        // Sum Insured Filter
        let normalizedPlanSI = '';
        if (plan.sumInsured.includes('50 Lakhs')) normalizedPlanSI = '50L';
        else if (plan.sumInsured.includes('1 Crore')) normalizedPlanSI = '1Cr';
        else if (plan.sumInsured.includes('2 Crores')) normalizedPlanSI = '2Cr';
        else if (plan.sumInsured.includes('3 Crores')) normalizedPlanSI = '3Cr';
        else if (plan.sumInsured.includes('4 Crores')) normalizedPlanSI = '4Cr';

        if (sumInsured !== 'All' && sumInsured !== normalizedPlanSI && normalizedPlanSI !== '') {
            if (sumInsured !== normalizedPlanSI) return false;
        }

        // Visa Type
        if (visaType !== 'All' && visaType !== plan.visaType) {
            if (plan.visaType !== visaType) return false;
        }

        // Checkboxes
        if (adventure) {
            if (!plan.features.some(f => f.includes('Adventure'))) return false;
        }
        if (preExisting) {
            if (!plan.features.some(f => f.includes('Pre-existing'))) return false;
        }

        return true;
    });

    // Sort
    if (sortValue === 'price-low') {
        filtered.sort((a, b) => a.premium - b.premium);
    } else if (sortValue === 'relevance') {
        filtered.sort((a, b) => a.id - b.id);
    }

    renderTravelPlans(filtered);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    filterAndSortPlans();

    // Attach Listeners
    document.getElementById('sort-select').addEventListener('change', filterAndSortPlans);
    document.getElementById('sum-insured-filter').addEventListener('change', filterAndSortPlans);
    document.getElementById('visa-type-filter').addEventListener('change', filterAndSortPlans);
    document.getElementById('adventure-sports').addEventListener('change', filterAndSortPlans);
    document.getElementById('pre-existing').addEventListener('change', filterAndSortPlans);

    // Header Logic
    const destElem = document.getElementById('trip-dest');
    const startElem = document.getElementById('trip-dates'); // Fix: trip-dates is combined text in HTML

    // Other elems
    const travElem = document.getElementById('trip-travellers');
    const ageElem = document.getElementById('trip-age');

    const storedDest = localStorage.getItem('travel_destination');
    const storedStart = localStorage.getItem('travel_start_date');

    if (storedDest) destElem.textContent = storedDest;
    if (storedStart) startElem.textContent = storedStart;

    // Modal Logic
    const editBtn = document.getElementById('edit-trip-btn');
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('close-edit-modal');
    const editForm = document.getElementById('edit-trip-form');

    const editDest = document.getElementById('edit-dest-input');
    const editStart = document.getElementById('edit-start-input');
    const editEnd = document.getElementById('edit-end-input');


    if (editBtn && modal) {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';

            // Prefill
            editDest.value = destElem.textContent;
            
            // Sync end date min value
            editStart.addEventListener('change', () => {
                if (editStart.value) {
                    editEnd.setAttribute('min', editStart.value);
                    if (editEnd.value && editEnd.value < editStart.value) {
                        editEnd.value = editStart.value;
                    }
                }
            });
        });

        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            destElem.textContent = editDest.value;
            // Format dates for display
            const startStr = ClaimEasyDates.format(editStart.value);
            const endStr = ClaimEasyDates.format(editEnd.value);
            startElem.textContent = `${startStr} - ${endStr}`;

            modal.style.display = 'none';
        });
    }
});
