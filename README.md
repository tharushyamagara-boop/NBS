# SUNCASA Kigali Nature-Based Solutions (NbS) Impact Dashboard (MVP)

An indicator-driven, narrative-supported, bilingual public communication dashboard inspired by **MyPeg (www.mypeg.ca)** to showcase the impact of the **SUNCASA (Scaling Urban Nature-Based Solutions for Climate Adaptation in Sub-Saharan Africa)** project in Kigali, focused on the **Lower Nyabarongo River watershed**.

Funded by **Global Affairs Canada**, jointly led by **IISD** and **WRI**, with **City of Kigali** and **Rwanda Forestry Authority (RFA)** as principal implementing partners.

> **🌐 Active Live Production Deployment:**  
> [https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/](https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/)  
> *(Hosted on Google Cloud Platform / Firebase App Hosting in `us-central1`, project `nbs-project-7deac`)*  
>  
> **📁 GitHub Source Code Repository:**  
> [https://github.com/tharushyamagara-boop/NBS](https://github.com/tharushyamagara-boop/NBS) *(Active Branch: `NBS-Live`)*

---

## Key Features & MyPeg Architecture

1. **Production-Grade Next.js 14 PWA**:
   - Built on **Next.js 14 (App Router)**, **TypeScript 5.6**, and **React 18.3**.
   - Multi-route architecture: public Hero view (`/`), per-indicator deep-dive pages (`/indicator/[id]`), password-protected Admin Panel (`/admin`), and standalone Embed Widget route (`/embed`).
   - Declared as a Progressive Web App (PWA) with `manifest.json` and theme color `#10b981`.

2. **MyPeg 4-Tab Indicator Workspace**:
   - Directly modeled after IISD's **MyPeg (www.mypeg.ca)** indicator exploration tool:
     - **Tab 1: Description & Story Narrative**: Plain-language civic answers to *What is this indicator?*, *Why does it matter for Kigali?*, and *What is SUNCASA doing?*, supplemented by measurement methodology, limitations, and RFA verification partner citations via `indicator_narratives.json`.
     - **Tab 2: Graphs & Trajectories**: Interactive Chart.js time-series tracking quarterly progression from 2024 baseline to 2026 targets, alongside micro-catchment bar breakdowns.
     - **Tab 3: Catchment Map & Geography**: Spatial GIS inspection focused on intervention compartments with a 1-click **Download Geography (GeoJSON)** export.
     - **Tab 4: UN SDGs Alignment**: Direct mapping to official United Nations Sustainable Development Goals (SDG 13 Climate Action, SDG 15 Life on Land, SDG 5 Gender Equality, SDG 8 Decent Work, SDG 6 Clean Water, SDG 11 Sustainable Cities) with official UN color badges and specific target references.

3. **Thematic Navigator & Five Pillars**:
   - Color-coded thematic taxonomy (🌿 Climate Adaptation, 🌳 Biodiversity Protection, ⚖️ Gender Equality & Social Inclusion [GESI], 💼 Employment & Economic Opportunities, and 🏙️ MyPeg Benchmark).
   - Real-time search filter and instant two-click indicator switching.

4. **Civic Stories & Peg Reports**:
   - Feature articles highlighting community impact: ravine bio-engineering in Mpazi, female nursery leadership in Yanze, and youth drone telemetry stewards.

5. **Interactive Geospatial Catchment Map (Leaflet)**:
   - Three distinct GeoJSON data layers: `nyabarongo_catchment.json` (micro-catchment boundaries), `intervention_sites.json` (georeferenced NbS interventions), and `monitoring_nodes.json` (hydrometric & water quality telemetry stations).
   - Real-time inspection panel details (district, sector, RFA compartment, species, GESI female %, green jobs).

6. **Native Bilingual Support**:
   - Seamless client-side switcher between **English (EN)** and **Ikinyarwanda (RW)** with zero page reloads powered by React `LocaleContext` and decoupled JSON locale dictionaries.

7. **RFA FMES Interoperability & Open Data**:
   - Zero vendor lock-in, client-side open data architecture.
   - Compartment ID mapping (`COMP-GAS-JB-01`), botanical taxonomy, and 1-click JSON / GeoJSON export.

8. **Admin Panel & Firebase Authentication**:
   - Password-protected `/admin` panel secured via Firebase Authentication with Firestore indicator persistence.

9. **Instant "Export Brief"**:
   - Optimized print stylesheet for generating executive one-pagers for stakeholders, donors (Global Affairs Canada), and city council meetings.

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
# → Open http://localhost:3000

# 3. Build optimized production bundle
npm run build

# 4. Start production server locally
npm run start
# → Open http://localhost:3000
```

---

## Live Deployment & Publishing
- **Active Live Site:** [https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/](https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/)
- See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for full instructions on Firebase App Hosting (Google Cloud), Vercel, Netlify, static exports, and the long-term handover to the Rwanda Forestry Authority (RFA) server.

## RFA FMES Integration Spec
See [FMES_INTEROPERABILITY.md](docs/FMES_INTEROPERABILITY.md) for data dictionaries, schema definitions, and REST synchronization guidelines.

## Proposal & Bid Submission Package
All RFP bid documents (Technical Proposal, Financial Proposal, Cover Letter, CV, References, Executive Summary, Submission Checklist) are organized in the [`proposal/`](proposal/) directory.

