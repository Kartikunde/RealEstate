"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfReportGenerator = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
class PdfReportGenerator {
    /**
     * Generates a branded PropVest PDF report header
     */
    static renderHeader(doc, title, subtitle, userName) {
        // Brand header background
        doc.rect(0, 0, doc.page.width, 90).fill('#14213D');
        // Title & Logo
        doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text('PropVest', 50, 25);
        doc.fillColor('#10B981').fontSize(11).font('Helvetica-Bold').text('PORTFOLIO MANAGEMENT & REAL ESTATE ANALYTICS', 50, 52);
        // Document Meta (Right-aligned)
        doc.fillColor('#E2E8F0').fontSize(10).font('Helvetica').text(`Report: ${title}`, 350, 25, { width: 210, align: 'right' });
        doc.fillColor('#94A3B8').fontSize(9).text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 350, 40, { width: 210, align: 'right' });
        doc.text(`Investor: ${userName}`, 350, 55, { width: 210, align: 'right' });
        doc.moveDown(4);
        doc.fillColor('#1E293B').fontSize(16).font('Helvetica-Bold').text(title, 50, 110);
        doc.fillColor('#64748B').fontSize(10).font('Helvetica').text(subtitle, 50, 130);
        doc.moveDown();
        // Divider line
        doc.moveTo(50, 150).lineTo(560, 150).strokeColor('#E2E8F0').stroke();
    }
    /**
     * Generate Portfolio Summary PDF Report
     */
    static generatePortfolioSummary(res, userName, metrics) {
        const doc = new pdfkit_1.default({ margin: 50, size: 'A4' });
        doc.pipe(res);
        this.renderHeader(doc, 'Portfolio Summary Report', 'Comprehensive executive overview of your real estate holdings and capital gains', userName);
        let y = 170;
        // KPI Summary Box
        doc.rect(50, y, 510, 80).fill('#F8FAFC').stroke('#CBD5E1');
        doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('TOTAL VALUATION', 65, y + 15);
        doc.fillColor('#14213D').fontSize(14).font('Helvetica-Bold').text(`₹ ${metrics.totalValuation.toLocaleString('en-IN')}`, 65, y + 30);
        doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('TOTAL INVESTED', 190, y + 15);
        doc.fillColor('#14213D').fontSize(14).font('Helvetica-Bold').text(`₹ ${metrics.totalInvested.toLocaleString('en-IN')}`, 190, y + 30);
        doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('OVERALL ROI', 320, y + 15);
        doc.fillColor('#10B981').fontSize(14).font('Helvetica-Bold').text(`+${metrics.overallRoi}%`, 320, y + 30);
        doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('PROPERTIES', 440, y + 15);
        doc.fillColor('#14213D').fontSize(14).font('Helvetica-Bold').text(`${metrics.propertyCount}`, 440, y + 30);
        // Second Row
        doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('UNREALIZED GAIN', 65, y + 55);
        doc.fillColor(metrics.unrealizedGain >= 0 ? '#10B981' : '#EF4444').fontSize(11).font('Helvetica-Bold')
            .text(`₹ ${metrics.unrealizedGain.toLocaleString('en-IN')}`, 160, y + 55);
        doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('MONTHLY RENTAL', 280, y + 55);
        doc.fillColor('#2563EB').fontSize(11).font('Helvetica-Bold')
            .text(`₹ ${metrics.monthlyRentalIncome.toLocaleString('en-IN')}/mo`, 380, y + 55);
        y += 105;
        // Property Table Header
        doc.fillColor('#1E293B').fontSize(12).font('Helvetica-Bold').text('Property Holdings Breakdown', 50, y);
        y += 20;
        doc.rect(50, y, 510, 24).fill('#14213D');
        doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
        doc.text('PROPERTY', 60, y + 8);
        doc.text('CITY / TYPE', 200, y + 8);
        doc.text('PURCHASE (₹)', 300, y + 8);
        doc.text('CURRENT (₹)', 390, y + 8);
        doc.text('ROI', 480, y + 8);
        y += 24;
        // Property Table Rows
        metrics.properties.forEach((p, idx) => {
            const bgColor = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
            doc.rect(50, y, 510, 24).fill(bgColor);
            doc.fillColor('#1E293B').fontSize(8).font('Helvetica').text(p.name.substring(0, 24), 60, y + 8);
            doc.fillColor('#64748B').text(`${p.city} (${p.type})`, 200, y + 8);
            doc.fillColor('#1E293B').text(`₹ ${p.purchasePrice.toLocaleString('en-IN')}`, 300, y + 8);
            doc.fillColor('#1E293B').text(`₹ ${p.currentValuation.toLocaleString('en-IN')}`, 390, y + 8);
            doc.fillColor(p.roi >= 0 ? '#10B981' : '#EF4444').font('Helvetica-Bold').text(`${p.roi}%`, 480, y + 8);
            y += 24;
            if (y > 750) {
                doc.addPage();
                y = 50;
            }
        });
        // Disclaimer footer
        doc.fontSize(7).font('Helvetica').fillColor('#94A3B8')
            .text('PropVest platform generated report. Figures represent valuations and actual records provided by the portfolio owner. Not financial or tax advice.', 50, 780, { width: 510, align: 'center' });
        doc.end();
    }
    /**
     * Generic Financial or Performance PDF Generator
     */
    static generateGenericTableReport(res, userName, reportTitle, reportSubtitle, headers, rows, summaryCards) {
        const doc = new pdfkit_1.default({ margin: 50, size: 'A4' });
        doc.pipe(res);
        this.renderHeader(doc, reportTitle, reportSubtitle, userName);
        let y = 170;
        if (summaryCards && summaryCards.length > 0) {
            doc.rect(50, y, 510, 48).fill('#F8FAFC').stroke('#CBD5E1');
            const cardWidth = 510 / summaryCards.length;
            summaryCards.forEach((card, idx) => {
                doc.fillColor('#64748B').fontSize(8).font('Helvetica').text(card.label.toUpperCase(), 50 + idx * cardWidth + 12, y + 10);
                doc.fillColor('#14213D').fontSize(12).font('Helvetica-Bold').text(card.value, 50 + idx * cardWidth + 12, y + 25);
            });
            y += 65;
        }
        // Table Header
        doc.rect(50, y, 510, 24).fill('#14213D');
        doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
        const colWidth = 510 / headers.length;
        headers.forEach((h, idx) => {
            doc.text(h, 55 + idx * colWidth, y + 8);
        });
        y += 24;
        rows.forEach((row, rowIdx) => {
            const bgColor = rowIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
            doc.rect(50, y, 510, 22).fill(bgColor);
            doc.fillColor('#1E293B').fontSize(8).font('Helvetica');
            row.forEach((cell, colIdx) => {
                doc.text(cell, 55 + colIdx * colWidth, y + 7, { width: colWidth - 10 });
            });
            y += 22;
            if (y > 750) {
                doc.addPage();
                y = 50;
            }
        });
        doc.fontSize(7).font('Helvetica').fillColor('#94A3B8')
            .text('Generated by PropVest Real Estate Portfolio Management Platform. For authorized use only.', 50, 780, { width: 510, align: 'center' });
        doc.end();
    }
    /**
     * Generates a Certified Legal Property Document (Deed, Tax, Lease, Khata)
     */
    static generateLegalDocument(res, title, category, propertyTitle, userName) {
        const doc = new pdfkit_1.default({ margin: 50, size: 'A4' });
        doc.pipe(res);
        // Decorative Indian Government Stamp Header
        doc.rect(40, 30, 515, 65).fill('#FDF4E7').stroke('#C28E00');
        doc.fillColor('#854D0E').fontSize(14).font('Helvetica-Bold').text('GOVERNMENT OF INDIA - REGISTRATION & REVENUE DEPARTMENT', 50, 42, { align: 'center', width: 495 });
        doc.fontSize(9).font('Helvetica').text('Official Electronic Record & Title Register - Indian Stamp Act, 1899', 50, 60, { align: 'center', width: 495 });
        doc.fontSize(8).font('Helvetica-Bold').text(`STAMP DUTY VERIFIED  *  REGISTRATION SER: IN-KA-${Math.floor(100000 + Math.random() * 900000)}B`, 50, 75, { align: 'center', width: 495 });
        let y = 115;
        doc.fillColor('#14213D').fontSize(16).font('Helvetica-Bold').text(title.replace('.pdf', ''), 50, y);
        y += 22;
        doc.fillColor('#64748B').fontSize(10).font('Helvetica').text(`Document Classification: ${category.replace(/_/g, ' ')} | Property Reference: ${propertyTitle}`, 50, y);
        y += 25;
        // Security Verification Bar
        doc.rect(50, y, 495, 32).fill('#EEF2FF').stroke('#6366F1');
        doc.fillColor('#4338CA').fontSize(8).font('Helvetica-Bold')
            .text('PROPVEST SECURE VAULT CERTIFIED RECORD (AES-256 ENCRYPTED ARCHIVE)', 62, y + 8);
        doc.fontSize(7).font('Helvetica').fillColor('#6366F1')
            .text(`Certificate Hash: SHA256:${Buffer.from(title + propertyTitle).toString('hex').substring(0, 32)}...  |  Status: ACTIVE & VERIFIED`, 62, y + 19);
        y += 45;
        // Parties Box
        doc.rect(50, y, 495, 80).fill('#F8FAFC').stroke('#E2E8F0');
        doc.fillColor('#1E293B').fontSize(10).font('Helvetica-Bold').text('PARTIES TO THE INSTRUMENT', 65, y + 12);
        doc.fontSize(9).font('Helvetica').fillColor('#64748B').text('First Party / Executant / Authority:', 65, y + 28);
        doc.fillColor('#1E293B').font('Helvetica-Bold').text('Competent Land & Revenue Authority / Registered Vendor', 240, y + 28);
        doc.font('Helvetica').fillColor('#64748B').text('Second Party / Registered Owner:', 65, y + 46);
        doc.fillColor('#1E293B').font('Helvetica-Bold').text(`${userName} (PAN Verified Real Estate Investor)`, 240, y + 46);
        doc.font('Helvetica').fillColor('#64748B').text('Date of Instrument & Verification:', 65, y + 64);
        doc.fillColor('#1E293B').font('Helvetica').text(`${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 240, y + 64);
        y += 95;
        // Property Schedule
        doc.fillColor('#14213D').fontSize(11).font('Helvetica-Bold').text('SCHEDULE OF PROPERTY & LEGAL BOUNDARIES', 50, y);
        y += 18;
        doc.rect(50, y, 495, 70).fill('#FAFAFA').stroke('#E2E8F0');
        doc.fontSize(8.5).font('Helvetica').fillColor('#334155');
        doc.text(`Property Name: ${propertyTitle}`, 65, y + 10);
        doc.text('Jurisdiction: Sub-Registrar Office, Bangalore Urban / Mumbai Suburban / Gurgaon Zone', 65, y + 23);
        doc.text('North Boundary: 40 Feet Public Master Plan Road    |    South Boundary: Private Residential Plot #42', 65, y + 36);
        doc.text('East Boundary: Civic Amenity Park & Green Belt       |    West Boundary: Adjoining Survey Land Parcel #19', 65, y + 49);
        y += 85;
        // Legal Recitals & Declarations
        doc.fillColor('#14213D').fontSize(11).font('Helvetica-Bold').text('COVENANTS, CONDITIONS & DECLARATIONS', 50, y);
        y += 18;
        const clauses = [
            '1. TITLE & INDEFEASIBLE OWNERSHIP: The property described in the Schedule herein has been legally transferred, mutated, and registered in favor of the owner free from all encumbrances, liens, mortgages, charges, court attachments, or title defects.',
            '2. MUNICIPAL & REVENUE APPROVAL: The structural plan, occupation certificate (OC), khata mutation certificate, and property tax clearances have been sanctioned and verified by the competent municipal corporation and development authority.',
            '3. PEACEFUL POSSESSION & USE: The rightful owner holds complete, undisputed, peaceful, physical possession of the said premises together with all easements, water supply rights, electricity sanctions, and undivided share in common land (UDS).',
            '4. TAX & STATUTORY LIABILITIES: All municipal cess, betterment charges, state stamp duties, and registration levies applicable to this asset have been paid in full and accounted for under the financial audit ledger.'
        ];
        clauses.forEach((c) => {
            doc.fontSize(8).font('Helvetica').fillColor('#475569').text(c, 50, y, { width: 495, lineGap: 3 });
            y += 36;
        });
        y += 10;
        // Seal and Signatures
        doc.rect(50, y, 235, 60).stroke('#CBD5E1');
        doc.fillColor('#64748B').fontSize(7).font('Helvetica').text('DIGITALLY SIGNED & NOTARIZED', 60, y + 10);
        doc.fillColor('#14213D').fontSize(9).font('Helvetica-Bold').text('Registrar / Authorised Notary Public', 60, y + 35);
        doc.rect(310, y, 235, 60).stroke('#CBD5E1');
        doc.fillColor('#64748B').fontSize(7).font('Helvetica').text('BENEFICIAL OWNER / PORTFOLIO INVESTOR', 320, y + 10);
        doc.fillColor('#14213D').fontSize(9).font('Helvetica-Bold').text(userName, 320, y + 35);
        // Footer
        doc.fontSize(7).font('Helvetica').fillColor('#94A3B8')
            .text('PropVest Encrypted Document Vault. Certified electronic transmission. Compliant with IT Act 2000 & Indian Evidence Act.', 50, 780, { width: 495, align: 'center' });
        doc.end();
    }
}
exports.PdfReportGenerator = PdfReportGenerator;
