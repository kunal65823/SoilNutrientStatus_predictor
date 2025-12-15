/* ============================================
   AI-POWERED SOIL NUTRIENT PREDICTOR
   Simple & Clean JavaScript
   ============================================ */

// Global variables
let isAnalyzing = false;
let currentResults = null;

// Soil Analyzer Class
class SoilAnalyzer {
    constructor() {
        this.form = document.getElementById('soilForm');
        this.resultPanel = document.getElementById('resultsPanel');
        this.init();
    }

    init() {
        console.log('Initializing Soil Analyzer...');
        
        // Initialize range inputs
        this.initRangeInputs();
        
        // Form submission handler
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Reset button handler
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetForm());
        }
    }

    initRangeInputs() {
        const ranges = document.querySelectorAll('input[type="range"]');
        
        ranges.forEach(range => {
            range.addEventListener('input', () => this.updateRangeDisplay(range));
            this.updateRangeDisplay(range); // Initial update
        });
    }

    updateRangeDisplay(range) {
        const valueElement = document.getElementById(range.id + 'Value');
        const statusElement = document.getElementById(range.id + 'Status');
        
        if (valueElement) {
            let value = parseFloat(range.value);
            let unit = '';
            
            switch (range.id) {
                case 'pH':
                    unit = '';
                    break;
                case 'temperature':
                    unit = '°C';
                    break;
                case 'moisture':
                case 'organicCarbon':
                    unit = '%';
                    break;
                case 'ec':
                    unit = ' dS/m';
                    break;
            }
            
            valueElement.textContent = value + unit;
        }

        if (statusElement) {
            statusElement.textContent = this.getParameterStatus(range.id, parseFloat(range.value));
            statusElement.className = 'parameter-status ' + this.getStatusClass(range.id, parseFloat(range.value));
        }
    }

    getParameterStatus(parameter, value) {
        const ranges = {
            pH: { low: 5.5, optimal: 7.0, high: 8.5 },
            temperature: { low: 18, optimal: 25, high: 30 },
            moisture: { low: 30, optimal: 50, high: 70 },
            ec: { low: 0.5, optimal: 1.2, high: 2.0 },
            organicCarbon: { low: 1.0, optimal: 2.5, high: 3.5 }
        };

        if (!ranges[parameter]) return 'Unknown';

        const { low, optimal, high } = ranges[parameter];
        
        if (value < low) return 'Low';
        if (value > high) return 'High';
        if (Math.abs(value - optimal) <= (optimal * 0.2)) return 'Optimal';
        return 'Good';
    }

    getStatusClass(parameter, value) {
        const status = this.getParameterStatus(parameter, value);
        switch (status) {
            case 'Optimal': return 'status-optimal';
            case 'Good': return 'status-good';
            case 'Low':
            case 'High': return 'status-warning';
            default: return 'status-unknown';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (isAnalyzing) return;
        
        isAnalyzing = true;
        this.showAnalyzing();

        // Collect form data
        const formData = this.collectFormData();
        
        // Simulate AI processing
        await this.simulateAIProcessing();
        
        // Generate predictions
        const results = await this.generatePredictions(formData);
        
        // Display results
        this.displayResults(results);
        
        isAnalyzing = false;
        this.hideAnalyzing();
    }

    collectFormData() {
        return {
            pH: parseFloat(document.getElementById('pH')?.value || 6.5),
            temperature: parseFloat(document.getElementById('temperature')?.value || 25),
            moisture: parseFloat(document.getElementById('moisture')?.value || 50),
            ec: parseFloat(document.getElementById('ec')?.value || 1.2),
            organicCarbon: parseFloat(document.getElementById('organicCarbon')?.value || 2.2),
            soilType: document.getElementById('soilType')?.value || 'loam'
        };
    }

    showAnalyzing() {
        const btn = document.querySelector('.btn-predict');
        if (!btn) return;
        
        const loader = btn.querySelector('.btn-loader');
        const span = btn.querySelector('span');
        
        if (loader && span) {
            loader.style.display = 'block';
            span.textContent = 'Analyzing...';
            btn.disabled = true;
        }
    }

    hideAnalyzing() {
        const btn = document.querySelector('.btn-predict');
        if (!btn) return;
        
        const loader = btn.querySelector('.btn-loader');
        const span = btn.querySelector('span');
        
        if (loader && span) {
            loader.style.display = 'none';
            span.textContent = 'Analyze Soil';
            btn.disabled = false;
        }
    }

    async simulateAIProcessing() {
        return new Promise(resolve => {
            setTimeout(resolve, 2000 + Math.random() * 1000);
        });
    }

    async generatePredictions(data) {
        const { pH, temperature, moisture, ec, organicCarbon, soilType } = data;
        
        // Soil type modifiers
        const soilModifiers = {
            clay: { n: 1.1, p: 0.9, k: 1.0 },
            sandy: { n: 0.8, p: 1.1, k: 0.9 },
            loam: { n: 1.0, p: 1.0, k: 1.0 },
            silt: { n: 0.9, p: 1.0, k: 1.1 },
            peat: { n: 1.2, p: 0.8, k: 0.8 },
            chalk: { n: 0.7, p: 1.2, k: 0.9 }
        };

        const modifier = soilModifiers[soilType] || soilModifiers.loam;
        
        // Calculate nutrients
        let nitrogen = this.calculateNitrogen(pH, temperature, moisture, organicCarbon) * modifier.n;
        let phosphorus = this.calculatePhosphorus(pH, ec, organicCarbon, temperature) * modifier.p;
        let potassium = this.calculatePotassium(pH, ec, moisture, soilType) * modifier.k;
        
        // Normalize to realistic ranges
        nitrogen = Math.max(0, Math.min(100, nitrogen));
        phosphorus = Math.max(0, Math.min(100, phosphorus));
        potassium = Math.max(0, Math.min(100, potassium));
        
        // Calculate additional metrics
        const soilHealth = this.calculateSoilHealth(nitrogen, phosphorus, potassium, pH, organicCarbon);
        const fertilityIndex = this.calculateFertilityIndex(nitrogen, phosphorus, potassium);
        const riskAssessment = this.assessRisks(data, { nitrogen, phosphorus, potassium });
        const cropSuitability = this.assessCropSuitability(soilHealth, fertilityIndex);
        
        return {
            nitrogen: Math.round(nitrogen * 10) / 10,
            phosphorus: Math.round(phosphorus * 10) / 10,
            potassium: Math.round(potassium * 10) / 10,
            soilHealth: Math.round(soilHealth * 10) / 10,
            fertilityIndex: Math.round(fertilityIndex * 10) / 10,
            riskAssessment,
            cropSuitability,
            confidence: Math.round((85 + Math.random() * 15) * 10) / 10,
            recommendations: this.generateRecommendations(data, { nitrogen, phosphorus, potassium })
        };
    }

    calculateNitrogen(pH, temp, moisture, organicCarbon) {
        let base = organicCarbon * 15;
        const pHFactor = 1 - Math.abs(pH - 6.75) * 0.15;
        const tempFactor = 1 - Math.abs(temp - 25) * 0.02;
        const moistureFactor = moisture > 40 && moisture < 70 ? 1.1 : 0.9;
        return base * pHFactor * tempFactor * moistureFactor + Math.random() * 10;
    }

    calculatePhosphorus(pH, ec, organicCarbon, temp) {
        let base = organicCarbon * 8 + ec * 10;
        const pHFactor = pH < 7 ? 1.2 : 1 - (pH - 7) * 0.1;
        const tempFactor = temp > 20 ? 1.1 : 0.9;
        return base * pHFactor * tempFactor + Math.random() * 15;
    }

    calculatePotassium(pH, ec, moisture, soilType) {
        let base = ec * 15 + moisture * 0.5;
        const pHFactor = pH > 6 && pH < 8 ? 1.1 : 0.9;
        const typeFactor = soilType === 'clay' ? 1.2 : 1.0;
        return base * pHFactor * typeFactor + Math.random() * 12;
    }

    calculateSoilHealth(n, p, k, pH, organicCarbon) {
        const nutrientBalance = (n + p + k) / 3;
        const pHScore = 100 - Math.abs(pH - 6.8) * 10;
        const organicScore = Math.min(organicCarbon * 25, 100);
        return (nutrientBalance * 0.4 + pHScore * 0.3 + organicScore * 0.3);
    }

    calculateFertilityIndex(n, p, k) {
        return (n * 0.4 + p * 0.35 + k * 0.25);
    }

    assessRisks(data, nutrients) {
        const risks = [];
        if (data.pH < 5.5) risks.push('Soil acidity');
        if (data.pH > 8.5) risks.push('Soil alkalinity');
        if (data.ec > 2.5) risks.push('High salinity');
        if (nutrients.nitrogen < 30) risks.push('Nitrogen deficiency');
        if (nutrients.phosphorus < 25) risks.push('Phosphorus deficiency');
        if (nutrients.potassium < 35) risks.push('Potassium deficiency');
        return risks.length > 0 ? risks.join(', ') : 'Low risk';
    }

    assessCropSuitability(soilHealth, fertilityIndex) {
        const avgScore = (soilHealth + fertilityIndex) / 2;
        if (avgScore >= 80) return 'Excellent for all crops';
        if (avgScore >= 65) return 'Good for most crops';
        if (avgScore >= 50) return 'Suitable with amendments';
        return 'Requires significant improvement';
    }

    generateRecommendations(data, nutrients) {
        const recommendations = [];
        
        // pH recommendations
        if (data.pH < 6.0) {
            recommendations.push({
                type: 'pH Correction',
                action: 'Apply lime to raise pH',
                priority: 'High'
            });
        } else if (data.pH > 8.0) {
            recommendations.push({
                type: 'pH Correction',
                action: 'Apply sulfur to lower pH',
                priority: 'High'
            });
        }
        
        // Nutrient recommendations
        if (nutrients.nitrogen < 40) {
            recommendations.push({
                type: 'Nitrogen',
                action: 'Apply nitrogen fertilizer or compost',
                priority: 'Medium'
            });
        }
        
        if (nutrients.phosphorus < 30) {
            recommendations.push({
                type: 'Phosphorus',
                action: 'Apply phosphate fertilizer',
                priority: 'Medium'
            });
        }
        
        if (nutrients.potassium < 40) {
            recommendations.push({
                type: 'Potassium',
                action: 'Apply potash fertilizer',
                priority: 'Medium'
            });
        }
        
        // Organic matter recommendation
        if (data.organicCarbon < 2.0) {
            recommendations.push({
                type: 'Organic Matter',
                action: 'Add compost or organic amendments',
                priority: 'High'
            });
        }
        
        return recommendations;
    }

    displayResults(results) {
        currentResults = results;
        
        // Update confidence level
        const confidenceEl = document.getElementById('confidenceLevel');
        if (confidenceEl) confidenceEl.textContent = results.confidence + '%';
        
        // Update nutrient values and bars
        this.updateNutrientCard('nitrogen', results.nitrogen);
        this.updateNutrientCard('phosphorus', results.phosphorus);
        this.updateNutrientCard('potassium', results.potassium);
        
        // Update detailed analysis
        const healthEl = document.getElementById('healthScore');
        const fertilityEl = document.getElementById('fertilityIndex');
        const riskEl = document.getElementById('riskAssessment');
        const cropEl = document.getElementById('cropSuitability');
        
        if (healthEl) healthEl.textContent = results.soilHealth + '/100';
        if (fertilityEl) fertilityEl.textContent = results.fertilityIndex + '/100';
        if (riskEl) riskEl.textContent = results.riskAssessment;
        if (cropEl) cropEl.textContent = results.cropSuitability;
        
        // Update recommendations
        this.displayRecommendations(results.recommendations);
        
        // Smooth scroll to results
        if (this.resultPanel) {
            this.resultPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateNutrientCard(nutrient, value) {
        const valueEl = document.getElementById(nutrient + 'Value');
        const barEl = document.getElementById(nutrient + 'Bar');
        const statusEl = document.getElementById(nutrient + 'Status');
        const descEl = document.getElementById(nutrient + 'Desc');
        
        if (valueEl) valueEl.textContent = value + '%';
        if (barEl) {
            barEl.style.width = '0%';
            setTimeout(() => {
                barEl.style.width = value + '%';
            }, 100);
        }
        
        if (statusEl) {
            const status = this.getNutrientStatus(value);
            statusEl.textContent = status;
        }
        
        if (descEl) {
            descEl.textContent = this.getNutrientDescription(nutrient, value);
        }
    }

    getNutrientStatus(value) {
        if (value >= 70) return 'Excellent';
        if (value >= 50) return 'Good';
        if (value >= 30) return 'Fair';
        return 'Poor';
    }

    getNutrientDescription(nutrient, value) {
        const descriptions = {
            nitrogen: {
                high: 'Excellent for leafy growth and protein synthesis',
                medium: 'Adequate for most plant growth requirements',
                low: 'May limit plant growth and yield potential'
            },
            phosphorus: {
                high: 'Optimal for root development and flowering',
                medium: 'Sufficient for normal plant development',
                low: 'Could restrict root growth and fruit production'
            },
            potassium: {
                high: 'Excellent for disease resistance and water regulation',
                medium: 'Adequate for plant health and stress tolerance',
                low: 'May reduce plant immunity and drought resistance'
            }
        };
        
        const level = value >= 60 ? 'high' : value >= 35 ? 'medium' : 'low';
        return descriptions[nutrient]?.[level] || 'Analysis complete';
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendationsList');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (recommendations.length === 0) {
            container.innerHTML = '<p class="placeholder-text">No specific recommendations - soil conditions are optimal!</p>';
            return;
        }
        
        recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <div class="recommendation-header">
                    <strong>${rec.type}</strong>
                    <span class="priority-badge priority-${rec.priority.toLowerCase()}">${rec.priority}</span>
                </div>
                <div class="recommendation-text">${rec.action}</div>
            `;
            container.appendChild(item);
        });
    }

    resetForm() {
        if (!this.form) return;
        
        // Reset form fields to default values
        document.getElementById('pH').value = 6.5;
        document.getElementById('temperature').value = 25;
        document.getElementById('moisture').value = 50;
        document.getElementById('ec').value = 1.2;
        document.getElementById('organicCarbon').value = 2.2;
        document.getElementById('soilType').selectedIndex = 1; // sandy
        
        // Reset range displays
        const ranges = document.querySelectorAll('input[type="range"]');
        ranges.forEach(range => {
            this.updateRangeDisplay(range);
        });
        
        // Clear results
        this.clearResults();
    }

    clearResults() {
        // Reset nutrient cards
        ['nitrogen', 'phosphorus', 'potassium'].forEach(nutrient => {
            const valueEl = document.getElementById(nutrient + 'Value');
            const barEl = document.getElementById(nutrient + 'Bar');
            const statusEl = document.getElementById(nutrient + 'Status');
            const descEl = document.getElementById(nutrient + 'Desc');
            
            if (valueEl) valueEl.textContent = '--';
            if (barEl) barEl.style.width = '0%';
            if (statusEl) statusEl.textContent = 'Ready';
            if (descEl) descEl.textContent = 'Click analyze to see results';
        });
        
        // Reset details
        ['healthScore', 'fertilityIndex', 'riskAssessment', 'cropSuitability'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '--';
        });
        
        // Reset confidence
        const confidenceEl = document.getElementById('confidenceLevel');
        if (confidenceEl) confidenceEl.textContent = '--';
        
        // Clear recommendations
        const recommendationsContainer = document.getElementById('recommendationsList');
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = '<p class="placeholder-text">Run analysis to see AI recommendations</p>';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const soilAnalyzer = new SoilAnalyzer();
    console.log('AI-Powered Soil Nutrient Predictor initialized successfully');
});
