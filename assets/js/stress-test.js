// Stress Testing Module — Sanah's AI + Private Credit Research Dashboard
// All calculations are DETERMINISTIC JavaScript. No AI/LLM math.
(function() {
    'use strict';

    const StressTest = {
        sliders: {},
        scenarios: {},

        init() {
            this.bindSliders();
            this.calculateAllScenarios();
            this.render();
        },

        bindSliders() {
            const sliderIds = [
                'revenue-decline', 'margin-decline', 'rate-increase',
                'refinancing-spread', 'cashflow-decline'
            ];

            sliderIds.forEach(id => {
                const slider = document.getElementById('slider-' + id);
                const display = document.getElementById('value-' + id);
                if (slider) {
                    this.sliders[id] = slider;
                    slider.addEventListener('input', () => {
                        if (display) {
                            const unit = id === 'rate-increase' || id === 'refinancing-spread' ? ' bps' : '%';
                            display.textContent = slider.value + unit;
                        }
                        this.onSliderChange();
                    });
                }
            });

            // Preset scenario buttons
            document.querySelectorAll('[data-scenario]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const scenario = e.target.dataset.scenario;
                    this.applyPreset(scenario);
                });
            });

            // Reset button
            const resetBtn = document.getElementById('stress-reset');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.applyPreset('base'));
            }
        },

        getSliderValues() {
            return {
                revenueDecline: parseFloat(this.sliders['revenue-decline']?.value || 0),
                marginDecline: parseFloat(this.sliders['margin-decline']?.value || 0),
                rateIncreaseBps: parseFloat(this.sliders['rate-increase']?.value || 0),
                refinancingSpreadBps: parseFloat(this.sliders['refinancing-spread']?.value || 0),
                cashFlowDecline: parseFloat(this.sliders['cashflow-decline']?.value || 0)
            };
        },

        applyPreset(scenario) {
            const presets = {
                base: { revenueDecline: 0, marginDecline: 0, rateIncreaseBps: 0, refinancingSpreadBps: 0, cashFlowDecline: 0 },
                moderate: { revenueDecline: 10, marginDecline: 15, rateIncreaseBps: 100, refinancingSpreadBps: 50, cashFlowDecline: 15 },
                severe: { revenueDecline: 25, marginDecline: 35, rateIncreaseBps: 250, refinancingSpreadBps: 150, cashFlowDecline: 30 }
            };

            const preset = presets[scenario] || presets.base;

            // Update sliders
            Object.entries({
                'revenue-decline': preset.revenueDecline,
                'margin-decline': preset.marginDecline,
                'rate-increase': preset.rateIncreaseBps,
                'refinancing-spread': preset.refinancingSpreadBps,
                'cashflow-decline': preset.cashFlowDecline
            }).forEach(([id, value]) => {
                const slider = this.sliders[id];
                const display = document.getElementById('value-' + id);
                if (slider) {
                    slider.value = value;
                    if (display) {
                        const unit = id === 'rate-increase' || id === 'refinancing-spread' ? ' bps' : '%';
                        display.textContent = value + unit;
                    }
                }
            });

            // Highlight active scenario button
            document.querySelectorAll('[data-scenario]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.scenario === scenario);
            });

            this.onSliderChange();
        },

        onSliderChange() {
            this.calculateAllScenarios();
            this.render();
        },

        calculateAllScenarios() {
            if (!window.DashboardData || !window.FinancialEngine) return;

            const base = window.DashboardData.stressTestBase;
            const params = this.getSliderValues();

            // Base case (no stress)
            this.scenarios.base = window.FinancialEngine.calculateStressScenario(base, {
                revenueDecline: 0, marginDecline: 0, rateIncreaseBps: 0, refinancingSpreadBps: 0, cashFlowDecline: 0
            });
            this.scenarios.base.revenue = base.revenue;
            this.scenarios.base.ebitda = base.ebitda;
            this.scenarios.base.interest_expense = base.interest_expense;
            this.scenarios.base.cash_flow = base.operating_cash_flow;
            this.scenarios.base.interest_coverage = base.ebitda / base.interest_expense;
            this.scenarios.base.liquidity = base.cash + base.operating_cash_flow - base.interest_expense;
            this.scenarios.base.risk = this.scenarios.base.interest_coverage >= 2 ? 'Healthy' : this.scenarios.base.interest_coverage >= 1 ? 'Watch' : 'Distressed';

            // Custom scenario (from sliders)
            this.scenarios.custom = window.FinancialEngine.calculateStressScenario(base, params);

            // Fixed moderate
            this.scenarios.moderate = window.FinancialEngine.calculateStressScenario(base, {
                revenueDecline: 10, marginDecline: 15, rateIncreaseBps: 100, refinancingSpreadBps: 50, cashFlowDecline: 15
            });

            // Fixed severe
            this.scenarios.severe = window.FinancialEngine.calculateStressScenario(base, {
                revenueDecline: 25, marginDecline: 35, rateIncreaseBps: 250, refinancingSpreadBps: 150, cashFlowDecline: 30
            });
        },

        render() {
            this.renderScenarioCards();
            this.renderComparisonTable();
            this.updateChart();
            this.renderMethodology();
        },

        renderScenarioCards() {
            const scenarios = ['base', 'custom', 'moderate', 'severe'];
            const labels = { base: 'Base Case', custom: 'Your Scenario', moderate: 'Moderate Stress', severe: 'Severe Stress' };
            const icons = { 
                base: window.Icons ? window.Icons.get('check') : '', 
                custom: window.Icons ? window.Icons.get('wrench') : '', 
                moderate: window.Icons ? window.Icons.get('alert') : '', 
                severe: window.Icons ? window.Icons.get('alert') : '' 
            };

            scenarios.forEach(key => {
                const container = document.getElementById('stress-card-' + key);
                if (!container || !this.scenarios[key]) return;

                const s = this.scenarios[key];
                const FE = window.FinancialEngine;
                const riskClass = FE.getRiskBadgeClass(s.risk);

                container.innerHTML = 
                    '<div class="stress-card-header">' +
                        '<span class="stress-card-icon">' + icons[key] + '</span>' +
                        '<h4>' + labels[key] + '</h4>' +
                        '<span class="badge ' + riskClass + '">' + s.risk + '</span>' +
                    '</div>' +
                    '<div class="stress-card-metrics">' +
                        '<div class="stress-metric">' +
                            '<span class="stress-metric-label">Revenue</span>' +
                            '<span class="stress-metric-value">' + FE.formatNumber(s.revenue, 'currency') + '</span>' +
                        '</div>' +
                        '<div class="stress-metric">' +
                            '<span class="stress-metric-label">EBITDA</span>' +
                            '<span class="stress-metric-value">' + FE.formatNumber(s.ebitda, 'currency') + '</span>' +
                        '</div>' +
                        '<div class="stress-metric">' +
                            '<span class="stress-metric-label">Interest Expense</span>' +
                            '<span class="stress-metric-value">' + FE.formatNumber(s.interest_expense, 'currency') + '</span>' +
                        '</div>' +
                        '<div class="stress-metric">' +
                            '<span class="stress-metric-label">Cash Flow</span>' +
                            '<span class="stress-metric-value ' + (s.cash_flow < 0 ? 'text-red' : 'text-green') + '">' + FE.formatNumber(s.cash_flow, 'currency') + '</span>' +
                        '</div>' +
                        '<div class="stress-metric">' +
                            '<span class="stress-metric-label">Interest Coverage</span>' +
                            '<span class="stress-metric-value">' + FE.formatNumber(s.interest_coverage, 'ratio') + '</span>' +
                        '</div>' +
                        '<div class="stress-metric">' +
                            '<span class="stress-metric-label">Liquidity</span>' +
                            '<span class="stress-metric-value ' + (s.liquidity < 0 ? 'text-red' : 'text-green') + '">' + FE.formatNumber(s.liquidity, 'currency') + '</span>' +
                        '</div>' +
                    '</div>';
            });
        },

        renderComparisonTable() {
            const table = document.getElementById('stress-comparison-table');
            if (!table) return;

            const FE = window.FinancialEngine;
            const metrics = [
                { key: 'revenue', label: 'Revenue', format: 'currency' },
                { key: 'ebitda', label: 'EBITDA', format: 'currency' },
                { key: 'interest_expense', label: 'Interest Expense', format: 'currency' },
                { key: 'cash_flow', label: 'Cash Flow', format: 'currency' },
                { key: 'interest_coverage', label: 'Interest Coverage', format: 'ratio' },
                { key: 'liquidity', label: 'Liquidity', format: 'currency' },
                { key: 'risk', label: 'Risk Level', format: 'text' }
            ];

            let html = '<thead><tr><th>Metric</th><th>Base</th><th>Moderate</th><th>Severe</th></tr></thead><tbody>';
            
            metrics.forEach(m => {
                html += '<tr>';
                html += '<td class="metric-label">' + m.label + '</td>';
                ['base', 'moderate', 'severe'].forEach(scenario => {
                    const val = this.scenarios[scenario]?.[m.key];
                    let display = '';
                    let cls = '';
                    if (m.format === 'text') {
                        display = val || 'N/A';
                        cls = FE.getRiskClass(val);
                    } else {
                        display = FE.formatNumber(val, m.format);
                        if (m.key === 'cash_flow' || m.key === 'liquidity') {
                            cls = val < 0 ? 'text-red' : 'text-green';
                        }
                    }
                    html += '<td class="' + cls + '">' + display + '</td>';
                });
                html += '</tr>';
            });

            html += '</tbody>';
            table.innerHTML = html;
        },

        updateChart() {
            if (window.ChartManager && this.scenarios.base) {
                window.ChartManager.initStressCharts(this.scenarios);
            }
        },

        renderMethodology() {
            const container = document.getElementById('stress-methodology');
            if (!container) return;

            container.innerHTML = 
                '<h4>Calculation Methodology</h4>' +
                '<div class="methodology-grid">' +
                    '<div class="methodology-item">' +
                        '<strong>Revenue</strong>' +
                        '<p>Base Revenue × (1 − Revenue Decline %)</p>' +
                    '</div>' +
                    '<div class="methodology-item">' +
                        '<strong>EBITDA</strong>' +
                        '<p>Base EBITDA × (1 − Revenue Decline %) × (1 − Margin Decline %)</p>' +
                    '</div>' +
                    '<div class="methodology-item">' +
                        '<strong>Interest Expense</strong>' +
                        '<p>Base Interest × (1 + Rate Increase bps ÷ 10,000 × 4)</p>' +
                    '</div>' +
                    '<div class="methodology-item">' +
                        '<strong>Cash Flow</strong>' +
                        '<p>Base OCF × (1 − Cash Flow Decline %)</p>' +
                    '</div>' +
                    '<div class="methodology-item">' +
                        '<strong>Interest Coverage</strong>' +
                        '<p>Stressed EBITDA ÷ Stressed Interest Expense</p>' +
                    '</div>' +
                    '<div class="methodology-item">' +
                        '<strong>Liquidity</strong>' +
                        '<p>Cash + Stressed Cash Flow − Stressed Interest Expense</p>' +
                    '</div>' +
                '</div>' +
                '<p class="demo-disclosure">' + (window.Icons ? window.Icons.get('alert') : '') + ' All calculations use illustrative base values. Results are for demonstration purposes only.</p>';
        }
    };

    window.StressTest = StressTest;
})();
