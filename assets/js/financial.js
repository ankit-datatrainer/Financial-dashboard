// Financial Calculation Engine — Sanah's AI + Private Credit Research Dashboard
// All calculations are deterministic. No LLM arithmetic.
(function() {
    'use strict';

    const FinancialEngine = {

        // Calculate derived ratios from raw quarterly data
        calculateRatios(current, previous) {
            const ratios = {};
            
            // Revenue Growth (QoQ)
            ratios.revenue_growth = previous && previous.revenue > 0
                ? ((current.revenue - previous.revenue) / previous.revenue * 100)
                : null;

            // Gross Margin
            ratios.gross_margin = current.revenue > 0
                ? (current.gross_profit / current.revenue * 100)
                : null;

            // EBITDA Margin
            ratios.ebitda_margin = current.revenue > 0 && current.ebitda !== null
                ? (current.ebitda / current.revenue * 100)
                : null;

            // Margin Change
            ratios.margin_change = previous
                ? (current.gross_margin - previous.gross_margin)
                : null;

            // Net Debt
            ratios.net_debt = current.total_debt - current.cash;

            // Debt Change
            ratios.debt_change = previous
                ? (current.total_debt - previous.total_debt)
                : null;

            // Cash Change
            ratios.cash_change = previous
                ? (current.cash - previous.cash)
                : null;

            // Leverage Ratio (Debt / EBITDA proxy) — annualized
            ratios.leverage_ratio = current.ebitda > 0
                ? (current.total_debt / (current.ebitda * 4))
                : (current.ebitda <= 0 ? 'N/M' : null);

            // Interest Coverage (EBITDA / Interest Expense) — quarterly
            ratios.interest_coverage = current.interest_expense > 0 && current.ebitda !== null
                ? (current.ebitda / current.interest_expense)
                : (current.interest_expense === 0 ? 'N/A' : null);

            // Free Cash Flow
            ratios.free_cash_flow = current.operating_cash_flow - Math.abs(current.capex);

            // Liquidity Indicator (Cash / Quarterly Interest Expense)
            ratios.liquidity_indicator = current.interest_expense > 0
                ? (current.cash / current.interest_expense)
                : null;

            return ratios;
        },

        // Calculate all ratios for the full dataset
        calculateAllRatios(quarterlyData) {
            return quarterlyData.map((q, i) => {
                const prev = i > 0 ? quarterlyData[i - 1] : null;
                return {
                    quarter: q.quarter,
                    ...this.calculateRatios(q, prev)
                };
            });
        },

        // Stress test calculations
        calculateStressScenario(base, params) {
            const result = {};
            
            // Revenue impact
            result.revenue = base.revenue * (1 - params.revenueDecline / 100);
            
            // EBITDA impact (both revenue decline and margin compression)
            const marginFactor = 1 - params.marginDecline / 100;
            result.ebitda = base.ebitda * (1 - params.revenueDecline / 100) * marginFactor;
            
            // Interest expense increase
            const rateIncreaseFactor = 1 + (params.rateIncreaseBps / 10000) * (base.total_debt / base.interest_expense);
            result.interest_expense = base.interest_expense * (1 + params.rateIncreaseBps / 10000 * 4);
            
            // Refinancing spread
            result.refinancing_cost = base.total_debt * (params.refinancingSpreadBps / 10000);
            
            // Cash flow
            const cashFlowDecline = params.cashFlowDecline || params.revenueDecline;
            result.cash_flow = base.operating_cash_flow * (1 - cashFlowDecline / 100);
            
            // Derived
            result.interest_coverage = result.interest_expense > 0 
                ? result.ebitda / result.interest_expense
                : null;
            
            result.liquidity = base.cash + result.cash_flow - result.interest_expense;
            
            // Risk assessment
            result.revenue = Math.round(result.revenue);
            result.ebitda = Math.round(result.ebitda);
            result.interest_expense = Math.round(result.interest_expense);
            result.cash_flow = Math.round(result.cash_flow);
            result.interest_coverage = result.interest_coverage ? Math.round(result.interest_coverage * 100) / 100 : null;
            result.liquidity = Math.round(result.liquidity);
            
            // Risk level
            if (result.interest_coverage !== null) {
                if (result.interest_coverage >= 2) result.risk = 'Healthy';
                else if (result.interest_coverage >= 1) result.risk = 'Watch';
                else result.risk = 'Distressed';
            } else {
                result.risk = 'N/A';
            }
            
            return result;
        },

        // Format number for display
        formatNumber(value, type) {
            if (value === null || value === undefined) return 'N/A';
            if (value === 'N/M') return 'N/M';
            if (value === 'N/A') return 'N/A';
            
            switch(type) {
                case 'currency':
                    return '$' + Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'M';
                case 'percentage':
                    return value.toFixed(1) + '%';
                case 'ratio':
                    return typeof value === 'number' ? value.toFixed(2) + 'x' : value;
                case 'score':
                    return value.toFixed(1);
                default:
                    return typeof value === 'number' ? value.toLocaleString() : value;
            }
        },

        // Get trend direction
        getTrend(current, previous) {
            if (current === null || previous === null || current === 'N/M' || previous === 'N/M') return 'neutral';
            if (current > previous) return 'up';
            if (current < previous) return 'down';
            return 'neutral';
        },

        // Get risk color class
        getRiskClass(risk) {
            switch(risk) {
                case 'Healthy': return 'text-green';
                case 'Watch': return 'text-amber';
                case 'Distressed': return 'text-red';
                default: return 'text-muted';
            }
        },

        getRiskBadgeClass(risk) {
            switch(risk) {
                case 'Healthy': return 'badge-healthy';
                case 'Watch': return 'badge-watch';
                case 'Distressed': return 'badge-distressed';
                default: return 'badge-info';
            }
        }
    };

    window.FinancialEngine = FinancialEngine;
})();