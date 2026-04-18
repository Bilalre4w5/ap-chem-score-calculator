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
    const element = document.getElementById(id);
    let value = parseFloat(element.value);
    if (isNaN(value)) value = 0;
    value = clamp(value, min, max);
    element.value = value;
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

    const selectedYear = document.getElementById('curveYear').value;
    const selectedCutoff = cutoffs[selectedYear];

    let apScore = 1;
    if (weightedTotal >= selectedCutoff[5]) {
        apScore = 5;
    } else if (weightedTotal >= selectedCutoff[4]) {
        apScore = 4;
    } else if (weightedTotal >= selectedCutoff[3]) {
        apScore = 3;
    } else if (weightedTotal >= selectedCutoff[2]) {
        apScore = 2;
    }

    document.getElementById('apScore').textContent = apScore;

    let resultText = '';
    if (apScore === 5) {
        resultText = `Projected score 5 based on the ${selectedYear} curve. This range is usually very competitive and suggests strong command of both sections.`;
    } else if (apScore === 4) {
        resultText = `Projected score 4 based on the ${selectedYear} curve. You appear to be in a solid position, and a few more points could push the result higher.`;
    } else if (apScore === 3) {
        resultText = `Projected score 3 based on the ${selectedYear} curve. This is often a passing range, though more work on weak areas could improve the final result.`;
    } else if (apScore === 2) {
        resultText = `Projected score 2 based on the ${selectedYear} curve. Focus on repeated practice, pacing, and free response accuracy to move upward.`;
    } else {
        resultText = `Projected score 1 based on the ${selectedYear} curve. Use this result as a starting point and build from topic review plus timed practice.`;
    }

    document.getElementById('percentileText').textContent = resultText;
}

function bindInputs() {
    const inputIds = ['mcqScore', 'frq1', 'frq2', 'frq3', 'frq4', 'frq5', 'frq6', 'frq7'];

    inputIds.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', calculateScore);
        input.addEventListener('change', calculateScore);
    });

    document.getElementById('curveYear').addEventListener('change', calculateScore);
    document.getElementById('calculateBtn').addEventListener('click', calculateScore);
}

window.addEventListener('DOMContentLoaded', () => {
    bindInputs();
    calculateScore();
});