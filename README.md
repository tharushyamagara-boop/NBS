# SUNCASA Kigali Nature-Based Solutions (NbS) Impact Dashboard (MVP)

An indicator-driven, narrative-supported, bilingual public communication dashboard inspired by **MyPeg (www.mypeg.ca)** to showcase the impact of the **SUNCASA (Scaling Urban Nature-Based Solutions for Climate Adaptation in Sub-Saharan Africa)** project in Kigali, focused on the **Lower Nyabarongo River watershed**.

Funded by **Global Affairs Canada**, jointly led by **IISD** and **WRI**, with **City of Kigali** and **Rwanda Forestry Authority (RFA)** as principal implementing partners.

---

## Key Features

1. **MyPeg 3-Tier Storytelling Engine**:
   - Every indicator answers the three key public questions:
     - *What is this indicator?*
     - *Why does it matter for Kigali?*
     - *What is SUNCASA doing?*
   - Drill-down deep dive modals with interactive Chart.js quarterly trend trajectories and micro-catchment breakdowns.

2. **Four Core Thematic Pillars**:
   - 🌿 **Climate Adaptation**: Flood risk mitigation, ravine bio-engineering (Mpazi), steep-slope stabilization, and stormwater runoff reduction.
   - 🦋 **Biodiversity Protection**: Restoring native Rwandan tree species (*Polyscias fulva*, *Markhamia lutea*), 30-meter riparian buffers along Nyabarongo River.
   - ⚖️ **Gender Equality & Social Inclusion (GESI)**: 50%+ women in catchment leadership, female-led seedling nurseries, youth GIS environmental stewards.
   - 💼 **Employment & Economic Opportunities**: Over 42,000 person-days of paid green labor, farmer agroforestry support, and community nursery income.

3. **Interactive Geospatial Catchment Map (Leaflet)**:
   - Polygons of Kigali's critical micro-catchments: Yanze, Mpazi, Mount Kigali, Nyabugogo, and Nyabarongo Shoreline.
   - Georeferenced intervention sites with real-time inspection panel details (district, sector, RFA compartment, species, GESI female %, green jobs).

4. **Native Bilingual Support**:
   - Seamless client-side switcher between **English (EN)** and **Ikinyarwanda (RW)** with zero page reloads.

5. **RFA FMES Interoperability**:
   - Zero vendor lock-in, client-side open data architecture.
   - Compartment ID mapping (`COMP-GAS-JB-01`), botanical taxonomy, and 1-click JSON / GeoJSON export.

6. **Instant "Export Brief"**:
   - Optimized print stylesheet for generating executive one-pagers for stakeholders and donor meetings.

---

## Quick Start (Local Development)

```bash
# 1. Navigate to directory
cd C:\Users\tharushyamagara\.gemini\antigravity-ide\scratch\suncasa-kigali-nbs-dashboard

# 2. Install dependencies (already installed)
npm install

# 3. Start development server
npm run dev

# 4. Build production bundle
npm run build

# 5. Preview production build
npm run preview
```

---

## Publishing to the Web
See [docs/DEPLOYMENT_GUIDE.md](file:///C:/Users/tharushyamagara/.gemini/antigravity-ide/scratch/suncasa-kigali-nbs-dashboard/docs/DEPLOYMENT_GUIDE.md) for 1-click instructions on deploying to **Netlify**, **Vercel**, or **GitHub Pages**.

## RFA FMES Integration Spec
See [docs/FMES_INTEROPERABILITY.md](file:///C:/Users/tharushyamagara/.gemini/antigravity-ide/scratch/suncasa-kigali-nbs-dashboard/docs/FMES_INTEROPERABILITY.md) for data dictionaries, schema definitions, and REST synchronization guidelines.
