# SUNCASA Kigali MVP Dashboard: RFA FMES Interoperability Specification

## 1. Executive Summary & Purpose
This document provides the technical data dictionary and architectural guidelines for integrating the **SUNCASA Kigali Nature-Based Solutions (NbS) Impact Dashboard (v2.0.0)** with the **Rwanda Forestry Authority (RFA) Forest Management and Evaluation System (FMES)**.

Under the SUNCASA project (IISD, WRI, City of Kigali, RFA), this dashboard functions as an indicator-driven, narrative-supported public communication tool. To avoid vendor lock-in and eliminate duplicate reporting burdens, the application features native FMES code taxonomies, 3 WGS84 GeoJSON layers, and a built-in **REST API v1** with inbound ingestion webhooks.

---

## 2. FMES Data Taxonomy & Schema Mapping

The dashboard's internal data model aligns with standard forestry compartment registration, species taxonomy, and spatial boundaries:

| SUNCASA Attribute | FMES Data Field | Type | Description / Standard | Example |
|---|---|---|---|---|
| `fmes_code` | `Indicator_Code` | String | Standard RFA M&E code | `RFA-FMES-SILV-01` |
| `fmes_compartment` | `Compartment_ID` | String | RFA Geographic Compartment Registry | `COMP-GAS-JB-01` |
| `district` | `Admin_District` | String | Rwandan Administrative Entity | `Gasabo` |
| `sector` | `Admin_Sector` | String | Rwandan Administrative Entity | `Jabana` |
| `intervention_type`| `Silvicultural_Type`| Enum | Afforestation, Riparian, Agroforestry, Bio-engineering | `Agroforestry & Terracing` |
| `primary_species` | `Taxonomic_Species` | String | Scientific binomial botanical names | `Polyscias fulva, Markhamia lutea` |
| `area_ha` | `Net_Treated_Area_Ha`| Float | Surface area treated in hectares | `310.0` |
| `trees_planted` | `Total_Seedlings` | Integer | Validated seedling tally from nursery register | `275000` |
| `tree_survival_rate`| `Survival_Audit_Pct`| Float | 12-month post-planting audited survival rate | `84.5%` |
| `jobs_created` | `Green_Labor_Days` | Integer | Total paid person-days of labor | `11500` |
| `female_pct` | `GESI_Female_Ratio`| Float | Proportion of female participants | `58.0%` |

---

## 3. Spatial Interoperability (Three WGS84 GeoJSON Layers)

All spatial data is strictly encoded in **WGS 84 (EPSG:4326 / CRS84)**:
1. **Micro-Catchments Layer**: `/src/data/geojson/nyabarongo_catchment.json`
   - Vector polygons representing upstream watersheds: Yanze (`catchment_yanze`), Mpazi (`catchment_mpazi`), Mount Kigali (`catchment_mt_kigali`), Nyabugogo (`catchment_nyabugogo`), and the 30-meter Lower Nyabarongo Shoreline corridor (`catchment_nyabarongo_corridor`).
2. **Intervention Sites Layer**: `/src/data/geojson/intervention_sites.json`
   - Georeferenced point and polygon features tagged with RFA compartment IDs, silvicultural interventions, tree tallies, and female labor ratios.
3. **Monitoring & Hydrometric Nodes Layer**: `/src/data/geojson/monitoring_nodes.json`
   - Hydrometric telemetry stations, water quality sampling nodes (WASAC), and sediment traps across the Lower Nyabarongo basin.

### Ingestion into RFA QGIS / ArcGIS / GeoServer:
1. RFA GIS officers can load `.geojson` files directly into QGIS (`Layer -> Add Layer -> Add Vector Layer`).
2. To publish on RFA's GeoServer: publish as standard WMS/WFS layers.
3. Live GeoJSON download is available directly from the dashboard top navigation and API.

---

## 4. REST API v1 & Inbound Ingestion Gateway

The application already includes production-ready REST API endpoints for seamless bi-directional synchronization with RFA FMES:

### A. Public Read Endpoints (CORS-Enabled)
- **Get All Indicators:** `GET /api/v1/indicators`
  - Returns the complete catalog of indicators with FMES codes, baseline, 2025 current figures, 2026 targets, trend histories, and micro-catchment breakdowns.
- **Get Single Indicator:** `GET /api/v1/indicators/{id}` (e.g., `/api/v1/indicators/area_restored_ha`)
  - Returns detailed JSON payload for a single indicator.

### B. Inbound Ingestion Webhook (RFA Telemetry Feed)
- **Endpoint:** `POST /api/v1/ingest`
- **Authentication:** `x-api-key: <PARTNER_API_KEY>` (managed in Admin Portal or `src/data/auth/api_keys.json`)
- **Payload Example:**
  ```json
  {
    "indicator_id": "area_restored_ha",
    "current_2025": 1050,
    "new_reading": {
      "period": "2025 Q3",
      "value": 1050
    }
  }
  ```
- Supports single indicator updates or batch array updates under `updates: [...]`.

---

## 5. Pluggable Database & Zero-Lock-In Architecture
- **Multi-Driver Database Manager (`src/lib/db/adapter.ts`)**:
  - `memory` (default): Fast local JSON storage reading from `src/data/indicators.json`.
  - `firestore`: Google Cloud Firebase Firestore for cloud persistence.
  - `inhouse`: Direct HTTP adapter connecting to RFA / Government of Rwanda backend REST APIs.
- **Self-Hostable**: Runs as a full Next.js 14 application on Node.js 18+ with PM2, or as a static bundle on Nginx at the AOS National Data Centre.
- **Bilingual localization**: All copy is decoupled into clean JSON files (`src/data/locales/en.json`, `src/data/locales/rw.json`, `src/data/locales/indicator_narratives.json`), allowing RFA and IISD communications teams to update texts without code changes.
