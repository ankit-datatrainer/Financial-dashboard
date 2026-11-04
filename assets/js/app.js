/**
 * Sanah's AI + Private Credit Research Dashboard
 * Core Application Controller (app.js)
 * 
 * DEMONSTRATION MODE — All data is illustrative and for research architecture demonstration.
 */

(function() {
    'use strict';

    const Dashboard = {
        selectedQuarter: 'Q4 2024',
        currentDocTab: 'all',
        claimFilterTopic: 'all',
        divergenceFilterSeverity: 'all',

        init() {
            if (!window.DashboardData) {
                console.error('DashboardData not loaded!');
                return;
            }

            // Set default quarter from latest data point
            const quarters = window.DashboardData.quarterlyData.map(q => q.quarter);
            this.selectedQuarter = quarters[quarters.length - 1] || 'Q4 2024';

            // Initial render of all view components
            this.renderCompanyHeader();
            this.renderOverviewKPIs();
            this.renderTopReasons();
            this.renderOverviewTimelinePreview();
            this.renderFinancialView();
            this.renderFinancialStatementsTable();
            this.renderLanguageView();
            this.renderDivergenceView();
            this.renderCreditView();
            this.renderComparisonView();
            this.renderResearchExperiments();
            this.renderDataSources();
            this.bindInteractiveControls();

            // Initialize Stress Lab & Evidence Modules
            if (window.StressTest && window.StressTest.init) {
                window.StressTest.init();
            }
            if (window.EvidenceManager && window.EvidenceManager.init) {
                window.EvidenceManager.init();
            }

            // Initialize Page 1 charts
            if (window.ChartManager) {
                setTimeout(() => {
                    window.ChartManager.initOverviewCharts();
                }, 50);
            }

            console.log('Sanah AI Research Dashboard initialized successfully. Current quarter:', this.selectedQuarter);
        },

        onPageChange(pageId) {
            // Lazy render/resize charts when navigating to specific views
            if (!window.ChartManager) return;

            setTimeout(() => {
                switch(pageId) {
                    case 'overview':
                        window.ChartManager.initOverviewCharts();
                        break;
                    case 'financial':
                        window.ChartManager.initFinancialCharts();
                        break;
                    case 'language':
                        window.ChartManager.initLanguageCharts();
                        break;
                    case 'divergence':
                        window.ChartManager.initDivergenceCharts();
                        break;
                    case 'credit':
                        window.ChartManager.initCreditCharts();
                        break;
                    case 'stress':
                        if (window.StressTest) {
                            window.StressTest.calculateAllScenarios();
                            window.StressTest.render();
                        }
                        break;
                    case 'comparison':
                        window.ChartManager.initComparisonCharts();
                        break;
                    case 'evidence':
                        if (window.EvidenceManager) {
                            window.EvidenceManager.render();
                        }
                        break;
                    case 'sources':
                        // Static/dynamic sources already populated
                        break;
                }
            }, 50);
        },

        onQuarterChange(quarter) {
            this.selectedQuarter = quarter;
            
            // Sync quarter dropdown in top bar if triggered elsewhere
            const select = document.getElementById('quarter-select');
            if (select && select.value !== quarter) {
                select.value = quarter;
            }

            // Re-render components that reflect quarter state
            this.renderCompanyHeader();
            this.renderOverviewKPIs();
            this.renderTopReasons();
            this.renderFinancialView();
            this.renderLanguageView();
            this.renderDivergenceView();
            this.renderCreditView();
            this.renderComparisonView();
        },

        // =========================================================================
        // VIEW RENDERERS
        // =========================================================================

        renderCompanyHeader() {
            const data = window.DashboardData;
            const q = this.selectedQuarter;
            const qData = data.quarterlyData.find(item => item.quarter === q) || data.quarterlyData[data.quarterlyData.length - 1];

            const headerEl = document.getElementById('company-header-widget');
            if (!headerEl) return;

            headerEl.innerHTML = `
                <div class="company-badge-header">
                    <div class="company-brand-box">
                        <div class="company-logo-avatar">CVNA</div>
                        <div class="company-title-info">
                            <div class="company-name-row">
                                <h1 class="company-title">Carvana Co.</h1>
                                <span class="badge badge-ticker">NYSE: CVNA</span>
                                <span class="badge badge-sector">${data.companyInfo.industry}</span>
                                <span class="badge badge-status">Active Research Track</span>
                            </div>
                            <div class="company-meta-row">
                                <span><strong>Selected Reporting Quarter:</strong> ${q}</span>
                                <span class="meta-separator">•</span>
                                <span><strong>Filing Date:</strong> ${qData.filing_date}</span>
                                <span class="meta-separator">•</span>
                                <span><strong>Call Date:</strong> ${qData.call_date}</span>
                                <span class="meta-separator">•</span>
                                <span class="text-amber"><strong>Cutoff:</strong> Contained historical timeline (No foresight leakage)</span>
                            </div>
                        </div>
                    </div>
                    <div class="company-header-actions">
                        <button class="btn btn-secondary btn-sm" onclick="Navigation.navigateTo('evidence')">
                            ${window.Icons ? window.Icons.get('evidence') : ''} Audit Trail
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="Navigation.navigateTo('stress')">
                            ${window.Icons ? window.Icons.get('stress') : ''} Stress Lab
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="Dashboard.openMethodologyModal()">
                            ${window.Icons ? window.Icons.get('info') : ''} Playbook Specs
                        </button>
                    </div>
                </div>
            `;
        },

        renderOverviewKPIs() {
            const q = this.selectedQuarter;
            const risk = window.DashboardData.riskScores.find(r => r.quarter === q) || window.DashboardData.riskScores[window.DashboardData.riskScores.length - 1];
            const qData = window.DashboardData.quarterlyData.find(item => item.quarter === q) || window.DashboardData.quarterlyData[window.DashboardData.quarterlyData.length - 1];
            const ratios = window.DashboardData.financialRatios.find(r => r.quarter === q) || {};
            const lang = window.DashboardData.managementLanguage.find(l => l.quarter === q) || {};
            const divItems = window.DashboardData.divergenceData.filter(d => d.quarter === q);
            const avgDiv = divItems.length > 0 
                ? (divItems.reduce((acc, curr) => acc + curr.divergence_score, 0) / divItems.length).toFixed(1)
                : '0.0';

            const container = document.getElementById('overview-kpi-grid');
            if (!container) return;

            const FE = window.FinancialEngine;

            const overallRiskBadge = FE ? FE.getRiskBadgeClass(risk.quantitative_risk) : 'badge-healthy';
            const aiRiskBadge = FE ? FE.getRiskBadgeClass(risk.ai_risk) : 'badge-watch';
            const humanRiskBadge = FE ? FE.getRiskBadgeClass(risk.human_risk) : 'badge-healthy';

            container.innerHTML = `
                <div class="kpi-card ${risk.quantitative_risk === 'Distressed' ? 'kpi-card-danger' : risk.quantitative_risk === 'Watch' ? 'kpi-card-warning' : 'kpi-card-success'}">
                    <div class="kpi-card-header">
                        <span class="kpi-label">Overall Risk Status</span>
                        <span class="risk-pulse-dot ${risk.quantitative_risk.toLowerCase()}"></span>
                    </div>
                    <div class="kpi-main-stat">
                        <span class="badge ${overallRiskBadge} badge-lg">${risk.quantitative_risk}</span>
                    </div>
                    <div class="kpi-sub-stat">
                        <span>Lead Time: <strong>${risk.warning_lead_time || 'On schedule'}</strong></span>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-card-header">
                        <span class="kpi-label">AI Risk Assessment</span>
                        <span class="badge badge-purple">NLP + Quant</span>
                    </div>
                    <div class="kpi-main-stat">
                        <span class="badge ${aiRiskBadge} badge-lg">${risk.ai_risk}</span>
                    </div>
                    <div class="kpi-sub-stat">
                        <span>Confidence: <strong>${risk.ai_confidence}%</strong></span>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-card-header">
                        <span class="kpi-label">Human Consensus</span>
                        <span class="badge badge-info">Analyst Model</span>
                    </div>
                    <div class="kpi-main-stat">
                        <span class="badge ${humanRiskBadge} badge-lg">${risk.human_risk}</span>
                    </div>
                    <div class="kpi-sub-stat">
                        <span>Confidence: <strong>${risk.human_confidence}%</strong></span>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-card-header">
                        <span class="kpi-label">Financial Risk Score</span>
                        <span class="badge badge-secondary">Deterministic</span>
                    </div>
                    <div class="kpi-main-stat">
                        <span class="kpi-number">${ratios.interest_coverage !== null ? (typeof ratios.interest_coverage === 'number' ? ratios.interest_coverage.toFixed(2) + 'x' : ratios.interest_coverage) : 'N/A'}</span>
                    </div>
                    <div class="kpi-sub-stat">
                        <span>Interest Coverage Proxy</span>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-card-header">
                        <span class="kpi-label">Management Tone / Uncertainty</span>
                        <span class="badge badge-purple">MD&A + Call</span>
                    </div>
                    <div class="kpi-main-stat">
                        <span class="kpi-number">${lang.management_tone ?? 2.0} / 3.0</span>
                    </div>
                    <div class="kpi-sub-stat">
                        <span>Uncertainty Index: <strong>${lang.uncertainty ?? 1.0} / 3</strong></span>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-card-header">
                        <span class="kpi-label">Words vs Numbers Divergence</span>
                        <span class="badge badge-danger">Signature Signal</span>
                    </div>
                    <div class="kpi-main-stat">
                        <span class="kpi-number">${avgDiv} <span class="kpi-unit">/ 3.0</span></span>
                    </div>
                    <div class="kpi-sub-stat">
                        <span>${parseFloat(avgDiv) >= 2.0 ? '<span class="notif-dot red" style="display:inline-block; margin-right:4px;"></span> Material Mismatch' : parseFloat(avgDiv) >= 1.0 ? '<span class="notif-dot amber" style="display:inline-block; margin-right:4px;"></span> Mild Inconsistency' : '<span class="notif-dot green" style="display:inline-block; margin-right:4px;"></span> Aligned Messaging'}</span>
                    </div>
                </div>
            `;
        },

        renderTopReasons() {
            const container = document.getElementById('top-reasons-container');
            if (!container) return;

            const q = this.selectedQuarter;
            const qData = window.DashboardData.quarterlyData.find(item => item.quarter === q);
            const lang = window.DashboardData.managementLanguage.find(l => l.quarter === q);
            const claims = window.DashboardData.managementClaims.filter(c => c.quarter === q);
            const ev = window.DashboardData.evidenceRecords.filter(e => e.quarter === q);

            let reasons = [];

            // Context-sensitive reasons based on quarter trajectory
            if (q.includes('2021')) {
                reasons = [
                    {
                        title: 'Hyper-growth in retail vehicle volume with compressed gross margins',
                        metric: `Revenue: $${qData?.revenue}M | Units: ${qData?.retail_units_sold?.toLocaleString() || 'N/A'}`,
                        severity: 'low',
                        sevText: 'Healthy Momentum',
                        excerpt: claims[0]?.statement || 'Rapid unit scaling continues across key metropolitan logistics hubs.',
                        evidenceId: ev[0]?.id || 'EVD-'
                    },
                    {
                        title: 'Inventory ramp financed with senior unsecured notes',
                        metric: `Total Debt: $${qData?.total_debt}M | Cash: $${qData?.cash}M`,
                        severity: 'medium',
                        sevText: 'Watch Leverage',
                        excerpt: 'Capital structure expanded to support rapid vehicle refurbishment centers.',
                        evidenceId: ev[1]?.id || 'EVD-'
                    },
                    {
                        title: 'Management claims confident demand amidst supply headwinds',
                        metric: `Uncertainty Index: ${lang?.uncertainty ?? 0.8}/3.0`,
                        severity: 'low',
                        sevText: 'Aligned Narrative',
                        excerpt: 'Management expressed elevated confidence in GPU growth and vehicle supply availability.',
                        evidenceId: ev[2]?.id || 'EVD-'
                    }
                ];
            } else if (q.includes('2022')) {
                reasons = [
                    {
                        title: 'ADESA acquisition debt burden in rising interest rate environment',
                        metric: `Total Debt: $${qData?.total_debt}M | Interest Expense: $${qData?.interest_expense}M`,
                        severity: 'critical',
                        sevText: 'Critical Stress',
                        excerpt: 'Issuance of $3.275B 10.25% Senior Notes created substantial fixed debt service load.',
                        evidenceId: 'EVD-'
                    },
                    {
                        title: 'Sharp GPU & Gross Margin compression vs optimistic guidance',
                        metric: `Gross Margin: ${qData?.gross_margin}% | Operating Loss: -$${Math.abs(qData?.operating_income || 0)}M`,
                        severity: 'high',
                        sevText: 'Material Divergence',
                        excerpt: 'Management initially cited temporary used vehicle depreciation; losses accelerated for 3 consecutive quarters.',
                        evidenceId: 'EVD-'
                    },
                    {
                        title: 'Elevated Q&A defensiveness and rising repeated explanations',
                        metric: `Q&A Defensiveness: ${lang?.qa_defensiveness ?? 2.8}/3 | Repeated Excuses: ${lang?.repeated_explanations ?? 3}`,
                        severity: 'high',
                        sevText: 'Language Warning',
                        excerpt: 'Frequent hedging regarding vehicle retail demand softness and floorplan borrowing headroom.',
                        evidenceId: 'EVD-'
                    }
                ];
            } else if (q.includes('2023')) {
                reasons = [
                    {
                        title: 'Out-of-court debt exchange extinguished ~$1.2B of face-value debt',
                        metric: `Net Debt Reduction: -$1,200M | PIK Toggle Feature Active`,
                        severity: 'medium',
                        sevText: 'Restructuring Milestone',
                        excerpt: 'Exchange offered senior secured PIK-toggle notes to defer cash interest payments.',
                        evidenceId: 'EVD-'
                    },
                    {
                        title: 'Inflexion in Gross Profit Per Unit (GPU) exceeding $6,000/car',
                        metric: `Gross Margin: ${qData?.gross_margin}% | EBITDA: $${qData?.ebitda}M`,
                        severity: 'low',
                        sevText: 'Recovery Indicator',
                        excerpt: 'Management aggressively stripped SG&A expense and optimized wholesale logistics.',
                        evidenceId: 'EVD-'
                    },
                    {
                        title: 'AI model detects language stabilization prior to human rating upgrade',
                        metric: `AI Risk: Watch -> Healthy | Human Risk: Distressed -> Watch`,
                        severity: 'low',
                        sevText: 'AI Early Lead Time',
                        excerpt: 'Management guidance became quantitative and disciplined, matching reported gross margin gains.',
                        evidenceId: 'EVD-'
                    }
                ];
            } else {
                // 2024 - 2025
                reasons = [
                    {
                        title: 'Sustained GAAP operating profitability and robust positive Free Cash Flow',
                        metric: `Operating Income: +$${qData?.operating_income}M | FCF: +$${qData?.free_cash_flow}M`,
                        severity: 'low',
                        sevText: 'Confirmed Turnaround',
                        excerpt: 'Core retail operations generate organic cash cushion without capital market reliance.',
                        evidenceId: 'EVD-'
                    },
                    {
                        title: 'Liquidity runway expanded with cash reserves exceeding $1.1B',
                        metric: `Cash: $${qData?.cash}M | Floorplan Headroom: Unrestricted`,
                        severity: 'low',
                        sevText: 'Robust Liquidity',
                        excerpt: 'Debt maturities pushed to 2028-2031, leaving near-term refinancing obligations negligible.',
                        evidenceId: 'EVD-'
                    },
                    {
                        title: 'Management statements align 100% with audited quantitative filings',
                        metric: `Divergence Score: 0.1/3.0 | Tone: 2.8/3.0`,
                        severity: 'low',
                        sevText: 'High Fidelity',
                        excerpt: 'Direct and transparent forward guidance validated across consecutive quarterly 10-Q disclosures.',
                        evidenceId: 'EVD-'
                    }
                ];
            }

            container.innerHTML = reasons.map((r, i) => `
                <div class="insight-card severity-${r.severity}">
                    <div class="insight-card-top">
                        <span class="insight-num">0${i + 1}</span>
                        <h4 class="insight-title">${r.title}</h4>
                        <span class="badge ${r.severity === 'critical' || r.severity === 'high' ? 'badge-distressed' : r.severity === 'medium' ? 'badge-watch' : 'badge-healthy'}">${r.sevText}</span>
                    </div>
                    <div class="insight-metrics-row">
                        <code>${r.metric}</code>
                    </div>
                    <blockquote class="insight-excerpt">
                        "${r.excerpt}"
                    </blockquote>
                    <div class="insight-footer">
                        <span class="insight-ref">Evidence Link: <strong>${r.evidenceId}</strong></span>
                        <button class="btn btn-ghost btn-sm" onclick="Navigation.openEvidenceDrawer('${r.evidenceId}')">
                            Audit Trace ↗
                        </button>
                    </div>
                </div>
            `).join('');
        },

        renderOverviewTimelinePreview() {
            const container = document.getElementById('overview-timeline-preview');
            if (!container) return;

            const events = window.DashboardData.creditEvents.slice(-4);
            container.innerHTML = events.map(e => `
                <div class="timeline-preview-item">
                    <div class="timeline-preview-dot ${e.severity}"></div>
                    <div class="timeline-preview-content">
                        <div class="timeline-preview-date">${e.date} (${e.quarter})</div>
                        <h5 class="timeline-preview-title">${e.title}</h5>
                        <p class="timeline-preview-desc">${e.description}</p>
                    </div>
                </div>
            `).join('');
        },

        // =========================================================================
        // FINANCIAL TREND VIEW
        // =========================================================================

        renderFinancialView() {
            const q = this.selectedQuarter;
            const qData = window.DashboardData.quarterlyData.find(item => item.quarter === q) || window.DashboardData.quarterlyData[window.DashboardData.quarterlyData.length - 1];
            const qIdx = window.DashboardData.quarterlyData.indexOf(qData);
            const prevQData = qIdx > 0 ? window.DashboardData.quarterlyData[qIdx - 1] : null;
            const FE = window.FinancialEngine;

            const ratios = FE ? FE.calculateRatios(qData, prevQData) : {};

            const container = document.getElementById('financial-ratio-cards');
            if (!container) return;

            container.innerHTML = `
                <div class="metric-tile">
                    <span class="metric-tile-label">Revenue Growth (QoQ)</span>
                    <span class="metric-tile-val ${ratios.revenue_growth >= 0 ? 'text-green' : 'text-red'}">
                        ${ratios.revenue_growth !== null ? ratios.revenue_growth.toFixed(1) + '%' : 'N/A'}
                    </span>
                    <span class="metric-tile-sub">Quarterly delta</span>
                </div>
                <div class="metric-tile">
                    <span class="metric-tile-label">Gross Margin</span>
                    <span class="metric-tile-val text-blue">
                        ${ratios.gross_margin !== null ? ratios.gross_margin.toFixed(1) + '%' : 'N/A'}
                    </span>
                    <span class="metric-tile-sub">Gross profit / Revenue</span>
                </div>
                <div class="metric-tile">
                    <span class="metric-tile-label">EBITDA Margin</span>
                    <span class="metric-tile-val ${ratios.ebitda_margin >= 0 ? 'text-green' : 'text-red'}">
                        ${ratios.ebitda_margin !== null ? ratios.ebitda_margin.toFixed(1) + '%' : 'N/A'}
                    </span>
                    <span class="metric-tile-sub">Operating efficiency proxy</span>
                </div>
                <div class="metric-tile">
                    <span class="metric-tile-label">Net Debt ($M)</span>
                    <span class="metric-tile-val text-amber">
                        $${ratios.net_debt?.toLocaleString() || 'N/A'}M
                    </span>
                    <span class="metric-tile-sub">Total Debt - Cash</span>
                </div>
                <div class="metric-tile">
                    <span class="metric-tile-label">Leverage Proxy (Debt/EBITDA)</span>
                    <span class="metric-tile-val ${ratios.leverage_ratio === 'N/M' ? 'text-red' : 'text-blue'}">
                        ${typeof ratios.leverage_ratio === 'number' ? ratios.leverage_ratio.toFixed(2) + 'x' : ratios.leverage_ratio}
                    </span>
                    <span class="metric-tile-sub">Annualized run-rate</span>
                </div>
                <div class="metric-tile">
                    <span class="metric-tile-label">Interest Coverage Proxy</span>
                    <span class="metric-tile-val ${typeof ratios.interest_coverage === 'number' && ratios.interest_coverage < 1.0 ? 'text-red' : 'text-green'}">
                        ${typeof ratios.interest_coverage === 'number' ? ratios.interest_coverage.toFixed(2) + 'x' : ratios.interest_coverage}
                    </span>
                    <span class="metric-tile-sub">EBITDA / Interest Exp</span>
                </div>
                <div class="metric-tile">
                    <span class="metric-tile-label">Liquidity Indicator</span>
                    <span class="metric-tile-val ${typeof ratios.liquidity_indicator === 'number' && ratios.liquidity_indicator < 4.0 ? 'text-amber' : 'text-green'}">
                        ${typeof ratios.liquidity_indicator === 'number' ? ratios.liquidity_indicator.toFixed(1) + ' Qtrs' : 'N/A'}
                    </span>
                    <span class="metric-tile-sub">Cash / Quarterly Interest</span>
                </div>
            `;
        },

        renderFinancialStatementsTable() {
            const tbody = document.getElementById('financial-table-body');
            if (!tbody) return;

            const data = window.DashboardData.quarterlyData;

            tbody.innerHTML = data.map(row => {
                const isSelected = row.quarter === this.selectedQuarter;
                return `
                    <tr class="${isSelected ? 'selected-quarter-row' : ''}" onclick="Dashboard.onQuarterChange('${row.quarter}')" style="cursor: pointer;">
                        <td><strong>${row.quarter}</strong></td>
                        <td>$${row.revenue.toLocaleString()}M</td>
                        <td>$${row.gross_profit.toLocaleString()}M</td>
                        <td>${row.gross_margin}%</td>
                        <td class="${row.operating_income < 0 ? 'text-red' : 'text-green'}">$${row.operating_income.toLocaleString()}M</td>
                        <td class="${row.ebitda < 0 ? 'text-red' : 'text-green'}">$${row.ebitda.toLocaleString()}M</td>
                        <td class="${row.net_income < 0 ? 'text-red' : 'text-green'}">$${row.net_income.toLocaleString()}M</td>
                        <td>$${row.cash.toLocaleString()}M</td>
                        <td class="text-amber">$${row.total_debt.toLocaleString()}M</td>
                        <td class="${row.operating_cash_flow < 0 ? 'text-red' : 'text-green'}">$${row.operating_cash_flow.toLocaleString()}M</td>
                        <td class="${row.free_cash_flow < 0 ? 'text-red' : 'text-green'}">$${row.free_cash_flow.toLocaleString()}M</td>
                        <td>$${row.interest_expense.toLocaleString()}M</td>
                    </tr>
                `;
            }).join('');
        },

        // =========================================================================
        // MANAGEMENT LANGUAGE & EARNINGS CALL VIEW
        // =========================================================================

        renderLanguageView() {
            const q = this.selectedQuarter;
            const lang = window.DashboardData.managementLanguage.find(l => l.quarter === q) || {};
            
            // 1. Language Scores Card Grid
            const scoresContainer = document.getElementById('language-scores-grid');
            if (scoresContainer) {
                scoresContainer.innerHTML = `
                    <div class="metric-tile">
                        <span class="metric-tile-label">Tone / Confidence</span>
                        <span class="metric-tile-val text-green">${lang.management_tone ?? 2.0} / 3.0</span>
                        <span class="metric-tile-sub">0: Dismal • 3: Highly Confident</span>
                    </div>
                    <div class="metric-tile">
                        <span class="metric-tile-label">Uncertainty / Hedging</span>
                        <span class="metric-tile-val ${lang.uncertainty >= 2.0 ? 'text-red' : 'text-amber'}">${lang.uncertainty ?? 1.0} / 3.0</span>
                        <span class="metric-tile-sub">0: Clear • 3: Heavily Hedged</span>
                    </div>
                    <div class="metric-tile">
                        <span class="metric-tile-label">Specificity Level</span>
                        <span class="metric-tile-val text-blue">${lang.specificity ?? 1.5} / 3.0</span>
                        <span class="metric-tile-sub">0: Vague • 3: Concrete Targets</span>
                    </div>
                    <div class="metric-tile">
                        <span class="metric-tile-label">Q&A Defensiveness</span>
                        <span class="metric-tile-val ${lang.qa_defensiveness >= 2.0 ? 'text-red' : 'text-green'}">${lang.qa_defensiveness ?? 1.0} / 3.0</span>
                        <span class="metric-tile-sub">0: Direct • 3: Evasive</span>
                    </div>
                    <div class="metric-tile">
                        <span class="metric-tile-label">New Risk Themes</span>
                        <span class="metric-tile-val ${lang.new_risk_themes > 2 ? 'text-red' : 'text-blue'}">${lang.new_risk_themes ?? 0}</span>
                        <span class="metric-tile-sub">Emergent risk topics</span>
                    </div>
                    <div class="metric-tile">
                        <span class="metric-tile-label">Repeated Explanations</span>
                        <span class="metric-tile-val ${lang.repeated_explanations > 1 ? 'text-amber' : 'text-muted'}">${lang.repeated_explanations ?? 0}</span>
                        <span class="metric-tile-sub">Recurring temporary excuses</span>
                    </div>
                    <div class="metric-tile">
                        <span class="metric-tile-label">Guidance Trajectory</span>
                        <span class="metric-tile-val ${lang.guidance_change > 0 ? 'text-green' : lang.guidance_change < 0 ? 'text-red' : 'text-muted'}">
                            ${lang.guidance_change > 0 ? 'Raised (+1)' : lang.guidance_change < 0 ? 'Lowered (-1)' : 'Maintained (0)'}
                        </span>
                        <span class="metric-tile-sub">Revision direction</span>
                    </div>
                `;
            }

            // 2. What Changed Since Last Quarter Panel
            this.renderWhatChangedPanel();

            // 3. Claims List
            this.renderClaimsList();
        },

        renderWhatChangedPanel() {
            const container = document.getElementById('what-changed-panel');
            if (!container) return;

            const q = this.selectedQuarter;
            const qList = window.DashboardData.quarterlyData.map(d => d.quarter);
            const idx = qList.indexOf(q);
            const prevQ = idx > 0 ? qList[idx - 1] : null;

            if (!prevQ) {
                container.innerHTML = `
                    <div class="what-changed-empty">
                        <p>Initial baseline observation (${q}). Quarter-over-quarter longitudinal diff tracking active starting next period.</p>
                    </div>
                `;
                return;
            }

            const currLang = window.DashboardData.managementLanguage.find(l => l.quarter === q) || {};
            const prevLang = window.DashboardData.managementLanguage.find(l => l.quarter === prevQ) || {};

            const toneDelta = (currLang.management_tone - prevLang.management_tone).toFixed(1);
            const uncDelta = (currLang.uncertainty - prevLang.uncertainty).toFixed(1);
            const defDelta = (currLang.qa_defensiveness - prevLang.qa_defensiveness).toFixed(1);

            container.innerHTML = `
                <div class="what-changed-header">
                    <h4>Longitudinal Linguistic Diff: ${prevQ} → ${q}</h4>
                    <span class="badge badge-purple">NLP Change Detector</span>
                </div>
                <div class="what-changed-grid">
                    <div class="what-changed-card">
                        <div class="what-changed-card-title">Tone & Confidence Shift</div>
                        <div class="what-changed-delta ${parseFloat(toneDelta) >= 0 ? 'text-green' : 'text-red'}">
                            ${parseFloat(toneDelta) > 0 ? '▲ +' + toneDelta : parseFloat(toneDelta) < 0 ? '▼ ' + toneDelta : '▶ 0.0'}
                        </div>
                        <p class="what-changed-desc">
                            ${parseFloat(toneDelta) < 0 ? 'Management shifted away from optimistic multi-year growth claims toward operational defense.' : 'Increased confidence backed by demonstrable metric stabilization.'}
                        </p>
                    </div>
                    <div class="what-changed-card">
                        <div class="what-changed-card-title">Uncertainty & Hedging</div>
                        <div class="what-changed-delta ${parseFloat(uncDelta) > 0 ? 'text-red' : 'text-green'}">
                            ${parseFloat(uncDelta) > 0 ? '▲ +' + uncDelta : parseFloat(uncDelta) < 0 ? '▼ ' + uncDelta : '▶ 0.0'}
                        </div>
                        <p class="what-changed-desc">
                            ${parseFloat(uncDelta) > 0 ? 'Higher frequency of conditional clauses ("subject to", "challenging macro", "difficult to predict").' : 'Hedging clauses dropped as unit economics became predictable.'}
                        </p>
                    </div>
                    <div class="what-changed-card">
                        <div class="what-changed-card-title">Analyst Q&A Friction</div>
                        <div class="what-changed-delta ${parseFloat(defDelta) > 0 ? 'text-red' : 'text-green'}">
                            ${parseFloat(defDelta) > 0 ? '▲ +' + defDelta : parseFloat(defDelta) < 0 ? '▼ ' + defDelta : '▶ 0.0'}
                        </div>
                        <p class="what-changed-desc">
                            ${parseFloat(defDelta) > 0 ? 'Analysts pressed directly on debt maturities and floorplan availability; answers were redirected.' : 'Direct numerical answers provided during the conference call without evasion.'}
                        </p>
                    </div>
                </div>
            `;
        },

        renderClaimsList() {
            const container = document.getElementById('management-claims-list');
            if (!container) return;

            let claims = window.DashboardData.managementClaims;

            // Filter by selected quarter if active
            const qFilter = this.selectedQuarter;
            if (qFilter !== 'all') {
                const qClaims = claims.filter(c => c.quarter === qFilter);
                if (qClaims.length > 0) claims = qClaims;
            }

            // Filter by topic
            if (this.claimFilterTopic !== 'all') {
                claims = claims.filter(c => c.topic.toLowerCase() === this.claimFilterTopic.toLowerCase());
            }

            // Filter by doc tab
            if (this.currentDocTab !== 'all') {
                claims = claims.filter(c => c.source_type.toLowerCase().includes(this.currentDocTab.toLowerCase()));
            }

            if (claims.length === 0) {
                container.innerHTML = `<div class="empty-state">No management claims match the selected filters for ${this.selectedQuarter}.</div>`;
                return;
            }

            container.innerHTML = claims.map(c => `
                <div class="claim-card">
                    <div class="claim-card-header">
                        <div class="claim-meta">
                            <span class="badge badge-info">${c.source_type}</span>
                            <span class="claim-speaker"><strong>${c.speaker || 'Management'}</strong></span>
                            <span class="claim-quarter">• ${c.quarter}</span>
                            <span class="badge ${c.direction === 'positive' ? 'badge-healthy' : c.direction === 'negative' ? 'badge-distressed' : 'badge-watch'}">
                                ${c.direction.toUpperCase()}
                            </span>
                        </div>
                        <div class="claim-confidence">
                            AI Confidence: <strong>${c.ai_confidence}%</strong>
                        </div>
                    </div>
                    <blockquote class="claim-quote">
                        "${c.statement}"
                    </blockquote>
                    <div class="claim-excerpt-box">
                        <span class="claim-excerpt-label">Verbatim Filing Excerpt [ILLUSTRATIVE]:</span>
                        <p class="claim-excerpt-text">${c.evidence_excerpt}</p>
                    </div>
                    <div class="claim-card-footer">
                        <span class="badge badge-secondary">Topic: ${c.topic}</span>
                        <button class="btn btn-ghost btn-sm" onclick="Navigation.openEvidenceDrawer('EVD-')">
                            Trace Source Passage ↗
                        </button>
                    </div>
                </div>
            `).join('');
        },

        // =========================================================================
        // MANAGEMENT VS NUMBERS DIVERGENCE VIEW (SIGNATURE RESEARCH PAGE)
        // =========================================================================

        renderDivergenceView() {
            const container = document.getElementById('divergence-items-container');
            if (!container) return;

            let items = window.DashboardData.divergenceData;

            // Apply severity filter
            if (this.divergenceFilterSeverity !== 'all') {
                const targetScore = parseInt(this.divergenceFilterSeverity, 10);
                items = items.filter(i => i.divergence_score === targetScore);
            }

            if (items.length === 0) {
                container.innerHTML = '<div class="empty-state">No divergence signals match the active severity criteria.</div>';
                return;
            }

            const getScoreBadge = (score) => {
                switch(score) {
                    case 0: return '<span class="badge badge-healthy badge-lg">Score 0: Aligned</span>';
                    case 1: return '<span class="badge badge-info badge-lg">Score 1: Mild Inconsistency</span>';
                    case 2: return '<span class="badge badge-watch badge-lg">Score 2: Material Inconsistency</span>';
                    case 3: return '<span class="badge badge-distressed badge-lg">Score 3: Repeated Contradiction</span>';
                    default: return '';
                }
            };

            container.innerHTML = items.map(d => `
                <div class="divergence-panel severity-level-${d.divergence_score}">
                    <!-- Column 1: Management Claim -->
                    <div class="divergence-col divergence-col-claim">
                        <div class="divergence-col-badge">
                            <span class="badge badge-purple">Qualitative Statement</span>
                            <span class="divergence-quarter">${d.quarter}</span>
                        </div>
                        <h4 class="divergence-claim-heading">Management Claim</h4>
                        <blockquote class="divergence-claim-quote">
                            "${d.claim}"
                        </blockquote>
                        <div class="divergence-claim-meta">
                            <span>Claim Direction: <strong>${d.claim_direction.toUpperCase()}</strong></span>
                            <span>Persistence: <strong>${d.persistence_quarters} Consecutive Quarter(s)</strong></span>
                        </div>
                    </div>

                    <!-- Column 2: Quantitative Evidence -->
                    <div class="divergence-col divergence-col-evidence">
                        <div class="divergence-col-badge">
                            <span class="badge badge-info">Audited Metrics</span>
                            <span class="divergence-metric-name">${d.linked_metric}</span>
                        </div>
                        <h4 class="divergence-metric-heading">Contemporaneous Numbers</h4>
                        <div class="divergence-metric-box">
                            <div class="divergence-trend-indicator ${d.metric_direction === 'down' ? 'text-red' : d.metric_direction === 'up' ? 'text-green' : 'text-blue'}">
                                ${d.metric_direction === 'down' ? '▼ Sharp Deterioration' : d.metric_direction === 'up' ? '▲ Expanding Growth' : '▶ Flat/Volatile'}
                            </div>
                            <p class="divergence-metric-desc">
                                Audited SEC 10-Q filing trends for <strong>${d.quarter}</strong> show metric moved in direction: <strong>${d.metric_direction}</strong>.
                            </p>
                        </div>
                    </div>

                    <!-- Column 3: Divergence Result & Persistence -->
                    <div class="divergence-col divergence-col-result">
                        <div class="divergence-col-badge">
                            ${getScoreBadge(d.divergence_score)}
                        </div>
                        <h4 class="divergence-result-heading">AI Divergence Explanation</h4>
                        <p class="divergence-explanation-text">
                            ${d.explanation}
                        </p>
                        <div class="divergence-action-row">
                            <button class="btn btn-secondary btn-sm" onclick="Navigation.openEvidenceDrawer('${d.evidence_id}')">
                                ${window.Icons ? window.Icons.get('evidence') : ''} Inspect Evidence Record (${d.evidence_id})
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        },

        // =========================================================================
        // CREDIT EVENTS, DEBT & COVENANT SURVEILLANCE VIEW
        // =========================================================================

        renderCreditView() {
            // 1. Debt Instruments Table
            const debtTbody = document.getElementById('debt-instruments-tbody');
            if (debtTbody && window.DashboardData.debtInstruments) {
                debtTbody.innerHTML = window.DashboardData.debtInstruments.map(inst => `
                    <tr>
                        <td><strong>${inst.name}</strong></td>
                        <td><span class="badge badge-secondary">${inst.type}</span></td>
                        <td>$${inst.principal?.toLocaleString()}M</td>
                        <td>${inst.interest_rate}</td>
                        <td>${inst.maturity_date}</td>
                        <td>
                            <span class="badge ${inst.status.includes('Restructured') ? 'badge-distressed' : inst.status.includes('Active') ? 'badge-healthy' : 'badge-watch'}">
                                ${inst.status}
                            </span>
                        </td>
                        <td><small class="text-muted">${inst.notes}</small></td>
                    </tr>
                `).join('');
            }

            // 2. Full Credit Events Timeline
            const timelineContainer = document.getElementById('full-credit-timeline');
            if (timelineContainer && window.DashboardData.creditEvents) {
                timelineContainer.innerHTML = window.DashboardData.creditEvents.map(ev => `
                    <div class="credit-timeline-item severity-${ev.severity}">
                        <div class="credit-timeline-marker"></div>
                        <div class="credit-timeline-card">
                            <div class="credit-timeline-card-header">
                                <span class="badge ${ev.severity === 'critical' ? 'badge-distressed' : ev.severity === 'high' ? 'badge-watch' : 'badge-healthy'}">
                                    ${ev.event_type}
                                </span>
                                <span class="credit-timeline-date">${ev.date} • ${ev.quarter}</span>
                            </div>
                            <h4 class="credit-timeline-title">${ev.title}</h4>
                            <p class="credit-timeline-desc">${ev.description}</p>
                            <div class="credit-timeline-footer">
                                <a href="${ev.source_url}" class="credit-timeline-link" onclick="Dashboard.openDemoDocNotice(event)">
                                    SEC Exhibit Filing ↗
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            // 3. Covenant Surveillance Disclosure
            const covContainer = document.getElementById('covenant-surveillance-container');
            if (covContainer && window.DashboardData.covenantData) {
                covContainer.innerHTML = `
                    <div class="covenant-card-grid">
                        ${window.DashboardData.covenantData.map(c => `
                            <div class="covenant-card ${c.is_disclosed ? 'disclosed' : 'undisclosed'}">
                                <div class="covenant-card-header">
                                    <h5>${c.name}</h5>
                                    <span class="badge ${c.is_disclosed ? 'badge-healthy' : 'badge-secondary'}">
                                        ${c.is_disclosed ? 'Disclosed Public Term' : 'Not Publicly Disclosed'}
                                    </span>
                                </div>
                                <div class="covenant-values">
                                    <div class="cov-val-item">
                                        <span>Required Threshold:</span>
                                        <strong>${c.threshold}</strong>
                                    </div>
                                    <div class="cov-val-item">
                                        <span>Reported Actual:</span>
                                        <strong class="${c.status === 'Compliant' ? 'text-green' : 'text-amber'}">${c.actual}</strong>
                                    </div>
                                    <div class="cov-val-item">
                                        <span>Estimated Headroom:</span>
                                        <strong>${c.headroom}</strong>
                                    </div>
                                </div>
                                <p class="covenant-notes"><small>${c.notes}</small></p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="covenant-integrity-notice">
                        <strong>${window.Icons ? window.Icons.get('shield') : ''} Research Playbook Covenant Rule:</strong>
                        Only display covenants when explicitly supported by 10-Q/10-K or Credit Agreement exhibits. Never invent arbitrary headroom percentages or breaches where not public.
                    </div>
                `;
            }
        },

        // =========================================================================
        // AI VS HUMAN ANALYSIS VIEW
        // =========================================================================

        renderComparisonView() {
            const matrixTbody = document.getElementById('comparison-matrix-tbody');
            if (!matrixTbody) return;

            const scores = window.DashboardData.riskScores;
            const FE = window.FinancialEngine;

            matrixTbody.innerHTML = scores.map(s => {
                const qRiskBadge = FE.getRiskBadgeClass(s.quantitative_risk);
                const aiRiskBadge = FE.getRiskBadgeClass(s.ai_risk);
                const hRiskBadge = FE.getRiskBadgeClass(s.human_risk);
                const outBadge = FE.getRiskBadgeClass(s.outcome);

                const isAgreed = s.ai_risk === s.human_risk;

                return `
                    <tr class="${s.quarter === this.selectedQuarter ? 'selected-quarter-row' : ''}">
                        <td><strong>${s.quarter}</strong></td>
                        <td><span class="badge ${qRiskBadge}">${s.quantitative_risk}</span></td>
                        <td>
                            <span class="badge ${aiRiskBadge}">${s.ai_risk}</span>
                            <small class="text-muted">${s.ai_confidence}%</small>
                        </td>
                        <td>
                            <span class="badge ${hRiskBadge}">${s.human_risk}</span>
                            <small class="text-muted">${s.human_confidence}%</small>
                        </td>
                        <td>
                            <span class="badge ${outBadge}">${s.outcome}</span>
                        </td>
                        <td>
                            ${isAgreed 
                                ? '<span class="text-green">' + (window.Icons ? window.Icons.get('check') : '') + ' Consensus</span>' 
                                : '<span class="text-amber">' + (window.Icons ? window.Icons.get('divergence') : '') + ' Divergent (' + (s.warning_lead_time || 'Lead signal') + ')</span>'}
                        </td>
                        <td>
                            <small class="text-muted">${s.warning_lead_time || 'In sync'}</small>
                        </td>
                    </tr>
                `;
            }).join('');
        },

        renderResearchExperiments() {
            const container = document.getElementById('research-experiments-container');
            if (!container || !window.DashboardData.researchExperiments) return;

            container.innerHTML = window.DashboardData.researchExperiments.map(exp => `
                <div class="experiment-card">
                    <div class="experiment-card-header">
                        <span class="experiment-num">EXP-${exp.id}</span>
                        <span class="badge ${exp.status === 'Completed (PoC)' ? 'badge-healthy' : 'badge-secondary'}">${exp.status}</span>
                    </div>
                    <h5 class="experiment-title">${exp.name}</h5>
                    <p class="experiment-desc">${exp.description}</p>
                    <div class="experiment-meta">
                        <div class="exp-meta-item">
                            <span class="exp-label">Target Metrics:</span>
                            <span class="exp-val">${exp.target_metrics}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        },

        // =========================================================================
        // DATA SOURCES VIEW
        // =========================================================================

        renderDataSources() {
            const container = document.getElementById('data-sources-container');
            if (!container || !window.DashboardData.dataSources) return;

            container.innerHTML = window.DashboardData.dataSources.map(s => `
                <div class="source-card">
                    <div class="source-card-header">
                        <span class="badge ${s.category === 'Carvana' ? 'badge-info' : s.category === 'Macroeconomic' ? 'badge-purple' : 'badge-secondary'}">
                            ${s.category}
                        </span>
                        <span class="source-status-pill">Preserved Hyperlink</span>
                    </div>
                    <h4 class="source-card-title">${s.name}</h4>
                    <p class="source-card-desc">${s.description}</p>
                    <div class="source-url-preview">
                        <code>${s.url}</code>
                    </div>
                    <div class="source-card-footer">
                        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                            Open First-Party Source ↗
                        </a>
                    </div>
                </div>
            `).join('');
        },

        // =========================================================================
        // INTERACTIVE EVENT BINDINGS
        // =========================================================================

        bindInteractiveControls() {
            // Document Tab switcher on Management Language page
            document.querySelectorAll('[data-doc-tab]').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    document.querySelectorAll('[data-doc-tab]').forEach(t => t.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    this.currentDocTab = e.currentTarget.dataset.docTab;
                    this.renderClaimsList();
                });
            });

            // Claim Topic Filter
            const topicFilter = document.getElementById('claim-topic-filter');
            if (topicFilter) {
                topicFilter.addEventListener('change', (e) => {
                    this.claimFilterTopic = e.target.value;
                    this.renderClaimsList();
                });
            }

            // Divergence Severity Filter
            const divFilter = document.getElementById('divergence-severity-filter');
            if (divFilter) {
                divFilter.addEventListener('change', (e) => {
                    this.divergenceFilterSeverity = e.target.value;
                    this.renderDivergenceView();
                });
            }

            // Export Modal Trigger
            const exportBtn = document.getElementById('export-report-btn');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    this.openExportModal();
                });
            }
        },

        // Modals & Notices
        openMethodologyModal() {
            if (window.Navigation) {
                window.Navigation.openModal('modal-methodology');
            }
        },

        openExportModal() {
            if (window.Navigation) {
                window.Navigation.openModal('modal-export');
            }
        },

        openDemoDocNotice(e) {
            e.preventDefault();
            alert('SEC exhibits and full transcript texts are indexed in the Evidence & Audit Trail tab with exact verbatim excerpts.');
        }
    };

    window.Dashboard = Dashboard;

    // Boot on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        Dashboard.init();
    });
})();

