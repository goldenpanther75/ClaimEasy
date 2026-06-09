const PDFDocument = require('pdfkit');

/**
 * Generates a Policy Summary PDF and returns it as a Buffer.
 * @param {string} policyType 
 * @param {object} planData 
 * @param {object} userData 
 */
function generatePolicyPDF(policyType, planData, userData) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`[PDF] Generating for ${policyType}...`);
            const doc = new PDFDocument({ margin: 50 });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                console.log(`[PDF] Generation complete, buffer size: ${pdfData.length}`);
                resolve(pdfData);
            });

            // --- Header ---
            doc.fillColor('#0065ff')
               .rect(0, 0, 612, 100)
               .fill();
            
            doc.fillColor('white')
               .fontSize(24)
               .text('ClaimEasy Insurance', 50, 40);
            
            doc.fontSize(10)
               .text('Insurance Simplified | Policy Summary', 50, 70);

            doc.fillColor('black').moveDown(4);

            // --- Title ---
            doc.fontSize(18)
               .text(`${policyType} Insurance Application Summary`, { align: 'center' });
            
            doc.moveDown();
            doc.fontSize(10)
               .text(`Date: ${new Date().toLocaleString()}`, { align: 'right' });
            
            doc.moveDown();
            doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke('#eee');
            doc.moveDown();

            // --- Section: Plan Details ---
            doc.fillColor('#0065ff')
               .fontSize(14)
               .text('Plan Information', { underline: true });
            
            doc.fillColor('black')
               .fontSize(10)
               .moveDown(0.5);

            Object.entries(planData).forEach(([key, val]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                doc.font('Helvetica-Bold').text(`${label}: `, { continued: true })
                   .font('Helvetica').text(`${val}`);
            });

            doc.moveDown();

            // --- Section: Proposer Details ---
            doc.fillColor('#0065ff')
               .fontSize(14)
               .text('Proposer Details', { underline: true });
            
            doc.fillColor('black')
               .fontSize(10)
               .moveDown(0.5);

            const fieldMap = {
                ownerName: 'Full Name',
                email: 'Email ID',
                mobile: 'Mobile Number',
                regNumber: 'Vehicle Reg No',
                policyId: 'Policy Reference',
                destination: 'Destination',
                tripDuration: 'Trip Duration (Days)',
                visaType: 'Visa Type'
            };

            Object.entries(userData).forEach(([key, val]) => {
                if (key === 'status') return;
                const label = fieldMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                doc.font('Helvetica-Bold').text(`${label}: `, { continued: true })
                   .font('Helvetica').text(`${val || 'N/A'}`);
            });

            // --- Footer ---
            const footerY = doc.page.height - 70;
            doc.moveTo(50, footerY).lineTo(562, footerY).stroke('#eee');
            doc.fontSize(8)
               .fillColor('#999')
               .text('ClaimEasy Insurance Services | www.claimeasy.com | Support: 1800-123-4567', 50, footerY + 10, { align: 'center' });

            doc.end();
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = { generatePolicyPDF };
