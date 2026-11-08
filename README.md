# Impact Dashboard — Progress & Analytics Platform

An indicator-driven, narrative-supported, bilingual public communication and monitoring dashboard built with **Next.js 14**, **React 18**, **TypeScript**, **Chart.js**, and **Leaflet**.

---

## Key Features & Architecture

1. **Production-Grade Next.js 14 PWA**:
   - Built on **Next.js 14 (App Router)**, **TypeScript 5.6**, and **React 18.3**.
   - Multi-route architecture: public Overview (`/`), per-indicator deep-dive pages (`/indicator/[id]`), password-protected Admin Console (`/admin`), and standalone Embed Widget routes (`/embed` & `/embed/indicator/[id]`).
   - Progressive Web App (PWA) ready with `manifest.json` and responsive design.

2. **4-Tab Indicator Workspace & Deep-Dive Views**:
   - **Description & Story Narrative**: Plain-language civic answers to *What is this indicator?*, *Why does it matter?*, and *What actions are being taken?*, supplemented by measurement methodology, limitations, and source citations via `indicator_narratives.json`.
   - **Graphs & Trajectories**: Interactive Chart.js time-series tracking quarterly progression from baseline to targets, alongside spatial micro-catchment breakdowns and side-by-side indicator comparisons.
   - **Catchment Map & Geography**: Spatial GIS inspection focused on intervention compartments and telemetry waypoints with 1-click **GeoJSON** export.
   - **UN SDGs Alignment**: Direct mapping to United Nations Sustainable Development Goals (SDG 5, 6, 8, 11, 13, 15) with official UN color badges and target references.

3. **Thematic Navigator & Five Pillars**:
   - Color-coded thematic taxonomy (Climate Adaptation, Biodiversity Protection, Gender Equality & Social Inclusion [GESI], Employment & Economic Opportunities, and Built Environment).
   - Real-time search filter and instant indicator switching.

4. **Field Stories & Community Reports**:
   - Bilingual feature articles highlighting community restoration milestones, cooperative nursery leadership, and youth digital monitoring stewards.

5. **Interactive Geospatial Catchment Map (Leaflet)**:
   - Three WGS84 GeoJSON data layers: `nyabarongo_catchment.json` (micro-catchment boundaries), `intervention_sites.json` (georeferenced restoration zones), and `monitoring_nodes.json` (hydrometric & water quality telemetry stations).
   - Real-time inspection panel details (district, sector, compartment code, species, female participation %, green jobs).

6. **Native Bilingual Support**:
   - Seamless client-side switcher between **English (EN)** and **Ikinyarwanda (RW)** with zero page reloads powered by React `LocaleContext` and decoupled JSON locale dictionaries.

7. **Open Data & REST API v1 Interoperability**:
   - Zero vendor lock-in, open data architecture with CORS-enabled public endpoints (`GET /api/v1/indicators`, `GET /api/v1/indicators/[id]`) and authenticated inbound ingestion (`POST /api/v1/ingest`).
   - 1-click CSV, JSON, and GeoJSON exports plus iframe widget syndication.

8. **Admin Governance Console (`/admin`)**:
   - Role-based access control (RBAC), live indicator builder, GPS telemetry mapper, bilingual story editors, collaborator & social channel management, and pluggable database driver switcher.
   - Default local demo credentials: `admin@dashboard.org` / `DashboardAdmin2025!`.

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

## Documentation
- **Deployment & Hosting Guide:** See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for instructions on Firebase App Hosting, Vercel, Netlify, static exports, and self-hosted Node.js/Nginx deployments.
- **Data Registry & API Interoperability Spec:** See [FMES_INTEROPERABILITY.md](docs/FMES_INTEROPERABILITY.md) for data dictionaries, GeoJSON schema definitions, and REST API v1 synchronization guidelines.
