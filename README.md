# Sanah's AI + Private Credit Research Dashboard
### AI-Powered Early Warning System for Credit Deterioration

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/ankit-datatrainer/Financial-dashboard)

---

## 1. Project Overview & Research Context

This application is an institutional-grade financial research dashboard developed for **Sanah**, a **Grade 10 researcher**, exploring the frontier of credit risk intelligence and artificial intelligence. 

The dashboard provides a visual and analytical laboratory designed to be demonstrated to financial professionals, credit researchers, university faculty, and private credit investment teams.

### Primary Research Question:
> *"Can AI identify deterioration or improvement in a company's credit quality earlier than traditional financial analysis by combining quantitative financial trends with what management says in MD&A reports and earnings calls?"*

### Core Triangulation Methodology:
The research evaluates each company-quarter as a frozen historical decision point by comparing three elements:
1. **What do the numbers say?** (Quantitative accounting momentum, cash burns, leverage, and interest coverage).
2. **What does management say?** (Linguistic analysis of 10-Q/10-K MD&A reports, prepared remarks, and analyst Q&A friction).
3. **Do the words and numbers agree?** (The signature *Divergence Signal*, identifying early inconsistencies before credit distress events).

---

## 2. Active Research Company: Carvana Co. (NYSE: CVNA)

For this initial prototype, the research focuses exclusively on **Carvana Co.** across **16 historical quarters (Q1 2021 – Q4 2024)**, tracing the full cycle of:
- **2021:** Post-pandemic hyper-growth and unit scaling.
- **2022:** ADESA debt acquisition, margin collapse, and severe credit distress.
- **2023:** Out-of-court debt exchange restructuring and gross profit per unit (GPU) inflection.
- **2024:** Sustainable GAAP operating turnaround, positive Free Cash Flow, and credit recovery.

*Architecture Note:* While Carvana serves as the initial active proof of concept, the application architecture is modularized to support planned expansions (Beyond Meat `BYND` and Peloton `PTON`) without refactoring.

---

## 3. Technology Stack

Built with a clean, high-performance vanilla web stack:
- **HTML5:** Semantic, accessible layout structuring 9 dedicated analytical views.
- **CSS3:** Modern custom property theming, responsive grid/flexbox, subtle animations, and high-contrast institutional dark/light modes.
- **Vanilla JavaScript (ES6+):** Zero frontend framework overhead (No React, Next.js, Angular, or Vue).
- **Chart.js (v4.4.1):** High-fidelity financial time-series, stacked theme bars, distribution donuts, and multi-signal radar charts.

---

## 4. Application Architecture & Folder Structure

```
Financial dashboard/
│
├── index.html                  # Master entry point with all 9 page sections & modals
├── vercel.json                 # Vercel static deployment configuration
├── .gitignore                  # Production Git ignore rules
├── README.md                   # Comprehensive technical & research documentation
│
├── assets/
│   ├── css/
│   │   ├── styles.css          # Core design system tokens, layout & typography
│   │   ├── components.css      # Specialized cards, 3-column divergence, & timeline
│   │   └── responsive.css      # Fluid layouts for Desktop, Tablet, and Mobile
│   │
│   └── js/
│       ├── data.js             # Comprehensive 16-quarter normalized demo dataset
│       ├── financial.js        # Deterministic financial math engine (No LLM math)
│       ├── charts.js           # Multi-view Chart.js manager with theme synchronization
│       ├── navigation.js       # SPA router, sidebar collapse, search, & drawers
│       ├── stress-test.js      # Interactive slider-driven macro shock simulator
│       ├── evidence.js         # Searchable audit trail library with error classification
│       └── app.js              # Master application controller and view orchestrator
│
└── docs/
    └── project-notes.md        # Deep-dive research notes and private credit bridge
```

---

## 5. Key Dashboard Features & Research Pages

1. **Company Overview:** High-level executive dashboard featuring risk status, AI risk rating, human consensus, financial risk scores, and the "Top 3 Reasons for Risk Trajectory Change."
2. **Financial Trend Dashboard:** 6 interactive quantitative charts covering revenue, profitability, cash vs. debt, operating cash flow, gross margin, and interest expense, alongside deterministic financial ratios.
3. **Management Language Analysis:** Granular 0–3 scoring of executive Tone, Uncertainty, Specificity, and Q&A Defensiveness, featuring a longitudinal *"What Changed Since Last Quarter?"* linguistic diff panel.
4. **Management vs. Numbers Divergence (Signature View):** 3-column triangulation interface matching executive claims directly against reported figures, rating divergence on a 0–3 scale and tracking multi-quarter persistence.
5. **Credit Events, Debt & Covenant Surveillance:** Comprehensive capital structure breakdown, senior note schedules, credit restructuring chronology, and verified public covenant terms.
6. **Interactive Stress Testing Laboratory:** Real-time scenario simulator with 5 interactive sliders (revenue decline, margin compression, rate hikes, refinancing spread, cash flow reduction) and dynamic Base/Moderate/Severe scenario modeling.
7. **AI vs. Human vs. Quantitative Model:** Empirical evaluation matrix testing whether AI detects deterioration earlier than human analysts, complete with a catalog of 10 formal research experiments.
8. **Evidence & Audit Trail:** Full auditability suite linking every AI interpretation and score change to verbatim filing excerpts, speaker metadata, and error classifications.
9. **Data Sources Registry:** First-party regulatory registry preserving original hyperlinks to Carvana IR, SEC EDGAR, Quartr transcripts, Federal Reserve policy rates, and FRED credit spreads.

---

## 6. How to Run Locally

Because this project uses vanilla web standards, it requires **no build tools, bundlers, or node dependencies**:

### Option 1: Direct File Opening
Double-click `index.html` in your file explorer to open it directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended)
Running through a local web server ensures seamless loading of CDN libraries and font assets:

**Using Python:**
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

**Using Node.js (via npx):**
```bash
npx serve .
```

**Using VS Code Live Server:**
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## 7. How to Deploy to Vercel

The application is pre-configured for instant zero-configuration deployment to Vercel as a static site:

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete AI + Private Credit Research Dashboard"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the repository: `ankit-datatrainer/Financial-dashboard`.
4. Keep the default settings:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build Command:** *(Leave empty)*
   - **Output Directory:** *(Leave empty)*
5. Click **"Deploy"**. The site will be live within seconds with clean URLs and full security headers.

---

## 8. Data Disclosure & Research Integrity

> **⚠️ DEMONSTRATION NOTICE:**  
> All numbers, scores, management quotes, divergence ratings, and covenant details in this version are **illustrative demonstration data** created to validate the user interface and system architecture. They do not constitute verified historical Carvana financial records or investment advice.

### Non-Negotiable Research Principles:
- **No LLM Arithmetic:** All financial ratios, growth rates, coverage multiples, and stress scenarios are computed deterministically in JavaScript.
- **No Hindsight Leakage:** Every historical quarter strictly operates within its frozen `information_cutoff_date`.
- **Neutral Auditability:** The system measures divergence objectively without editorializing management intent or making subjective claims of dishonesty.

---

## 9. Planned Future Enhancements

- Ingestion of verified historical Carvana 10-Q/10-K filings and Quartr call transcripts via a Python extraction pipeline.
- Integration of real LLM APIs (Gemini 1.5 Pro / Claude 3.5 Sonnet) using structured JSON schemas for automated extraction.
- Expansion of the company dataset to include **Beyond Meat (BYND)** and **Peloton (PTON)**.
- Translation of the public-company model to anonymized private credit borrower packages.
