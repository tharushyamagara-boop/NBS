# Impact Dashboard: Open Data Registry & API Interoperability Specification

## 1. Overview & Purpose
This document provides the technical data dictionary and architectural guidelines for integrating the **Impact Dashboard — Progress & Analytics Platform** with external GIS portals, environmental monitoring registries, and IoT telemetry feeds.

To avoid vendor lock-in and eliminate duplicate reporting, the platform includes standardized registry code fields, three WGS84 GeoJSON spatial layers, and a built-in **REST API v1** with inbound ingestion webhooks.

---

## 2. Data Taxonomy & Schema Mapping

The dashboard's internal data model aligns with standard compartment registration, botanical taxonomy, and administrative spatial boundaries:

| Dashboard Attribute | External Registry Field | Type | Description / Standard | Example |
|---|---|---|---|---|
| `fmes_code` | `Indicator_Code` | String | Standard indicator registry code | `IND-SILV-01` |
| `fmes_compartment` | `Compartment_ID` | String | Geographic compartment registry ID | `COMP-GAS-JB-01` |
| `district` | `Admin_District` | String | Administrative district | `Gasabo` |
| `sector` | `Admin_Sector` | String | Administrative sector | `Jabana` |
| `intervention_type` | `Intervention_Type` | String | Restoration or infrastructure category | `Agroforestry & Terracing` |
| `primary_species` | `Taxonomic_Species` | String | Scientific binomial botanical names | `Polyscias fulva, Markhamia lutea` |
| `area_ha` | `Net_Treated_Area_Ha` | Float | Surface area treated in hectares | `310.0` |
| `trees_planted` | `Total_Seedlings` | Integer | Validated seedling tally from nursery register | `275000` |
| `tree_survival_rate` | `Survival_Audit_Pct` | Float | Post-planting audited survival rate | `84.5%` |
| `jobs_created` | `Green_Labor_Days` | Integer | Paid person-days or jobs created | `11500` |
| `female_pct` | `GESI_Female_Ratio` | Float | Proportion of female participants | `58.0%` |

---

## 3. Spatial Interoperability (Three WGS84 GeoJSON Layers)

All spatial data is encoded in **WGS 84 (EPSG:4326 / CRS84)**:
1. **Micro-Catchments Layer**: `/src/data/geojson/nyabarongo_catchment.json`
   - Vector polygons representing monitored sub-catchments and riparian corridors.
2. **Intervention Sites Layer**: `/src/data/geojson/intervention_sites.json`
   - Georeferenced features tagged with compartment IDs, restoration types, seedling tallies, and participation ratios.
3. **Monitoring & Hydrometric Nodes Layer**: `/src/data/geojson/monitoring_nodes.json`
   - Hydrometric telemetry stations, water quality sampling nodes, nurseries, and drone survey zones.

### Loading into QGIS / ArcGIS / GeoServer:
1. GIS analysts can load `.geojson` files directly into QGIS (`Layer -> Add Layer -> Add Vector Layer`).
2. Layers can be published on GeoServer as standard WMS/WFS services or downloaded directly from any indicator workspace on the dashboard.

---

## 4. REST API v1 & Inbound Ingestion Gateway

### A. Public Read Endpoints (CORS-Enabled)
- **Get All Indicators:** `GET /api/v1/indicators`
  - Returns the complete catalog of indicators with registry codes, baselines, current figures, targets, trend histories, and site breakdowns. Supports `?theme=`, `?status=`, and `?fmes_code=` filters.
- **Get Single Indicator:** `GET /api/v1/indicators/{id}` (e.g., `/api/v1/indicators/area_restored_ha`)
  - Returns detailed JSON payload for a single indicator including bilingual narratives.

### B. Inbound Ingestion Webhook
- **Endpoint:** `POST /api/v1/ingest`
- **Authentication:** `x-api-key: <PARTNER_API_KEY>` (managed in `/admin` or `src/data/auth/api_keys.json`, default demo key: `dashboard-partner-key-2025`)
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

## 5. Pluggable Database Architecture
- **Multi-Driver Database Manager (`src/lib/db/adapter.ts`)**:
  - `memory` (default): Local JSON storage reading from `src/data/indicators.json`.
  - `firestore`: Google Cloud Firebase Firestore persistence.
  - `inhouse`: Direct HTTP REST adapter connecting to an external PostgreSQL / REST API backend.
- **Bilingual Localization**: All copy is decoupled into JSON dictionaries (`src/data/locales/en.json`, `src/data/locales/rw.json`, `src/data/locales/indicator_narratives.json`).
