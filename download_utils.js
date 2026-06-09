/**
 * Generates and downloads a beautifully styled PDF policy summary.
 * Uses jsPDF library.
 * @param {string} policyType - The type of insurance (e.g., 'Car', 'Health').
 * @param {object} planData - The selected plan object.
 * @param {object} userData - The user/proposer details object.
 */
function downloadPolicyDetails(policyType, planData, userData) {
    if (typeof window.jspdf === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = () => {
            generatePDF(policyType, planData, userData);
        };
        document.head.appendChild(script);
    } else {
        generatePDF(policyType, planData, userData);
    }
}

function generatePDF(policyType, planData, userData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    // settings
    const brandColor = [0, 101, 255]; // #0065ff
    const secondaryColor = [255, 87, 34]; // #ff5722
    const darkText = [51, 51, 51];
    const lightText = [100, 100, 100];

    let yPos = 0;

    // --- 1. Brand Header with Logo ---
    doc.setFillColor(...brandColor);
    doc.rect(0, 0, 210, 40, 'F'); // Top bar

    // Logo (Simulated Vector Shield)
    doc.setFillColor(255, 255, 255);
    doc.circle(25, 20, 12, 'F');
    doc.setTextColor(...brandColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CE", 20.5, 22); // ClaimEasy Initials

    // Company Name & Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("ClaimEasy", 42, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Insurance Simplified", 42, 24);

    // Document Title (Right Aligned)
    doc.setFontSize(14);
    doc.text("Application Summary", 190, 20, { align: "right" });

    yPos = 50;

    // --- 2. Meta Info ---
    doc.setFontSize(10);
    doc.setTextColor(...lightText);
    doc.text(`Generated On: ${date}`, 20, yPos);
    doc.text(`Policy Type: ${policyType} Insurance`, 190, yPos, { align: "right" });

    yPos += 15;

    // --- Helper Function for Sections ---
    const drawSectionHeader = (title, y) => {
        doc.setFillColor(245, 247, 250);
        doc.rect(15, y - 6, 180, 10, 'F'); // Background strip
        doc.setFontSize(12);
        doc.setFont("times", "bold");
        doc.setTextColor(...brandColor);
        doc.text(title.toUpperCase(), 20, y);
        return y + 15;
    };

    // --- 3. Plan Details ---
    if (planData) {
        yPos = drawSectionHeader("Plan Selection", yPos);
        doc.setTextColor(...darkText);
        doc.setFontSize(10);
        doc.setFont("times", "normal");

        const planKeys = Object.keys(planData);
        let col = 0;
        let startY = yPos;

        planKeys.forEach((key, index) => {
            // Formatting Keys
            let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            let value = planData[key] ? planData[key].toString() : 'N/A';

            // 2 Column Layout
            let x = (col === 0) ? 20 : 110;

            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, x, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(value, x + 40, yPos);

            if (col === 1) {
                col = 0;
                yPos += 8;
            } else {
                col = 1;
            }
        });
        if (col === 1) yPos += 8; // Reset if ended on odd
        yPos += 10;
    }

    // --- 4. Applicant Details ---
    if (userData) {
        // Page break check
        if (yPos > 220) {
            doc.addPage();
            yPos = 30;
        }

        yPos = drawSectionHeader("Applicant & Vehicle Details", yPos);
        doc.setTextColor(...darkText);
        doc.setFont("times", "normal");

        // Map keys to readable labels (Expanded List)
        const fieldMap = {
            'regNumber': 'Registration No',
            'carMake': 'Manufacturer',
            'carModel': 'Model',
            'bikeMake': 'Manufacturer',
            'bikeModel': 'Model',
            'regDate': 'Reg. Date',
            'engineNumber': 'Engine No',
            'chassisNumber': 'Chassis No',
            'pucNumber': 'PUC No',
            'pucExpiry': 'PUC Expiry',
            'licenseNumber': 'License No',
            'panNumber': 'PAN Card',
            'height': 'Height (cm)',
            'weight': 'Weight (kg)',
            'annualIncome': 'Annual Income',
            'maritalStatus': 'Marital Status',
            'propertyAge': 'Building Age',
            'propertyType': 'Property Type',
            'securityGuards': '24x7 Security',
            'cctv': 'CCTV',
            'visaType': 'Visa Type',
            'tripDuration': 'Trip Days (Duration)',
            'passport': 'Passport No',
            'dob': 'Date of Birth',
            'email': 'Email ID',
            'mobile': 'Mobile No',
            'ownerName': 'Full Name',
            'address': 'Address',
            'pincode': 'Pincode',
            'city': 'City',
            'nomineeName': 'Nominee Name',
            'tobacco': 'Tobacco User',
            'occupation': 'Occupation'
        };

        const ignoreKeys = ['type', 'premium', 'status'];
        let col = 0;

        Object.entries(userData).forEach(([key, value]) => {
            if (ignoreKeys.includes(key)) return;

            // Page break check inside loop
            if (yPos > 270) {
                doc.addPage();
                yPos = 30;
            }

            const label = fieldMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const valStr = value ? value.toString() : 'N/A';

            let x = (col === 0) ? 20 : 110;

            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, x, yPos);
            doc.setFont("helvetica", "normal");

            // Simple truncation/wrap for long values
            if (valStr.length > 25) {
                doc.text(valStr.substring(0, 25) + '...', x + 40, yPos);
            } else {
                doc.text(valStr, x + 40, yPos);
            }

            if (col === 1) {
                col = 0;
                yPos += 8;
            } else {
                col = 1;
            }
        });
        if (col === 1) yPos += 8;
    }

    // --- Footer ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(200);
    doc.line(10, pageHeight - 15, 200, pageHeight - 15);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("ClaimEasy Insurance Services | www.claimeasy.com | Support: 1800-123-4567", 105, pageHeight - 10, { align: "center" });

    // Save
    doc.save(`ClaimEasy_${policyType}_Summary.pdf`);
}
