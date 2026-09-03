# SUNCASA Kigali MVP Dashboard: RFA FMES Interoperability Specification

## 1. Executive Summary & Purpose
This document provides the technical data dictionary and architectural guidelines for integrating the **SUNCASA Kigali Nature-Based Solutions (NbS) Impact Dashboard** with the **Rwanda Forestry Authority (RFA) Forest Management and Evaluation System (FMES)**.

Under the SUNCASA project (IISD, WRI, City of Kigali, RFA), this MVP dashboard functions as an indicator-driven, narrative-supported public communication tool. To avoid vendor lock-in and minimize duplication, the technical design choice adheres to open, transparent, and modular conventions directly compatible with FMES upgrade phases.

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

## 3. Spatial Interoperability (GeoJSON / GIS)

All spatial data is encoded in **WGS 84 (EPSG:4326 / CRS84)**:
- **Micro-Catchments Layer**: `/src/data/geojson/nyabarongo_catchment.json`
  - Polygons representing upstream watersheds: Yanze (`catchment_yanze`), Mpazi (`catchment_mpazi`), Mount Kigali (`catchment_mt_kigali`), Nyabugogo (`catchment_nyabugogo`), and the 30-meter Lower Nyabarongo Shoreline corridor (`catchment_nyabarongo_corridor`).
- **Intervention Sites Layer**: `/src/data/geojson/intervention_sites.json`
  - Georeferenced points and polygons tagged with RFA compartment IDs.

### Ingestion into RFA QGIS / ArcGIS / GeoServer:
1. RFA GIS officers can load the `.geojson` files directly into QGIS (`Layer -> Add Layer -> Add Vector Layer`).
2. To publish on RFA's GeoServer: publish as a standard WMS/WFS layer.

---

## 4. REST API Endpoint Integration Architecture

For future FMES automated synchronization, the dashboard supports static JSON feeds that can be replaced by live REST endpoints:

```
[FMES Core Database / PostgreSQL + PostGIS]
               │
               ▼
[RFA REST API Gateway: /api/v1/indicators & /api/v1/sites]
               │ (JSON / GeoJSON Payload)
               ▼
[SUNCASA Kigali Frontend (Vite / Vanilla JS Client)]
```

When RFA activates their FMES external API, simply update the data fetch in `src/js/indicators.js` and `src/js/map.js` to point from local static files to the secure RFA endpoint URL.

---

## 5. Maintenance & Zero-Lock-In Principles
- **No proprietary licenses**: Built using open-source libraries (Leaflet, Chart.js, Vanilla ES6 JavaScript).
- **Self-hostable**: The entire application compiles into a single static directory (`dist/`), runnable on standard Apache or Nginx servers hosted inside the Government of Rwanda data center (AOS).
- **Bilingual localization**: All copy is decoupled into clean JSON files (`src/data/locales/en.json` and `src/data/locales/rw.json`), allowing RFA communication teams to update texts without touching code.
