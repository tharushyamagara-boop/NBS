# RFP SUBMISSION CHECKLIST & INSTRUCTIONS

## SUNCASA Kigali NbS Impact Dashboard Consultancy Bid
**Submission Deadline:** September 16, 2026  
**Recipient Email:** `suncasa@iisd.org`  
**All Applications Must Be Submitted In English**  

---

## 1. Mandatory Submission Items Checklist

Ensure each of the following required documents (mandated in the RFP) is prepared and included before submitting:

- [x] **1. Cover Letter:**
  - File: [`proposal/01_COVER_LETTER.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/01_COVER_LETTER.md)
  - Content: Outlines relevant professional experience, project commitment, and actual Next.js 14 + TypeScript + React 18 PWA stack. Contains primary contact details at the bottom.
  - *Action:* Confirm or update your personal contact details (Name, phone number, email, address).

- [x] **2. Technical Proposal:**
  - File: [`proposal/02_TECHNICAL_PROPOSAL.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/02_TECHNICAL_PROPOSAL.md)
  - Content: Proposed methodology (MyPeg 3-tier storytelling via `indicator_narratives.json`, **5 thematic pillars** including MyPeg Benchmark), Next.js 14 App Router architecture, Firebase Authentication for Admin Panel, **3 GeoJSON layers** (`nyabarongo_catchment.json`, `intervention_sites.json`, `monitoring_nodes.json`), RFA FMES interoperability plan, 9-week work plan and deliverables schedule (Section 4 & 5 aligned), hosting/transfer strategy (Firebase App Hosting on GCP + RFA server), risk management matrix, and production application proof-of-capability demo guide with live deployment link.

- [x] **3. Financial Proposal:**
  - File: [`proposal/03_FINANCIAL_PROPOSAL.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/03_FINANCIAL_PROPOSAL.md)
  - Content: Consultant daily rate ($450/day), Level of Effort (LOE) person-days breakdown by deliverable (Section 4 aligned), Core MVP build (**$18,000**) clearly distinguished from optional hosting & maintenance (**$1,850** including Firebase App Hosting setup), total amount: **USD 19,850 inclusive of taxes** (strictly under the $20,000 cap).

- [x] **4. References and Relevant Experience:**
  - File: [`proposal/04_RELEVANT_EXPERIENCE_AND_REFERENCES.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/04_RELEVANT_EXPERIENCE_AND_REFERENCES.md)
  - Content: At least two (2) detailed references from previous related projects, demonstrating Next.js, multi-layer GeoJSON, Firebase, GESI data delivery, with client names, organizations, emails, phone numbers, and contract scopes.

- [x] **5. Detailed Curriculum Vitae (CV):**
  - File: [`proposal/05_CONSULTANT_CV_PROFILE.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/05_CONSULTANT_CV_PROFILE.md)
  - Content: Tailored CV highlighting **Next.js 14**, **TypeScript**, **React 18**, **Firebase Authentication & Firestore**, web GIS (Leaflet.js, multi-layer GeoJSON), data visualization (Chart.js v4.4), bilingual i18n (React LocaleContext), Admin Panel, Embed routes, and public sector MVP delivery.

- [x] **6. Working Production Application Demonstration Asset:**
  - GitHub Repository: [https://github.com/tharushyamagara-boop/NBS](https://github.com/tharushyamagara-boop/NBS) *(Branch: `NBS-Live`)*
  - Source Code: Complete repository at `c:\Users\tharushyamagara\Downloads\NBS` (v2.0.0)
  - Demo Brief: [`proposal/06_EXECUTIVE_SUMMARY_AND_PROTOTYPE_BRIEF.md`](file:///c:/Users/tharushyamagara/Downloads/NBS/proposal/06_EXECUTIVE_SUMMARY_AND_PROTOTYPE_BRIEF.md)
  - **Live Deployed Platform:** [https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/](https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/) *(Hosted live on Google Cloud / Firebase App Hosting in `us-central1`, project `nbs-project-7deac`)*
  - *Action:* The live URL and GitHub repository link are pre-populated in your submission email template below so evaluators can test the system immediately on web or mobile.

---

## 2. Converting Documents to PDF

For official submission, it is best practice to submit your bid as clean, professional PDF documents or a single consolidated PDF dossier:

### Option A: Print to PDF from Any Markdown Editor / Browser
1. Open any `.md` file in VS Code or your preferred Markdown viewer (or copy-paste into Microsoft Word / Google Docs).
2. Choose **File > Print > Save as PDF** (or **Export as PDF**).
3. Ensure margins are set to Standard (1 inch / 2.5 cm) with clean typography.

### Option B: Using VS Code Markdown PDF Extension
1. Install the `Markdown PDF` or `Markdown Preview Enhanced` extension in VS Code.
2. Right-click on the Markdown file and select **Markdown PDF: Export (pdf)**.

### Suggested File Naming for Submission:
- `01_Cover_Letter_SUNCASA_Kigali_Dashboard.pdf`
- `02_Technical_Proposal_SUNCASA_Kigali_Dashboard.pdf`
- `03_Financial_Proposal_SUNCASA_Kigali_Dashboard.pdf`
- `04_Relevant_Experience_and_References_SUNCASA.pdf`
- `05_CV_Tharushya_Magara_SUNCASA.pdf`
- `06_Executive_Summary_Prototype_Brief_SUNCASA.pdf`
- *(Optional consolidated package)*: `SUNCASA_Kigali_NbS_Dashboard_Proposal_v2_Complete_Bid.pdf`

---

## 3. Email Submission Template

Below is the exact email text ready to send to `suncasa@iisd.org`:

```text
To: suncasa@iisd.org
Subject: Submission of Proposal: Consultancy Service for the Development of a Digital Dashboard to Communicate the Impact of Nature-Based Solutions in Kigali (SUNCASA)

Dear Members of the SUNCASA Selection Committee,

Please accept this submission of our technical and financial proposal for the consultancy service to develop the Digital Dashboard to Communicate the Impact of Nature-Based Solutions (NbS) in Kigali, jointly led by the International Institute for Sustainable Development (IISD) and the World Resources Institute (WRI), funded by Global Affairs Canada, in partnership with the City of Kigali and the Rwanda Forestry Authority (RFA).

In accordance with the Terms of Reference, our complete application package consists of the following attached documents:
1. Cover Letter (including primary contact details)
2. Technical Proposal (methodology, MyPeg storytelling engine via `indicator_narratives.json`, **5 thematic pillars** including MyPeg Benchmark, **Next.js 14 + TypeScript + React 18 PWA** architecture, Firebase-secured Admin Panel (`/admin`), standalone Embed Widget (`/embed`), **3 GeoJSON layers** for the Lower Nyabarongo watershed, RFA FMES interoperability, 9-week work plan & deliverables schedule)
3. Financial Proposal (transparent daily rate, LOE breakdown per deliverable, separating core MVP build **$18,000** from optional hosting & maintenance **$1,850** including Firebase setup, total: **USD 19,850 inclusive of taxes**)
4. Relevant Experience and References (two detailed references from related environmental & catchment dashboard projects demonstrating Next.js, multi-layer GeoJSON, Firebase, and GESI data delivery)
5. Detailed Curriculum Vitae (CV) of the proposed lead consultant
6. Executive Summary & Working Production Application Demonstration Brief

WORKING PRODUCTION APPLICATION DEMONSTRATION (v2.0.0):
To demonstrate our commitment and eliminate delivery risk for IISD and partners, we have already engineered a fully functional, production-grade **Next.js 14 + TypeScript + React 18 PWA** dashboard strictly adhering to the RFP, and **deployed it live to the web**:

🌐 LIVE APPLICATION URL:
https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/
(Hosted on Google Cloud Platform / Firebase App Hosting in us-central1)

The application features:
- Multi-route Next.js architecture: public Hero view (`/`), per-indicator deep-dive pages (`/indicator/[id]`), Firebase-secured Admin Panel (`/admin`), and standalone Embed Widget route (`/embed`)
- **3 GeoJSON layers** rendered via Leaflet: `nyabarongo_catchment.json` (catchment polygons), `intervention_sites.json` (NbS intervention markers), `monitoring_nodes.json` (hydrometric & water quality sensors)
- **5 SUNCASA thematic pillars**: Climate Adaptation, Biodiversity Protection, GESI, Employment & Economy, and MyPeg Benchmark
- Real-time client-side bilingual switching between English and Ikinyarwanda via React `LocaleContext` and decoupled JSON locale files
- MyPeg 3-tier storytelling via dedicated `indicator_narratives.json` data layer
- 1-click open data exports (Indicators JSON and Catchment GeoJSON) aligned with RFA FMES standards
- Floating Social Share Rail and Collaborators Footer displaying all 6 institutional partners
- Current live indicators: **985 ha restored**, **842K trees planted** (84.5% survival), **54.2% women in leadership** (exceeded target), **98,500 green person-days** generated, **61.5% women-owned nurseries** (exceeded target)

To test locally if desired: `npm install && npm run dev` → Open http://localhost:3000
GitHub Repository: https://github.com/tharushyamagara-boop/NBS (Branch: NBS-Live)
The complete codebase, documentation, and deployment guides are available in our repository, and we would be delighted to provide a live interactive demonstration at your convenience.

We confirm that our proposal remains valid for 90 days. We look forward to the opportunity to contribute to climate adaptation and NbS impact communication in Kigali.

Sincerely,

Tharushya Magara
Principal Consultant, ApexGeo Analytics & Digital Solutions
KG 549 St, Kacyiru, Gasabo District, Kigali, Rwanda
Email: tharushya.magara@apexgeo.org / tharushyamagara@gmail.com
Phone / WhatsApp: +250 788 123 456
```

---

## 4. Key Deadlines & Rules to Remember

> [!IMPORTANT]
> - **Deadline:** Applications must be received by **September 16, 2026**.
> - **Disqualification Rule:** Incomplete and late proposals will be automatically disqualified.
> - **Budget Rule:** The total price must not exceed USD 20,000 (our bid is USD 19,850 inclusive of taxes).
> - **Language:** All application documents must be in English.
