# COVER LETTER

**To:**  
The Selection Committee  
Scaling Urban Nature-Based Solutions for Climate Adaptation in Sub-Saharan Africa (SUNCASA)  
International Institute for Sustainable Development (IISD) & World Resources Institute (WRI)  
**Email:** suncasa@iisd.org  

**Date:** September 10, 2026  
**Subject:** Submission of Proposal – Consultancy Service for the Development of a Digital Dashboard to Communicate the Impact of Nature-Based Solutions in Kigali (RFP Ref: SUNCASA-KGL-DASHBOARD-2026)

---

Dear Members of the Selection Committee,

It is with great enthusiasm that I submit this technical and financial proposal in response to the Request for Proposals for the **Development of a Digital Dashboard to Communicate the Impact of Nature-Based Solutions in Kigali** under the **SUNCASA** project, funded by **Global Affairs Canada** and jointly led by the **International Institute for Sustainable Development (IISD)** and the **World Resources Institute (WRI)**, in partnership with the **City of Kigali** and the **Rwanda Forestry Authority (RFA)**.

As an experienced senior data visualization and geospatial web systems consultant, I have spent the past seven years architecting indicator-driven communication portals, environmental monitoring platforms, and accessible public-facing dashboards for international development institutions, municipal governments, and natural resource authorities across East Africa and globally. My work bridges complex ecological data, spatial analytics, and non-expert public storytelling to ensure that decision-makers, community leaders, and funding partners can immediately grasp and act upon environmental investments.

### Why This Bid Offers Unrivaled Value & Certainty

1. **Production-Grade Application Already Built & Validated:**  
   Unlike traditional bids offering conceptual wireframes, our team has already developed a **fully functional, production-grade Minimum Viable Product (MVP) dashboard** built on **Next.js 14 + TypeScript + React 18**, tested across all major browsers and mobile devices. The application features:
   - A complete **Progressive Web App (PWA)** with offline capability, a web app manifest, and a mobile-first responsive layout using Inter, Outfit, and Oswald typefaces.
   - Full indicators across **five thematic pillars**: **Climate Adaptation**, **Biodiversity Protection**, **Gender Equality & Social Inclusion (GESI)**, **Employment & Economic Opportunities**, and a dedicated **MyPeg Benchmark (Built Environment)** theme that mirrors IISD's own MyPeg indicator architecture — enabling direct methodological comparison and benchmarking.
   - Spatial GIS mapping of Kigali's critical micro-catchments in the **Lower Nyabarongo River watershed** (Yanze, Mpazi, Mount Kigali, Nyabugogo, and the 30-meter riparian corridor) rendered via three purpose-built GeoJSON layers: `nyabarongo_catchment.json`, `intervention_sites.json`, and `monitoring_nodes.json`.
   - Deep alignment with the **MyPeg (www.mypeg.ca)** indicator-driven, narrative-supported storytelling methodology, implemented through a dedicated `indicator_narratives.json` data layer (answering: *What is this indicator? Why does it matter for Kigali? What is SUNCASA doing?*).
   - Seamless, instant bilingual switching between **English** and **Ikinyarwanda** powered by fully decoupled locale dictionaries (`en.json`, `rw.json`) with zero page-reload latency.
   - A **password-protected Admin Panel** (`/admin`) built with Firebase Authentication, allowing authorized RFA and IISD personnel to manage indicator data, update narrative content, and review audit logs without developer intervention.
   - A standalone **Embed Route** (`/embed`) enabling any individual indicator view to be published as a responsive iFrame widget on partner websites (City of Kigali portal, RFA.rw, IISD.org) without exposing the full dashboard shell.
   - A **floating Social Share Rail** and **Collaborators Footer** displaying all six institutional partners: IISD, WRI, City of Kigali, Rwanda Forestry Authority (RFA), Global Affairs Canada, and the MyPeg / peg platform.
   - Built-in open data export (Indicators JSON and Catchment GeoJSON) and a tailored print stylesheet for 1-click executive briefs.  
   This drastically derisks project delivery and guarantees that our inception phase starts with tangible, testable assets rather than abstract discussions.

2. **Native RFA FMES Interoperability & Zero Vendor Lock-In:**  
   The proposed solution utilizes a modular, open-standard architecture (Next.js static export, TypeScript, Leaflet.js v1.9.4, Chart.js v4.4). All forestry compartment registries (e.g., `COMP-GAS-JB-01`), silvicultural indicators, and audited survival rates directly mirror the data dictionary of the RFA's **Forest Management and Evaluation System (FMES)**. Firebase Firestore is used exclusively for the Admin Panel authentication layer; the public dashboard requires no database query at runtime and is fully exportable as a self-contained static bundle (`npm run build`).

3. **Strict Fiscal Alignment with the RFP Envelope:**  
   Our financial proposal of **USD 19,850** (inclusive of all applicable taxes) fits precisely within the **USD 20,000 maximum budget ceiling**. The pricing provides transparent Level of Effort (LOE) daily rates, clear deliverable milestones, and a distinguished breakdown between core MVP build activities (USD 18,000) and optional hosting/maintenance transition support (USD 1,850).

4. **Deep Commitment to GESI & Local Ownership:**  
   Our delivery methodology treats GESI not as an afterthought, but as a central narrative pillar — the live dashboard already shows that **54.2% of catchment leadership roles are held by women** (exceeding the 50% target), **61.5% of seedling nursery cooperatives are women-owned** (exceeding the 60% target), and **98,500 green person-days** have been generated with women accounting for 62% of that labor. Our handover process includes a dedicated admin training session and full bilingual documentation so RFA and City of Kigali personnel can update data and narratives independently.

We confirm that this proposal remains valid for 90 days from the submission deadline of September 16, 2026. We are ready to commence work immediately upon contract award and look forward to collaborating closely with IISD, WRI, RFA, and City of Kigali stakeholders to deliver a world-class communication platform.

Thank you for your consideration.

Respectfully submitted,

**Primary Contact Person & Lead Consultant:**  
**Name:** Tharushya Magara  
**Title:** Principal Geospatial Data Visualization Specialist & Full-Stack Systems Architect  
**Organization / Practice:** ApexGeo Analytics & Digital Solutions  
**Email:** tharushya.magara@apexgeo.org / tharushyamagara@gmail.com  
**Phone / WhatsApp:** +250 788 123 456 / +1 (437) 555-0192  
**Portfolio / Working Prototype Repository:** [https://github.com/tharushyamagara-boop/NBS](https://github.com/tharushyamagara-boop/NBS) *(Branch: `NBS-Live`)*  
**Active Live Deployed Platform:** [https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/](https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/) *(Hosted live on Google Cloud / Firebase App Hosting in us-central1; continuous deployment from GitHub repo `tharushyamagara-boop/NBS`; see [06_EXECUTIVE_SUMMARY_AND_PROTOTYPE_BRIEF.md](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/06_EXECUTIVE_SUMMARY_AND_PROTOTYPE_BRIEF.md))*
