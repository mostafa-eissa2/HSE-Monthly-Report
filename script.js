// In script.js

let chartInstances = {}; // This will hold the instances of the VISIBLE charts

function getInputValue(id) {
    const element = document.getElementById(id);
    if (element === null) {
        console.error(`Error: Element with ID "${id}" was not found.`);
        return "0";
    }
    return element.value;
}

// THIS FUNCTION IS NOW MODIFIED TO RETURN THE CHART INSTANCES
function renderAllCharts(container, savedData, options = {}) {
    const companyName = savedData.companyName || 'Company';
    const subcontractor = 'Subcontractor';
    const finalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000 },
        ...options
    };

    Chart.defaults.font.family = 'Poppins';

    // Create a local object to hold the new instances
    const newInstances = {};

    newInstances.manpower = new Chart(container.querySelector('#manpowerChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: [companyName, subcontractor],
            datasets: [{ data: [savedData.manpowerCompany, savedData.manpowerSC], backgroundColor: ['#005A9C', '#00A3E0'], borderColor: '#ffffff', borderWidth: 2 }]
        },
        options: { ...finalOptions, animation: { ...finalOptions.animation, animateScale: true } }
    });

    newInstances.training = new Chart(container.querySelector('#trainingChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Induction Training', 'General Training'],
            datasets: [
                { label: companyName, data: [savedData.inductionCompany, savedData.trainingCompany], backgroundColor: '#005A9C' },
                { label: subcontractor, data: [savedData.inductionSC, savedData.trainingSC], backgroundColor: '#00A3E0' }
            ]
        },
        options: { ...finalOptions, scales: { y: { beginAtZero: true } } }
    });

    newInstances.observations = new Chart(container.querySelector('#observationsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Unsafe Act', 'Unsafe Condition', 'Environmental Impact'],
            datasets: [
                { label: companyName, data: [savedData.unsafeActCompany, savedData.unsafeConditionCompany, savedData.envImpactCompany], backgroundColor: '#2A9D8F' },
                { label: subcontractor, data: [savedData.unsafeActSC, savedData.unsafeConditionSC, savedData.envImpactSC], backgroundColor: '#E9C46A' }
            ]
        },
        options: { ...finalOptions, scales: { y: { beginAtZero: true } } }
    });

    newInstances.incidents = new Chart(container.querySelector('#incidentsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Fatality', 'LTI', 'Medical Treatment', 'First Aid', 'Env. Incident', 'Property Damage', 'Near Miss'],
            datasets: [
                { label: companyName, data: [savedData.fatalityCompany, savedData.ltiCompany, savedData.mtcCompany, savedData.firstAidCompany, savedData.envIncidentCompany, savedData.propDamageCompany, savedData.nearmissCompany], backgroundColor: '#E63946' },
                { label: subcontractor, data: [savedData.fatalitySC, savedData.ltiSC, savedData.mtcSC, savedData.firstAidSC, savedData.envIncidentSC, savedData.propDamageSC, savedData.nearmissSC], backgroundColor: '#F4A261' }
            ]
        },
        options: { ...finalOptions, indexAxis: 'y', scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });

    newInstances.inspections = new Chart(container.querySelector('#inspectionsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Hazard Reports', 'Observation Cards', 'Monthly Tours', 'Weekly Walk-Downs', 'Equipment Inspections', 'Internal Audits', 'External Audits'],
            datasets: [{ label: companyName, data: [savedData.hazardReport, savedData.observationCards, savedData.siteTour, savedData.walkDown, savedData.equipmentInsp, savedData.internalAudit, savedData.externalAudit], backgroundColor: '#457B9D' }]
        },
        options: { ...finalOptions, indexAxis: 'y', scales: { x: { beginAtZero: true } } }
    });

    // Return the newly created instances
    return newInstances;
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hseForm')) {
        // ... (Form submission logic remains exactly the same)
        document.getElementById('hseForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const logoFile = document.getElementById('logoUpload').files[0];
            if (!logoFile) {
                alert('Please upload a company logo');
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(logoFile);
            reader.onload = function() {
                const hseData = {
                    logo: reader.result,
                    companyName: getInputValue('companyName'),
                    preparedBy: getInputValue('preparedBy'),
                    manpowerCompany: getInputValue('manpowerCompany'),
                    manpowerSC: getInputValue('manpowerSC'),
                    manhoursTotal: getInputValue('manhoursTotal'),
                    ptwCount: getInputValue('ptwCount'),
                    inductionCompany: getInputValue('inductionCompany'),
                    inductionSC: getInputValue('inductionSC'),
                    trainingCompany: getInputValue('trainingCompany'),
                    trainingSC: getInputValue('trainingSC'),
                    drills: getInputValue('drills'),
                    campaigns: getInputValue('campaigns'),
                    fatalityCompany: getInputValue('fatalityCompany'), fatalitySC: getInputValue('fatalitySC'),
                    ltiCompany: getInputValue('ltiCompany'), ltiSC: getInputValue('ltiSC'),
                    mtcCompany: getInputValue('mtcCompany'), mtcSC: getInputValue('mtcSC'),
                    firstAidCompany: getInputValue('firstAidCompany'), firstAidSC: getInputValue('firstAidSC'),
                    envIncidentCompany: getInputValue('envIncidentCompany'), envIncidentSC: getInputValue('envIncidentSC'),
                    propDamageCompany: getInputValue('propDamageCompany'), propDamageSC: getInputValue('propDamageSC'),
                    nearmissCompany: getInputValue('nearmissCompany'), nearmissSC: getInputValue('nearmissSC'),
                    unsafeActCompany: getInputValue('unsafeActCompany'), unsafeActSC: getInputValue('unsafeActSC'),
                    unsafeConditionCompany: getInputValue('unsafeConditionCompany'), unsafeConditionSC: getInputValue('unsafeConditionSC'),
                    envImpactCompany: getInputValue('envImpactCompany'), envImpactSC: getInputValue('envImpactSC'),
                    hazardReport: getInputValue('hazardReport'),
                    observationCards: getInputValue('observationCards'),
                    siteTour: getInputValue('siteTour'),
                    walkDown: getInputValue('walkDown'),
                    equipmentInsp: getInputValue('equipmentInsp'),
                    internalAudit: getInputValue('internalAudit'),
                    externalAudit: getInputValue('externalAudit'),
                };
                localStorage.setItem('hseReportData', JSON.stringify(hseData));
                window.location.href = 'report.html';
            };
        });
    }

    if (document.querySelector('.report-container')) {
        const savedData = JSON.parse(localStorage.getItem('hseReportData'));
        if (savedData) {
            document.getElementById('reportTitle').textContent = `HSE Visual Report - ${savedData.companyName}`;
            document.getElementById('preparedBy').textContent = `Prepared by: ${savedData.preparedBy}`;
            document.getElementById('reportLogo').src = savedData.logo;

            animateValue("totalManhoursKPI", 0, savedData.manhoursTotal, 1500);
            animateValue("ptwKPI", 0, savedData.ptwCount, 1500);
            animateValue("drillsKPI", 0, savedData.drills, 1500);
            animateValue("campaignsKPI", 0, savedData.campaigns, 1500);

            // Render charts on the visible page and store their instances
            chartInstances = renderAllCharts(document, savedData);
        } else {
            document.querySelector('.report-container').innerHTML = `<h1>No data to display. Please fill out the form first.</h1>`;
        }
    }
});

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        obj.innerHTML = new Intl.NumberFormat().format(currentValue);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}