// In pdf-generator.js

async function generatePdfWithClone() {
    const downloadBtn = document.getElementById('download-pdf-btn');
    const originalContent = document.getElementById('report-content');
    if (!downloadBtn || !originalContent) return;

    const originalBtnText = downloadBtn.textContent;
    const savedData = JSON.parse(localStorage.getItem('hseReportData'));
    if (!savedData) {
        alert('No data found to generate PDF.');
        return;
    }

    // --- Step 1: Show loading state & Create off-screen container ---
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Preparing report...';

    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px'; // Position it off-screen
    printContainer.style.width = '1200px'; // Force a wide, desktop-like width

    const contentClone = originalContent.cloneNode(true);
    printContainer.appendChild(contentClone);
    document.body.appendChild(printContainer);

    try {
        // --- Step 2: Render charts in the off-screen clone with no animation ---
        // This gives us wide, high-quality chart instances
        const printChartInstances = renderAllCharts(contentClone, savedData, { animation: { duration: 0 } });

        // Give the browser a moment to paint the charts in the off-screen div
        await new Promise(resolve => setTimeout(resolve, 1000));

        downloadBtn.textContent = 'Building PDF...';

        // --- Step 3: Build the pdfmake document using the CLONED chart images ---
        const companyName = savedData.companyName || 'Company';
        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 90, 40, 60],
            header: {
                columns: [{ image: savedData.logo, width: 90, margin: [40, 20, 0, 0] }]
            },
            footer: (currentPage, pageCount) => ({
                text: `Page ${currentPage} of ${pageCount} | Prepared by: ${savedData.preparedBy}`,
                alignment: 'center',
                style: 'footer'
            }),
            content: [
                { text: 'HSE Visual Report', style: 'subHeader' },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] },
                {
                    columns: [
                        { table: { widths: ['*'], body: [[{ text: 'Total Man-hours', style: 'kpiTitle' }], [{ text: new Intl.NumberFormat().format(savedData.manhoursTotal), style: 'kpiNumber' }]] }, layout: 'noBorders', fillColor: '#f8f9fa' },
                        { table: { widths: ['*'], body: [[{ text: 'PTW Issued', style: 'kpiTitle' }], [{ text: savedData.ptwCount, style: 'kpiNumber' }]] }, layout: 'noBorders', fillColor: '#f8f9fa' },
                        { table: { widths: ['*'], body: [[{ text: 'HSE Drills', style: 'kpiTitle' }], [{ text: savedData.drills, style: 'kpiNumber' }]] }, layout: 'noBorders', fillColor: '#f8f9fa' },
                        { table: { widths: ['*'], body: [[{ text: 'HSE Campaigns', style: 'kpiTitle' }], [{ text: savedData.campaigns, style: 'kpiNumber' }]] }, layout: 'noBorders', fillColor: '#f8f9fa' }
                    ],
                    columnGap: 10,
                    style: 'kpiContainer'
                },
                {
                    columns: [
                        // Use images from the WIDE, off-screen charts
                        { image: printChartInstances.manpower.toBase64Image(), fit: [250, 250] },
                        { image: printChartInstances.training.toBase64Image(), fit: [250, 250] }
                    ],
                    columnGap: 15
                },
                { text: 'HSE Observations', style: 'tableTitle' },
                { image: printChartInstances.observations.toBase64Image(), width: 515 },
                { text: 'Incident Classification', style: 'tableTitle', pageBreak: 'before' },
                { image: printChartInstances.incidents.toBase64Image(), width: 515 },
                { text: 'Inspection Reports', style: 'tableTitle' },
                { image: printChartInstances.inspections.toBase64Image(), width: 515 },
            ],
            styles: {
                subHeader: { fontSize: 16, bold: true, alignment: 'center', margin: [0, 15, 0, 10] },
                tableTitle: { fontSize: 14, bold: true, margin: [0, 20, 0, 10], color: '#005A9C' },
                footer: { fontSize: 9, italics: true },
                kpiContainer: { margin: [0, 15, 0, 20] },
                kpiTitle: { fontSize: 10, bold: true, color: '#555', alignment: 'center', margin: [0, 5, 0, 2] },
                kpiNumber: { fontSize: 22, bold: true, color: '#005A9C', alignment: 'center', margin: [0, 2, 0, 5] },
            }
        };

        // --- Step 4: Create and download the PDF ---
        pdfMake.createPdf(docDefinition).download(`HSE Report - ${companyName}.pdf`);
    } catch (err) {
        console.error("PDF generation failed:", err);
        alert('An error occurred while generating the file.');
    } finally {
        // --- Step 5: IMPORTANT: Clean up and restore the page ---
        document.body.removeChild(printContainer); // Remove the off-screen element
        downloadBtn.disabled = false;
        downloadBtn.textContent = originalBtnText;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-pdf-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generatePdfWithClone);
    }
});