document.getElementById('currentYear').textContent = new Date().getFullYear();

const cutoffs = {
    2024: { 5: 72, 4: 60, 3: 45, 2: 30 },
    2023: { 5: 70, 4: 58, 3: 43, 2: 28 },
    2022: { 5: 68, 4: 55, 3: 40, 2: 25 }
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getNumber(id, min, max) {
    const input = document.getElementById(id);
    let value = parseFloat(input.value);
    if (isNaN(value)) value = 0;
    value = clamp(value, min, max);
    input.value = value;
    return value;
}

function updateProgress(id, value, max) {
    const percent = (value / max) * 100;
    document.getElementById(id).style.width = `${percent}%`;
}

function calculateScore() {
    const mcqRaw = getNumber('mcqScore', 0, 60);

    const frq1 = getNumber('frq1', 0, 10);
    const frq2 = getNumber('frq2', 0, 10);
    const frq3 = getNumber('frq3', 0, 10);
    const frq4 = getNumber('frq4', 0, 4);
    const frq5 = getNumber('frq5', 0, 4);
    const frq6 = getNumber('frq6', 0, 4);
    const frq7 = getNumber('frq7', 0, 4);

    const frqRaw = frq1 + frq2 + frq3 + frq4 + frq5 + frq6 + frq7;

    document.getElementById('mcqRaw').textContent = mcqRaw;
    document.getElementById('frqRaw').textContent = frqRaw;

    updateProgress('mcqProgress', mcqRaw, 60);
    updateProgress('frqProgress', frqRaw, 46);

    const mcqWeighted = (mcqRaw / 60) * 50;
    const frqWeighted = (frqRaw / 46) * 50;
    const weightedTotal = Math.round(mcqWeighted + frqWeighted);

    document.getElementById('weightedScore').textContent = weightedTotal;

    const year = document.getElementById('curveYear').value;
    const cutoff = cutoffs[year];

    let apScore = 1;
    if (weightedTotal >= cutoff[5]) {
        apScore = 5;
    } else if (weightedTotal >= cutoff[4]) {
        apScore = 4;
    } else if (weightedTotal >= cutoff[3]) {
        apScore = 3;
    } else if (weightedTotal >= cutoff[2]) {
        apScore = 2;
    }

    document.getElementById('apScore').textContent = apScore;

    let message = '';
    if (apScore === 5) {
        message = `Projected score 5 based on the ${year} curve. This suggests very strong control across both multiple choice and free response sections.`;
    } else if (apScore === 4) {
        message = `Projected score 4 based on the ${year} curve. You are in a strong range, and a few more points could move the result even higher.`;
    } else if (apScore === 3) {
        message = `Projected score 3 based on the ${year} curve. This is often a passing range, with room for improvement through targeted practice.`;
    } else if (apScore === 2) {
        message = `Projected score 2 based on the ${year} curve. Focus on weak topics, pacing, and free response accuracy for better results.`;
    } else {
        message = `Projected score 1 based on the ${year} curve. Use the estimate as a starting point and build upward through practice and review.`;
    }

    document.getElementById('percentileText').textContent = message;
}

function bindEvents() {
    const ids = ['mcqScore', 'frq1', 'frq2', 'frq3', 'frq4', 'frq5', 'frq6', 'frq7'];

    ids.forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('input', calculateScore);
        element.addEventListener('change', calculateScore);
    });

    document.getElementById('curveYear').addEventListener('change', calculateScore);
    document.getElementById('calculateBtn').addEventListener('click', calculateScore);
}

window.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    calculateScore();
});