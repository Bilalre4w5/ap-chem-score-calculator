// Dynamic year
document.getElementById('currentYear').innerText = new Date().getFullYear();

// Scoring cutoffs
const cutoffs = {
    2024: { 5: 72, 4: 60, 3: 45, 2: 30 },
    2023: { 5: 70, 4: 58, 3: 43, 2: 28 },
    2022: { 5: 68, 4: 55, 3: 40, 2: 25 }
};

function calculateScore() {
    // Get MCQ
    let mcqRaw = parseFloat(document.getElementById('mcqScore').value);
    if (isNaN(mcqRaw)) mcqRaw = 0;
    mcqRaw = Math.min(60, Math.max(0, mcqRaw));
    document.getElementById('mcqScore').value = mcqRaw;
    document.getElementById('mcqRaw').innerText = mcqRaw;

    // Get FRQ values
    let frq1 = parseFloat(document.getElementById('frq1').value) || 0;
    let frq2 = parseFloat(document.getElementById('frq2').value) || 0;
    let frq3 = parseFloat(document.getElementById('frq3').value) || 0;
    let frq4 = parseFloat(document.getElementById('frq4').value) || 0;
    let frq5 = parseFloat(document.getElementById('frq5').value) || 0;
    let frq6 = parseFloat(document.getElementById('frq6').value) || 0;
    let frq7 = parseFloat(document.getElementById('frq7').value) || 0;

    let frqRaw = frq1 + frq2 + frq3 + frq4 + frq5 + frq6 + frq7;
    frqRaw = Math.min(46, Math.max(0, frqRaw));
    document.getElementById('frqRaw').innerText = frqRaw;

    // Normalize to 50/50 weighting
    let mcqWeighted = (mcqRaw / 60) * 50;
    let frqWeighted = (frqRaw / 46) * 50;
    let weightedTotal = mcqWeighted + frqWeighted;
    weightedTotal = Math.round(weightedTotal);
    document.getElementById('weightedScore').innerText = weightedTotal;

    // Get selected curve
    let year = document.getElementById('curveYear').value;
    let cutoff = cutoffs[year];
    let apScore = 1;

    if (weightedTotal >= cutoff[5]) apScore = 5;
    else if (weightedTotal >= cutoff[4]) apScore = 4;
    else if (weightedTotal >= cutoff[3]) apScore = 3;
    else if (weightedTotal >= cutoff[2]) apScore = 2;
    else apScore = 1;

    document.getElementById('apScore').innerText = apScore;

    // Percentile text
    let percentileText = '';
    if (apScore === 5) percentileText = 'Top ~13% of students — Excellent!';
    else if (apScore === 4) percentileText = 'Approximately top 35% — Well qualified.';
    else if (apScore === 3) percentileText = 'Around 55th percentile — Qualified, keep practicing!';
    else if (apScore === 2) percentileText = 'Approximately 70th percentile (below passing) — Review more.';
    else percentileText = 'Bottom 20% — Focus on weak areas.';

    document.getElementById('percentileText').innerHTML = `${percentileText} Based on ${year} curve.`;

    // Update practice link
    let practiceBtn = document.getElementById('practiceLink');
    practiceBtn.href = 'https://www.albert.io/blog/ap-chemistry-score-calculator/';
}

// Add event listeners
function bindEvents() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateScore);
        input.addEventListener('change', calculateScore);
    });

    document.getElementById('curveYear').addEventListener('change', calculateScore);
}

window.onload = () => {
    bindEvents();
    calculateScore();
};