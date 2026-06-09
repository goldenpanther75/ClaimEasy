const homePlansData = [
    {
        id: 1,
        provider: 'ClaimEasy',
        logoColor: '#6f42c1',
        logoIcon: 'fa-home',
        sumInsured: '₹ 50 Lakhs',
        coverType: 'Structure + Content',
        features: ['Fire & Theft', 'Natural Calamities'],
        premium: 2500,
        tenure: 5
    },
    {
        id: 2,
        provider: 'ClaimEasy',
        logoColor: '#e31e24',
        logoIcon: 'fa-building',
        sumInsured: '₹ 1 Crore',
        coverType: 'Structure + Content',
        features: ['Fire & Theft', 'Natural Calamities'],
        premium: 1800,
        tenure: 1
    },
    {
        id: 3,
        provider: 'ClaimEasy',
        logoColor: '#f37021',
        logoIcon: 'fa-house-user',
        sumInsured: '₹ 2 Crores',
        coverType: 'Structure Only',
        features: ['Fire Only', 'Terrorism Cover'],
        premium: 4500,
        tenure: 3
    },
    {
        id: 4,
        provider: 'ClaimEasy',
        logoColor: '#f9b92e',
        logoIcon: 'fa-couch',
        sumInsured: '₹ 3 Crores',
        coverType: 'Structure + Content',
        features: ['Burglary Cover', 'Electrical Breakdown'],
        premium: 1200,
        tenure: 1
    },
    {
        id: 5,
        provider: 'ClaimEasy',
        logoColor: '#0056b3',
        logoIcon: 'fa-dungeon',
        sumInsured: '₹ 6 Crores',
        coverType: 'Structure + Content',
        features: ['Rent for Alt. Acc.', 'Debris Removal'],
        premium: 2800,
        tenure: 5
    },

];

const container = document.getElementById('home-plans-container');
const planCountElem = document.getElementById('plan-count');

function renderHomePlans(plans = homePlansData) {
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
            <p style="font-size: 1.5rem; font-weight: bold; color: #555; text-align: center; max-width: 600px;">We couldn't find any Home Insurance plans matching your filters${budgetMsg}.</p>
            <a href="home_comparison.html" style="margin-top: 40px; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; background: #0065ff; color: white; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 15px rgba(0, 101, 255, 0.4);">View All Plans</a>
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
                <span style="display:block; font-size:0.8rem; color:#888;">Sum Insured</span>
                <strong style="font-size:1.1rem; color:#333;">${plan.sumInsured}</strong>
            </div>
            <div class="plan-features">
                 <ul aria-label="Plan Features">
                    ${plan.features.map(f => `<li><i class="fas fa-check" aria-hidden="true"></i> ${f}</li>`).join('')}
                 </ul>
                 <span class="discount-tag">${plan.tenure} Year Plan</span>
            </div>
            <div style="text-align:right;">
                <div class="premium-price" aria-label="Premium: ₹ ${plan.premium.toLocaleString()}">₹ ${plan.premium.toLocaleString()}</div>
                <button onclick="buyHomePlan(${plan.id})" class="btn btn-primary" style="margin-top:10px; width:100%;" aria-label="Buy ${plan.provider} plan for ₹ ${plan.premium}">Buy Now</button>
            </div>
        `;

        container.appendChild(card);
    });
}

function buyHomePlan(id) {
    const selectedPlan = homePlansData.find(plan => plan.id === id);
    if (selectedPlan) {
        localStorage.setItem('selected_home_plan', JSON.stringify(selectedPlan));
        window.location.href = 'home_application_form.html';
    } else {
        alert('Error selecting plan.');
    }
}

// Filters and Sort Logic
function filterAndSortPlans() {
    const sortValue = document.getElementById('sort-select').value;
    const sumInsured = document.getElementById('sum-insured-filter').value; // 20L, 50L, 1Cr
    const tenure = document.getElementById('tenure-filter').value; // 1, 3, 5
    const burglary = document.getElementById('burglary-cover').checked;
    // const natural = document.getElementById('natural-calamity').checked;

    const urlParams = new URLSearchParams(window.location.search);
    const maxBudget = urlParams.get('budget');

    let filtered = homePlansData.filter(plan => {
        // Filter by Budget
        if (maxBudget && plan.premium > parseInt(maxBudget, 10)) {
            return false;
        }

        // Sum Insured Filter
        // Parse plan.sumInsured to match filter value
        // Plan: "₹ 50 Lakhs", Filter: "50L"
        let planSI = plan.sumInsured.replace('₹ ', '').replace(' Lakhs', 'L').replace(' Crore', 'Cr');
        // Simple match or "All"
        // Actually, let's just do partial match or exact match if logic allows
        // Since my mock data is consistent, I can map keys
        // Sum Insured filter string matcher
        let normalizedPlanSI = '';
        if (plan.sumInsured.includes('1 Crore')) normalizedPlanSI = '1Cr';
        else if (plan.sumInsured.includes('2 Crores')) normalizedPlanSI = '2Cr';
        else if (plan.sumInsured.includes('3 Crores')) normalizedPlanSI = '3Cr';
        else if (plan.sumInsured.includes('4 Crores')) normalizedPlanSI = '4Cr';
        else if (plan.sumInsured.includes('6 Crores')) normalizedPlanSI = '6Cr';

        if (sumInsured !== 'All' && sumInsured !== normalizedPlanSI && normalizedPlanSI !== '') {
            // For now, if filter is selected, show only matching. 
            // But usually user wants >= Sum Insured. 
            // Let's simplified: Show exact match.
            if (sumInsured !== normalizedPlanSI) return false;
        }

        // Tenure Filter
        // Plan has numeric tenure. Filter has string "1", "3", "5"
        // Show plans with tenure >= filter? Or exact?
        // Let's do exact for simplicity in standardization
        // If filter is "1", show only 1 year plans? 
        // My mock data has 1, 3, 5, 10.
        // Let's make it >=. 
        if (parseInt(tenure) > plan.tenure) return false;

        // Burglary Coverage
        if (burglary) {
            if (!plan.features.some(f => f.includes('Theft') || f.includes('Burglary'))) return false;
        }

        return true;
    });

    // Sort
    if (sortValue === 'price-low') {
        filtered.sort((a, b) => a.premium - b.premium);
    } else if (sortValue === 'relevance') {
        // Default sort (id)
        filtered.sort((a, b) => a.id - b.id);
    }

    renderHomePlans(filtered);
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    filterAndSortPlans();

    // Attach Listeners
    document.getElementById('sort-select').addEventListener('change', filterAndSortPlans);
    document.getElementById('sum-insured-filter').addEventListener('change', filterAndSortPlans);
    document.getElementById('tenure-filter').addEventListener('change', filterAndSortPlans);
    document.getElementById('burglary-cover').addEventListener('change', filterAndSortPlans);
    document.getElementById('natural-calamity').addEventListener('change', filterAndSortPlans);

    // Header Logic
    const propValueElem = document.getElementById('property-value');
    const storedValue = localStorage.getItem('home_property_value');
    if (storedValue) propValueElem.textContent = storedValue;

    // Modal Logic
    const editBtn = document.getElementById('edit-property-btn');
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('close-edit-modal');
    const editForm = document.getElementById('edit-prop-form');

    const editType = document.getElementById('edit-type-input');
    const editLoc = document.getElementById('edit-loc-input');
    const editStruct = document.getElementById('edit-struct-input');
    const editCont = document.getElementById('edit-content-input');
    const editTenure = document.getElementById('edit-tenure-input');


    if (editBtn && modal) {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';

            // Prefill
            editType.value = typeElem.textContent; // Attempt match
            editLoc.value = locElem.textContent;
            editStruct.value = structElem.textContent;
            editCont.value = contElem.textContent;
            editTenure.value = tenureElem.textContent;
        });

        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Save to LocalStorage if needed, or just update UI
            // For complex fields, updating UI is primary here

            typeElem.textContent = editType.value;
            locElem.textContent = editLoc.value;
            structElem.textContent = editStruct.value;
            contElem.textContent = editCont.value;
            tenureElem.textContent = editTenure.value;

            modal.style.display = 'none';
        });
    }
});
