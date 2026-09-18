# DETAILED CURRICULUM VITAE (CV)

## Tharushya Magara
**Principal Geospatial Data Visualization Specialist & Full-Stack Systems Architect**  
**Location:** Kigali, Rwanda  
**Email:** tharushya.magara@apexgeo.org / tharushyamagara@gmail.com  
**Phone / WhatsApp:** +250 788 123 456 / +1 (437) 555-0192  
**LinkedIn:** linkedin.com/in/tharushya-magara  
**GitHub / Code Portfolio:** [github.com/tharushyamagara-boop](https://github.com/tharushyamagara-boop) / [github.com/tharushyamagara-boop/NBS](https://github.com/tharushyamagara-boop/NBS)  

---

## 1. Executive Summary & Professional Profile

Senior Data Visualization and Geospatial Web Systems Architect with **over 7 years of specialized experience** designing and delivering high-impact, public-facing digital dashboards, environmental monitoring portals, and indicator-driven communication platforms across Sub-Saharan Africa and internationally. 

Expertise lies at the intersection of **cartography/GIS, visual storytelling, and lightweight web architecture**. Demonstrated mastery in translating complex environmental, hydrological, and forestry datasets into intuitive, accessible (WCAG 2.1 AA), bilingual interfaces that captivate non-technical audiences, empower local communities, and inform government and international donor decision-making. Proven track record of rapid MVP prototyping, zero vendor lock-in engineering, and seamless institutional handover to public sector agencies.

---

## 2. Core Competencies & Technical Skills

| Domain | Tools, Languages & Frameworks |
|---|---|
| **Application Frameworks** | **Next.js 14** (App Router, Server Components, Static Export), **React 18** (Context API, Hooks, Suspense), **TypeScript 5.6**, **Vite**, Webpack, **Firebase v10** (Authentication, Firestore). |
| **Front-End Development** | Semantic HTML5, Vanilla CSS3 (Custom Design Systems, CSS Variables, Glassmorphism, Print Stylesheets), ES6+ Modern JavaScript, **PWA** (Web Manifests, Service Workers), Mobile-First Responsive Design. |
| **Geospatial & Web GIS** | **Leaflet.js v1.9.4**, MapLibre GL, GeoJSON (multi-layer: catchment polygons, intervention sites, monitoring nodes), TopoJSON, QGIS, GDAL/OGR, PostGIS, EPSG:4326/CRS84, Watershed Boundary Delineation. |
| **Data Visualization** | **Chart.js v4.4**, D3.js, Observable Plot, Micro-animations, Time-Series Forecasting, Indicator Progress Gauges, Quarterly Trend Charts, Interactive Data Filtering. |
| **Bilingual Localization** | React `LocaleContext` (createContext / useContext), Zero-Reload Locale Switching (English / Ikinyarwanda), Decoupled JSON Locale Dictionaries (`en.json`, `rw.json`, `indicator_narratives.json`). |
| **Admin & Auth Systems** | **Firebase Authentication** (Admin Panel password-protection), Firebase Firestore (Admin data persistence), Next.js API Routes, Standalone Embed Widget Routes (`/embed`). |
| **Interoperability & Open Data** | RESTful APIs, JSON/GeoJSON Data Exchange, Rwanda Forestry Authority (RFA) FMES Schema Mapping, Open Data Portals, FMES-aligned indicator code taxonomy. |
| **UX/UI & Civic Storytelling** | MyPeg Indicator Storytelling Paradigm (3-tier: What? Why? How?), `indicator_narratives.json` data layer, User Persona Journey Mapping, Low/High-Fidelity Prototyping (Figma), Non-Expert Educational Communication, Collaborators Footer, Social Share Rail. |
| **DevOps & Deployment** | **Firebase App Hosting** (Google Cloud Platform, Cloud Run, Cloud Build), **Google Cloud Platform (GCP)**, Vercel, Netlify, GitHub Pages, Linux (Ubuntu/Debian), Nginx, Node.js Server, Git/GitHub Version Control. |

---

## 3. Professional Experience

### Principal Geospatial Data Visualization Consultant
**ApexGeo Analytics & Digital Solutions — Kigali, Rwanda**  
*January 2022 – Present*
- Spearhead the conceptualization, UI/UX architecture, and full-stack technical execution of public-facing web applications for climate adaptation, forestry restoration, and urban resilience initiatives across Rwanda and East Africa.
- Architected the **SUNCASA Kigali Nature-Based Solutions (NbS) MVP Dashboard (v2.0.0)** as a production-grade **Next.js 14 + TypeScript + React 18 PWA**, integrating Leaflet micro-catchment maps (three GeoJSON layers: `nyabarongo_catchment.json`, `intervention_sites.json`, `monitoring_nodes.json`), Chart.js indicator trend charts, the MyPeg 3-tier storytelling model (`indicator_narratives.json`), instant English/Ikinyarwanda React `LocaleContext` translation, a Firebase-secured Admin Panel (`/admin`), and a standalone Embed widget route (`/embed`).
- Designed modular architectures using decoupled JSON data layers (indicators, locales, collaborators, GeoJSON) that eliminate recurring software licensing and enable public-sector partners to update content without developer intervention.
- Built and maintained a password-protected **Admin Panel** (Firebase Authentication) enabling authorized RFA and IISD staff to manage indicator data and narrative content independently.
- Conducted technical handover workshops and authored comprehensive administrative documentation for municipal and ministerial IT personnel.

### Senior Web Systems & Data Visualization Developer
**East Africa Geospatial & Environmental Solutions — Nairobi, Kenya & Kigali, Rwanda**  
*March 2019 – December 2021*
- Led frontend engineering for regional environmental monitoring platforms sponsored by international development partners and national forestry directorates.
- Built interactive web mapping tools integrating satellite-derived vegetation indices (NDVI) and on-the-ground tree seedling nursery audit registers.
- Pioneered accessible data storytelling methodologies, transforming technical multi-catchment hydrology models into intuitive flood risk indicators for community leaders and youth stewards.
- Formulated GESI-responsive monitoring frameworks, ensuring gender-disaggregated labor metrics were prominently visualized.

### Frontend GIS Software Engineer
**Civic Data & Cartographic Labs**  
*June 2017 – February 2019*
- Developed responsive web GIS applications and data dashboards utilizing Leaflet, OpenLayers, and modern JavaScript.
- Engineered automated spatial data conversion pipelines transforming shapefiles and CAD surveys into web-optimized GeoJSON geometries.
- Collaborated with UX researchers to conduct participatory design and usability testing sessions with diverse stakeholder groups.

---

## 4. Key Projects & Prototype Deliveries

### 1. SUNCASA Kigali Nature-Based Solutions Impact Dashboard (MVP v2.0.0)
- **Role:** Lead Architect & Developer (Current Bid Demonstration Asset)
- **Technologies:** Next.js 14, TypeScript, React 18, Leaflet.js v1.9.4, Chart.js v4.4, Firebase Auth & Firestore, **Firebase App Hosting (Google Cloud, us-central1)**, Vanilla CSS3, GeoJSON.
- **Live Deployment:** [https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/](https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/)
- **GitHub Repository:** [https://github.com/tharushyamagara-boop/NBS](https://github.com/tharushyamagara-boop/NBS) *(Branch: `NBS-Live`)*
- **Key Features:** Full implementation of **5 SUNCASA themes** (Climate, Biodiversity, GESI, Economy, MyPeg Benchmark), Lower Nyabarongo micro-catchment GIS rendered via **3 GeoJSON layers** (`nyabarongo_catchment.json`, `intervention_sites.json`, `monitoring_nodes.json`), bilingual EN/RW switcher via React `LocaleContext`, RFA FMES compartment tagging, `indicator_narratives.json` MyPeg storytelling layer, Firebase-secured `/admin` panel, standalone `/embed` widget route, floating Social Share Rail, Collaborators Footer (6 institutional partners), 1-click JSON/GeoJSON export, and executive print stylesheet. Live indicator highlights: **985 ha restored**, **842K trees planted**, **54.2% women in leadership** (exceeding target), **98,500 green person-days**, **61.5% women-owned nursery cooperatives** (exceeding target).

### 2. Kigali Urban Catchment & Climate Resilience Visual Portal
- **Role:** Lead Data Visualization Consultant
- **Technologies:** Leaflet, Chart.js, Vanilla JavaScript, GeoJSON, Nginx.
- **Key Features:** Interactive flood risk reduction and hillside bio-engineering tracker covering urban Kigali sub-catchments, complete with bilingual reporting (EN/RW) and technical handover to municipal staff.

### 3. East Africa Forest & Agroforestry Restoration Tracker
- **Role:** Systems Architect & Full-Stack Engineer
- **Technologies:** JavaScript, Chart.js, HTML5/CSS3, GitHub Actions, Netlify.
- **Key Features:** Multi-country restoration portal tracking 50,000+ hectares of reforested land, seedling survival audits, and gender-equitable nursery cooperatives.

### 4. Municipal Environmental Indicators & Civic Storytelling Portal
- **Role:** UI/UX & Frontend Specialist
- **Technologies:** MyPeg Methodology, HTML5, CSS3 Grid, Chart.js.
- **Key Features:** Indicator-driven portal directly adopting the MyPeg 3-question communication model for civic education and council policy advocacy.

---

## 5. Education & Academic Background

- **Master of Science (M.Sc.) in Geoinformatics & Environmental Data Science**  
  *University of Rwanda / Regional Centre for Mapping of Resources for Development (RCMRD)* — 2019  
  *Focus:* Spatial modeling of urban watersheds, remote sensing, and public geospatial web services.
- **Bachelor of Science (B.Sc.) in Computer Science & Software Engineering**  
  *National University of Rwanda (UR-CST)* — 2017  
  *Focus:* Web architectures, database management systems, human-computer interaction (HCI).

---

## 6. Professional Certifications & Training

- **Certified Web Accessibility Specialist (WCAG 2.1 AA Compliance)** — International Association of Accessibility Professionals (IAAP), 2023.
- **Advanced Spatial Analysis & Cartographic Design with QGIS/Leaflet** — FOSS4G Global Academy, 2021.
- **Gender-Responsive Project Design & GESI Mainstreaming in Environmental Projects** — International Development Training Institute, 2022.

---

## 7. Language Capabilities

| Language | Speaking Proficiency | Reading Proficiency | Writing Proficiency |
|---|---|---|---|
| **English** | Fluent / Native Professional | Fluent / Native Professional | Fluent / Native Professional |
| **Ikinyarwanda** | Professional Working | Professional Working | Professional Working |
| **French** | Professional Working | Professional Working | Professional Working |
