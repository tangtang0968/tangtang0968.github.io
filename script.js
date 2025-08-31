// Define the seven subjects with their weights
const subjects = [
    { id: 'chinese', name: '國文', weight: 5, icon: '📝', color: 'red' },
    { id: 'math', name: '數學', weight: 4, icon: '🔢', color: 'blue' },
    { id: 'science', name: '自然', weight: 3, icon: '🔬', color: 'green' },
    { id: 'english', name: '英文', weight: 3, icon: '🇺🇸', color: 'purple' },
    { id: 'geography', name: '地理', weight: 1, icon: '🌍', color: 'yellow' },
    { id: 'history', name: '歷史', weight: 1, icon: '📚', color: 'orange' },
    { id: 'civics', name: '公民', weight: 1, icon: '🏛️', color: 'indigo' }
];

const totalWeight = 18; // Sum of all weights: 5+4+3+3+1+1+1=18

function initializeSubjects() {
    const grid = document.getElementById('subjectsGrid');
    grid.innerHTML = subjects.map(subject => `
        <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div class="text-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">${subject.name}</h3>
            </div>
            <input type="number" 
                   id="score_${subject.id}" 
                   placeholder="分數" 
                   min="0" 
                   max="100" 
                   step="0.1"
                   onchange="validateAndCalculate(this)"
                   oninput="validateAndCalculate(this)"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-center">
        </div>
    `).join('');
}

function validateAndCalculate(input) {
    let value = parseFloat(input.value);
    
    // If value is not a number, clear the input
    if (isNaN(value)) {
        input.value = '';
        calculateResults();
        return;
    }
    
    // Limit value to 0-100 range
    if (value < 0) {
        input.value = '0';
    } else if (value > 100) {
        input.value = '100';
    }
    
    calculateResults();
}

function drawRadarChart() {
    const svg = document.getElementById('radarChart');
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;
    const levels = 5; // 5 levels: 0, 20, 40, 60, 80, 100
    
    // Clear previous chart
    svg.innerHTML = '';
    
    // Draw background circles and grid lines
    for (let i = 1; i <= levels; i++) {
        const radius = (maxRadius / levels) * i;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#e5e7eb');
        circle.setAttribute('stroke-width', '1');
        svg.appendChild(circle);
        
        // Add level labels
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', centerX + radius + 5);
        text.setAttribute('y', centerY + 5);
        text.setAttribute('font-size', '12');
        text.setAttribute('fill', '#9ca3af');
        text.textContent = (i * 20).toString();
        svg.appendChild(text);
    }
    
    // Draw axis lines and labels
    subjects.forEach((subject, index) => {
        const angle = (index * 2 * Math.PI) / subjects.length - Math.PI / 2;
        const x = centerX + Math.cos(angle) * maxRadius;
        const y = centerY + Math.sin(angle) * maxRadius;
        
        // Draw axis line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', x);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#d1d5db');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
        
        // Add subject labels
        const labelX = centerX + Math.cos(angle) * (maxRadius + 20);
        const labelY = centerY + Math.sin(angle) * (maxRadius + 20);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', '#374151');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.textContent = subject.name;
        svg.appendChild(text);
    });
    
    // Draw data polygon
    const scores = [];
    let hasData = false;
    
    subjects.forEach(subject => {
        const scoreInput = document.getElementById(`score_${subject.id}`);
        const score = parseFloat(scoreInput.value);
        if (!isNaN(score) && score >= 0 && score <= 100) {
            scores.push(score);
            hasData = true;
        } else {
            scores.push(0);
        }
    });
    
    if (hasData) {
        let pathData = '';
        const points = [];
        
        scores.forEach((score, index) => {
            const angle = (index * 2 * Math.PI) / subjects.length - Math.PI / 2;
            const radius = (score / 100) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            points.push({x, y});
            
            if (index === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
        });
        
        pathData += ' Z'; // Close the path
        
        // Draw filled polygon
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        polygon.setAttribute('d', pathData);
        polygon.setAttribute('fill', 'rgba(59, 130, 246, 0.3)');
        polygon.setAttribute('stroke', '#3b82f6');
        polygon.setAttribute('stroke-width', '2');
        svg.appendChild(polygon);
        
        // Draw data points
        points.forEach((point, index) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', '#3b82f6');
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '2');
            svg.appendChild(circle);
            
            // Add score labels on points
            if (scores[index] > 0) {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', point.x);
                text.setAttribute('y', point.y - 10);
                text.setAttribute('font-size', '12');
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('fill', '#1f2937');
                text.setAttribute('text-anchor', 'middle');
                text.textContent = scores[index].toString();
                svg.appendChild(text);
            }
        });
    }
}

function calculateResults() {
    let totalWeightedScore = 0;
    let hasAnyScore = false;
    let calculationSteps = [];
    let validSubjects = 0;

    subjects.forEach(subject => {
        const scoreInput = document.getElementById(`score_${subject.id}`);
        const score = parseFloat(scoreInput.value);
        
        if (!isNaN(score) && score >= 0 && score <= 100) {
            const weightedScore = score * subject.weight;
            totalWeightedScore += weightedScore;
            calculationSteps.push(`${subject.name}: ${score} × ${subject.weight} = ${weightedScore.toFixed(1)}`);
            hasAnyScore = true;
            validSubjects++;
        }
    });

    // Update radar chart
    drawRadarChart();

    // Update results
    if (hasAnyScore) {
        const weightedAverage = totalWeightedScore / totalWeight;
        
        document.getElementById('totalWeightedScore').textContent = totalWeightedScore.toFixed(1);
        document.getElementById('weightedAverage').textContent = weightedAverage.toFixed(2);
        
        // Calculate grade level
        let gradeLevel = getGradeLevel(weightedAverage);
        document.getElementById('gradeLevel').textContent = gradeLevel;
        
        // Update calculation display
        const calculationFormula = document.getElementById('calculationFormula');
        const detailedCalculation = document.getElementById('detailedCalculation');
        
        calculationFormula.textContent = `加權平均 = ${totalWeightedScore.toFixed(1)} ÷ ${totalWeight} = ${weightedAverage.toFixed(2)}`;
        
        if (calculationSteps.length > 0) {
            detailedCalculation.innerHTML = `
                <strong>詳細計算過程：</strong><br>
                ${calculationSteps.join('<br>')}
                <br><strong>總加權分數：</strong> ${totalWeightedScore.toFixed(1)}
                <br><strong>加權平均：</strong> ${totalWeightedScore.toFixed(1)} ÷ ${totalWeight} = ${weightedAverage.toFixed(2)}
            `;
        }
        
        // Auto-save when all subjects have scores
        if (validSubjects === subjects.length) {
            autoSaveToHistory();
        }
    } else {
        document.getElementById('totalWeightedScore').textContent = '--';
        document.getElementById('weightedAverage').textContent = '--';
        document.getElementById('gradeLevel').textContent = '--';
        document.getElementById('calculationFormula').textContent = '加權平均 = 總加權分數 ÷ 18';
        document.getElementById('detailedCalculation').textContent = '請輸入各科成績以查看詳細計算過程';
    }
}

function getGradeLevel(average) {
    if (average >= 93) return 'A++';
    else if (average >= 85) return 'A+';
    else if (average >= 80) return 'A';
    else if (average >= 75) return 'B++';
    else if (average >= 70) return 'B+';
    else if (average >= 60) return 'B';
    else return 'C';
}

function quickClear() {
    subjects.forEach(subject => {
        const input = document.getElementById(`score_${subject.id}`);
        if (input) {
            input.value = '';
        }
    });
    calculateResults();
}

function autoSaveToHistory() {
    const scores = {};
    let totalWeightedScore = 0;
    let allScoresValid = true;
    
    subjects.forEach(subject => {
        const scoreInput = document.getElementById(`score_${subject.id}`);
        const score = parseFloat(scoreInput.value);
        if (!isNaN(score) && score >= 0 && score <= 100) {
            scores[subject.id] = score;
            totalWeightedScore += score * subject.weight;
        } else {
            allScoresValid = false;
        }
    });
    
    if (!allScoresValid) return; // Only auto-save when all scores are complete
    
    const weightedAverage = totalWeightedScore / totalWeight;
    const gradeLevel = getGradeLevel(weightedAverage);
    
    // Check if this exact combination already exists in recent history
    const history = JSON.parse(localStorage.getItem('gradeHistory') || '[]');
    const isDuplicate = history.some(record => {
        return subjects.every(subject => 
            record.scores[subject.id] === scores[subject.id]
        );
    });
    
    if (isDuplicate) return; // Don't save duplicate records
    
    const record = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('zh-TW') + ' (自動儲存)',
        scores: scores,
        weightedAverage: weightedAverage.toFixed(2),
        totalWeightedScore: totalWeightedScore.toFixed(1),
        gradeLevel: gradeLevel
    };
    
    history.unshift(record); // Add to beginning
    
    // Keep only last 10 records
    if (history.length > 10) {
        history.splice(10);
    }
    
    localStorage.setItem('gradeHistory', JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    const historyContainer = document.getElementById('historyContainer');
    const history = JSON.parse(localStorage.getItem('gradeHistory') || '[]');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<p class="text-gray-500 text-center py-4">尚無歷史紀錄</p>';
        deleteSelectedBtn.classList.add('hidden');
        return;
    }
    
    // Show the delete selected button if there's history
    deleteSelectedBtn.classList.remove('hidden');

    historyContainer.innerHTML = history.map(record => `
        <div class="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow flex items-start space-x-4">
            <input type="checkbox" class="h-5 w-5 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded" data-record-id="${record.id}">
            <div class="flex-1 cursor-pointer" onclick="loadFromHistory('${record.id}')">
                <div class="flex justify-between items-start mb-2">
                    <div class="text-sm text-gray-500">${record.timestamp}</div>
                    <div class="flex items-center space-x-2">
                        <span class="text-lg font-bold text-blue-600">${record.weightedAverage}</span>
                        <span class="px-2 py-1 rounded text-sm font-medium bg-orange-100 text-orange-800">${record.gradeLevel}</span>
                    </div>
                </div>
                <div class="grid grid-cols-4 gap-2 text-xs">
                    ${subjects.map(subject => {
                        const score = record.scores[subject.id] || '--';
                        return `<div class="text-center">
                            <div class="text-gray-600">${subject.name}</div>
                            <div class="font-semibold">${score}</div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function loadFromHistory(recordId) {
    const history = JSON.parse(localStorage.getItem('gradeHistory') || '[]');
    const record = history.find(r => r.id == recordId);
    
    if (!record) return;
    
    // Clear all inputs first
    subjects.forEach(subject => {
        document.getElementById(`score_${subject.id}`).value = '';
    });
    
    // Load scores from record
    subjects.forEach(subject => {
        if (record.scores[subject.id] !== undefined) {
            document.getElementById(`score_${subject.id}`).value = record.scores[subject.id];
        }
    });
    
    calculateResults();
}

function clearHistory() {
    if (confirm('確定要清除所有歷史紀錄嗎？')) {
        localStorage.removeItem('gradeHistory');
        displayHistory();
    }
}

function deleteSelectedHistory() {
    const selectedCheckboxes = document.querySelectorAll('#historyContainer input[type="checkbox"]:checked');
    
    if (selectedCheckboxes.length === 0) {
        alert('請先勾選要刪除的紀錄！');
        return;
    }
    
    if (confirm(`確定要刪除這 ${selectedCheckboxes.length} 筆紀錄嗎？`)) {
        let history = JSON.parse(localStorage.getItem('gradeHistory') || '[]');
        
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.recordId));
        
        // Filter out the records with IDs that are in the selectedIds array
        const newHistory = history.filter(record => !selectedIds.includes(record.id));
        
        localStorage.setItem('gradeHistory', JSON.stringify(newHistory));
        displayHistory();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeSubjects();
    drawRadarChart(); // Initialize empty radar chart
    calculateResults();
    displayHistory(); // Load and display history
});