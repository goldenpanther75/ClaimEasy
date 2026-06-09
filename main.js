document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Content Initialization ---
    async function initDynamicContent() {
        try {
            const res = await fetch('http://13.126.167.8:5000/api/config');
            if (!res.ok) return;
            const config = await res.json();

            // Apply Logo globally
            if (config.logoUrl) {
                const logos = document.querySelectorAll('.logo-img');
                logos.forEach(img => {
                    img.src = config.logoUrl;
                    img.style.display = 'block';
                });
                const logoTexts = document.querySelectorAll('.logo-text');
                logoTexts.forEach(txt => txt.style.display = 'none');
            }

            // Apply Hero Changes (if on homepage)
            if (config.heroConfig) {
                const heroCov = document.getElementById('dynamic-hero-coverage');
                const heroPrice = document.getElementById('dynamic-hero-price');
                if (heroCov && config.heroConfig.coverage) heroCov.innerText = config.heroConfig.coverage;
                if (heroPrice && config.heroConfig.price) heroPrice.innerText = config.heroConfig.price;
            }

            // Inject Custom Sections for current page
            if (config.customSections && config.customSections.length > 0) {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';

                config.customSections.forEach(section => {
                    if (section.targetPage === currentPage || section.targetPage === '*') {
                        const container = document.getElementById(section.containerId);
                        if (container) {
                            container.innerHTML = section.htmlContent;
                        }
                    }
                });
            }

        } catch (e) {
            console.error("Failed to load dynamic config", e);
        }
    }
    initDynamicContent();

    // --- Sticky Header Logic ---
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
            header.style.padding = '15px 0';
        }
    });

    // --- Mobile Menu ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');

    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });

    // --- Modal Logic (Quote & Calculator) ---
    const quoteModal = document.getElementById('quote-modal');
    const calcModal = document.getElementById('calc-modal');
    const openQuoteBtns = document.querySelectorAll('#open-quote-modal'); // Assuming multiple triggers eventually
    const closeButtons = document.querySelectorAll('.close-modal');
    const calcCards = document.querySelectorAll('.calc-card');

    function openModal(modal) {
        modal.style.display = 'flex';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    // Trigger Quote Modal
    if (openQuoteBtns) {
        openQuoteBtns.forEach(btn => {
            btn.addEventListener('click', () => openModal(quoteModal));
        });
    }

    // Trigger Calculator Modal
    if (calcCards) {
        calcCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const type = card.dataset.type;
                const title = card.querySelector('span').innerText;
                document.getElementById('calc-title').innerText = title;
                // Reset fields for demo
                document.getElementById('calc-output').innerText = '₹ 0';
                openModal(calcModal);
            });
        });
    }

    // Close Modals
    if (closeButtons) {
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                closeModal(e.target.closest('.modal-overlay'));
            });
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    // --- Calculator Logic (Simple Investment Estimation) ---
    const calcAmount = document.getElementById('calc-amount');
    const calcDuration = document.getElementById('calc-duration');
    const durationVal = document.getElementById('duration-val');
    const calcOutput = document.getElementById('calc-output');
    const calcBtn = document.getElementById('calc-btn');

    if (calcAmount && calcDuration && durationVal && calcOutput && calcBtn) {
        calcDuration.addEventListener('input', (e) => {
            durationVal.innerText = `${e.target.value} Years`;
        });

        calcBtn.addEventListener('click', () => {
            const p = parseFloat(calcAmount.value);
            const r = 0.12 / 12; // estimating 12% annual return
            const n = parseFloat(calcDuration.value) * 12;

            // SIP Formula: P × ({[1 + i]^n - 1} / i) × (1 + i)
            if (p > 0 && n > 0) {
                const fv = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
                calcOutput.innerText = `₹ ${Math.round(fv).toLocaleString()}`;
            } else {
                calcOutput.innerText = "Invalid Input";
            }
        });
    }

    // --- Promo Scroll Logic ---
    const promoWalk = 300; // scroll amount
    const scrollContainer = document.querySelector('.promo-cards-wrapper');
    const leftBtn = document.getElementById('scroll-left');
    const rightBtn = document.getElementById('scroll-right');

    if (scrollContainer && leftBtn && rightBtn) {
        leftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -promoWalk, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: promoWalk, behavior: 'smooth' });
        });
    }

    // --- Testimonial Carousel ---
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const cards = document.querySelectorAll('.testimonial-card');

    if (track && prevBtn && nextBtn && playPauseBtn && cards.length > 0) {
        let currentIndex = 0;
        let isPlaying = true;
        let intervalId;

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth + 20; // card width + gap (approx)
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        }

        function startAutoSlide() {
            intervalId = setInterval(nextSlide, 3000);
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }

        function stopAutoSlide() {
            clearInterval(intervalId);
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            if (isPlaying) { stopAutoSlide(); startAutoSlide(); } // Reset timer
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            if (isPlaying) { stopAutoSlide(); startAutoSlide(); }
        });

        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                stopAutoSlide();
            } else {
                startAutoSlide();
            }
        });

        // Initialize
        startAutoSlide();
    }

    // --- Payment Page Logic ---
    const timerElement = document.getElementById('timer');
    const paymentTabs = document.querySelectorAll('.tab-item');
    const paymentSections = document.querySelectorAll('.mode-section');
    const paySecurelyBtn = document.getElementById('pay-securely-btn');

    // 1. Session Timer
    if (timerElement) {
        let time = 15 * 60; // 15 minutes in seconds

        const updateTimer = () => {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;

            seconds = seconds < 10 ? '0' + seconds : seconds;
            timerElement.innerText = `${minutes}:${seconds}`;

            if (time > 0) {
                time--;
            } else {
                // Timer expired
                clearInterval(timerInterval);
                alert("Session Expired. Please refresh.");
            }
        };

        const timerInterval = setInterval(updateTimer, 1000);
        updateTimer(); // Initial call
    }

    // 2. Tab Switching
    if (paymentTabs.length > 0 && paymentSections.length > 0) {
        paymentTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                paymentTabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked
                tab.classList.add('active');

                // Hide all sections
                paymentSections.forEach(sec => sec.classList.remove('active'));

                // Show target section
                const targetId = tab.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    // 3. Bank Selection Logic
    const bankGrid = document.getElementById('bank-grid');
    const bankDropdown = document.getElementById('bank-dropdown');
    let selectedBank = null;

    if (bankGrid && bankDropdown && paySecurelyBtn) {
        // Grid Selection
        const bankOptions = bankGrid.querySelectorAll('.bank-option');
        bankOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Clear previous
                bankOptions.forEach(el => el.classList.remove('selected'));
                bankDropdown.value = ""; // Clear dropdown

                // Select new
                option.classList.add('selected');
                selectedBank = option.dataset.bank;
                paySecurelyBtn.innerText = `Pay Securely via ${selectedBank} ₹12,840`;
            });
        });

        // Dropdown Selection
        bankDropdown.addEventListener('change', (e) => {
            // Clear grid
            bankOptions.forEach(el => el.classList.remove('selected'));
            selectedBank = e.target.value;

            if (selectedBank) {
                paySecurelyBtn.innerText = `Pay Securely via ${selectedBank} ₹12,840`;
            } else {
                paySecurelyBtn.innerText = `Pay Securely ₹12,840`;
            }
        });

        paySecurelyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = paySecurelyBtn.innerText;
            paySecurelyBtn.innerText = "Processing...";

            setTimeout(() => { }, 300);
        });
    }

    // 6. Proposer Details Collapsible
    const coll = document.getElementsByClassName("collapsible");
    if (coll) {
        for (let i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                const content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    }

    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = quoteForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Processing...';
            btn.disabled = true;

            const formData = {
                type: 'Quick Quote',
                name: quoteForm.querySelector('input[type="text"]').value,
                mobile: quoteForm.querySelector('input[type="tel"]').value,
                status: 'Lead Generated'
            };

            try {
                const response = await fetch('http://13.126.167.8:5000/api/policies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Quote requested successfully! Our experts will call you shortly.');
                    closeModal(document.getElementById('quote-modal'));
                    quoteForm.reset();
                } else {
                    alert('Something went wrong. Please try again.');
                }
            } catch (error) {
                console.error(error);
                alert('Backend connection error.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // 7. Auto-fill User Data
    const autoFillUserData = () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        try {
            const user = JSON.parse(userStr);
            console.log("Auto-filling data for:", user.name);

            // Name Fields
            if (user.name) {
                document.querySelectorAll('input[placeholder*="name" i], input[placeholder*="Name" i], input[placeholder="Owner Name" i]').forEach(el => {
                    if (!el.value && el.type === 'text') el.value = user.name;
                });
            }

            // Mobile Fields
            if (user.phone) {
                document.querySelectorAll('input[placeholder*="mobile" i], input[placeholder*="Mobile" i], input[placeholder*="10-digit" i], input[type="tel"]').forEach(el => {
                    if (!el.value) el.value = user.phone;
                });
            }

            // Email Fields
            if (user.email) {
                document.querySelectorAll('input[placeholder*="email" i], input[placeholder*="name@example.com" i], input[type="email"]').forEach(el => {
                    if (!el.value) el.value = user.email;
                });
            }

            // DOB (Date fields in general forms)
            if (user.dob) {
                document.querySelectorAll('input[type="date"]').forEach(el => {
                    if (!el.value) el.value = user.dob;
                });
            }

            // Pincode
            if (user.address && user.address.pincode) {
                document.querySelectorAll('input[placeholder*="PIN" i], input[placeholder*="Pincode" i]').forEach(el => {
                    if (!el.value) el.value = user.address.pincode;
                });
            }

            // City
            if (user.address && user.address.city) {
                document.querySelectorAll('input[placeholder*="City" i]').forEach(el => {
                    if (!el.value) el.value = user.address.city;
                });
            }

        } catch (e) {
            console.error("Failed to parse user data for auto-fill", e);
        }
    };
    autoFillUserData();

    // --- Date Validation Initialization ---
    const validateField = (input) => {
        const type = input.getAttribute('data-date-type');
        const val = input.value;
        if (!val) return !input.hasAttribute('required');

        const isDob = type === 'dob' ||
            input.id.toLowerCase().includes('dob') ||
            (input.getAttribute('name') && input.getAttribute('name').toLowerCase().includes('dob')) ||
            (input.previousElementSibling && input.previousElementSibling.textContent.toLowerCase().includes('birth'));

        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        if (isDob) {
            const eighteenYrs = new Date();
            eighteenYrs.setFullYear(eighteenYrs.getFullYear() - 18);
            const limit = eighteenYrs.toISOString().split('T')[0];
            return val <= limit && val >= '1920-01-01';
        }
        if (type === 'future' || input.id.toLowerCase().includes('expiry') || input.id.toLowerCase().includes('puc')) return val >= today;
        if (type === 'past' || input.id.toLowerCase().includes('reg') || input.id.toLowerCase().includes('incident')) return val <= today;
        return true;
    };

    if (window.ClaimEasyDates && window.ClaimEasyDates.initConstraints) {
        window.ClaimEasyDates.initConstraints(validateField);
    }

    // --- Blockers ---
    document.addEventListener('click', function (e) {
        const target = e.target.closest('button, input[type="button"], input[type="submit"], .btn');
        if (target) {
            if (target.classList.contains('close-modal') || target.classList.contains('btn-outline')) return;
            if (window.ClaimEasyDates && window.ClaimEasyDates.checkAll && !window.ClaimEasyDates.checkAll()) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const firstInvalid = document.querySelector('.invalid-date');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            }
        }
    }, true);

    document.addEventListener('submit', function (e) {
        if (window.ClaimEasyDates && window.ClaimEasyDates.checkAll && !window.ClaimEasyDates.checkAll()) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);
});

// --- Global Date Utilities (Exposed Outside Listener) ---
window.ClaimEasyDates = {
    format: (dateSource) => {
        if (!dateSource) return 'N/A';
        const date = new Date(dateSource);
        if (isNaN(date)) return dateSource;
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    getPolicySchedule: (durationYears = 1) => {
        const start = new Date();
        const end = new Date();
        end.setFullYear(start.getFullYear() + Number(durationYears));
        end.setDate(end.getDate() - 1);
        return {
            start: start,
            end: end,
            formattedStart: window.ClaimEasyDates.format(start),
            formattedEnd: window.ClaimEasyDates.format(end),
            durationText: `${durationYears} Year${durationYears > 1 ? 's' : ''} Protection`
        };
    },
    initConstraints: function (validateField) {
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const setValidationError = (input, isValid) => {
            const existing = document.querySelector(`.tooltip-for-${input.id || 'unknown'}`);
            if (existing) existing.remove();
            if (isValid) {
                input.classList.remove('invalid-date');
            } else {
                input.classList.add('invalid-date');
                const tooltip = document.createElement('div');
                tooltip.className = `custom-date-tooltip tooltip-for-${input.id || 'unknown'}`;
                tooltip.innerHTML = `<div class="tooltip-icon"><i class="fas fa-exclamation"></i></div><div class="tooltip-text">please fill correct information.</div>`;
                document.body.appendChild(tooltip);
                const rect = input.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
                tooltip.classList.add('show');
            }
        };

        this.checkAll = () => {
            let allValid = true;
            document.querySelectorAll('input[type="date"]').forEach(input => {
                const isValid = validateField(input);
                setValidationError(input, isValid);
                if (!isValid) allValid = false;
            });
            return allValid;
        };

        document.querySelectorAll('input[type="date"]').forEach(input => {
            if (input.id.toLowerCase().includes('dob')) {
                const eighteenYrs = new Date();
                eighteenYrs.setFullYear(eighteenYrs.getFullYear() - 18);
                input.setAttribute('max', eighteenYrs.toISOString().split('T')[0]);
            } else if (input.id.toLowerCase().includes('reg')) {
                input.setAttribute('max', today);
            } else if (input.id.toLowerCase().includes('start')) {
                input.setAttribute('min', today);
            }
            ['input', 'change', 'blur'].forEach(evt => {
                input.addEventListener(evt, () => setValidationError(input, validateField(input)));
            });
        });
    }
};
