// Chart Manager — Sanah's AI + Private Credit Research Dashboard
(function() {
    'use strict';

    const ChartManager = {
        charts: {},
        isDark: true,

        colors: {
            blue: '#3b82f6',
            green: '#10b981',
            amber: '#f59e0b',
            red: '#ef4444',
            purple: '#8b5cf6',
            cyan: '#06b6d4',
            blueFaded: 'rgba(59, 130, 246, 0.15)',
            greenFaded: 'rgba(16, 185, 129, 0.15)',
            redFaded: 'rgba(239, 68, 68, 0.15)',
            amberFaded: 'rgba(245, 158, 11, 0.15)',
            purpleFaded: 'rgba(139, 92, 246, 0.15)',
        },

        getThemeColors() {
            return this.isDark ? {
                text: '#94a3b8',
                grid: 'rgba(148, 163, 184, 0.1)',
                tooltipBg: '#1e293b',
                tooltipText: '#e2e8f0',
                tooltipBorder: '#334155'
            } : {
                text: '#475569',
                grid: 'rgba(71, 85, 105, 0.1)',
                tooltipBg: '#ffffff',
                tooltipText: '#1e293b',
                tooltipBorder: '#e2e8f0'
            };
        },

        defaultOptions() {
            const theme = this.getThemeColors();
            return {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        labels: {
                            color: theme.text,
                            font: { family: 'Inter, sans-serif', size: 12 },
                            padding: 16,
                            usePointStyle: true,
                            pointStyleWidth: 10
                        }
                    },
                    tooltip: {
                        backgroundColor: theme.tooltipBg,
                        titleColor: theme.tooltipText,
                        bodyColor: theme.tooltipText,
                        borderColor: theme.tooltipBorder,
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { family: 'Inter, sans-serif', size: 13, weight: '600' },
                        bodyFont: { family: 'Inter, sans-serif', size: 12 },
                        displayColors: true,
                        boxPadding: 4,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    if (context.dataset.isPercentage) {
                                        label += context.parsed.y.toFixed(1) + '%';
                                    } else if (context.dataset.isCurrency) {
                                        label += '$' + context.parsed.y.toLocaleString() + 'M';
                                    } else {
                                        label += context.parsed.y.toLocaleString();
                                    }
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: theme.text, font: { family: 'Inter, sans-serif', size: 11 } },
                        grid: { color: theme.grid }
                    },
                    y: {
                        ticks: { color: theme.text, font: { family: 'Inter, sans-serif', size: 11 } },
                        grid: { color: theme.grid }
                    }
                }
            };
        },

        createChart(canvasId, type, data, customOptions) {
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded yet, retrying for ' + canvasId);
                setTimeout(() => this.createChart(canvasId, type, data, customOptions), 300);
                return null;
            }
            const canvas = document.getElementById(canvasId);
            if (!canvas) return null;

            // Destroy existing
            if (this.charts[canvasId]) {
                this.charts[canvasId].destroy();
            }

            const ctx = canvas.getContext('2d');
            const options = this.mergeDeep(this.defaultOptions(), customOptions || {});

            this.charts[canvasId] = new Chart(ctx, {
                type: type,
                data: data,
                options: options
            });

            return this.charts[canvasId];
        },

        // --- OVERVIEW PAGE CHARTS ---
        
        initOverviewCharts() {
            if (!window.DashboardData) return;
            const qd = window.DashboardData.quarterlyData;
            const labels = qd.map(q => q.quarter);

            // Revenue trend sparkline-style
            this.createChart('overview-revenue-chart', 'line', {
                labels: labels,
                datasets: [{
                    label: 'Revenue ($M)',
                    data: qd.map(q => q.revenue),
                    borderColor: this.colors.blue,
                    backgroundColor: this.colors.blueFaded,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderWidth: 2,
                    isCurrency: true
                }]
            }, {
                plugins: { legend: { display: false } }
            });

            // Risk trend chart
            this.initRiskTrendChart();

            // Cash vs Debt overview
            this.createChart('overview-cash-debt-chart', 'bar', {
                labels: labels,
                datasets: [
                    {
                        label: 'Cash ($M)',
                        data: qd.map(q => q.cash),
                        backgroundColor: this.colors.green,
                        borderRadius: 4,
                        isCurrency: true
                    },
                    {
                        label: 'Total Debt ($M)',
                        data: qd.map(q => q.total_debt),
                        backgroundColor: this.colors.red,
                        borderRadius: 4,
                        isCurrency: true
                    }
                ]
            });
        },

        initRiskTrendChart() {
            if (!window.DashboardData) return;
            const rs = window.DashboardData.riskScores;
            const labels = rs.map(r => r.quarter);

            const riskToNum = (r) => r === 'Healthy' ? 1 : r === 'Watch' ? 2 : 3;

            this.createChart('risk-trend-chart', 'line', {
                labels: labels,
                datasets: [
                    {
                        label: 'Financial Risk',
                        data: rs.map(r => riskToNum(r.quantitative_risk)),
                        borderColor: this.colors.blue,
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        borderWidth: 2
                    },
                    {
                        label: 'AI Risk',
                        data: rs.map(r => riskToNum(r.ai_risk)),
                        borderColor: this.colors.purple,
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        borderWidth: 2
                    },
                    {
                        label: 'Human Risk',
                        data: rs.map(r => riskToNum(r.human_risk)),
                        borderColor: this.colors.amber,
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        borderWidth: 2
                    }
                ]
            }, {
                scales: {
                    y: {
                        min: 0.5,
                        max: 3.5,
                        ticks: {
                            stepSize: 1,
                            callback: (v) => v === 1 ? 'Healthy' : v === 2 ? 'Watch' : v === 3 ? 'Distressed' : ''
                        }
                    }
                }
            });
        },

        // --- FINANCIAL PAGE CHARTS ---

        initFinancialCharts() {
            if (!window.DashboardData) return;
            const qd = window.DashboardData.quarterlyData;
            const labels = qd.map(q => q.quarter);

            // Revenue chart
            this.createChart('financial-revenue-chart', 'bar', {
                labels: labels,
                datasets: [{
                    label: 'Revenue ($M)',
                    data: qd.map(q => q.revenue),
                    backgroundColor: qd.map(q => {
                        const idx = qd.indexOf(q);
                        if (idx === 0) return this.colors.blue;
                        return q.revenue > qd[idx-1].revenue ? this.colors.green : this.colors.red;
                    }),
                    borderRadius: 4,
                    isCurrency: true
                }]
            });

            // Profitability chart
            this.createChart('financial-profit-chart', 'line', {
                labels: labels,
                datasets: [
                    {
                        label: 'Gross Profit ($M)',
                        data: qd.map(q => q.gross_profit),
                        borderColor: this.colors.green,
                        backgroundColor: this.colors.greenFaded,
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2,
                        isCurrency: true
                    },
                    {
                        label: 'Operating Income ($M)',
                        data: qd.map(q => q.operating_income),
                        borderColor: this.colors.amber,
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        borderWidth: 2,
                        isCurrency: true
                    },
                    {
                        label: 'Net Income ($M)',
                        data: qd.map(q => q.net_income),
                        borderColor: this.colors.red,
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        borderWidth: 2,
                        isCurrency: true
                    }
                ]
            });

            // Cash vs Debt
            this.createChart('financial-cash-debt-chart', 'line', {
                labels: labels,
                datasets: [
                    {
                        label: 'Cash ($M)',
                        data: qd.map(q => q.cash),
                        borderColor: this.colors.green,
                        backgroundColor: this.colors.greenFaded,
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2,
                        isCurrency: true
                    },
                    {
                        label: 'Total Debt ($M)',
                        data: qd.map(q => q.total_debt),
                        borderColor: this.colors.red,
                        backgroundColor: this.colors.redFaded,
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2,
                        isCurrency: true
                    }
                ]
            });

            // Operating Cash Flow
            this.createChart('financial-ocf-chart', 'bar', {
                labels: labels,
                datasets: [{
                    label: 'Operating Cash Flow ($M)',
                    data: qd.map(q => q.operating_cash_flow),
                    backgroundColor: qd.map(q => q.operating_cash_flow >= 0 ? this.colors.green : this.colors.red),
                    borderRadius: 4,
                    isCurrency: true
                }]
            });

            // Gross Margin Trend
            this.createChart('financial-margin-chart', 'line', {
                labels: labels,
                datasets: [{
                    label: 'Gross Margin (%)',
                    data: qd.map(q => q.gross_margin),
                    borderColor: this.colors.cyan,
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    borderWidth: 2,
                    isPercentage: true
                }]
            }, {
                scales: {
                    y: {
                        ticks: { callback: v => v + '%' }
                    }
                }
            });

            // Interest Expense
            this.createChart('financial-interest-chart', 'bar', {
                labels: labels,
                datasets: [{
                    label: 'Interest Expense ($M)',
                    data: qd.map(q => q.interest_expense),
                    backgroundColor: this.colors.amber,
                    borderRadius: 4,
                    isCurrency: true
                }]
            });
        },

        // --- MANAGEMENT LANGUAGE PAGE CHARTS ---

        initLanguageCharts() {
            if (!window.DashboardData) return;
            const ml = window.DashboardData.managementLanguage;
            const labels = ml.map(m => m.quarter);

            // Multi-line language scores
            this.createChart('language-trend-chart', 'line', {
                labels: labels,
                datasets: [
                    {
                        label: 'Tone / Confidence',
                        data: ml.map(m => m.management_tone),
                        borderColor: this.colors.green,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Uncertainty',
                        data: ml.map(m => m.uncertainty),
                        borderColor: this.colors.red,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Specificity',
                        data: ml.map(m => m.specificity),
                        borderColor: this.colors.blue,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Q&A Defensiveness',
                        data: ml.map(m => m.qa_defensiveness),
                        borderColor: this.colors.amber,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 4
                    }
                ]
            }, {
                scales: { y: { min: 0, max: 3, ticks: { stepSize: 1 } } }
            });

            // Risk themes heatmap (as stacked bar)
            this.createChart('language-themes-chart', 'bar', {
                labels: labels,
                datasets: [
                    {
                        label: 'New Risk Themes',
                        data: ml.map(m => m.new_risk_themes),
                        backgroundColor: this.colors.red,
                        borderRadius: 4
                    },
                    {
                        label: 'Repeated Explanations',
                        data: ml.map(m => m.repeated_explanations),
                        backgroundColor: this.colors.amber,
                        borderRadius: 4
                    }
                ]
            }, {
                scales: { x: { stacked: true }, y: { stacked: true } }
            });

            // Guidance changes
            this.createChart('language-guidance-chart', 'bar', {
                labels: labels,
                datasets: [{
                    label: 'Guidance Change',
                    data: ml.map(m => m.guidance_change),
                    backgroundColor: ml.map(m => m.guidance_change > 0 ? this.colors.green : m.guidance_change < 0 ? this.colors.red : this.colors.blue + '40'),
                    borderRadius: 4
                }]
            }, {
                scales: {
                    y: {
                        min: -1.5, max: 1.5,
                        ticks: {
                            stepSize: 1,
                            callback: v => v === -1 ? 'Cut' : v === 0 ? 'Unchanged' : v === 1 ? 'Raised' : ''
                        }
                    }
                }
            });
        },

        // --- DIVERGENCE PAGE CHARTS ---

        initDivergenceCharts() {
            if (!window.DashboardData) return;
            const dd = window.DashboardData.divergenceData;
            
            // Get unique quarters in order
            const quarters = [...new Set(dd.map(d => d.quarter))];
            
            // Average divergence per quarter
            const avgByQuarter = quarters.map(q => {
                const items = dd.filter(d => d.quarter === q);
                return items.reduce((sum, i) => sum + i.divergence_score, 0) / items.length;
            });

            this.createChart('divergence-trend-chart', 'line', {
                labels: quarters,
                datasets: [{
                    label: 'Average Divergence Score',
                    data: avgByQuarter,
                    borderColor: this.colors.purple,
                    backgroundColor: this.colors.purpleFaded,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    borderWidth: 2.5
                }]
            }, {
                scales: {
                    y: {
                        min: 0, max: 3,
                        ticks: {
                            stepSize: 1,
                            callback: v => v === 0 ? 'Aligned' : v === 1 ? 'Mild' : v === 2 ? 'Material' : v === 3 ? 'Repeated' : ''
                        }
                    }
                }
            });

            // Divergence distribution
            const dist = [0,1,2,3].map(s => dd.filter(d => d.divergence_score === s).length);
            this.createChart('divergence-distribution-chart', 'doughnut', {
                labels: ['Aligned (0)', 'Mild (1)', 'Material (2)', 'Repeated (3)'],
                datasets: [{
                    data: dist,
                    backgroundColor: [this.colors.green, this.colors.blue, this.colors.amber, this.colors.red],
                    borderWidth: 0,
                    spacing: 2
                }]
            }, {
                cutout: '65%',
                plugins: { legend: { position: 'bottom' } }
            });
        },

        // --- CREDIT EVENTS PAGE CHARTS ---

        initCreditCharts() {
            if (!window.DashboardData) return;
            const qd = window.DashboardData.quarterlyData;
            const labels = qd.map(q => q.quarter);

            // Debt composition over time
            this.createChart('credit-debt-chart', 'line', {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Debt ($M)',
                        data: qd.map(q => q.total_debt),
                        borderColor: this.colors.red,
                        backgroundColor: this.colors.redFaded,
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2,
                        isCurrency: true
                    },
                    {
                        label: 'Interest Expense ($M)',
                        data: qd.map(q => q.interest_expense),
                        borderColor: this.colors.amber,
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        borderWidth: 2,
                        yAxisID: 'y1',
                        isCurrency: true
                    }
                ]
            }, {
                scales: {
                    y1: {
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: this.getThemeColors().text }
                    }
                }
            });
        },

        // --- STRESS TEST PAGE CHARTS ---

        initStressCharts(scenarios) {
            // This is called dynamically from stress-test.js
            const labels = ['Revenue', 'EBITDA', 'Interest Exp.', 'Cash Flow', 'Int. Coverage'];
            
            this.createChart('stress-comparison-chart', 'bar', {
                labels: labels,
                datasets: [
                    {
                        label: 'Base Case',
                        data: [
                            scenarios.base.revenue,
                            scenarios.base.ebitda,
                            scenarios.base.interest_expense,
                            scenarios.base.cash_flow,
                            scenarios.base.interest_coverage
                        ],
                        backgroundColor: this.colors.green,
                        borderRadius: 4
                    },
                    {
                        label: 'Moderate Stress',
                        data: [
                            scenarios.moderate.revenue,
                            scenarios.moderate.ebitda,
                            scenarios.moderate.interest_expense,
                            scenarios.moderate.cash_flow,
                            scenarios.moderate.interest_coverage
                        ],
                        backgroundColor: this.colors.amber,
                        borderRadius: 4
                    },
                    {
                        label: 'Severe Stress',
                        data: [
                            scenarios.severe.revenue,
                            scenarios.severe.ebitda,
                            scenarios.severe.interest_expense,
                            scenarios.severe.cash_flow,
                            scenarios.severe.interest_coverage
                        ],
                        backgroundColor: this.colors.red,
                        borderRadius: 4
                    }
                ]
            });
        },

        // --- COMPARISON PAGE CHARTS ---

        initComparisonCharts() {
            if (!window.DashboardData) return;
            const rs = window.DashboardData.riskScores;
            const labels = rs.map(r => r.quarter);
            const riskToNum = (r) => r === 'Healthy' ? 1 : r === 'Watch' ? 2 : 3;

            // Radar chart for latest quarter
            const latest = rs[rs.length - 1];
            this.createChart('comparison-radar-chart', 'radar', {
                labels: ['Financial', 'Language', 'Divergence', 'Covenant', 'Stress', 'Combined'],
                datasets: [
                    {
                        label: 'Quantitative Model',
                        data: [riskToNum(latest.quantitative_risk), 1.5, 1.2, 1.0, 1.5, riskToNum(latest.quantitative_risk)],
                        borderColor: this.colors.blue,
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2
                    },
                    {
                        label: 'AI Assessment',
                        data: [riskToNum(latest.ai_risk), 1.3, 1.5, 1.2, 1.3, riskToNum(latest.ai_risk)],
                        borderColor: this.colors.purple,
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Human Assessment',
                        data: [riskToNum(latest.human_risk), 1.4, 1.3, 1.1, 1.4, riskToNum(latest.human_risk)],
                        borderColor: this.colors.amber,
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2
                    }
                ]
            }, {
                scales: {
                    r: {
                        min: 0, max: 3,
                        ticks: { stepSize: 1, display: false },
                        grid: { color: this.getThemeColors().grid },
                        pointLabels: { color: this.getThemeColors().text, font: { size: 11 } }
                    }
                }
            });

            // Confidence over time
            this.createChart('comparison-confidence-chart', 'line', {
                labels: labels,
                datasets: [
                    {
                        label: 'AI Confidence',
                        data: rs.map(r => r.ai_confidence),
                        borderColor: this.colors.purple,
                        tension: 0.3,
                        borderWidth: 2,
                        isPercentage: true
                    },
                    {
                        label: 'Human Confidence',
                        data: rs.map(r => r.human_confidence),
                        borderColor: this.colors.amber,
                        tension: 0.3,
                        borderWidth: 2,
                        isPercentage: true
                    }
                ]
            }, {
                scales: { y: { min: 0, max: 100, ticks: { callback: v => v + '%' } } }
            });
        },

        // --- UTILITY ---

        updateTheme(isDark) {
            this.isDark = isDark;
            // Re-render all active charts
            Object.keys(this.charts).forEach(id => {
                const chart = this.charts[id];
                if (chart) {
                    const theme = this.getThemeColors();
                    if (chart.options.scales) {
                        Object.keys(chart.options.scales).forEach(scaleId => {
                            const scale = chart.options.scales[scaleId];
                            if (scale.ticks) scale.ticks.color = theme.text;
                            if (scale.grid) scale.grid.color = theme.grid;
                            if (scale.pointLabels) scale.pointLabels.color = theme.text;
                        });
                    }
                    if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                        chart.options.plugins.legend.labels.color = theme.text;
                    }
                    chart.update();
                }
            });
        },

        destroyAll() {
            Object.keys(this.charts).forEach(id => {
                if (this.charts[id]) this.charts[id].destroy();
            });
            this.charts = {};
        },

        mergeDeep(target, source) {
            const output = Object.assign({}, target);
            if (typeof target === 'object' && typeof source === 'object') {
                Object.keys(source).forEach(key => {
                    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        if (!(key in target)) Object.assign(output, { [key]: source[key] });
                        else output[key] = this.mergeDeep(target[key], source[key]);
                    } else {
                        Object.assign(output, { [key]: source[key] });
                    }
                });
            }
            return output;
        }
    };

    window.ChartManager = ChartManager;
})();