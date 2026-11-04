// Sanah's AI + Private Credit Research Dashboard — Illustrative Demo Data
// ⚠️ DEMONSTRATION MODE — All values are illustrative. Not verified historical Carvana data.
// This dataset is modeled after Carvana Co. (NYSE: CVNA) credit trajectory (2021-2024),
// designed to evaluate whether AI can detect credit deterioration earlier than traditional
// quantitative models by analyzing management narrative (MD&A, Earnings Calls) alongside financial metrics.

(function() {
    'use strict';

    /**
     * 1. Company Information
     */
    const companyInfo = {
        name: "Carvana Co.",
        ticker: "CVNA",
        exchange: "NYSE",
        industry: "Online Used Vehicle Retail",
        subsector: "Automotive E-Commerce & Retail",
        period: "2021-2025",
        cik: "0001690820",
        headquarters: "Tempe, Arizona",
        fiscalYearEnd: "December 31",
        reportingCurrency: "USD (in millions, except per-share and per-unit amounts)",
        description: "Carvana Co. is an e-commerce platform for buying and selling used cars, known for its multi-story glass vehicle vending machines and direct-to-consumer delivery infrastructure. During 2021-2024, the company experienced hyper-growth, severe debt-fueled distress following the debt-financed acquisition of ADESA amid rising interest rates, an out-of-court debt exchange restructuring in late 2023, and a subsequent operational turnaround.",
        researchThesis: "Carvana serves as the primary proof-of-concept case study for testing whether management narrative signals (hedging, uncertainty, divergence from numbers) provide earlier warning than financial metrics alone, and whether the AI model can recognize genuine operational recovery instead of remaining permanently distressed.",
        roleInExperiment: "Stress -> Restructuring -> Recovery validation case",
        dataCutoffRule: "Strict historical freezing: At any quarter t, analysis only has access to filings and transcripts published on or before the filing/call date."
    };

    /**
     * 2. Quarterly Financial Data (16 Quarters: Q1 2021 - Q4 2024)
     * All values in USD Millions unless noted otherwise.
     * Internally consistent:
     * - gross_profit = round(revenue * (gross_margin / 100), 1)
     * - free_cash_flow = round(operating_cash_flow - capex, 1)
     */
    const quarterlyData = [
        // --- 2021: Hyper-growth & Capacity Ramp ---
        {
            quarter: "Q1 2021",
            period_end: "2021-03-31",
            filing_date: "2021-05-06",
            call_date: "2021-05-06",
            revenue: 2245.0,
            gross_profit: 336.8,
            gross_margin: 15.0,
            operating_income: -65.0,
            ebitda: -32.0,
            net_income: -82.0,
            cash: 205.0,
            total_debt: 2950.0,
            interest_expense: 42.0,
            operating_cash_flow: -110.0,
            capex: 65.0,
            free_cash_flow: -175.0,
            retail_units_sold: 92455,
            gpu_total: 3656
        },
        {
            quarter: "Q2 2021",
            period_end: "2021-06-30",
            filing_date: "2021-08-05",
            call_date: "2021-08-05",
            revenue: 3338.0,
            gross_profit: 550.8,
            gross_margin: 16.5,
            operating_income: 38.0,
            ebitda: 80.0,
            net_income: 22.0,
            cash: 245.0,
            total_debt: 3080.0,
            interest_expense: 45.0,
            operating_cash_flow: 40.0,
            capex: 78.0,
            free_cash_flow: -38.0,
            retail_units_sold: 107797,
            gpu_total: 5120
        },
        {
            quarter: "Q3 2021",
            period_end: "2021-09-30",
            filing_date: "2021-11-04",
            call_date: "2021-11-04",
            revenue: 3480.0,
            gross_profit: 515.0,
            gross_margin: 14.8,
            operating_income: -28.0,
            ebitda: 14.0,
            net_income: -58.0,
            cash: 215.0,
            total_debt: 3200.0,
            interest_expense: 52.0,
            operating_cash_flow: -95.0,
            capex: 85.0,
            free_cash_flow: -180.0,
            retail_units_sold: 111949,
            gpu_total: 4672
        },
        {
            quarter: "Q4 2021",
            period_end: "2021-12-31",
            filing_date: "2022-02-24",
            call_date: "2022-02-24",
            revenue: 3753.0,
            gross_profit: 457.9,
            gross_margin: 12.2,
            operating_income: -130.0,
            ebitda: -75.0,
            net_income: -182.0,
            cash: 155.0,
            total_debt: 3450.0,
            interest_expense: 58.0,
            operating_cash_flow: -220.0,
            capex: 105.0,
            free_cash_flow: -325.0,
            retail_units_sold: 113016,
            gpu_total: 4056
        },

        // --- 2022: ADESA Buyout, Margin Collapse & Rapid Debt Escalation ---
        {
            quarter: "Q1 2022",
            period_end: "2022-03-31",
            filing_date: "2022-04-20",
            call_date: "2022-04-20",
            revenue: 3497.0,
            gross_profit: 318.2,
            gross_margin: 9.1,
            operating_income: -355.0,
            ebitda: -290.0,
            net_income: -506.0,
            cash: 247.0,
            total_debt: 4100.0,
            interest_expense: 65.0,
            operating_cash_flow: -480.0,
            capex: 115.0,
            free_cash_flow: -595.0,
            retail_units_sold: 105185,
            gpu_total: 2833
        },
        {
            quarter: "Q2 2022",
            period_end: "2022-06-30",
            filing_date: "2022-08-04",
            call_date: "2022-08-04",
            revenue: 3930.0,
            gross_profit: 381.2,
            gross_margin: 9.7,
            operating_income: -238.0,
            ebitda: -160.0,
            net_income: -439.0,
            cash: 1045.0, // Temporary boost from ADESA bond proceeds remaining after closing
            total_debt: 6650.0, // ADESA $3.275B junk notes issued at 10.25%
            interest_expense: 145.0,
            operating_cash_flow: -310.0,
            capex: 120.0,
            free_cash_flow: -430.0,
            retail_units_sold: 117564,
            gpu_total: 3368
        },
        {
            quarter: "Q3 2022",
            period_end: "2022-09-30",
            filing_date: "2022-11-03",
            call_date: "2022-11-03",
            revenue: 3386.0,
            gross_profit: 358.9,
            gross_margin: 10.6,
            operating_income: -283.0,
            ebitda: -195.0,
            net_income: -508.0,
            cash: 440.0,
            total_debt: 6780.0,
            interest_expense: 153.0,
            operating_cash_flow: -340.0,
            capex: 95.0,
            free_cash_flow: -435.0,
            retail_units_sold: 102570,
            gpu_total: 3500
        },
        {
            quarter: "Q4 2022",
            period_end: "2022-12-31",
            filing_date: "2023-02-23",
            call_date: "2023-02-23",
            revenue: 2837.0,
            gross_profit: 261.0,
            gross_margin: 9.2,
            operating_income: -491.0,
            ebitda: -390.0,
            net_income: -806.0, // Peak trough loss
            cash: 434.0,
            total_debt: 6920.0,
            interest_expense: 162.0,
            operating_cash_flow: -410.0,
            capex: 70.0,
            free_cash_flow: -480.0,
            retail_units_sold: 86977,
            gpu_total: 2219
        },

        // --- 2023: Aggressive Cost Reductions & Out-of-Court Debt Restructuring ---
        {
            quarter: "Q1 2023",
            period_end: "2023-03-31",
            filing_date: "2023-05-04",
            call_date: "2023-05-04",
            revenue: 2606.0,
            gross_profit: 341.4,
            gross_margin: 13.1,
            operating_income: -125.0,
            ebitda: -45.0,
            net_income: -286.0,
            cash: 450.0,
            total_debt: 6850.0,
            interest_expense: 159.0,
            operating_cash_flow: 45.0,
            capex: 35.0,
            free_cash_flow: 10.0,
            retail_units_sold: 79240,
            gpu_total: 4303
        },
        {
            quarter: "Q2 2023",
            period_end: "2023-06-30",
            filing_date: "2023-07-19",
            call_date: "2023-07-19",
            revenue: 2968.0,
            gross_profit: 498.6,
            gross_margin: 16.8,
            operating_income: 44.0,
            ebitda: 110.0,
            net_income: -105.0,
            cash: 541.0,
            total_debt: 6790.0,
            interest_expense: 155.0,
            operating_cash_flow: 135.0,
            capex: 28.0,
            free_cash_flow: 107.0,
            retail_units_sold: 76530,
            gpu_total: 6520
        },
        {
            quarter: "Q3 2023",
            period_end: "2023-09-30",
            filing_date: "2023-11-02",
            call_date: "2023-11-02",
            revenue: 2773.0,
            gross_profit: 482.5,
            gross_margin: 17.4,
            operating_income: 32.0,
            ebitda: 98.0,
            net_income: 741.0, // Includes ~$878M one-time gain on debt extinguishment from restructuring
            cash: 544.0,
            total_debt: 5540.0, // ~$1.25B principal reduction via debt exchange
            interest_expense: 92.0, // Cash interest reduction via PIK toggle option
            operating_cash_flow: 180.0,
            capex: 25.0,
            free_cash_flow: 155.0,
            retail_units_sold: 80987,
            gpu_total: 5952
        },
        {
            quarter: "Q4 2023",
            period_end: "2023-12-31",
            filing_date: "2024-02-22",
            call_date: "2024-02-22",
            revenue: 2424.0,
            gross_profit: 402.4,
            gross_margin: 16.6,
            operating_income: 18.0,
            ebitda: 75.0,
            net_income: -114.0,
            cash: 530.0,
            total_debt: 5490.0,
            interest_expense: 96.0,
            operating_cash_flow: 110.0,
            capex: 22.0,
            free_cash_flow: 88.0,
            retail_units_sold: 76106,
            gpu_total: 5283
        },

        // --- 2024: Sustainable Operational Profitability & Organic Cash Generation ---
        {
            quarter: "Q1 2024",
            period_end: "2024-03-31",
            filing_date: "2024-05-01",
            call_date: "2024-05-01",
            revenue: 3061.0,
            gross_profit: 590.8,
            gross_margin: 19.3,
            operating_income: 134.0,
            ebitda: 235.0,
            net_income: 49.0, // Sustained GAAP net profit
            cash: 689.0,
            total_debt: 5410.0,
            interest_expense: 94.0,
            operating_cash_flow: 255.0,
            capex: 25.0,
            free_cash_flow: 230.0,
            retail_units_sold: 91878,
            gpu_total: 6432
        },
        {
            quarter: "Q2 2024",
            period_end: "2024-06-30",
            filing_date: "2024-07-31",
            call_date: "2024-07-31",
            revenue: 3410.0,
            gross_profit: 709.3,
            gross_margin: 20.8,
            operating_income: 259.0,
            ebitda: 355.0,
            net_income: 148.0,
            cash: 835.0,
            total_debt: 5320.0,
            interest_expense: 91.0,
            operating_cash_flow: 340.0,
            capex: 32.0,
            free_cash_flow: 308.0,
            retail_units_sold: 101440,
            gpu_total: 7049
        },
        {
            quarter: "Q3 2024",
            period_end: "2024-09-30",
            filing_date: "2024-10-30",
            call_date: "2024-10-30",
            revenue: 3655.0,
            gross_profit: 771.2,
            gross_margin: 21.1,
            operating_income: 295.0,
            ebitda: 429.0,
            net_income: 175.0,
            cash: 980.0,
            total_debt: 5210.0,
            interest_expense: 88.0,
            operating_cash_flow: 415.0,
            capex: 38.0,
            free_cash_flow: 377.0,
            retail_units_sold: 108651,
            gpu_total: 7427
        },
        {
            quarter: "Q4 2024",
            period_end: "2024-12-31",
            filing_date: "2025-02-20",
            call_date: "2025-02-20",
            revenue: 3820.0,
            gross_profit: 821.3,
            gross_margin: 21.5,
            operating_income: 320.0,
            ebitda: 460.0,
            net_income: 198.0,
            cash: 1150.0,
            total_debt: 5080.0,
            interest_expense: 85.0,
            operating_cash_flow: 460.0,
            capex: 42.0,
            free_cash_flow: 418.0,
            retail_units_sold: 112500,
            gpu_total: 7510
        }
    ];

    /**
     * 3. Derived Financial Ratios (Deterministically Calculated per Quarter)
     */
    const financialRatios = [
        {
            quarter: "Q1 2021",
            revenue_growth: 22.9, // QoQ vs Q4 2020 base (~1826)
            margin_change: -0.8,
            debt_change: 8.5,
            cash_change: -12.4,
            leverage_ratio: "Neg EBITDA",
            interest_coverage: -0.76,
            liquidity_indicator: "Adequate"
        },
        {
            quarter: "Q2 2021",
            revenue_growth: 48.7,
            margin_change: 1.5,
            debt_change: 4.4,
            cash_change: 19.5,
            leverage_ratio: "9.6x",
            interest_coverage: 1.78,
            liquidity_indicator: "Adequate"
        },
        {
            quarter: "Q3 2021",
            revenue_growth: 4.3,
            margin_change: -1.7,
            debt_change: 3.9,
            cash_change: -12.2,
            leverage_ratio: "57.1x",
            interest_coverage: 0.27,
            liquidity_indicator: "Adequate"
        },
        {
            quarter: "Q4 2021",
            revenue_growth: 7.8,
            margin_change: -2.6,
            debt_change: 7.8,
            cash_change: -27.9,
            leverage_ratio: "Neg EBITDA",
            interest_coverage: -1.29,
            liquidity_indicator: "Constrained"
        },
        {
            quarter: "Q1 2022",
            revenue_growth: -6.8,
            margin_change: -3.1,
            debt_change: 18.8,
            cash_change: 59.4,
            leverage_ratio: "Neg EBITDA",
            interest_coverage: -4.46,
            liquidity_indicator: "Constrained"
        },
        {
            quarter: "Q2 2022",
            revenue_growth: 12.4,
            margin_change: 0.6,
            debt_change: 62.2, // ADESA acquisition closed
            cash_change: 323.1, // Escrow / net cash from $3.275B junk note issuance
            leverage_ratio: "Neg EBITDA",
            interest_coverage: -1.10,
            liquidity_indicator: "Constrained"
        },
        {
            quarter: "Q3 2022",
            revenue_growth: -13.8,
            margin_change: 0.9,
            debt_change: 2.0,
            cash_change: -57.9,
            leverage_ratio: "Neg EBITDA",
            interest_coverage: -1.27,
            liquidity_indicator: "Critical Stress"
        },
        {
            quarter: "Q4 2022",
            revenue_growth: -16.2,
            margin_change: -1.4,
            debt_change: 2.1,
            cash_change: -1.4,
            leverage_ratio: "Neg EBITDA",
            interest_coverage: -2.41,
            liquidity_indicator: "Critical Stress"
        },
        {
            quarter: "Q1 2023",
            revenue_growth: -8.1,
            margin_change: 3.9,
            debt_change: -1.0,
            cash_change: 3.7,
            leverage_ratio: "Neg EBITDA",
            interest_coverage: -0.28,
            liquidity_indicator: "Stabilizing"
        },
        {
            quarter: "Q2 2023",
            revenue_growth: 13.9,
            margin_change: 3.7,
            debt_change: -0.9,
            cash_change: 20.2,
            leverage_ratio: "15.4x",
            interest_coverage: 0.71,
            liquidity_indicator: "Stabilizing"
        },
        {
            quarter: "Q3 2023",
            revenue_growth: -6.6,
            margin_change: 0.6,
            debt_change: -18.4, // Out-of-court debt exchange completed
            cash_change: 0.6,
            leverage_ratio: "14.1x",
            interest_coverage: 1.07,
            liquidity_indicator: "Improving"
        },
        {
            quarter: "Q4 2023",
            revenue_growth: -12.6,
            margin_change: -0.8,
            debt_change: -0.9,
            cash_change: -2.6,
            leverage_ratio: "18.3x",
            interest_coverage: 0.78,
            liquidity_indicator: "Improving"
        },
        {
            quarter: "Q1 2024",
            revenue_growth: 26.3,
            margin_change: 2.7,
            debt_change: -1.5,
            cash_change: 30.0,
            leverage_ratio: "5.8x",
            interest_coverage: 2.50,
            liquidity_indicator: "Strong"
        },
        {
            quarter: "Q2 2024",
            revenue_growth: 11.4,
            margin_change: 1.5,
            debt_change: -1.7,
            cash_change: 21.2,
            leverage_ratio: "3.7x",
            interest_coverage: 3.90,
            liquidity_indicator: "Strong"
        },
        {
            quarter: "Q3 2024",
            revenue_growth: 7.2,
            margin_change: 0.3,
            debt_change: -2.1,
            cash_change: 17.4,
            leverage_ratio: "3.0x",
            interest_coverage: 4.88,
            liquidity_indicator: "Strong"
        },
        {
            quarter: "Q4 2024",
            revenue_growth: 4.5,
            margin_change: 0.4,
            debt_change: -2.5,
            cash_change: 17.3,
            leverage_ratio: "2.8x",
            interest_coverage: 5.41,
            liquidity_indicator: "Strong"
        }
    ];

    /**
     * 4. Management Qualitative Language Signals (0-3 Scale per Playbook)
     * Scoring rubric:
     * - management_tone: 0 = very negative/defensive, 1 = cautious, 2 = moderately positive, 3 = very confident
     * - uncertainty: 0 = low, 1 = moderate, 2 = elevated, 3 = high hedging / macro excuse frequency
     * - hedging: 0 = low, 1 = moderate, 2 = elevated, 3 = widespread conditional phrasing ("subject to", "may")
     * - specificity: 0 = vague/hand-waving, 1 = broad targets, 2 = moderately specific, 3 = exact dollar/date metrics
     * - guidance_change: -1 = cut/lowered, 0 = reiterated, +1 = raised/re-introduced
     * - qa_defensiveness: 0 = direct/transparent, 1 = mildly guarded, 2 = evasive on margins/debt, 3 = hostile/combative
     */
    const managementLanguage = [
        {
            quarter: "Q1 2021",
            management_tone: 3,
            uncertainty: 1,
            hedging: 1,
            specificity: 2,
            new_risk_themes: 1,
            repeated_explanations: 0,
            guidance_change: 1,
            qa_defensiveness: 0,
            primary_theme: "Unprecedented demand and manufacturing capacity expansion"
        },
        {
            quarter: "Q2 2021",
            management_tone: 3,
            uncertainty: 0,
            hedging: 0,
            specificity: 3,
            new_risk_themes: 1,
            repeated_explanations: 0,
            guidance_change: 1,
            qa_defensiveness: 0,
            primary_theme: "First positive operating income quarter; raising medium-term GPU expectations"
        },
        {
            quarter: "Q3 2021",
            management_tone: 2,
            uncertainty: 1,
            hedging: 1,
            specificity: 2,
            new_risk_themes: 2,
            repeated_explanations: 1,
            guidance_change: 0,
            qa_defensiveness: 1,
            primary_theme: "Logistics friction and reconditioning staffing constraints framed as temporary"
        },
        {
            quarter: "Q4 2021",
            management_tone: 2,
            uncertainty: 2,
            hedging: 2,
            specificity: 1,
            new_risk_themes: 3,
            repeated_explanations: 2,
            guidance_change: 0,
            qa_defensiveness: 1,
            primary_theme: "Omicron and vehicle wholesale price inflation cited for margin pressure"
        },
        {
            quarter: "Q1 2022",
            management_tone: 1,
            uncertainty: 2,
            hedging: 2,
            specificity: 1,
            new_risk_themes: 4,
            repeated_explanations: 2,
            guidance_change: -1,
            qa_defensiveness: 2,
            primary_theme: "Macro headwinds, rapid interest rate spikes, and ADESA acquisition defense"
        },
        {
            quarter: "Q2 2022",
            management_tone: 1,
            uncertainty: 3,
            hedging: 3,
            specificity: 1,
            new_risk_themes: 5,
            repeated_explanations: 3,
            guidance_change: -1,
            qa_defensiveness: 2,
            primary_theme: "Pivot from hyper-growth to cash conservation; restructuring first 2,500 jobs"
        },
        {
            quarter: "Q3 2022",
            management_tone: 0,
            uncertainty: 3,
            hedging: 3,
            specificity: 1,
            new_risk_themes: 4,
            repeated_explanations: 4,
            guidance_change: -1,
            qa_defensiveness: 3,
            primary_theme: "Industry-wide affordability crisis; evasion on debt service and refinancing plans"
        },
        {
            quarter: "Q4 2022",
            management_tone: 0,
            uncertainty: 3,
            hedging: 3,
            specificity: 1,
            new_risk_themes: 5,
            repeated_explanations: 4,
            guidance_change: -1,
            qa_defensiveness: 3,
            primary_theme: "Survival mode; defensiveness on liquidity and creditor cooperation pact inquiries"
        },
        {
            quarter: "Q1 2023",
            management_tone: 1,
            uncertainty: 2,
            hedging: 2,
            specificity: 2,
            new_risk_themes: 2,
            repeated_explanations: 2,
            guidance_change: 0,
            qa_defensiveness: 2,
            primary_theme: "Non-vehicle SG&A reduction exceeding targets; operational stability emerging"
        },
        {
            quarter: "Q2 2023",
            management_tone: 2,
            uncertainty: 2,
            hedging: 1,
            specificity: 3,
            new_risk_themes: 2,
            repeated_explanations: 1,
            guidance_change: 1,
            qa_defensiveness: 1,
            primary_theme: "Record GPU inflection ($6.5k+) and announcement of creditor debt exchange"
        },
        {
            quarter: "Q3 2023",
            management_tone: 2,
            uncertainty: 1,
            hedging: 1,
            specificity: 3,
            new_risk_themes: 1,
            repeated_explanations: 1,
            guidance_change: 1,
            qa_defensiveness: 1,
            primary_theme: "Successful completion of debt exchange; $430M+ annual cash interest savings"
        },
        {
            quarter: "Q4 2023",
            management_tone: 2,
            uncertainty: 1,
            hedging: 1,
            specificity: 3,
            new_risk_themes: 1,
            repeated_explanations: 0,
            guidance_change: 1,
            qa_defensiveness: 0,
            primary_theme: "Proven unit economics durability and adjusted EBITDA profitability roadmap"
        },
        {
            quarter: "Q1 2024",
            management_tone: 3,
            uncertainty: 0,
            hedging: 0,
            specificity: 3,
            new_risk_themes: 0,
            repeated_explanations: 0,
            guidance_change: 1,
            qa_defensiveness: 0,
            primary_theme: "Inflection to positive GAAP Net Income and industry-benchmark unit economics"
        },
        {
            quarter: "Q2 2024",
            management_tone: 3,
            uncertainty: 0,
            hedging: 0,
            specificity: 3,
            new_risk_themes: 0,
            repeated_explanations: 0,
            guidance_change: 1,
            qa_defensiveness: 0,
            primary_theme: "Operating leverage driving free cash flow >$300M without incremental capital"
        },
        {
            quarter: "Q3 2024",
            management_tone: 3,
            uncertainty: 0,
            hedging: 0,
            specificity: 3,
            new_risk_themes: 0,
            repeated_explanations: 0,
            guidance_change: 1,
            qa_defensiveness: 0,
            primary_theme: "Voluntary open-market debt repurchases enabled by organic cash flow"
        },
        {
            quarter: "Q4 2024",
            management_tone: 3,
            uncertainty: 0,
            hedging: 0,
            specificity: 3,
            new_risk_themes: 0,
            repeated_explanations: 0,
            guidance_change: 1,
            qa_defensiveness: 0,
            primary_theme: "Market share re-acceleration on high-margin unit foundation"
        }
    ];

    /**
     * 5. Management Claims (22 Illustrative Claims Across Timeline)
     */
    const managementClaims = [
        {
            id: "CLM-001",
            quarter: "Q1 2021",
            statement: "We are seeing unprecedented national customer demand and our production capacity ramp is accelerating toward 1.25 million annual units.",
            topic: "Capacity & Demand",
            direction: "positive",
            source_type: "Earnings Call",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Demand remains off the charts. We are constrained only by our speed of reconditioning and delivering vehicles.'",
            source_url: "#demo",
            ai_confidence: 94
        },
        {
            id: "CLM-002",
            quarter: "Q2 2021",
            statement: "Our GPU milestone demonstrates that Carvana's digital purchasing model has permanent gross margin advantages over traditional dealership franchises.",
            topic: "Gross Margin & GPU",
            direction: "positive",
            source_type: "Shareholder Letter",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Achieving over $5,100 total GPU in Q2 validates our multi-year thesis that national centralized reconditioning unlocks structural cost advantages.'",
            source_url: "#demo",
            ai_confidence: 91
        },
        {
            id: "CLM-003",
            quarter: "Q3 2021",
            statement: "Supply chain bottlenecks and temporary logistics rebalancing increased wholesale acquisition costs but have no bearing on underlying demand.",
            topic: "Supply Chain & Logistics",
            direction: "neutral",
            source_type: "Earnings Call",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'The sequential margin decline of 170 bps reflects transitory shipping surcharges and technician hiring ramps.'",
            source_url: "#demo",
            ai_confidence: 86
        },
        {
            id: "CLM-004",
            quarter: "Q4 2021",
            statement: "Used vehicle retail margins are expected to normalize swiftly in the spring selling season following temporary Omicron omens.",
            topic: "Gross Margin & Guidance",
            direction: "positive",
            source_type: "MD&A",
            speaker: "Item 7 MD&A Disclosures",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Management anticipates gross profit per unit to re-expand in early fiscal 2022 as inventory turns normalize.'",
            source_url: "#demo",
            ai_confidence: 82
        },
        {
            id: "CLM-005",
            quarter: "Q1 2022",
            statement: "The acquisition of ADESA U.S. physical auction network will instantly unlock nationwide recon capacity and generate over $100M in annual SG&A synergies.",
            topic: "M&A & Synergies",
            direction: "positive",
            source_type: "Earnings Call",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'ADESA puts 78% of the U.S. population within 100 miles of a Carvana inspection center. This is transformative for logistics speed and unit costs.'",
            source_url: "#demo",
            ai_confidence: 88
        },
        {
            id: "CLM-006",
            quarter: "Q1 2022",
            statement: "Our liquidity position remains resilient with substantial floorplan availability and unpledged real estate assets.",
            topic: "Liquidity & Runway",
            direction: "positive",
            source_type: "MD&A",
            speaker: "Item 2 MD&A Disclosures",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'We believe existing cash, floorplan lines, and unencumbered assets provide adequate headroom to satisfy obligations for the next 12 months.'",
            source_url: "#demo",
            ai_confidence: 79
        },
        {
            id: "CLM-007",
            quarter: "Q2 2022",
            statement: "We have pivoted our entire organizational focus from growth at all costs to generating significant positive free cash flow.",
            topic: "Strategic Pivot & Cash Flow",
            direction: "neutral",
            source_type: "Shareholder Letter",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'In light of rapid Federal Reserve tightening and used car price volatility, we are executing a $1B SG&A reduction plan.'",
            source_url: "#demo",
            ai_confidence: 90
        },
        {
            id: "CLM-008",
            quarter: "Q2 2022",
            statement: "The $3.275B bond financing successfully secures all closing obligations for ADESA and fully funds our multi-year business plan without additional debt needs.",
            topic: "Debt & Refinancing",
            direction: "positive",
            source_type: "Earnings Call",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Completing the debt placement with institutional partners ensures Carvana is funded through the cycle.'",
            source_url: "#demo",
            ai_confidence: 85
        },
        {
            id: "CLM-009",
            quarter: "Q3 2022",
            statement: "Macro affordability challenges are impacting the entire used auto retail sector, but Carvana continues to gain market share relative to legacy dealers.",
            topic: "Market Share & Demand",
            direction: "neutral",
            source_type: "Earnings Call",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Higher interest rates are depressing industry-wide retail transactions, yet our customer conversion and NPS hold near record peaks.'",
            source_url: "#demo",
            ai_confidence: 83
        },
        {
            id: "CLM-010",
            quarter: "Q3 2022",
            statement: "Our cost actions will reduce non-vehicle SG&A expense per retail unit by over $1,000 within the next two quarters.",
            topic: "SG&A & Cost Cutting",
            direction: "positive",
            source_type: "Earnings Call",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'We are aggressively shedding overhead and rationalizing corporate logistics to adjust for lower unit volume run rates.'",
            source_url: "#demo",
            ai_confidence: 87
        },
        {
            id: "CLM-011",
            quarter: "Q4 2022",
            statement: "We have over $2.0B in committed liquidity and unpledged real estate and have no interest in or need for bankruptcy or debt restructuring.",
            topic: "Solvency & Liquidity",
            direction: "positive",
            source_type: "Earnings Call (Analyst Q&A)",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Rumors regarding bankruptcy filings or debt restructuring are entirely unfounded. We have multi-year runway.'",
            source_url: "#demo",
            ai_confidence: 76
        },
        {
            id: "CLM-012",
            quarter: "Q4 2022",
            statement: "The steep drop in retail gross profit per unit to $2,219 was driven by an unprecedented 15% wholesale price drop in 60 days.",
            topic: "Wholesale Depreciation & Margin",
            direction: "negative",
            source_type: "Shareholder Letter",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Carvana endured the steepest used vehicle depreciation in modern records, requiring aggressive inventory discounting to clear carrying risk.'",
            source_url: "#demo",
            ai_confidence: 93
        },
        {
            id: "CLM-013",
            quarter: "Q1 2023",
            statement: "Step 1 of our turnaround plan is complete: non-vehicle SG&A fell by more than $100M sequentially and operating cash burn has ceased.",
            topic: "Turnaround Progress & Cash Flow",
            direction: "positive",
            source_type: "Shareholder Letter",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'We achieved positive operating cash flow of $45M in Q1, demonstrating the speed and operational discipline of our overhead reduction.'",
            source_url: "#demo",
            ai_confidence: 92
        },
        {
            id: "CLM-014",
            quarter: "Q2 2023",
            statement: "Total GPU reached an all-time company record of $6,520, proving that our fundamental unit economics are vastly more profitable than in 2021.",
            topic: "Gross Margin & GPU Record",
            direction: "positive",
            source_type: "Earnings Call",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Our $6,520 GPU is not an accident; it is the structural result of internal reconditioning efficiency and direct customer vehicle sourcing.'",
            source_url: "#demo",
            ai_confidence: 95
        },
        {
            id: "CLM-015",
            quarter: "Q2 2023",
            statement: "The comprehensive debt exchange agreement eliminates over $1.2B of debt and reduces cash interest payments by more than $430M annually for two years.",
            topic: "Debt Exchange & Restructuring",
            direction: "positive",
            source_type: "8-K / Earnings Call",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'This agreement with noteholders representing >90% of our debt decisively resolves our capital structure runway and removes restructuring overhang.'",
            source_url: "#demo",
            ai_confidence: 96
        },
        {
            id: "CLM-016",
            quarter: "Q3 2023",
            statement: "Following execution of our debt exchange, Carvana has no material unsecured debt maturities until late 2028.",
            topic: "Maturity Profile & Solvency",
            direction: "positive",
            source_type: "MD&A",
            speaker: "Item 2 MD&A Disclosures",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'With senior secured PIK-toggle notes in place, the company possesses immense flexibility to fund growth from internal operating profits.'",
            source_url: "#demo",
            ai_confidence: 94
        },
        {
            id: "CLM-017",
            quarter: "Q4 2023",
            statement: "Carvana generated positive Adjusted EBITDA for the full year 2023, turning around an initial $1B consensus loss expectation.",
            topic: "EBITDA & Profitability",
            direction: "positive",
            source_type: "Shareholder Letter",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'We defied industry expectations by delivering full-year positive Adjusted EBITDA and sustainable unit margins through rigorous execution.'",
            source_url: "#demo",
            ai_confidence: 95
        },
        {
            id: "CLM-018",
            quarter: "Q1 2024",
            statement: "Our Q1 performance conclusively demonstrates that Carvana is a structurally high-margin, profitable growth engine, generating $134M in GAAP operating profit.",
            topic: "GAAP Profitability & Turnaround",
            direction: "positive",
            source_type: "Earnings Call",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Today Carvana is fundamentally profitable on a GAAP basis, with gross profit per unit exceeding $6,400 across all revenue streams.'",
            source_url: "#demo",
            ai_confidence: 97
        },
        {
            id: "CLM-019",
            quarter: "Q2 2024",
            statement: "We are generating over $300M in quarterly free cash flow, giving us the opportunity to voluntarily deleverage our balance sheet ahead of schedule.",
            topic: "Free Cash Flow & Deleveraging",
            direction: "positive",
            source_type: "Shareholder Letter",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Our organic cash flow generation provides full self-funding capability and enables proactive retirement of high-coupon debt.'",
            source_url: "#demo",
            ai_confidence: 96
        },
        {
            id: "CLM-020",
            quarter: "Q3 2024",
            statement: "ADESA physical infrastructure is now handling over 40% of our vehicle logistics, unlocking $300M in cumulative logistics cost avoidance.",
            topic: "ADESA Synergies & Logistics",
            direction: "positive",
            source_type: "Earnings Call",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'The operational integration of ADESA hubs has permanently cut average delivery transit miles by over 30%.'",
            source_url: "#demo",
            ai_confidence: 93
        },
        {
            id: "CLM-021",
            quarter: "Q4 2024",
            statement: "Carvana enters 2025 with $1.15B in cash and over $460M in quarterly EBITDA, resuming market share expansion with the highest margins in auto retail history.",
            topic: "Outlook & Financial Strength",
            direction: "positive",
            source_type: "Earnings Call",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Our multi-year turnaround is complete. We possess the balance sheet, unit economics, and operational machine to scale national market share profitably.'",
            source_url: "#demo",
            ai_confidence: 98
        },
        {
            id: "CLM-022",
            quarter: "Q3 2022",
            statement: "We do not anticipate needing to access the public debt markets under any reasonable scenario over the next 18 to 24 months.",
            topic: "Capital Markets Access",
            direction: "positive",
            source_type: "Earnings Call (Analyst Q&A)",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'With cash on hand and available inventory lines, we have removed dependence on public capital markets.'",
            source_url: "#demo",
            ai_confidence: 74
        }
    ];

    /**
     * 6. Management vs Numbers Divergence Data (16 Records)
     * Demonstrates where words and numbers disagree — the core research signal.
     */
    const divergenceData = [
        {
            id: "DIV-001",
            quarter: "Q3 2021",
            claim: "Logistics friction and reconditioning staffing constraints are strictly transitory.",
            linked_metric: "Operating Income ($M)",
            claim_direction: "neutral",
            metric_direction: "declining",
            divergence_score: 2,
            persistence_quarters: 1,
            explanation: "Management downplayed cost headwinds as short-lived logistics friction, but Operating Income flipped from +$38M to -$28M while gross margin contracted 170 bps.",
            evidence_id: "EVD-003"
        },
        {
            id: "DIV-002",
            quarter: "Q4 2021",
            claim: "Retail margins expected to rebound quickly into spring 2022.",
            linked_metric: "Gross Margin (%)",
            claim_direction: "positive",
            metric_direction: "collapsing",
            divergence_score: 2,
            persistence_quarters: 2,
            explanation: "Management guided toward margin re-expansion, but gross margin collapsed from 14.8% to 12.2% in Q4 and plummeted to 9.1% in Q1 2022.",
            evidence_id: "EVD-004"
        },
        {
            id: "DIV-003",
            quarter: "Q1 2022",
            claim: "Liquidity and cash headroom remain completely adequate to fund operations through the cycle.",
            linked_metric: "Free Cash Flow ($M)",
            claim_direction: "positive",
            metric_direction: "deteriorating",
            divergence_score: 3,
            persistence_quarters: 3,
            explanation: "Management asserted liquidity resilience while quarterly Free Cash Flow fell to -$595M (burning $6.6M daily) and debt commitments ballooned for the ADESA acquisition.",
            evidence_id: "EVD-006"
        },
        {
            id: "DIV-004",
            quarter: "Q2 2022",
            claim: "ADESA financing fully funds business plan without additional debt needs.",
            linked_metric: "Total Debt ($M)",
            claim_direction: "positive",
            metric_direction: "expanding",
            divergence_score: 3,
            persistence_quarters: 4,
            explanation: "Management framed the $3.275B bond issue as a liquidity win, ignoring that the punitive 10.25% coupon escalated annual interest burden to nearly $600M, suffocating cash flow.",
            evidence_id: "EVD-008"
        },
        {
            id: "DIV-005",
            quarter: "Q3 2022",
            claim: "Customer demand remains strong and Carvana continues to capture market share.",
            linked_metric: "Retail Units Sold",
            claim_direction: "positive",
            metric_direction: "declining",
            divergence_score: 2,
            persistence_quarters: 2,
            explanation: "Management touted resilient market share and customer conversion, but retail unit volume dropped 12.8% QoQ to 102,570 units and revenue contracted 13.8%.",
            evidence_id: "EVD-009"
        },
        {
            id: "DIV-006",
            quarter: "Q3 2022",
            claim: "No reliance on public debt markets; multi-year runway in place.",
            linked_metric: "Cash Balance ($M)",
            claim_direction: "positive",
            metric_direction: "deteriorating",
            divergence_score: 3,
            persistence_quarters: 3,
            explanation: "CFO asserted robust liquidity runway, but unrestricted cash dropped 58% in a single quarter from $1,045M to $440M, leaving less than 3 quarters of burn coverage.",
            evidence_id: "EVD-010"
        },
        {
            id: "DIV-007",
            quarter: "Q4 2022",
            claim: "Over $2B in total liquidity and zero need for bankruptcy or debt restructuring.",
            linked_metric: "Operating Cash Flow ($M)",
            claim_direction: "positive",
            metric_direction: "collapsing",
            divergence_score: 3,
            persistence_quarters: 4,
            explanation: "Severe divergence: Management insisted bankruptcy rumors were baseless, but noteholders holding $4B+ formed an ad-hoc cooperation pact as Q4 operating loss hit -$491M.",
            evidence_id: "EVD-011"
        },
        {
            id: "DIV-008",
            quarter: "Q4 2022",
            claim: "Depreciation in vehicle prices is transitory and GPU will rapidly normalize.",
            linked_metric: "Total GPU ($)",
            claim_direction: "positive",
            metric_direction: "collapsing",
            divergence_score: 3,
            persistence_quarters: 4,
            explanation: "Management called wholesale drops transitory, yet total GPU plunged to $2,219 per unit (down 57% YoY), triggering an -$806M quarterly net loss.",
            evidence_id: "EVD-012"
        },
        {
            id: "DIV-009",
            quarter: "Q1 2023",
            claim: "Cost reductions on track and cash burn neutralized.",
            linked_metric: "Operating Cash Flow ($M)",
            claim_direction: "positive",
            metric_direction: "improving",
            divergence_score: 1,
            persistence_quarters: 1,
            explanation: "Mild divergence: Management claimed cash burn neutralized; numbers confirmed OCF turned positive to $45M, though GAAP net income remained deeply negative at -$286M.",
            evidence_id: "EVD-013"
        },
        {
            id: "DIV-010",
            quarter: "Q2 2023",
            claim: "Fundamental unit economics structurally transformed to mid-$6k GPU.",
            linked_metric: "Revenue ($M)",
            claim_direction: "positive",
            metric_direction: "declining YoY",
            divergence_score: 1,
            persistence_quarters: 1,
            explanation: "GPU surged to $6,520 as claimed, but volume was sacrificed: retail units sold dropped 35% YoY from Q2 2022 peak, trading revenue volume for margin per unit.",
            evidence_id: "EVD-014"
        },
        {
            id: "DIV-011",
            quarter: "Q3 2023",
            claim: "Debt exchange eliminates restructuring overhang and extends maturity runway.",
            linked_metric: "Total Debt ($M)",
            claim_direction: "positive",
            metric_direction: "improving",
            divergence_score: 1,
            persistence_quarters: 0,
            explanation: "Numbers largely aligned: Debt principal dropped by $1.25B and cash interest was cut in half, though total debt of $5.54B remained substantial.",
            evidence_id: "EVD-015"
        },
        {
            id: "DIV-012",
            quarter: "Q4 2023",
            claim: "Durability of positive Adjusted EBITDA confirmed across seasonal trough.",
            linked_metric: "EBITDA ($M)",
            claim_direction: "positive",
            metric_direction: "improving",
            divergence_score: 0,
            persistence_quarters: 0,
            explanation: "Aligned: EBITDA remained positive at $75M despite standard seasonal volume decline, confirming that cost cuts were structural rather than temporary.",
            evidence_id: "EVD-016"
        },
        {
            id: "DIV-013",
            quarter: "Q1 2024",
            claim: "Carvana is now structurally GAAP profitable with industry-benchmark unit economics.",
            linked_metric: "Operating Income ($M)",
            claim_direction: "positive",
            metric_direction: "expanding",
            divergence_score: 0,
            persistence_quarters: 0,
            explanation: "Completely aligned: Operating Income reached +$134M, Net Income +$49M, and Gross Margin expanded to 19.3%. Words and numbers fully converged.",
            evidence_id: "EVD-017"
        },
        {
            id: "DIV-014",
            quarter: "Q2 2024",
            claim: "Operating leverage driving cash generation without incremental external capital.",
            linked_metric: "Free Cash Flow ($M)",
            claim_direction: "positive",
            metric_direction: "expanding",
            divergence_score: 0,
            persistence_quarters: 0,
            explanation: "Completely aligned: Free Cash Flow reached +$308M, cash balance expanded to $835M, and interest coverage rose to 3.9x.",
            evidence_id: "EVD-018"
        },
        {
            id: "DIV-015",
            quarter: "Q3 2024",
            claim: "Organic cash flow enables voluntary early debt retirement.",
            linked_metric: "Total Debt ($M)",
            claim_direction: "positive",
            metric_direction: "declining",
            divergence_score: 0,
            persistence_quarters: 0,
            explanation: "Completely aligned: Debt declined to $5,210M as Carvana initiated open-market buybacks of senior secured notes using cash on hand.",
            evidence_id: "EVD-018"
        },
        {
            id: "DIV-016",
            quarter: "Q4 2024",
            claim: "Resuming profitable market share expansion with $1.15B cash cushion.",
            linked_metric: "Cash Balance ($M)",
            claim_direction: "positive",
            metric_direction: "expanding",
            divergence_score: 0,
            persistence_quarters: 0,
            explanation: "Completely aligned: Cash expanded to $1,150M, EBITDA reached $460M, and retail units grew to 112,500.",
            evidence_id: "EVD-018"
        }
    ];

    /**
     * 7. Credit & Capital Structure Events (12 Events)
     */
    const creditEvents = [
        {
            id: "EVT-001",
            date: "2021-03-29",
            quarter: "Q1 2021",
            event_type: "Debt Issuance",
            title: "Upsized Senior Notes Offering ($500M 5.875% Due 2028)",
            description: "Carvana completed an upsized private offering of $500M senior unsecured notes due 2028 to finance nationwide logistics expansion and automated glass vending machine construction.",
            severity: "low",
            source_url: "#demo"
        },
        {
            id: "EVT-002",
            date: "2021-08-16",
            quarter: "Q3 2021",
            event_type: "Debt Issuance",
            title: "Senior Notes Offering ($750M 4.875% Due 2029)",
            description: "Issued $750M senior notes at tight credit spreads during the peak of easy monetary policy to bolster working capital for rapid inventory acquisition.",
            severity: "low",
            source_url: "#demo"
        },
        {
            id: "EVT-003",
            date: "2022-02-25",
            quarter: "Q1 2022",
            event_type: "Liquidity Action",
            title: "Definitive Agreement to Acquire ADESA for $2.2B in Cash",
            description: "Carvana agreed to acquire ADESA's U.S. wholesale physical auction business from KAR Global for $2.2B in cash, committing to major debt financing just as the Federal Reserve began raising interest rates.",
            severity: "high",
            source_url: "#demo"
        },
        {
            id: "EVT-004",
            date: "2022-04-26",
            quarter: "Q2 2022",
            event_type: "Debt Issuance",
            title: "Punitive 10.25% Senior Notes Offering ($3.275B Due 2030)",
            description: "To fund the ADESA buyout amidst rapidly freezing credit markets, Carvana was forced to issue $3.275B of senior unsecured notes at a 10.25% yield, with Apollo Global Management purchasing $1.6B at a discount. Added $335M in annual cash interest expense.",
            severity: "critical",
            source_url: "#demo"
        },
        {
            id: "EVT-005",
            date: "2022-05-10",
            quarter: "Q2 2022",
            event_type: "Liquidity Action",
            title: "Closing of ADESA Buyout & First Major Workforce Reduction (2,500 Employees)",
            description: "Concurrently closed the ADESA purchase and laid off 2,500 workers (12% of workforce) to mitigate immediate cash burn from operational redundancies.",
            severity: "high",
            source_url: "#demo"
        },
        {
            id: "EVT-006",
            date: "2022-11-18",
            quarter: "Q4 2022",
            event_type: "Liquidity Action",
            title: "Secondary Layoffs (1,500 Employees) & Inventory Curtailment",
            description: "Implemented additional 8% workforce reduction and slowed used car buying to halt cash burn as wholesale vehicle prices dropped at the fastest pace since 2008.",
            severity: "high",
            source_url: "#demo"
        },
        {
            id: "EVT-007",
            date: "2022-12-07",
            quarter: "Q4 2022",
            event_type: "Restructuring",
            title: "Creditor Cooperation Pact Formed by Major Bondholders (~$4B of Debt)",
            description: "Ten major noteholders including Apollo Global, PIMCO, Ares Management, and BlackRock formed an ad-hoc creditor group bound by a 3-month cooperation pact to negotiate jointly and prevent coercive debt exchange priming.",
            severity: "critical",
            source_url: "#demo"
        },
        {
            id: "EVT-008",
            date: "2023-01-19",
            quarter: "Q1 2023",
            event_type: "Liquidity Action",
            title: "Ally Financial Prime Floorplan Facility Extension ($2.2B)",
            description: "Carvana successfully extended and amended its committed prime inventory floorplan facility of up to $2.2B with Ally Financial through 2024, preserving critical vehicle inventory financing.",
            severity: "medium",
            source_url: "#demo"
        },
        {
            id: "EVT-009",
            date: "2023-07-19",
            quarter: "Q2 2023",
            event_type: "Debt Exchange",
            title: "Comprehensive Out-of-Court Debt Exchange Agreement Announced",
            description: "Carvana and noteholders holding >90% of unsecured bonds announced a binding agreement to swap existing notes for new senior secured PIK-toggle notes, reducing total debt by $1.2B+ and slashing cash interest by $430M/yr.",
            severity: "critical",
            source_url: "#demo"
        },
        {
            id: "EVT-010",
            date: "2023-09-01",
            quarter: "Q3 2023",
            event_type: "Restructuring",
            title: "Closing of Debt Restructuring: $5.5B Exchanged, $1.25B Principal Reduction",
            description: "Executed the transaction, issuing new Senior Secured 2028, 2030, and 2031 notes with 2-year payment-in-kind (PIK) options. S&P recognized the exchange as a distressed debt restructuring (SD rating briefly), subsequently upgrading.",
            severity: "critical",
            source_url: "#demo"
        },
        {
            id: "EVT-011",
            date: "2024-05-01",
            quarter: "Q1 2024",
            event_type: "Recovery Milestone",
            title: "First Full GAAP Operating Profit & Profitability Confirmation",
            description: "Carvana reported Q1 2024 Operating Income of $134M and Net Income of $49M, conclusively proving business model viability without reliance on external rescue capital.",
            severity: "medium",
            source_url: "#demo"
        },
        {
            id: "EVT-012",
            date: "2024-11-15",
            quarter: "Q4 2024",
            event_type: "Refinancing",
            title: "Credit Rating Upgrades & Voluntary Debt Retirement from Free Cash Flow",
            description: "Moody's and S&P upgraded Carvana credit ratings multiple notches to B2/B. Carvana utilized surplus cash flow to execute open-market repurchases of Senior Secured PIK Notes.",
            severity: "low",
            source_url: "#demo"
        }
    ];

    /**
     * 8. Debt Capital Structure & Instruments
     */
    const debtInstruments = [
        {
            name: "5.500% Senior Notes due 2025",
            type: "Senior Unsecured Notes",
            principal: 500.0,
            maturity_date: "2025-04-15",
            interest_rate: "5.500%",
            status: "Substantially Exchanged (Sept 2023)",
            notes: "$440M tendered and converted into Senior Secured PIK-toggle notes; remaining stub ~$60M."
        },
        {
            name: "5.875% Senior Notes due 2028",
            type: "Senior Unsecured Notes",
            principal: 600.0,
            maturity_date: "2028-10-01",
            interest_rate: "5.875%",
            status: "Substantially Exchanged (Sept 2023)",
            notes: "$520M tendered and retired in debt exchange."
        },
        {
            name: "4.875% Senior Notes due 2029",
            type: "Senior Unsecured Notes",
            principal: 750.0,
            maturity_date: "2029-09-01",
            interest_rate: "4.875%",
            status: "Substantially Exchanged (Sept 2023)",
            notes: "Issued Aug 2021 at peak valuation; $660M tendered in 2023 restructuring."
        },
        {
            name: "10.250% Senior Notes due 2030",
            type: "Senior Unsecured Notes (ADESA Financing)",
            principal: 3275.0,
            maturity_date: "2030-05-01",
            interest_rate: "10.250%",
            status: "Substantially Exchanged (Sept 2023)",
            notes: "Issued April 2022 to fund ADESA purchase; primary catalyst of distress; $3.0B exchanged for new secured notes."
        },
        {
            name: "12.000% / 13.000% Senior Secured PIK Notes due 2028",
            type: "Senior Secured First Lien Notes",
            principal: 1000.0,
            maturity_date: "2028-12-01",
            interest_rate: "9.0% Cash / 12.0% PIK (Yrs 1-2), 11.0% Cash thereafter",
            status: "Active (Issued Sept 2023)",
            notes: "First-priority lien on ADESA physical auction facilities and vehicle collateral."
        },
        {
            name: "12.000% / 13.000% Senior Secured PIK Notes due 2030",
            type: "Senior Secured First Lien Notes",
            principal: 1500.0,
            maturity_date: "2030-06-01",
            interest_rate: "9.0% Cash / 12.0% PIK (Yrs 1-2), 11.0% Cash thereafter",
            status: "Active (Issued Sept 2023)",
            notes: "Extended duration tranche issued to ad-hoc creditor committee."
        },
        {
            name: "9.000% / 11.000% Senior Secured PIK Notes due 2031",
            type: "Senior Secured First Lien Notes",
            principal: 1800.0,
            maturity_date: "2031-12-01",
            interest_rate: "9.0% Cash / 10.0% PIK (Yrs 1-2), 9.0% Cash thereafter",
            status: "Active (Issued Sept 2023)",
            notes: "Largest tranche of 2023 restructuring; provides runway through 2031."
        },
        {
            name: "Ally Inventory Floorplan Credit Facility",
            type: "Revolving Asset-Backed Warehouse Facility",
            principal: 2200.0,
            maturity_date: "2025-03-31",
            interest_rate: "SOFR + 225 bps",
            status: "Active & In Compliance",
            notes: "Secured solely by retail and wholesale vehicle inventory units held for resale."
        }
    ];

    /**
     * 9. Covenant Surveillance Data
     * Per research protocol: "Mark unknown/not publicly disclosed instead of forcing a number.
     * Never invent a covenant."
     */
    const covenantData = [
        {
            name: "Floorplan Minimum Liquidity Covenant",
            type: "Financial Maintenance Covenant",
            requirement: "Maintain minimum unrestricted cash & available floorplan capacity of at least $200M",
            current_status: "In Compliance ($1,150M cash + $450M floorplan headroom)",
            headroom: "$1,400M Headroom",
            is_disclosed: true,
            notes: "Publicly referenced in 10-Q Item 2 debt disclosures.",
            source_doc: "10-Q (Q3 2023 Debt Footnote)"
        },
        {
            name: "Senior Secured Indenture Fixed Charge Coverage Incurrence Test",
            type: "Debt Incurrence Covenant",
            requirement: "Not publicly disclosed (Indenture requires consolidated fixed charge coverage ratio >= 2.0x for restricted debt incurrence)",
            current_status: "Estimated In Compliance",
            headroom: "Not publicly disclosed",
            is_disclosed: false,
            notes: "Governs ability to incur additional senior debt. Private compliance certificate not filed publicly with SEC.",
            source_doc: "8-K Exhibit 4.1 (Indenture)"
        },
        {
            name: "Ally Floorplan Tangible Net Worth Test",
            type: "Financial Maintenance Covenant",
            requirement: "Not publicly disclosed",
            current_status: "Estimated In Compliance",
            headroom: "Not publicly disclosed",
            is_disclosed: false,
            notes: "Confidential terms redacted under SEC FOIA confidential treatment rules.",
            source_doc: "SEC Filing Ex-10.1 (Confidential Treatment)"
        },
        {
            name: "Senior Secured Notes Restricted Payments Basket",
            type: "Negative Covenant",
            requirement: "Not publicly disclosed (Zero basket for equity distributions while leverage exceeds covenant threshold)",
            current_status: "Restricted (No equity repurchases or dividends permitted)",
            headroom: "Not publicly disclosed",
            is_disclosed: false,
            notes: "Strict covenants blocking parent-to-shareholder distributions.",
            source_doc: "8-K Exhibit 4.1 (Indenture)"
        },
        {
            name: "First Lien Net Leverage Incurrence Cap",
            type: "Negative Covenant",
            requirement: "Not publicly disclosed (Estimated < 3.5x first lien net leverage for new secured liens)",
            current_status: "Deleveraging Underway",
            headroom: "Not publicly disclosed",
            is_disclosed: false,
            notes: "Protects first-lien collateral pool from priming liens.",
            source_doc: "8-K Exhibit 4.1 (Indenture)"
        }
    ];

    /**
     * 10. Base Case Values for Interactive Stress Testing
     * Based on Q4 2024 quarterly run-rate
     */
    const stressTestBase = {
        period: "Q4 2024 Baseline",
        revenue: 3820.0,
        ebitda: 460.0,
        gross_profit: 821.3,
        gross_margin: 21.5,
        interest_expense: 85.0,
        cash: 1150.0,
        total_debt: 5080.0,
        operating_cash_flow: 460.0,
        capex: 42.0,
        free_cash_flow: 418.0,
        sofr_base_rate: 4.35,
        high_yield_spread: 3.45,
        notes: "Baseline values represent Carvana's Q4 2024 quarterly performance. Interactive stress scenarios apply deterministic arithmetic: Revenue -5%/-10%/-20%, Gross Margin -100/-250/-400 bps, Benchmark Rates +100/+200 bps, and High Yield Spreads +200/+400 bps."
    };

    /**
     * 11. Risk Scores: AI vs Human vs Quantitative Model (16 Quarters)
     * Tracks the central research question:
     * "Can AI warn early, then recognize the recovery instead of staying permanently bearish?"
     */
    const riskScores = [
        {
            quarter: "Q1 2021",
            quantitative_risk: "Healthy",
            ai_risk: "Healthy",
            human_risk: "Healthy",
            ai_confidence: 88,
            human_confidence: 85,
            outcome: "Hyper-growth continuing; revenue +48% in Q2",
            warning_lead_time: 0
        },
        {
            quarter: "Q2 2021",
            quantitative_risk: "Healthy",
            ai_risk: "Healthy",
            human_risk: "Healthy",
            ai_confidence: 92,
            human_confidence: 90,
            outcome: "First positive operating income quarter ($38M)",
            warning_lead_time: 0
        },
        {
            quarter: "Q3 2021",
            quantitative_risk: "Healthy",
            ai_risk: "Watch", // AI raises Watch flag 2-3 quarters early!
            human_risk: "Healthy",
            ai_confidence: 78,
            human_confidence: 85,
            outcome: "Early signs: Gross margin compresses 170 bps; logistics friction",
            warning_lead_time: 3
        },
        {
            quarter: "Q4 2021",
            quantitative_risk: "Watch",
            ai_risk: "Watch",
            human_risk: "Healthy", // Human stays optimistic on +73% YoY revenue
            ai_confidence: 84,
            human_confidence: 80,
            outcome: "Cash burn accelerates; free cash flow -$325M",
            warning_lead_time: 2
        },
        {
            quarter: "Q1 2022",
            quantitative_risk: "Watch",
            ai_risk: "Distressed", // AI detects toxic debt load + rising rates
            human_risk: "Watch",
            ai_confidence: 89,
            human_confidence: 75,
            outcome: "ADESA $3.275B junk notes issued at punitive 10.25% coupon",
            warning_lead_time: 2
        },
        {
            quarter: "Q2 2022",
            quantitative_risk: "Distressed",
            ai_risk: "Distressed",
            human_risk: "Distressed",
            ai_confidence: 94,
            human_confidence: 88,
            outcome: "First 2,500 employee layoffs; debt explodes to $6.65B",
            warning_lead_time: 1
        },
        {
            quarter: "Q3 2022",
            quantitative_risk: "Distressed",
            ai_risk: "Distressed",
            human_risk: "Distressed",
            ai_confidence: 96,
            human_confidence: 92,
            outcome: "Used car retail volume collapses 12.8% QoQ",
            warning_lead_time: 0
        },
        {
            quarter: "Q4 2022",
            quantitative_risk: "Distressed",
            ai_risk: "Distressed",
            human_risk: "Distressed",
            ai_confidence: 95,
            human_confidence: 95,
            outcome: "Peak trough: Creditor cooperation pact signed; bankruptcy rumors peak",
            warning_lead_time: 0
        },
        {
            quarter: "Q1 2023",
            quantitative_risk: "Distressed",
            ai_risk: "Watch", // AI recognizes cost reduction & GPU inflection early!
            human_risk: "Distressed", // Human analyst remains heavily bearish
            ai_confidence: 82,
            human_confidence: 90,
            outcome: "Operating cash flow turns positive to +$45M",
            warning_lead_time: 2 // Lead time on recovery
        },
        {
            quarter: "Q2 2023",
            quantitative_risk: "Watch",
            ai_risk: "Watch",
            human_risk: "Distressed",
            ai_confidence: 86,
            human_confidence: 80,
            outcome: "Record GPU ($6,520) and debt exchange announced",
            warning_lead_time: 1
        },
        {
            quarter: "Q3 2023",
            quantitative_risk: "Watch",
            ai_risk: "Healthy", // AI upgrades following $1.2B debt reduction
            human_risk: "Watch", // Human remains cautious
            ai_confidence: 88,
            human_confidence: 76,
            outcome: "Debt exchange successfully executed; cash interest cut by $430M/yr",
            warning_lead_time: 2
        },
        {
            quarter: "Q4 2023",
            quantitative_risk: "Watch",
            ai_risk: "Healthy",
            human_risk: "Watch",
            ai_confidence: 89,
            human_confidence: 82,
            outcome: "Full year positive Adjusted EBITDA confirmed",
            warning_lead_time: 1
        },
        {
            quarter: "Q1 2024",
            quantitative_risk: "Healthy",
            ai_risk: "Healthy",
            human_risk: "Healthy", // Human finally upgrades to Healthy
            ai_confidence: 94,
            human_confidence: 89,
            outcome: "First sustained GAAP operating profit ($134M)",
            warning_lead_time: 0
        },
        {
            quarter: "Q2 2024",
            quantitative_risk: "Healthy",
            ai_risk: "Healthy",
            human_risk: "Healthy",
            ai_confidence: 95,
            human_confidence: 92,
            outcome: "Free cash flow reaches +$308M",
            warning_lead_time: 0
        },
        {
            quarter: "Q3 2024",
            quantitative_risk: "Healthy",
            ai_risk: "Healthy",
            human_risk: "Healthy",
            ai_confidence: 96,
            human_confidence: 94,
            outcome: "Debt deleveraging to $5,210M via open market repurchases",
            warning_lead_time: 0
        },
        {
            quarter: "Q4 2024",
            quantitative_risk: "Healthy",
            ai_risk: "Healthy",
            human_risk: "Healthy",
            ai_confidence: 97,
            human_confidence: 95,
            outcome: "Multi-notch credit rating upgrades; cash cushion exceeds $1.15B",
            warning_lead_time: 0
        }
    ];

    /**
     * 12. Evidence & Audit Trail Records (18 Items)
     * All excerpts clearly marked [ILLUSTRATIVE EXAMPLE].
     * Includes error_category tags: null | "Extraction" | "Calculation" | "Reasoning" | "Judgment"
     */
    const evidenceRecords = [
        {
            id: "EVD-001",
            company: "Carvana Co. (CVNA)",
            quarter: "Q1 2021",
            document_type: "Earnings Call Transcript (Prepared Remarks)",
            document_date: "2021-05-06",
            source_url: "#demo",
            source_section: "CEO Prepared Remarks - Growth & Demand",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Demand remains off the charts. We are constrained only by our speed of reconditioning and delivering vehicles to awaiting customers.'",
            related_claim_id: "CLM-001",
            related_metric: "Retail Units Sold",
            ai_interpretation: "Management tone reflects extreme confidence in unconstrained secular consumer adoption, with zero risk acknowledgment regarding unit shipping economics or debt capacity.",
            confidence: 94,
            error_category: null
        },
        {
            id: "EVD-002",
            company: "Carvana Co. (CVNA)",
            quarter: "Q2 2021",
            document_type: "Shareholder Letter",
            document_date: "2021-08-05",
            source_url: "#demo",
            source_section: "Unit Economics & GPU Performance",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Achieving over $5,100 total GPU in Q2 validates our multi-year thesis that national centralized reconditioning unlocks structural cost advantages.'",
            related_claim_id: "CLM-002",
            related_metric: "Total GPU ($)",
            ai_interpretation: "Accurately reflects contemporaneous peak GPU performance driven by rapid used car wholesale price appreciation. Claim is aligned with Q2 financials.",
            confidence: 91,
            error_category: null
        },
        {
            id: "EVD-003",
            company: "Carvana Co. (CVNA)",
            quarter: "Q3 2021",
            document_type: "Earnings Call Transcript (Analyst Q&A)",
            document_date: "2021-11-04",
            source_url: "#demo",
            source_section: "Analyst Q&A - Inbound Sourcing & Logistics Costs",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'The sequential margin decline of 170 bps reflects transitory shipping surcharges and technician hiring ramps that will normalize in coming quarters.'",
            related_claim_id: "CLM-003",
            related_metric: "Operating Income ($M)",
            ai_interpretation: "AI identifies hedging language ('transitory', 'normalize') masking fundamental cost creep in reconditioning centers. First subtle signal of unit margin deceleration.",
            confidence: 86,
            error_category: null
        },
        {
            id: "EVD-004",
            company: "Carvana Co. (CVNA)",
            quarter: "Q4 2021",
            document_type: "10-K (Item 7 MD&A)",
            document_date: "2022-02-24",
            source_url: "#demo",
            source_section: "Item 7 - Management's Discussion and Analysis - Outlook",
            speaker: "Item 7 MD&A Disclosures",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Management anticipates gross profit per unit to re-expand in early fiscal 2022 as inventory turns normalize following seasonal Omicron disruptions.'",
            related_claim_id: "CLM-004",
            related_metric: "Gross Margin (%)",
            ai_interpretation: "Optimistic guidance directly contradicted by subsequent Q1 2022 gross margin drop to 9.1%. AI flags high divergence risk.",
            confidence: 82,
            error_category: "Reasoning"
        },
        {
            id: "EVD-005",
            company: "Carvana Co. (CVNA)",
            quarter: "Q1 2022",
            document_type: "Earnings Call Transcript (Prepared Remarks)",
            document_date: "2022-04-20",
            source_url: "#demo",
            source_section: "ADESA Transaction Rationale",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'ADESA puts 78% of the U.S. population within 100 miles of a Carvana inspection center. This is transformative for logistics speed and unit costs.'",
            related_claim_id: "CLM-005",
            related_metric: "Total Debt ($M)",
            ai_interpretation: "Management emphasizes physical footprint benefits while completely deflecting from the massive debt burden required to finance the acquisition during a tightening rate cycle.",
            confidence: 88,
            error_category: null
        },
        {
            id: "EVD-006",
            company: "Carvana Co. (CVNA)",
            quarter: "Q1 2022",
            document_type: "10-Q (Item 2 MD&A)",
            document_date: "2022-04-20",
            source_url: "#demo",
            source_section: "Item 2 - Liquidity and Capital Resources",
            speaker: "Item 2 MD&A Disclosures",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'We believe existing cash, floorplan lines, and unencumbered assets provide adequate headroom to satisfy obligations for the next 12 months.'",
            related_claim_id: "CLM-006",
            related_metric: "Free Cash Flow ($M)",
            ai_interpretation: "Standard boilerplate liquidity language masks severe cash burn rate (-$595M FCF in Q1 2022), signaling that external capital or restructuring is imminent.",
            confidence: 79,
            error_category: "Judgment"
        },
        {
            id: "EVD-007",
            company: "Carvana Co. (CVNA)",
            quarter: "Q2 2022",
            document_type: "Shareholder Letter",
            document_date: "2022-08-04",
            source_url: "#demo",
            source_section: "Operational Strategy & Cash Conservation",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'In light of rapid Federal Reserve tightening and used car price volatility, we are executing a $1B SG&A reduction plan and prioritizing self-funded operations.'",
            related_claim_id: "CLM-007",
            related_metric: "Operating Cash Flow ($M)",
            ai_interpretation: "Strategic inflection: Management explicitly acknowledges macro tightening and formally abandons unconstrained volume growth in favor of cash preservation.",
            confidence: 90,
            error_category: null
        },
        {
            id: "EVD-008",
            company: "Carvana Co. (CVNA)",
            quarter: "Q2 2022",
            document_type: "Earnings Call Transcript (Analyst Q&A)",
            document_date: "2022-08-04",
            source_url: "#demo",
            source_section: "Analyst Q&A - Debt Structure & Cash Interest",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Completing the debt placement with institutional partners ensures Carvana is funded through the cycle with no need for equity dilution.'",
            related_claim_id: "CLM-008",
            related_metric: "Interest Expense ($M)",
            ai_interpretation: "Severe divergence: CFO portrays the 10.25% notes as a stability victory, ignoring that interest expense immediately surged to $145M per quarter, exceeding gross profit.",
            confidence: 85,
            error_category: "Calculation"
        },
        {
            id: "EVD-009",
            company: "Carvana Co. (CVNA)",
            quarter: "Q3 2022",
            document_type: "Earnings Call Transcript (Prepared Remarks)",
            document_date: "2022-11-03",
            source_url: "#demo",
            source_section: "CEO Remarks - Macro Demand",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Higher interest rates are depressing industry-wide retail transactions, yet our customer conversion and NPS hold near record peaks.'",
            related_claim_id: "CLM-009",
            related_metric: "Retail Units Sold",
            ai_interpretation: "Shift to external scapegoating: Management attributes all volume and margin contraction to the Federal Reserve and industry affordability rather than internal overcapacity.",
            confidence: 83,
            error_category: null
        },
        {
            id: "EVD-010",
            company: "Carvana Co. (CVNA)",
            quarter: "Q3 2022",
            document_type: "Earnings Call Transcript (Analyst Q&A)",
            document_date: "2022-11-03",
            source_url: "#demo",
            source_section: "Analyst Q&A - Liquidity & Cash Runway",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'We do not anticipate needing to access the public debt markets under any reasonable scenario over the next 18 to 24 months.'",
            related_claim_id: "CLM-022",
            related_metric: "Cash Balance ($M)",
            ai_interpretation: "High uncertainty hedging: Unrestricted cash plummeted from $1,045M to $440M. AI detects that stated runway is mathematically impossible without severe operational cuts.",
            confidence: 74,
            error_category: "Reasoning"
        },
        {
            id: "EVD-011",
            company: "Carvana Co. (CVNA)",
            quarter: "Q4 2022",
            document_type: "Earnings Call Transcript (Analyst Q&A)",
            document_date: "2023-02-23",
            source_url: "#demo",
            source_section: "Analyst Q&A - Bankruptcy Rumors & Creditor Pact",
            speaker: "Mark Jenkins (CFO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Rumors regarding bankruptcy filings or debt restructuring are entirely unfounded. We have multi-year runway and unencumbered real estate assets.'",
            related_claim_id: "CLM-011",
            related_metric: "Operating Cash Flow ($M)",
            ai_interpretation: "Defensive denial: CFO disputes restructuring necessity despite creditor pact formation and Q4 net loss of -$806M. Peak divergence between executive narrative and credit market pricing.",
            confidence: 76,
            error_category: null
        },
        {
            id: "EVD-012",
            company: "Carvana Co. (CVNA)",
            quarter: "Q4 2022",
            document_type: "Shareholder Letter",
            document_date: "2023-02-23",
            source_url: "#demo",
            source_section: "Inventory Valuation & Wholesale Dynamics",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Carvana endured the steepest used vehicle depreciation in modern records, requiring aggressive inventory discounting to clear carrying risk.'",
            related_claim_id: "CLM-012",
            related_metric: "Total GPU ($)",
            ai_interpretation: "Accurate post-mortem description of catastrophic wholesale depreciation that collapsed GPU to $2,219. AI confirms high severity of inventory markdown cycle.",
            confidence: 93,
            error_category: null
        },
        {
            id: "EVD-013",
            company: "Carvana Co. (CVNA)",
            quarter: "Q1 2023",
            document_type: "Shareholder Letter",
            document_date: "2023-05-04",
            source_url: "#demo",
            source_section: "Three-Step Turnaround Plan Execution",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'We achieved positive operating cash flow of $45M in Q1, demonstrating the speed and operational discipline of our overhead reduction.'",
            related_claim_id: "CLM-013",
            related_metric: "Operating Cash Flow ($M)",
            ai_interpretation: "Inflection verified: Numbers confirm positive OCF ($45M) and sequential SG&A reduction. AI upgrades outlook from Distressed to Watch, recognizing operational inflection.",
            confidence: 92,
            error_category: null
        },
        {
            id: "EVD-014",
            company: "Carvana Co. (CVNA)",
            quarter: "Q2 2023",
            document_type: "Earnings Call Transcript (Prepared Remarks)",
            document_date: "2023-07-19",
            source_url: "#demo",
            source_section: "Record GPU & Unit Economics Transformation",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Our $6,520 GPU is not an accident; it is the structural result of internal reconditioning efficiency and direct customer vehicle sourcing.'",
            related_claim_id: "CLM-014",
            related_metric: "Total GPU ($)",
            ai_interpretation: "Claim supported by data: Total GPU reached $6,520 and Adjusted EBITDA flipped to +$110M. AI identifies structural turnaround taking hold.",
            confidence: 95,
            error_category: null
        },
        {
            id: "EVD-015",
            company: "Carvana Co. (CVNA)",
            quarter: "Q2 2023",
            document_type: "8-K Material Definitive Agreement",
            document_date: "2023-07-19",
            source_url: "#demo",
            source_section: "Item 1.01 - Transaction Support Agreement",
            speaker: "8-K Filing",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Carvana Co. entered into a Transaction Support Agreement with noteholders holding approximately 90% of Senior Notes to extinguish >$1.2B of debt principal.'",
            related_claim_id: "CLM-015",
            related_metric: "Total Debt ($M)",
            ai_interpretation: "Objective credit event: Out-of-court debt restructuring eliminates bankruptcy overhang, validates AI Watch upgrade, and provides multi-year interest deferral runway.",
            confidence: 96,
            error_category: null
        },
        {
            id: "EVD-016",
            company: "Carvana Co. (CVNA)",
            quarter: "Q4 2023",
            document_type: "Shareholder Letter",
            document_date: "2024-02-22",
            source_url: "#demo",
            source_section: "Full-Year 2023 Performance Summary",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'We defied industry expectations by delivering full-year positive Adjusted EBITDA and sustainable unit margins through rigorous execution.'",
            related_claim_id: "CLM-017",
            related_metric: "EBITDA ($M)",
            ai_interpretation: "Financial data confirms turnaround durability: positive EBITDA ($75M) maintained despite seasonal volume low. AI maintains Healthy/Recovery rating.",
            confidence: 95,
            error_category: null
        },
        {
            id: "EVD-017",
            company: "Carvana Co. (CVNA)",
            quarter: "Q1 2024",
            document_type: "Earnings Call Transcript (Prepared Remarks)",
            document_date: "2024-05-01",
            source_url: "#demo",
            source_section: "GAAP Profitability & Long-Term Targets",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Today Carvana is fundamentally profitable on a GAAP basis, with gross profit per unit exceeding $6,400 across all revenue streams.'",
            related_claim_id: "CLM-018",
            related_metric: "Operating Income ($M)",
            ai_interpretation: "Complete alignment: GAAP Net Income ($49M) and Operating Income ($134M) confirm institutional recovery. Human and quantitative models finally upgrade to Healthy.",
            confidence: 97,
            error_category: null
        },
        {
            id: "EVD-018",
            company: "Carvana Co. (CVNA)",
            quarter: "Q4 2024",
            document_type: "Earnings Call Transcript (Prepared Remarks)",
            document_date: "2025-02-20",
            source_url: "#demo",
            source_section: "2024 Full Year Review & 2025 Vision",
            speaker: "Ernie Garcia III (CEO)",
            evidence_excerpt: "[ILLUSTRATIVE EXAMPLE] 'Our multi-year turnaround is complete. We possess the balance sheet, unit economics, and operational machine to scale national market share profitably.'",
            related_claim_id: "CLM-021",
            related_metric: "Cash Balance ($M)",
            ai_interpretation: "Record performance: Q4 EBITDA reached $460M, FCF reached $418M, and cash cushion expanded to $1.15B. Credit trajectory completed full circle from hyper-growth to distress to recovery.",
            confidence: 98,
            error_category: null
        }
    ];

    /**
     * 13. Data Sources & Direct Verification Links
     * Contains all primary investor relations, SEC EDGAR, transcript, and macro benchmark endpoints.
     */
    const dataSources = [
        {
            id: "SRC-001",
            name: "Carvana Investor Relations",
            category: "Carvana",
            description: "Primary investor relations portal containing quarterly releases, shareholder letters, and webcasts.",
            url: "https://investors.carvana.com/",
            status: "unverified"
        },
        {
            id: "SRC-002",
            name: "Carvana Quarterly Results Archive",
            category: "Carvana",
            description: "Historical quarterly earnings releases, financial packages, and supplemental operational tables.",
            url: "https://investors.carvana.com/financial-reports/quarterly-results/2026",
            status: "unverified"
        },
        {
            id: "SRC-003",
            name: "Carvana Events & Presentations",
            category: "Carvana",
            description: "Earnings call audio archives, investor day slide decks, and conference webcasts.",
            url: "https://investors.carvana.com/events-and-presentations",
            status: "unverified"
        },
        {
            id: "SRC-004",
            name: "Carvana SEC EDGAR Filings",
            category: "Carvana",
            description: "Official SEC regulatory filings including Form 10-K, 10-Q, 8-K agreements, and debt indenture exhibits.",
            url: "https://www.sec.gov/edgar/browse/?CIK=1690820",
            status: "unverified"
        },
        {
            id: "SRC-005",
            name: "Quartr Transcripts & Live Calls",
            category: "Transcripts",
            description: "Searchable earnings call transcripts, prepared remarks, and analyst Q&A logs.",
            url: "https://quartr.com/features/live-calls-and-transcripts",
            status: "unverified"
        },
        {
            id: "SRC-006",
            name: "Federal Reserve Policy Rate",
            category: "Macroeconomic",
            description: "Official FOMC federal funds target range and monetary policy rate history.",
            url: "https://www.federalreserve.gov/economy-at-a-glance-policy-rate.htm",
            status: "unverified"
        },
        {
            id: "SRC-007",
            name: "New York Fed EFFR",
            category: "Macroeconomic",
            description: "Effective Federal Funds Rate historical series and benchmark money market rate data.",
            url: "https://www.newyorkfed.org/markets/reference-rates/effr",
            status: "unverified"
        },
        {
            id: "SRC-008",
            name: "FRED High Yield Spread (ICE BofA OAS)",
            category: "Macroeconomic",
            description: "ICE BofA US High Yield Index Option-Adjusted Spread tracking corporate credit market risk premiums.",
            url: "https://fred.stlouisfed.org/series/BAMLH0A0HYM2",
            status: "unverified"
        },
        {
            id: "SRC-009",
            name: "FRED U.S. Unemployment Rate",
            category: "Macroeconomic",
            description: "Civilian unemployment rate from Bureau of Labor Statistics for consumer credit health context.",
            url: "https://fred.stlouisfed.org/series/UNRATE",
            status: "unverified"
        }
    ];

    /**
     * 14. Research Experiments (10 Experiments from Research Playbook)
     */
    const researchExperiments = [
        {
            id: "EXP-001",
            number: 1,
            name: "Experiment 1 - Baseline: Financial Features Only",
            description: "Establish what simple quantitative monitoring (growth, margins, leverage, interest coverage) can detect on a standalone basis without qualitative textual inputs.",
            status: "Planned",
            research_question: "How late do purely quantitative indicators signal distress and recovery?",
            target_metrics: ["Warning Lead Time", "Precision", "Recall", "False Alarm Rate"]
        },
        {
            id: "EXP-002",
            number: 2,
            name: "Experiment 2 - Language Only",
            description: "Use MD&A and earnings call language signals (uncertainty, tone, hedging, specificity, excuses) in isolation to evaluate predictive power without numerical inputs.",
            status: "Planned",
            research_question: "Can management narrative alone predict credit deterioration before numbers reflect it?",
            target_metrics: ["Sentiment Calibration", "Uncertainty Lead Time", "Language Degradation Speed"]
        },
        {
            id: "EXP-003",
            number: 3,
            name: "Experiment 3 - Financial + Language Multi-Modal Fusion",
            description: "Test the incremental early-warning detection value obtained by combining qualitative text analysis with traditional financial metrics.",
            status: "Planned",
            research_question: "Does combining numbers and text outperform both standalone models?",
            target_metrics: ["Lead Time Expansion", "F1 Score", "ROC-AUC"]
        },
        {
            id: "EXP-004",
            number: 4,
            name: "Experiment 4 - Add Management vs Numbers Divergence",
            description: "Test whether explicitly scoring the inconsistency between executive optimism and underlying operational data provides a superior leading credit indicator.",
            status: "Planned",
            research_question: "Does persistent management-numbers divergence precede major restructuring events?",
            target_metrics: ["Divergence Persistence Score", "Distress Prediction Accuracy"]
        },
        {
            id: "EXP-005",
            number: 5,
            name: "Experiment 5 - Snapshot vs Longitudinal Trajectory",
            description: "Compare single-quarter snapshot analysis against 4-quarter rolling trajectory and financial acceleration/deceleration trends.",
            status: "Planned",
            research_question: "Does rate of change provide earlier warning than static threshold crossing?",
            target_metrics: ["Acceleration Detection", "False Positive Reduction"]
        },
        {
            id: "EXP-006",
            number: 6,
            name: "Experiment 6 - Prepared Remarks vs Analyst Q&A",
            description: "Evaluate whether unscripted analyst Q&A exchanges reveal deterioration earlier and with higher defensiveness than scripted management prepared remarks.",
            status: "Planned",
            research_question: "Are analyst questions and defensive responses more informative than prepared remarks?",
            target_metrics: ["Q&A Pressure Score", "Defensiveness Correlation", "Evasion Index"]
        },
        {
            id: "EXP-007",
            number: 7,
            name: "Experiment 7 - AI vs Human Analyst Benchmark",
            description: "Compare AI automated assessment with independent human credit analyst ratings under identical blinded historical information cutoffs.",
            status: "Planned",
            research_question: "Where does AI outperform human judgment and where does it produce false alarms?",
            target_metrics: ["Disagreement Rate", "Early Warning Differential", "Accuracy Calibration"]
        },
        {
            id: "EXP-008",
            number: 8,
            name: "Experiment 8 - Human + AI Collaboration Synergy",
            description: "Test whether a human credit analyst assisted by AI divergence flags and evidence links achieves superior portfolio surveillance speed and decision quality.",
            status: "Planned",
            research_question: "Does AI assistance reduce human cognitive anchoring and confirmation bias?",
            target_metrics: ["Analyst Review Speed", "Auditability", "Decision Confidence"]
        },
        {
            id: "EXP-009",
            number: 9,
            name: "Experiment 9 - Stress Robustness & Macro Sensitivity",
            description: "Evaluate whether the credit assessment system remains stable under simulated interest rate increases, used vehicle wholesale depreciation, and demand contractions.",
            status: "Planned",
            research_question: "Does the model distinguish company-specific resilience from external macro headwinds?",
            target_metrics: ["Scenario Sensitivity", "Headroom Depletion Rate", "Model Robustness"]
        },
        {
            id: "EXP-010",
            number: 10,
            name: "Experiment 10 - Missing Information & Confidence Calibration",
            description: "Systematically withhold selected disclosures (e.g., redacted covenants, missing transcripts) to test whether AI confidence scores degrade gracefully.",
            status: "Planned",
            research_question: "Does AI appropriately express uncertainty when key credit documents are absent?",
            target_metrics: ["Confidence Calibration", "Refusal / Insufficient Evidence Rate", "Brier Score"]
        }
    ];

    /**
     * 15. Pre-computed KPI Cards for Overview Dashboard (Latest Quarter: Q4 2024)
     */
    const kpiCards = {
        overallRisk: "Healthy",
        aiRiskScore: "Low (18/100)",
        humanRisk: "Healthy",
        financialRiskScore: "Strong (14/100)",
        languageScore: "Confident & Direct (2.7/3.0)",
        divergenceScore: "Aligned (0.2/3.0)",
        latestQuarter: "Q4 2024",
        periodEnd: "2024-12-31",
        revenue: "$3,820M",
        grossMargin: "21.5%",
        ebitda: "$460M",
        operatingIncome: "$320M",
        netIncome: "$198M",
        cash: "$1,150M",
        totalDebt: "$5,080M",
        operatingCashFlow: "$460M",
        capex: "$42M",
        freeCashFlow: "$418M",
        retailUnitsSold: "112,500 units",
        gpuTotal: "$7,510",
        interestCoverage: "5.4x",
        leverageRatio: "2.8x (Debt / Annualized EBITDA)",
        riskTrajectory: "Full Operational Turnaround Achieved",
        firstWarningLeadTime: "3 quarters earlier than traditional quant indicators",
        recoveryLeadTime: "2 quarters earlier than human analyst consensus",
        topReasonsForStatus: [
            "Positive free cash flow generation exceeding $400M in Q4 2024 with gross margin sustained above 21%",
            "Significant debt reduction following September 2023 debt exchange with no near-term senior maturities until late 2028",
            "Management communication highly aligned with operational data; direct, specific guidance with zero defensiveness"
        ]
    };

    /**
     * Helper Methods for Interactive Dashboard Components
     */
    const helpers = {
        /**
         * Get full quarter record by quarter string (e.g. "Q1 2022")
         */
        getQuarter: function(quarterStr) {
            return quarterlyData.find(function(d) { return d.quarter === quarterStr; }) || null;
        },

        /**
         * Get derived ratios for a specific quarter
         */
        getRatios: function(quarterStr) {
            return financialRatios.find(function(r) { return r.quarter === quarterStr; }) || null;
        },

        /**
         * Get language scoring for a specific quarter
         */
        getLanguage: function(quarterStr) {
            return managementLanguage.find(function(l) { return l.quarter === quarterStr; }) || null;
        },

        /**
         * Get risk scores for a specific quarter
         */
        getRiskScores: function(quarterStr) {
            return riskScores.find(function(s) { return s.quarter === quarterStr; }) || null;
        },

        /**
         * Get claims filtered by quarter
         */
        getClaimsByQuarter: function(quarterStr) {
            return managementClaims.filter(function(c) { return c.quarter === quarterStr; });
        },

        /**
         * Get divergence records for a quarter
         */
        getDivergenceByQuarter: function(quarterStr) {
            return divergenceData.filter(function(d) { return d.quarter === quarterStr; });
        },

        /**
         * Get evidence record by ID
         */
        getEvidenceById: function(evidenceId) {
            return evidenceRecords.find(function(e) { return e.id === evidenceId; }) || null;
        },

        /**
         * Calculate deterministic stress scenario
         * @param {Object} params - { revenueShockPct: -10, marginShockBps: -200, rateHikeBps: 150 }
         */
        calculateStressTest: function(params) {
            const base = stressTestBase;
            const revShock = (params && params.revenueShockPct !== undefined) ? params.revenueShockPct : 0;
            const marginShock = (params && params.marginShockBps !== undefined) ? params.marginShockBps / 100 : 0;
            const rateHike = (params && params.rateHikeBps !== undefined) ? params.rateHikeBps / 100 : 0;

            const stressedRevenue = Math.round(base.revenue * (1 + revShock / 100) * 10) / 10;
            const stressedMargin = Math.max(0, Math.round((base.gross_margin + marginShock) * 10) / 10);
            const stressedGrossProfit = Math.round(stressedRevenue * (stressedMargin / 100) * 10) / 10;
            
            // Operating expenses assumed relatively fixed in near term (~$500M)
            const opex = base.gross_profit - base.ebitda;
            const stressedEbitda = Math.round((stressedGrossProfit - opex) * 10) / 10;
            
            // Stressed interest: SOFR exposure on floating debt (~$2.2B floorplan + cash interest)
            const floatingDebt = 2200.0;
            const incrementalInterest = (floatingDebt * (rateHike / 100)) / 4;
            const stressedInterest = Math.round((base.interest_expense + incrementalInterest) * 10) / 10;
            
            const stressedOperatingCashFlow = Math.round((stressedEbitda - stressedInterest) * 10) / 10;
            const stressedFreeCashFlow = Math.round((stressedOperatingCashFlow - base.capex) * 10) / 10;
            const interestCoverage = stressedInterest > 0 ? (stressedEbitda / stressedInterest).toFixed(2) : "N/A";

            let riskCategory = "Healthy";
            if (stressedEbitda <= 0 || interestCoverage < 1.0) {
                riskCategory = "Distressed";
            } else if (interestCoverage < 2.0 || stressedFreeCashFlow < 50) {
                riskCategory = "Watch";
            }

            return {
                baseQuarter: base.period,
                stressedRevenue: stressedRevenue,
                stressedGrossMargin: stressedMargin,
                stressedGrossProfit: stressedGrossProfit,
                stressedEbitda: stressedEbitda,
                stressedInterest: stressedInterest,
                stressedOperatingCashFlow: stressedOperatingCashFlow,
                stressedFreeCashFlow: stressedFreeCashFlow,
                interestCoverage: interestCoverage,
                riskCategory: riskCategory,
                cashBurnRunwayMonths: stressedFreeCashFlow < 0 ? Math.round((base.cash / Math.abs(stressedFreeCashFlow)) * 3) : "Self-funding"
            };
        }
    };

    /**
     * Master Export Object
     */
    const DashboardData = {
        isDemo: true,
        demoNotice: "⚠️ DEMONSTRATION MODE — All values are illustrative. Not verified historical Carvana data.",
        companyInfo: companyInfo,
        quarterlyData: quarterlyData,
        financialRatios: financialRatios,
        managementLanguage: managementLanguage,
        managementClaims: managementClaims,
        divergenceData: divergenceData,
        creditEvents: creditEvents,
        debtInstruments: debtInstruments,
        covenantData: covenantData,
        stressTestBase: stressTestBase,
        riskScores: riskScores,
        evidenceRecords: evidenceRecords,
        dataSources: dataSources,
        researchExperiments: researchExperiments,
        kpiCards: kpiCards,
        helpers: helpers
    };

    // Export to global window in browser environment
    if (typeof window !== 'undefined') {
        window.DashboardData = DashboardData;
    }

    // Export for CommonJS / Node.js test runner
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DashboardData;
    }

})();
