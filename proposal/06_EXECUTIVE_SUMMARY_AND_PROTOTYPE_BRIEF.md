# EXECUTIVE SUMMARY & PROTOTYPE DEMONSTRATION BRIEF

## SUNCASA Kigali Nature-Based Solutions (NbS) Impact Dashboard (MVP)
**Project:** Scaling Urban Nature-Based Solutions for Climate Adaptation in Sub-Saharan Africa (SUNCASA)  
**Lead Organizations:** International Institute for Sustainable Development (IISD) & World Resources Institute (WRI)  
**Funding Agency:** Global Affairs Canada  
**Implementing Partners:** City of Kigali & Rwanda Forestry Authority (RFA)  
**Target Area:** Lower Nyabarongo River Watershed, Kigali, Rwanda  
**Consultant / Bidder:** Tharushya Magara (ApexGeo Analytics & Digital Solutions)  

---

## 1. Executive Summary

This proposal presents an exceptional, de-risked opportunity for IISD, WRI, the City of Kigali, and the Rwanda Forestry Authority (RFA). Rather than submitting a theoretical bid consisting only of planned intentions, **we have designed, built, and validated a fully working, production-grade Minimum Viable Product (MVP) dashboard** that precisely implements the requirements of this Request for Proposals.

The dashboard functions as an indicator-driven, narrative-supported public communication and educational tool. It bridges the gap between high-level project monitoring and civic advocacy—explaining to citizens, youth, city officials, and prospective funders how SUNCASA's nature-based investments in Kigali’s Lower Nyabarongo River watershed mitigate flooding, restore indigenous biodiversity, advance gender equality, and create local green prosperity.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BID VALUE PROPOSITION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  ✓ WORKING MVP ALREADY DELIVERED: Zero execution risk for IISD & WRI.       │
│  ✓ STRICTLY WITHIN BUDGET: USD 19,850 total (under the $20,000 ceiling).   │
│  ✓ FULL BILINGUAL LOCALIZATION: English & Ikinyarwanda zero-reload toggle.  │
│  ✓ MyPeg STORYTELLING ENGINE: 3-Tier public narrative for every indicator.   │
│  ✓ NATIVE RFA FMES INTEROPERABILITY: Compartment IDs & standardized export. │
│  ✓ ZERO VENDOR LOCK-IN: Jamstack architecture with $0 recurring fees.       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Interactive Prototype Feature Highlights

### 1. The MyPeg 3-Tier Public Storytelling Engine
Inspired by IISD's **MyPeg (www.mypeg.ca)**, the platform replaces technical jargon with structured, plain-language civic narratives:
- **Hero KPI Highlights:** Instant executive visibility into four flagship metrics (Hectares Restored, Flood Peak Reduction, Indigenous Tree Ratio, and Paid Green Labor Days) with progress bars tracking targets toward 2026.
- **Thematic Spotlight Selector:** Interactive tabs allowing citizens to explore the 4 strategic pillars (Climate Adaptation, Biodiversity Protection, GESI, and Employment & Economy), answering:
  1. *What is this action?*
  2. *Why does it matter for Kigali?*
  3. *What is SUNCASA doing?*
- **Deep-Dive Indicator Modals:** Clicking any indicator launches an in-depth analytics window featuring:
  - 3-tier narrative cards;
  - Interactive Chart.js quarterly trend trajectories from 2024 baseline through 2026 targets;
  - Catchment-by-catchment breakdown tables (e.g. Yanze, Mpazi, Mount Kigali, Nyabugogo);
  - Official RFA FMES indicator alignment codes and audit source citations.

### 2. Interactive Geospatial GIS Catchment Map
Centered on Kigali and the **Lower Nyabarongo River watershed**:
- **Micro-Catchment Overlays:** Color-coded polygon boundaries delineating **Yanze Upstream Basin**, **Mpazi Critical Drainage Ravine**, **Mount Kigali Slopes**, **Nyabugogo Wetland Basin**, and the **Nyabarongo 30m Shoreline Corridor**.
- **Georeferenced Intervention Markers:** Geocoded sites categorized by theme with custom high-contrast SVG markers.
- **Live Inspection Panel:** Clicking any site or micro-catchment immediately displays sector/district location, RFA compartment registration (e.g., `COMP-GAS-JB-01`), treated surface area, dominant native tree species (*Polyscias fulva*, *Markhamia lutea*), audited survival rates, and GESI female participation rates.
- **Thematic Filtering Controls:** 1-click filter bar to isolate interventions by Climate, Biodiversity, GESI, or Economy.

### 3. Native Bilingual Engine (English & Ikinyarwanda)
- Instant client-side language toggle in the header (`EN` / `RW`).
- Zero page reload: dynamic DOM replacement updates all titles, labels, tooltips, and MyPeg narratives instantaneously without disrupting user map pan/zoom state.
- Decoupled JSON dictionaries (`src/data/locales/en.json` and `src/data/locales/rw.json`) allow project communications staff to edit or expand translations without software developer intervention.

### 4. Rwanda Forestry Authority (RFA) FMES Interoperability
- Directly adheres to the RFA's **Forest Management and Evaluation System (FMES)** schema.
- **Zero Duplicate Data Structures:** Uses official RFA compartment codes and silvicultural definitions.
- **1-Click Open Data Export:** Dedicated buttons allow researchers, government officials, and partners to export the entire live indicator dataset in standardized JSON or the spatial catchment boundaries in standard EPSG:4326 GeoJSON.
- **Seamless Future API Migration:** Built with a modular data adapter that can switch from local JSON files to live RFA REST API endpoints (`/api/v1/indicators`) when FMES upgrades go live.

### 5. Instant Executive Brief Print Engine
- Includes a dedicated print stylesheet (`@media print`).
- Clicking the **"Export Brief"** button in the header formats the active dashboard view into an executive two-page summary suitable for donor briefings, municipal council meetings, or steering committee sessions.

---

## 3. How to Run & Verify the Prototype Locally

The complete source code for this working prototype is contained in this repository and can be tested immediately on any computer with Node.js installed:

```bash
# 1. Install project dependencies (Leaflet, Chart.js, Vite)
npm install

# 2. Launch the local development server
npm run dev

# 3. Open your browser to the displayed URL (typically http://localhost:5173)

# 4. To build the production bundle:
npm run build

# 5. To preview the production bundle:
npm run preview
```

---

## 4. Live Cloud Deployment Options (Instant & Zero Cost)

Because the dashboard compiles into a static bundle (`dist/`), it can be hosted globally with zero recurring infrastructure costs:
1. **Netlify (1-Click):** Drag and drop the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop) or run `npx netlify-cli deploy --prod --dir=dist`.
2. **Vercel (1 Command):** Run `npx vercel --prod` from the project directory.
3. **GitHub Pages:** Automated deployment via GitHub Actions (workflow template included in `docs/DEPLOYMENT_GUIDE.md`).
4. **RFA Server / AOS National Data Centre:** Drop the compiled `dist/` folder into `/var/www/html/suncasa/` on any standard Nginx or Apache server.

---

## 5. Bid Document Navigation Guide

All required bid submission documents have been prepared with rigorous detail in the `proposal/` directory:

| Document | File Path | Purpose |
|---|---|---|
| **Cover Letter** | [`proposal/01_COVER_LETTER.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/01_COVER_LETTER.md) | Formal letter of submission with primary contact details and qualifications summary. |
| **Technical Proposal** | [`proposal/02_TECHNICAL_PROPOSAL.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/02_TECHNICAL_PROPOSAL.md) | Complete methodology, MyPeg framework, architecture, FMES integration, work plan, and risk matrix. |
| **Financial Proposal** | [`proposal/03_FINANCIAL_PROPOSAL.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/03_FINANCIAL_PROPOSAL.md) | Transparent LOE daily rate breakdown ($19,850 total, distinguishing core MVP vs. optional hosting). |
| **References & Experience** | [`proposal/04_RELEVANT_EXPERIENCE_AND_REFERENCES.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/04_RELEVANT_EXPERIENCE_AND_REFERENCES.md) | Detailed project references in Rwanda & Sub-Saharan Africa with full client contact details. |
| **Consultant CV** | [`proposal/05_CONSULTANT_CV_PROFILE.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/05_CONSULTANT_CV_PROFILE.md) | Comprehensive professional resume showcasing front-end, GIS, and environmental dashboard experience. |
| **FMES Integration Spec** | [`docs/FMES_INTEROPERABILITY.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/docs/FMES_INTEROPERABILITY.md) | Data dictionaries, schema definitions, and REST synchronization guidelines for RFA. |
| **Deployment Guide** | [`docs/DEPLOYMENT_GUIDE.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/docs/DEPLOYMENT_GUIDE.md) | Step-by-step instructions for publishing the live dashboard to the web. |
| **Submission Checklist** | [`proposal/SUBMISSION_CHECKLIST_AND_INSTRUCTIONS.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/SUBMISSION_CHECKLIST_AND_INSTRUCTIONS.md) | Final pre-submission checklist and email template for `suncasa@iisd.org`. |
