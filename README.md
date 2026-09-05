# SUNCASA Kigali Nature-Based Solutions (NbS) Impact Dashboard (MVP)

An indicator-driven, narrative-supported, bilingual public communication dashboard inspired by **MyPeg (www.mypeg.ca)** to showcase the impact of the **SUNCASA (Scaling Urban Nature-Based Solutions for Climate Adaptation in Sub-Saharan Africa)** project in Kigali, focused on the **Lower Nyabarongo River watershed**.

Funded by **Global Affairs Canada**, jointly led by **IISD** and **WRI**, with **City of Kigali** and **Rwanda Forestry Authority (RFA)** as principal implementing partners.

---

## Key Features & MyPeg Architecture

1. **MyPeg 4-Tab Indicator Workspace**:
   - Directly modeled after IISD's **MyPeg (www.mypeg.ca)** indicator exploration tool:
     - **Tab 1: Description & Story Narrative**: Plain-language civic answers to *What is this indicator?*, *Why does it matter for Kigali?*, and *What is SUNCASA doing?*, supplemented by measurement methodology, limitations, and RFA verification partner citations.
     - **Tab 2: Graphs & Trajectories**: Interactive Chart.js time-series tracking quarterly progression from 2024 baseline to 2026 targets, alongside micro-catchment bar breakdowns.
     - **Tab 3: Catchment Map & Geography**: Spatial GIS inspection focused on intervention compartments with a 1-click **Download Geography (GeoJSON)** export.
     - **Tab 4: UN SDGs Alignment**: Direct mapping to official United Nations Sustainable Development Goals (SDG 13 Climate Action, SDG 15 Life on Land, SDG 5 Gender Equality, SDG 8 Decent Work, SDG 6 Clean Water, SDG 11 Sustainable Cities) with official UN color badges and specific target references.

2. **Thematic Navigator & Two-Click Access**:
   - Color-coded thematic taxonomy (🌿 Climate Adaptation, 🌳 Biodiversity Protection, ⚖️ Gender Equality & Social Inclusion [GESI], and 💼 Employment & Economic Opportunities).
   - Real-time search filter and instant two-click indicator switching.

3. **Civic Stories & Peg Reports**:
   - Feature articles highlighting community impact: ravine bio-engineering in Mpazi, female nursery leadership in Yanze, and youth drone telemetry stewards.

4. **Interactive Geospatial Catchment Map (Leaflet)**:
   - Polygons of Kigali's critical micro-catchments: Yanze, Mpazi, Mount Kigali, Nyabugogo, and Nyabarongo Shoreline.
   - Georeferenced intervention sites with real-time inspection panel details (district, sector, RFA compartment, species, GESI female %, green jobs).

5. **Native Bilingual Support**:
   - Seamless client-side switcher between **English (EN)** and **Ikinyarwanda (RW)** with zero page reloads.

6. **RFA FMES Interoperability & Open Data**:
   - Zero vendor lock-in, client-side open data architecture.
   - Compartment ID mapping (`COMP-GAS-JB-01`), botanical taxonomy, and 1-click JSON / GeoJSON export.

7. **Instant "Export Brief"**:
   - Optimized print stylesheet for generating executive one-pagers for stakeholders, donors (Global Affairs Canada), and city council meetings.

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Start production server locally
npm run start
```

---

## Publishing to the Web
See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for 1-click instructions on deploying to **Netlify**, **Vercel**, or **GitHub Pages**.

## RFA FMES Integration Spec
See [FMES_INTEROPERABILITY.md](docs/FMES_INTEROPERABILITY.md) for data dictionaries, schema definitions, and REST synchronization guidelines.

## Proposal & Bid Submission Package
All RFP bid documents (Technical Proposal, Financial Proposal, Cover Letter, CV, References) are organized in the [`proposal/`](proposal/) directory.

