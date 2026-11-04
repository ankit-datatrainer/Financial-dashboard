# Sanah's AI + Private Credit Research Dashboard: Project Notes & Architecture

## 1. Project Background & Research Objective

**Student:** Sanah (Grade 10)  
**Research Focus:** AI-Powered Early Warning Systems for Credit Deterioration  
**Target Domain:** Translating public company distress indicators into private credit portfolio monitoring  

### Primary Research Question:
> *"Can AI identify deterioration or improvement in a company's credit quality earlier than traditional financial analysis by combining quantitative financial trends with what management says in MD&A reports and earnings calls?"*

---

## 2. Core Triangulation Methodology

The research treats every company-quarter as a frozen historical decision point. For each quarter:

1. **What do the numbers say?**
   - Quantitative condition: revenue trajectory, gross margin per unit, EBITDA proxy, operating cash flow burn, total debt service, and interest coverage.
   - *Engine rule:* Deterministic arithmetic calculations only. No LLM arithmetic.

2. **What does management say?**
   - Qualitative analysis across MD&A disclosures (10-Q/10-K), prepared executive remarks, and analyst Q&A sessions.
   - Scoring on a standardized 0–3 scale across:
     - Tone / Confidence (0 = Very negative, 3 = Highly confident)
     - Uncertainty / Hedging (0 = Low hedging, 3 = Heavy hedging)
     - Specificity (0 = Vague/aspirational, 3 = Concrete dates/targets)
     - Q&A Defensiveness (0 = Direct numerical answer, 3 = Evasive)
     - New Risk Themes (count of newly introduced headwinds)
     - Repeated Explanations (count of recurring excuses)
     - Guidance Revisions (-1 = Cut, 0 = Maintained, +1 = Raised)

3. **Do the words and numbers agree? (The Signature Divergence Signal)**
   - Algorithmic comparison matching management statements against contemporaneous audited figures.
   - Severity rubric:
     - **Score 0 (Aligned):** Qualitative statements match accounting direction.
     - **Score 1 (Mildly Inconsistent):** Optimistic tone despite modest growth decelerations.
     - **Score 2 (Materially Inconsistent):** Asserting resilient demand while margins collapse or cash burns accelerate.
     - **Score 3 (Repeated / Severe Contradiction):** Multi-quarter persistence of positive narratives contradicted by mounting losses.

---

## 3. Public Company to Private Credit Translation

While the initial proof-of-concept tests Carvana Co. (CVNA) across 2021–2024/25, the architecture is engineered to slot directly into private credit portfolio surveillance:

| Public Company Source | Private Credit Equivalent | Surveillance & Early Warning Significance |
| :--- | :--- | :--- |
| **10-Q / 10-K Filings** | Monthly / Quarterly Financial Package | Auditing EBITDA adjustments, revenue run-rates, and liquidity. |
| **MD&A Commentary** | Lender Updates / Sponsor Commentary | Monitoring management explanations for budget variances. |
| **Prepared Earnings Remarks**| Quarterly Lender Update Presentation | Executive framing of forward business outlook. |
| **Analyst Q&A Transcripts** | Deal Team / Portfolio Manager Q&A Calls | Detecting evasiveness when pressed on liquidity or covenants. |
| **Public Guidance Revisions**| Annual Budget & Board Forecasts | Tracking frequency and severity of downward budget revisions. |
| **Credit Agreement Exhibits**| Officer Compliance Certificates | Surveillance of financial covenants, leverage caps, and waivers. |

---

## 4. Time-Contained Protocol (Eliminating Hindsight Bias)

To maintain scientific integrity:
- Every observation is tagged with an immutable `information_cutoff_date`.
- When evaluating e.g. Q2 2022, the model and researcher are strictly restricted to documents filed on or before that date.
- Restatements made in subsequent years are recorded separately; initial predictions run exclusively on originally published figures.

---

## 5. Technical Stack & Implementation Guidelines

- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript (ES6+). Zero heavy build dependencies (No React, Next.js, Vue, or Angular).
- **Visualization:** Chart.js 4.4 via lightweight CDN.
- **Theming:** Full CSS variable-driven Institutional Dark Navy (default) and Light theme.
- **Portability:** 100% static asset deployment ready for GitHub and Vercel.

