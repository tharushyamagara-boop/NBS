const fs = require('fs');
const path = require('path');

const indicatorsPath = path.join(__dirname, '..', 'src', 'data', 'indicators.json');
const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'locales', 'indicator_narratives.json');

const themes = [
  {
    id: "climate",
    name: "Climate Adaptation",
    icon: "cloud-rain",
    color: "#0284c7"
  },
  {
    id: "biodiversity",
    name: "Biodiversity Protection",
    icon: "trees",
    color: "#10b981"
  },
  {
    id: "gesi",
    name: "Gender Equality & Inclusion (GESI)",
    icon: "users",
    color: "#8b5cf6"
  },
  {
    id: "economy",
    name: "Employment & Economy",
    icon: "trending-up",
    color: "#f59e0b"
  },
  {
    id: "mypeg_benchmark",
    name: "Built Environment (MyPeg)",
    icon: "building",
    color: "#eb6b23"
  }
];

// The 12 RFP Indicators (Table 1 Alignment) + Screenshot Benchmark Indicators
const indicators = [
  // THEME 1: CLIMATE ADAPTATION
  {
    id: "area_restored_ha",
    theme: "climate",
    fmes_code: "RFA-FMES-LU-01",
    fmes_alignment: "National Forest Inventory (NFI) Land Restoration Layer",
    unit: "Hectares (ha)",
    baseline_2024: 150,
    current_2025: 985,
    target_2026: 1500,
    change_pct: 556.7,
    status: "on-track",
    priority_rank: 1,
    featured_in_hero: true,
    dual_icon: "tree",
    legend_label: "Lower Nyabarongo Watershed",
    definition: "Area of degraded hillside micro-catchments actively restored through terracing, agroforestry, and afforestation.",
    trend_history: [
      { period: "2024 Q1", value: 150 },
      { period: "2024 Q2", value: 340 },
      { period: "2024 Q3", value: 520 },
      { period: "2024 Q4", value: 710 },
      { period: "2025 Q1", value: 845 },
      { period: "2025 Q2", value: 985 }
    ],
    site_breakdown: [
      { site: "Yanze River Catchment", value: 410 },
      { site: "Mount Kigali Slopes", value: 295 },
      { site: "Mpazi Drainage Ravine", value: 160 },
      { site: "Nyabugogo Wetland Corridor", value: 120 }
    ],
    sdgs: [
      {
        sdg_number: 15,
        sdg_title: "15. Life on Land",
        target_code: "15.3",
        target_desc: "Combat desertification, restore degraded land and soil, including land affected by desertification, drought and floods.",
        color: "#56c02b"
      },
      {
        sdg_number: 13,
        sdg_title: "13. Climate Action",
        target_code: "13.1",
        target_desc: "Strengthen resilience and adaptive capacity to climate-related hazards and natural disasters in all countries.",
        color: "#3f7e44"
      }
    ],
    measurement_method: "High-resolution satellite spatial telemetry corroborated by on-the-ground GPS boundary polygons surveyed by RFA forestry technicians.",
    data_source_citation: "Rwanda Forestry Authority (RFA) & City of Kigali Land Use Registry (2025)"
  },
  {
    id: "flood_risk_reduction",
    theme: "climate",
    fmes_code: "RFA-FMES-HYDRO-04",
    fmes_alignment: "Rwanda Water Resources Board (RWB) Catchment Hydrology",
    unit: "Percentage (%)",
    baseline_2024: 0,
    current_2025: 28.5,
    target_2026: 40.0,
    change_pct: 28.5,
    status: "on-track",
    priority_rank: 2,
    featured_in_hero: true,
    dual_icon: "leaf",
    legend_label: "Mpazi & Nyabugogo Basins",
    definition: "Estimated percentage reduction in peak stormwater runoff discharge entering vulnerable urban ravines and commercial zones during intense tropical rainfall events.",
    trend_history: [
      { period: "2024 Q1", value: 0 },
      { period: "2024 Q2", value: 6.2 },
      { period: "2024 Q3", value: 12.8 },
      { period: "2024 Q4", value: 19.5 },
      { period: "2025 Q1", value: 24.1 },
      { period: "2025 Q2", value: 28.5 }
    ],
    site_breakdown: [
      { site: "Mpazi Ravine Micro-catchment", value: 34.0 },
      { site: "Nyabugogo Lower Basin", value: 29.5 },
      { site: "Yanze Upstream Buffer", value: 26.0 },
      { site: "Gikondo Wetland Transition", value: 24.5 }
    ],
    sdgs: [
      {
        sdg_number: 11,
        sdg_title: "11. Sustainable Cities & Communities",
        target_code: "11.5",
        target_desc: "Significantly reduce the number of deaths and the number of people affected and decrease direct economic losses caused by water-related disasters.",
        color: "#f99d26"
      },
      {
        sdg_number: 13,
        sdg_title: "13. Climate Action",
        target_code: "13.1",
        target_desc: "Strengthen resilience to climate hazards and extreme storm runoff.",
        color: "#3f7e44"
      }
    ],
    measurement_method: "Calibrated hydrological runoff modeling using hydrometric sensor stations at Mpazi and Yanze outfalls, verified during high-precipitation events.",
    data_source_citation: "Rwanda Water Resources Board (RWB) & City of Kigali Stormwater Master Plan (2025)"
  },
  {
    id: "soil_erosion_prevented",
    theme: "climate",
    fmes_code: "RFA-FMES-SOIL-02",
    fmes_alignment: "RFA Watershed Soil Protection Index",
    unit: "Tons / year",
    baseline_2024: 1200,
    current_2025: 14600,
    target_2026: 22000,
    change_pct: 1116.7,
    status: "on-track",
    priority_rank: 3,
    featured_in_hero: false,
    dual_icon: "leaf",
    legend_label: "Lower Nyabarongo Slopes",
    definition: "Conserved metric tons of fertile hillside topsoil retained annually that would otherwise wash into the Nyabarongo River and urban culverts.",
    trend_history: [
      { period: "2024 Q1", value: 1200 },
      { period: "2024 Q2", value: 4100 },
      { period: "2024 Q3", value: 7800 },
      { period: "2024 Q4", value: 10500 },
      { period: "2025 Q1", value: 12800 },
      { period: "2025 Q2", value: 14600 }
    ],
    site_breakdown: [
      { site: "Mount Kigali Terraces", value: 6200 },
      { site: "Yanze Catchment Slopes", value: 4900 },
      { site: "Jali Ridge Buffer", value: 2100 },
      { site: "Mpazi Headwaters", value: 1400 }
    ],
    sdgs: [
      {
        sdg_number: 15,
        sdg_title: "15. Life on Land",
        target_code: "15.3",
        target_desc: "Restore degraded land and soil, striving to achieve a land degradation-neutral world.",
        color: "#56c02b"
      },
      {
        sdg_number: 6,
        sdg_title: "6. Clean Water & Sanitation",
        target_code: "6.6",
        target_desc: "Protect and restore water-related ecosystems, including mountains, forests, wetlands and rivers.",
        color: "#00aed9"
      }
    ],
    measurement_method: "Revised Universal Soil Loss Equation (RUSLE) parameterized with high-resolution digital elevation models and sediment trap audits.",
    data_source_citation: "Rwanda Forestry Authority (RFA) Watershed Soil Protection Register (2025)"
  },

  // THEME 2: BIODIVERSITY PROTECTION & ENVIRONMENTAL MANAGEMENT
  {
    id: "trees_planted",
    theme: "biodiversity",
    fmes_code: "RFA-FMES-SILV-01",
    fmes_alignment: "FMES Plantation & Nursery Register (Compartment DB)",
    unit: "Seedlings / Trees",
    baseline_2024: 85000,
    current_2025: 842000,
    target_2026: 1200000,
    change_pct: 890.6,
    status: "on-track",
    priority_rank: 1,
    featured_in_hero: true,
    dual_icon: "tree",
    legend_label: "Kigali NbS Sites",
    definition: "Total number of certified indigenous, multipurpose, and agroforestry seedlings planted across hillsides, riparian zones, and urban corridors.",
    trend_history: [
      { period: "2024 Q1", value: 85000 },
      { period: "2024 Q2", value: 240000 },
      { period: "2024 Q3", value: 430000 },
      { period: "2024 Q4", value: 610000 },
      { period: "2025 Q1", value: 735000 },
      { period: "2025 Q2", value: 842000 }
    ],
    site_breakdown: [
      { site: "Yanze Catchment Reforestation", value: 365000 },
      { site: "Mount Kigali Hillside Agroforestry", value: 248000 },
      { site: "Nyabarongo Riparian Green Belt", value: 145000 },
      { site: "Urban Roads & Public Spaces", value: 84000 }
    ],
    sdgs: [
      {
        sdg_number: 15,
        sdg_title: "15. Life on Land",
        target_code: "15.2",
        target_desc: "Promote the implementation of sustainable management of all types of forests, halt deforestation, and substantially increase afforestation.",
        color: "#56c02b"
      },
      {
        sdg_number: 13,
        sdg_title: "13. Climate Action",
        target_code: "13.2",
        target_desc: "Integrate climate change measures and ecosystem preservation into municipal spatial policies.",
        color: "#3f7e44"
      }
    ],
    measurement_method: "Audited dispatch registries from certified cooperative seedling nurseries, matched to georeferenced planting compartments.",
    data_source_citation: "RFA Forest Management and Evaluation System (FMES) Silviculture Registry (2025)"
  },
  {
    id: "tree_survival_rate",
    theme: "biodiversity",
    fmes_code: "RFA-FMES-SURV-02",
    fmes_alignment: "FMES Post-Planting Audit & Survival Protocol",
    unit: "Percentage (%)",
    baseline_2024: 62.0,
    current_2025: 84.5,
    target_2026: 85.0,
    change_pct: 36.3,
    status: "exceeded",
    priority_rank: 2,
    featured_in_hero: false,
    dual_icon: "leaf",
    legend_label: "Permanent Sample Plots",
    definition: "Percentage of planted native and agroforestry seedlings surviving across surveyed permanent sample plots after 6, 12, and 24 months.",
    trend_history: [
      { period: "2024 Q1", value: 62.0 },
      { period: "2024 Q2", value: 71.5 },
      { period: "2024 Q3", value: 76.0 },
      { period: "2024 Q4", value: 81.2 },
      { period: "2025 Q1", value: 83.0 },
      { period: "2025 Q2", value: 84.5 }
    ],
    site_breakdown: [
      { site: "Community Managed Plots (Yanze)", value: 88.0 },
      { site: "Mount Kigali Terraces", value: 83.5 },
      { site: "Riparian Wetland Margins", value: 86.2 },
      { site: "Urban High-Traffic Corridors", value: 80.3 }
    ],
    sdgs: [
      {
        sdg_number: 15,
        sdg_title: "15. Life on Land",
        target_code: "15.2",
        target_desc: "Halt deforestation, restore degraded forests and substantially increase afforestation and reforestation globally.",
        color: "#56c02b"
      }
    ],
    measurement_method: "Permanent 20m x 20m random sampling plots surveyed at 3, 6, and 12-month post-planting intervals using mobile ODK survey tools.",
    data_source_citation: "RFA Silvicultural Audit Service & SUNCASA Independent Monitoring Unit (2025)"
  },
  {
    id: "riparian_buffer_km",
    theme: "biodiversity",
    fmes_code: "RFA-FMES-ECO-03",
    fmes_alignment: "RFA Riverine & Wetland Protection Framework",
    unit: "Kilometers (km)",
    baseline_2024: 4.5,
    current_2025: 32.8,
    target_2026: 45.0,
    change_pct: 628.9,
    status: "on-track",
    priority_rank: 3,
    featured_in_hero: false,
    dual_icon: "tree",
    legend_label: "Lower Nyabarongo Shoreline",
    definition: "Linear kilometers of continuous 30-meter native vegetative buffer restored along the Lower Nyabarongo River and its tributary wetland corridors.",
    trend_history: [
      { period: "2024 Q1", value: 4.5 },
      { period: "2024 Q2", value: 11.0 },
      { period: "2024 Q3", value: 18.2 },
      { period: "2024 Q4", value: 24.5 },
      { period: "2025 Q1", value: 29.0 },
      { period: "2025 Q2", value: 32.8 }
    ],
    site_breakdown: [
      { site: "Nyabarongo Main Channel Shoreline", value: 16.4 },
      { site: "Yanze River Riparian Margins", value: 9.2 },
      { site: "Nyabugogo Wetland Tributary", value: 4.8 },
      { site: "Mpazi Drainage Outfall Buffer", value: 2.4 }
    ],
    sdgs: [
      {
        sdg_number: 6,
        sdg_title: "6. Clean Water & Sanitation",
        target_code: "6.6",
        target_desc: "Protect and restore water-related ecosystems, including mountains, forests, wetlands, rivers, aquifers and lakes.",
        color: "#00aed9"
      },
      {
        sdg_number: 15,
        sdg_title: "15. Life on Land",
        target_code: "15.1",
        target_desc: "Ensure the conservation, restoration and sustainable use of terrestrial and inland freshwater ecosystems.",
        color: "#56c02b"
      }
    ],
    measurement_method: "High-resolution drone orthomosaics verifying continuous 30-meter native vegetative buffer adherence along surveyed riverbanks.",
    data_source_citation: "Rwanda Environment Management Authority (REMA) & RFA Riverine Protection Database (2025)"
  },
  {
    id: "water_quality_index",
    theme: "biodiversity",
    fmes_code: "RFA-FMES-WQ-05",
    fmes_alignment: "Rwanda Water Quality Telemetry Network (WASAC)",
    unit: "Index Score (0-100)",
    baseline_2024: 42.0,
    current_2025: 68.5,
    target_2026: 80.0,
    change_pct: 63.1,
    status: "on-track",
    priority_rank: 4,
    featured_in_hero: false,
    dual_icon: "leaf",
    legend_label: "Yanze Water Treatment Intake",
    definition: "Surface water quality and turbidity reduction score measured at the Yanze water treatment intake supplying over 60% of Kigali's potable water.",
    trend_history: [
      { period: "2024 Q1", value: 42.0 },
      { period: "2024 Q2", value: 48.0 },
      { period: "2024 Q3", value: 55.5 },
      { period: "2024 Q4", value: 61.0 },
      { period: "2025 Q1", value: 64.8 },
      { period: "2025 Q2", value: 68.5 }
    ],
    site_breakdown: [
      { site: "Yanze Main Treatment Intake", value: 72.0 },
      { site: "Upstream Agro-Terrace Runoff", value: 68.0 },
      { site: "Lower Nyabarongo Confluence", value: 65.5 }
    ],
    sdgs: [
      {
        sdg_number: 6,
        sdg_title: "6. Clean Water & Sanitation",
        target_code: "6.3",
        target_desc: "Improve water quality by reducing pollution, eliminating dumping and minimizing release of hazardous chemicals.",
        color: "#00aed9"
      }
    ],
    measurement_method: "Nephelometric Turbidity Unit (NTU) lab sampling paired with continuous optical sensors at the WASAC water intake station.",
    data_source_citation: "Water and Sanitation Corporation (WASAC) & Rwanda Water Resources Board (2025)"
  },

  // THEME 3: GENDER EQUALITY AND SOCIAL INCLUSION (GESI)
  {
    id: "women_leadership_catchment",
    theme: "gesi",
    fmes_code: "RFA-FMES-GESI-01",
    fmes_alignment: "RFA Community Forestry Committee GESI Standard",
    unit: "Percentage (%)",
    baseline_2024: 18.0,
    current_2025: 54.2,
    target_2026: 50.0,
    change_pct: 201.1,
    status: "exceeded",
    priority_rank: 1,
    featured_in_hero: true,
    dual_icon: "users",
    legend_label: "Catchment Committees",
    definition: "Proportion of leadership and executive governance positions held by women on community watershed and forestry management committees.",
    trend_history: [
      { period: "2024 Q1", value: 18.0 },
      { period: "2024 Q2", value: 27.5 },
      { period: "2024 Q3", value: 36.0 },
      { period: "2024 Q4", value: 45.0 },
      { period: "2025 Q1", value: 51.5 },
      { period: "2025 Q2", value: 54.2 }
    ],
    site_breakdown: [
      { site: "Yanze Catchment Committees", value: 58.0 },
      { site: "Nyarugenge Sector NbS Groups", value: 55.5 },
      { site: "Gasabo Watershed Associations", value: 52.0 },
      { site: "Kicukiro Urban Green Teams", value: 51.3 }
    ],
    sdgs: [
      {
        sdg_number: 5,
        sdg_title: "5. Gender Equality",
        target_code: "5.5",
        target_desc: "Ensure women's full and effective participation and equal opportunities for leadership at all levels of decision-making.",
        color: "#ef402d"
      },
      {
        sdg_number: 16,
        sdg_title: "16. Peace, Justice & Strong Institutions",
        target_code: "16.7",
        target_desc: "Ensure responsive, inclusive, participatory and representative decision-making at all levels.",
        color: "#00689d"
      }
    ],
    measurement_method: "Bi-annual audits of official executive committee rosters and meeting sign-in sheets verified by district gender officers.",
    data_source_citation: "Ministry of Gender and Family Promotion (MIGEPROF) & City of Kigali Community Governance Unit (2025)"
  },
  {
    id: "participants_trained",
    theme: "gesi",
    fmes_code: "RFA-FMES-CAP-02",
    fmes_alignment: "SUNCASA Capacity Building Framework",
    unit: "Trainees",
    baseline_2024: 320,
    current_2025: 2840,
    target_2026: 4000,
    change_pct: 787.5,
    status: "on-track",
    priority_rank: 2,
    featured_in_hero: false,
    dual_icon: "users",
    legend_label: "Certified NbS Practitioners",
    definition: "Total local community members, women farmers, and youth trained and certified in progressive hillside terracing, tree seedling nursery management, and bio-engineering.",
    trend_history: [
      { period: "2024 Q1", value: 320 },
      { period: "2024 Q2", value: 850 },
      { period: "2024 Q3", value: 1450 },
      { period: "2024 Q4", value: 2100 },
      { period: "2025 Q1", value: 2520 },
      { period: "2025 Q2", value: 2840 }
    ],
    site_breakdown: [
      { site: "Women Agroforestry Farmers", value: 1680 },
      { site: "Youth GIS & Nursery Technicians", value: 820 },
      { site: "Local Administrative Leaders", value: 340 }
    ],
    sdgs: [
      {
        sdg_number: 4,
        sdg_title: "4. Quality Education",
        target_code: "4.4",
        target_desc: "Substantially increase the number of youth and adults who have relevant skills for employment, decent jobs and entrepreneurship.",
        color: "#c5192d"
      },
      {
        sdg_number: 5,
        sdg_title: "5. Gender Equality",
        target_code: "5.5",
        target_desc: "Equal access to capacity building and vocational climate adaptation skills.",
        color: "#ef402d"
      }
    ],
    measurement_method: "Signed graduation records from district vocational training modules and RFA practical nursery workshops.",
    data_source_citation: "SUNCASA Field Directorate & City of Kigali Vocational Training Division (2025)"
  },

  // THEME 4: EMPLOYMENT AND ECONOMIC OPPORTUNITIES
  {
    id: "green_jobs_created",
    theme: "economy",
    fmes_code: "RFA-FMES-ECON-01",
    fmes_alignment: "National Green Jobs Strategy & SUNCASA PMF",
    unit: "Person-Days",
    baseline_2024: 12000,
    current_2025: 98500,
    target_2026: 150000,
    change_pct: 720.8,
    status: "on-track",
    priority_rank: 1,
    featured_in_hero: true,
    dual_icon: "dollar",
    legend_label: "Cumulative Person-Days",
    definition: "Cumulative person-days of direct paid employment created through hillside terracing, seedling production, planting, and drainage maintenance.",
    trend_history: [
      { period: "2024 Q1", value: 12000 },
      { period: "2024 Q2", value: 32000 },
      { period: "2024 Q3", value: 54000 },
      { period: "2024 Q4", value: 76000 },
      { period: "2025 Q1", value: 89000 },
      { period: "2025 Q2", value: 98500 }
    ],
    site_breakdown: [
      { site: "Women Workers (62% of Total)", value: 61070 },
      { site: "Youth Workers (31% of Total)", value: 30535 },
      { site: "Adult Men (7% of Total)", value: 6895 }
    ],
    sdgs: [
      {
        sdg_number: 8,
        sdg_title: "8. Decent Work & Economic Growth",
        target_code: "8.5",
        target_desc: "Achieve full and productive employment and decent work for all women and men, including for young people and persons with disabilities.",
        color: "#8f1838"
      },
      {
        sdg_number: 1,
        sdg_title: "1. No Poverty",
        target_code: "1.2",
        target_desc: "Reduce at least by half the proportion of men, women and children of all ages living in poverty in all its dimensions.",
        color: "#e5243b"
      }
    ],
    measurement_method: "Audited cooperative payroll disbursement logs and mobile-money direct payment registers verified by district labor inspectors.",
    data_source_citation: "SUNCASA Financial Audit & Rwanda Cooperative Agency (RCA) Employment Registry (2025)"
  },
  {
    id: "female_nursery_operators",
    theme: "economy",
    fmes_code: "RFA-FMES-GESI-02",
    fmes_alignment: "SUNCASA Gender Responsive Livelihoods Framework",
    unit: "Percentage (%)",
    baseline_2024: 22.0,
    current_2025: 61.5,
    target_2026: 60.0,
    change_pct: 179.5,
    status: "exceeded",
    priority_rank: 2,
    featured_in_hero: false,
    dual_icon: "dollar",
    legend_label: "Cooperative Ownership",
    definition: "Percentage of registered community seedling nursery cooperatives owned and operated by women, generating sustainable revenue from tree seedling contracts.",
    trend_history: [
      { period: "2024 Q1", value: 22.0 },
      { period: "2024 Q2", value: 34.0 },
      { period: "2024 Q3", value: 46.5 },
      { period: "2024 Q4", value: 55.0 },
      { period: "2025 Q1", value: 58.5 },
      { period: "2025 Q2", value: 61.5 }
    ],
    site_breakdown: [
      { site: "Yanze Tree Cooperative", value: 67.0 },
      { site: "Mpazi Green Nursery Union", value: 62.5 },
      { site: "Mount Kigali Agroforestry Hub", value: 59.0 },
      { site: "Nyabugogo Basin Seedling Hub", value: 57.5 }
    ],
    sdgs: [
      {
        sdg_number: 5,
        sdg_title: "5. Gender Equality",
        target_code: "5.a",
        target_desc: "Undertake reforms to give women equal rights to economic resources, ownership and control over land, financial services and natural resources.",
        color: "#ef402d"
      },
      {
        sdg_number: 8,
        sdg_title: "8. Decent Work & Economic Growth",
        target_code: "8.5",
        target_desc: "Achieve full and productive employment and decent work for all women and men.",
        color: "#8f1838"
      }
    ],
    measurement_method: "Audited cooperative enterprise registries maintained by the Rwanda Cooperative Agency (RCA).",
    data_source_citation: "Rwanda Cooperative Agency (RCA) & RFA Forest Nursery Register (2025)"
  },
  {
    id: "vulnerable_youth_employed",
    theme: "economy",
    fmes_code: "RFA-FMES-YOUTH-03",
    fmes_alignment: "National Youth Employment in Green Economy Framework",
    unit: "Youth Employed",
    baseline_2024: 140,
    current_2025: 1120,
    target_2026: 1600,
    change_pct: 700.0,
    status: "on-track",
    priority_rank: 3,
    featured_in_hero: false,
    dual_icon: "dollar",
    legend_label: "Youth in NbS & Telemetry",
    definition: "Number of vulnerable Rwandan youth (aged 18-30) employed directly in drone surveying, mobile GIS telemetry, check-dam construction, and nursery production.",
    trend_history: [
      { period: "2024 Q1", value: 140 },
      { period: "2024 Q2", value: 380 },
      { period: "2024 Q3", value: 640 },
      { period: "2024 Q4", value: 890 },
      { period: "2025 Q1", value: 1010 },
      { period: "2025 Q2", value: 1120 }
    ],
    site_breakdown: [
      { site: "Digital GIS & Drone Telemetry", value: 280 },
      { site: "Check-Dam Bio-Engineering", value: 490 },
      { site: "Seedling Nursery Logistics", value: 350 }
    ],
    sdgs: [
      {
        sdg_number: 8,
        sdg_title: "8. Decent Work & Economic Growth",
        target_code: "8.6",
        target_desc: "Substantially reduce the proportion of youth not in employment, education or training.",
        color: "#8f1838"
      }
    ],
    measurement_method: "National Youth Council employment verification rosters cross-referenced with cooperative contractor manifests.",
    data_source_citation: "National Youth Council (NYC) & SUNCASA Field Directorate (2025)"
  },

  // THEME 5: MYPEG COMPARATIVE BENCHMARK (Screenshot 2 Match)
  {
    id: "building_permit_values",
    theme: "mypeg_benchmark",
    fmes_code: "PEG-BE-01",
    fmes_alignment: "Municipal Construction & Infrastructure Investment Registry",
    unit: "CAD ($)",
    baseline_2024: 372000,
    current_2025: 2142000,
    target_2026: 2500000,
    change_pct: 475.8,
    status: "on-track",
    priority_rank: 1,
    featured_in_hero: false,
    dual_icon: "dollar",
    legend_label: "Winnipeg (City)",
    definition: "Building permit values measures the total value of residential and non residential permit values.",
    trend_history: [
      { period: "2001", value: 372000 },
      { period: "2002", value: 421000 },
      { period: "2003", value: 648000 },
      { period: "2004", value: 671000 },
      { period: "2005", value: 653000 },
      { period: "2006", value: 842000 },
      { period: "2007", value: 841000 },
      { period: "2008", value: 1052000 },
      { period: "2009", value: 1104000 },
      { period: "2010", value: 1152000 },
      { period: "2011", value: 1161000 },
      { period: "2012", value: 1512000 },
      { period: "2013", value: 1783000 },
      { period: "2014", value: 1541000 },
      { period: "2015", value: 1432000 },
      { period: "2016", value: 1812000 },
      { period: "2017", value: 2021000 },
      { period: "2018", value: 1852000 },
      { period: "2019", value: 2174000 },
      { period: "2020", value: 1653000 },
      { period: "2021", value: 2281000 },
      { period: "2022", value: 2142000 }
    ],
    site_breakdown: [
      { site: "Winnipeg (City)", value: 2142000 },
      { site: "Downtown Core Zone", value: 885000 },
      { site: "Urban Growth Sectors", value: 745000 },
      { site: "Commercial & Industrial", value: 512000 }
    ],
    sdgs: [
      {
        sdg_number: 11,
        sdg_title: "11. Sustainable Cities & Communities",
        target_code: "11.3",
        target_desc: "Enhance inclusive and sustainable urbanization and capacity for participatory human settlement planning.",
        color: "#f99d26"
      }
    ],
    measurement_method: "Aggregated municipal building inspection valuations and architectural permit filings compiled on an annual schedule.",
    data_source_citation: "City of Winnipeg Planning, Property and Development Department & Statistics Canada"
  },
  {
    id: "collision_victims",
    theme: "mypeg_benchmark",
    fmes_code: "PEG-BE-02",
    fmes_alignment: "Urban Mobility & Road Safety Database",
    unit: "Casualties / 100k",
    baseline_2024: 480,
    current_2025: 395,
    target_2026: 320,
    change_pct: -17.7,
    status: "on-track",
    priority_rank: 2,
    featured_in_hero: false,
    dual_icon: "none",
    legend_label: "Winnipeg (City)",
    definition: "Measures annual traffic collision victims and casualty injury rates per 100,000 population.",
    trend_history: [
      { period: "2010", value: 540 },
      { period: "2012", value: 520 },
      { period: "2014", value: 495 },
      { period: "2016", value: 460 },
      { period: "2018", value: 440 },
      { period: "2020", value: 375 },
      { period: "2022", value: 395 }
    ],
    site_breakdown: [
      { site: "Major Arterial Roads", value: 195 },
      { site: "Downtown Core", value: 110 },
      { site: "Suburban Corridors", value: 90 }
    ],
    sdgs: [
      {
        sdg_number: 3,
        sdg_title: "3. Good Health & Well-Being",
        target_code: "3.6",
        target_desc: "Halve the number of global deaths and injuries from road traffic accidents.",
        color: "#4c9f38"
      }
    ],
    measurement_method: "Police accident collision reporting registries cross-referenced with regional health trauma center admissions.",
    data_source_citation: "Manitoba Public Insurance & City Police Traffic Analysis Division"
  }
];

const updatedIndicatorsData = {
  project: {
    name: "SUNCASA Kigali NbS Impact Dashboard",
    funder: "Global Affairs Canada",
    leads: ["International Institute for Sustainable Development (IISD)", "World Resources Institute (WRI)"],
    government_partners: ["City of Kigali", "Rwanda Forestry Authority (RFA)"],
    target_area: "Lower Nyabarongo River Watershed, Kigali",
    timeline: "2023 - 2026",
    budget_mvp: "$20,000 USD"
  },
  themes,
  indicators
};

fs.writeFileSync(indicatorsPath, JSON.stringify(updatedIndicatorsData, null, 2), 'utf8');
console.log(`Wrote ${indicators.length} indicators and ${themes.length} themes to indicators.json`);

// Comprehensive bilingual narratives
const narratives = {
  area_restored_ha: {
    en: {
      title: "Total Area Restored and Managed through NbS",
      what_is: "Measures cumulative land area undergoing active ecological restoration using contour terracing, agroforestry, and afforestation across the Lower Nyabarongo watershed.",
      why_matters: "Steep slopes around Mount Kigali and the Yanze river basin suffer from severe erosion during heavy rains. Restoring degraded hillsides anchors the soil, reduces silt runoff into Kigali's water systems, and prevents dangerous landslides.",
      what_suncasa: "SUNCASA partners with the Rwanda Forestry Authority (RFA), the City of Kigali, and local cooperatives to terrace vulnerable hillsides, plant fast-growing indigenous and multi-purpose trees, and protect vulnerable terrain.",
      limitations: "Restoration polygons are verified bi-annually; canopy closure requires 3-5 years of continuous growth before full hydrological stabilization is achieved.",
      source: "Rwanda Forestry Authority (RFA) & City of Kigali Land Use Registry (FMES-LU-01)"
    },
    rw: {
      title: "Hegitari Zose Zasanywe binyuze mu Bisubizo Kamere",
      what_is: "Bipima ubuso bwose bw'ubutaka bwasanywe hifashishijwe amaterasi y'indagano, ibiti bivangwa n'imyaka, no gutera amashyamba mu kibaya cya Nyabarongo yo hasi.",
      why_matters: "Imisozi ihanamye ya Mont Kigali n'ikibaya cya Yanze yibasirwa n'isuri ikabije mu gihe cy'imvura. Gusana iyi misozi bifasha gufata ubutaka, bikarinda ibyondo kwinjira mu mazi ya Kigali, kandi bikarinda inkangu.",
      what_suncasa: "SUNCASA ifatanya na RFA, Umujyi wa Kigali n'amakoperative guca amaterasi, gutera ibiti byihuta gakondo, no kurinda ubutaka buhanamye.",
      limitations: "Ubuso busanwa bugenzurwa kabiri mu mwaka; ibiti bisaba imyaka 3-5 kugira ngo bitange umusaruro wose wo gufata amazi.",
      source: "Ikigo cy'Amashyamba mu Rwanda (RFA) n'Umujyi wa Kigali (FMES-LU-01)"
    }
  },
  flood_risk_reduction: {
    en: {
      title: "Flash Flood Peak Runoff Reduction",
      what_is: "Models the estimated percentage reduction in peak stormwater runoff entering urban ravines and drainage corridors during severe tropical rainfall events.",
      why_matters: "Flash flooding in the Mpazi ravine regularly inundates commercial markets in Nyabugogo and cuts off essential transit arteries across Kigali. Upstream rainwater retention saves lives, protects small businesses, and prevents municipal infrastructure destruction.",
      what_suncasa: "By installing vegetative check-dams, bamboo barriers, infiltration trenches, and contour swales in upper catchment basins, SUNCASA delays rainwater travel time, slashing peak flash flood volumes.",
      limitations: "Estimates depend on hydrometric sensor calibrators and rainfall intensity profiles; extreme 100-year storms may exceed retention capacity.",
      source: "Rwanda Water Resources Board (RWB) & City of Kigali Drainage Masterplan"
    },
    rw: {
      title: "Kugabanya Ubukana bw'Imyuzure n'Amazi y'Isuri",
      what_is: "Iki gipimo kigereranya ijanisha amazi y'inkukuma yagabanutseho mbere yo kwinjira mu mikoki n'inzira z'amazi mu mujyi mu gihe cy'imvura idasanzwe.",
      why_matters: "Imyuzure y'inkukuma mu mukoki wa Mpazi ikunze kurengera amasoko y'i Nyabugogo no gufunga imihanda minini y'i Kigali. Gufata amazi hakiri kare birinda ubuzima bw'abaturage, ubucuruzi, n'ibikorwa remezo bihenze.",
      what_suncasa: "Binyuze mu gukoresha ingomero z'ibiti, imigano ku nkombe, n'ibyobo bifata amazi mu misozi yo hejuru, SUNCASA igabanya umuvuduko n'ubukana bw'imyuzure mu bibaya byo hejuru.",
      limitations: "Bishingira ku byuma bipima amazi n'ingano y'imvura yaguye; imvura y'umurengera cyane ishobora kurenga ubushobozi bw'ingomero z'ibyatsi.",
      source: "Ikigo cy'Amazi mu Rwanda (RWB) na Gahunda yo Gucunga Imyuzure mu Mujyi wa Kigali"
    }
  },
  soil_erosion_prevented: {
    en: {
      title: "Soil Loss & Sediment Runoff Prevented",
      what_is: "Measures metric tons of fertile topsoil conserved annually that would otherwise be washed away into the Nyabarongo River and urban culverts.",
      why_matters: "Erosion strips fertile topsoil from hillside smallholders, diminishing agricultural food security while depositing thick mud in downstream water treatment intakes and city drains.",
      what_suncasa: "Through continuous contour hedgerows, vetiver grass stabilization on slopes exceeding 30% gradient, and agroforestry canopies, SUNCASA anchors nutrient-rich topsoil firmly in place.",
      limitations: "Calculated using empirical RUSLE modelling cross-verified with field sediment trap measurements across representative sample micro-catchments.",
      source: "RFA Watershed Soil Protection Index & MINAGRI Agro-Hydrology Service"
    },
    rw: {
      title: "Igitaka n'Isuri Byakumiwe ku Mwaka",
      what_is: "Bipima toni z'ubutaka burumbuka bwarinzwe gutwarwa n'isuri ngo bijye mu mugezi wa Nyabarongo no mu miferege ya Kigali.",
      why_matters: "Isuri itwara ubutaka burumbuka bw'abahinzi boroheje, bikagabanya umusaruro w'ibiribwa kandi bikaziba uruganda rutunganya amazi rwa Yanze n'imiferege y'umujyi.",
      what_suncasa: "Hifashishijwe imiferege ifata amazi n'ubwatsi bwa vetiver ku misozi ihanamiye hejuru ya 30%, SUNCASA irinda ubutaka burumbuka gutwarwa n'isuri.",
      limitations: "Bibarwa hakoreshejwe uburyo bwa tekiniki bwa RUSLE bugenzurwa n'ibyobo bifata ibyondo mu mirenge y'ikitegererezo.",
      source: "Ikigo cy'Amashyamba (RFA) na Serivisi y'Ubuhinzi n'Amazi ya MINAGRI"
    }
  },
  trees_planted: {
    en: {
      title: "Total Seedlings & Native Trees Planted",
      what_is: "The total number of certified indigenous, multipurpose, and agroforestry seedlings planted across hillsides, riparian zones, and urban corridors.",
      why_matters: "Native tree canopies regulate micro-climates, cool urban heat islands, create natural habitats for pollinators and bird life, and intercept heavy tropical downpours before they trigger mudslides.",
      what_suncasa: "SUNCASA finances certified community seedling nurseries and organizes structured planting campaigns with local community cooperatives and the City of Kigali.",
      limitations: "Data reflects dispatch manifests and initial field planting; sapling mortality requires periodic replanting and monitoring.",
      source: "RFA Forest Management and Evaluation System (FMES-SILV-01)"
    },
    rw: {
      title: "Ingemwe n'Ibiti Gakondo Byatewe Byose",
      what_is: "Umubare w'ingemwe z'ibiti gakondo, ibivangwa n'imyaka, n'iby'ubwiza byatewe ku misozi, ku nkengero z'imigezi, no mu bice by'umujyi.",
      why_matters: "Ibiti birinda ubushyuhe bukabije mu mujyi, bituma ikirere gikonja, biha ubuhungiro inyoni n'udukoko dufasha ubuhinzi, kandi bikagabanya ingufu z'imvura zateza inkangu.",
      what_suncasa: "SUNCASA itera inkunga ubuhumbikiro bw'ingemwe ikanategura ibikorwa byo gutera ibiti ifatanyije n'amakoperative y'abaturage n'Umujyi wa Kigali.",
      limitations: "Amakuru agaragaza ingemwe zasohotse mu buhumbikiro zikajya guterwa; hari izishobora kuma bisaba kongera guteramo izindi.",
      source: "Ikigo cy'Amashyamba mu Rwanda (RFA FMES-SILV-01)"
    }
  },
  tree_survival_rate: {
    en: {
      title: "Vegetation Canopy Cover & Tree Survival Rate",
      what_is: "Tracks the survival rate percentage of planted seedlings across monitored permanent sample plots after 6, 12, and 24-month growing periods.",
      why_matters: "Planting trees is only effective if seedlings survive to maturity. High survival rates ensure that restoration investments deliver real long-term canopy cover and slope stabilization.",
      what_suncasa: "SUNCASA ties nursery cooperative payments to verified survival benchmarks, conducts seasonal weeding, and trains local youth to monitor permanent sample plots.",
      limitations: "Sample plot extrapolation carries an estimated margin of error of +/- 3.5% across diverse micro-climatic zones.",
      source: "RFA Silvicultural Audit Service & SUNCASA Independent Monitoring Unit (FMES-SURV-02)"
    },
    rw: {
      title: "Ijanisha ry'Ibiti Byatewe Bikura Neza",
      what_is: "Gupima ijanisha ry'ingemwe zatewe zikomeje gukura neza mu bice by'ikitegererezo bigenzurwa nyuma y'amezi 6, 12, na 24.",
      why_matters: "Gutera ibiti bigira akamaro gusa iyo byakuze. Iyo ibiti byinshi bikura neza, nibwo ubutaka bufatika kandi amashyamba akagaruka ku misozi.",
      what_suncasa: "SUNCASA ihemba amakoperative y'ubuhumbikiro hisunzwe uko ibiti byakuze neza, ikanahugura urubyiruko rwo gupima ibiti mu bice byatoranyijwe.",
      limitations: "Bishingira ku bipimo byafashwe mu bice by'icyitegererezo; bishobora gutandukana gato bitewe n'imiterere y'ahantu.",
      source: "Ubugenzuzi bwa RFA n'Ishami rya SUNCASA rishinzwe Igenzura (FMES-SURV-02)"
    }
  },
  riparian_buffer_km: {
    en: {
      title: "Riparian Buffer Zone Protected",
      what_is: "Linear kilometers of continuous 30-meter native vegetative buffer restored along the Lower Nyabarongo River and its tributary wetland corridors.",
      why_matters: "Unprotected riverbanks collapse during high seasonal water flows, choking the river with sediment and destroying sensitive wetland ecology. A continuous 30m buffer acts as a living biological filter.",
      what_suncasa: "Enforcing national environmental regulations, SUNCASA works with adjacent landowners to replace annual crops within 30 meters of shorelines with native trees, bamboo, and perennial vetiver.",
      limitations: "Linear protection requires ongoing enforcement to prevent illegal sand-mining, grazing, and seasonal cultivation along the riverbank.",
      source: "Rwanda Environment Management Authority (REMA) & RFA Riverine Protection Database (FMES-ECO-03)"
    },
    rw: {
      title: "Ibirometero by'Inkombe z'Imigezi Zabungabunzwe",
      what_is: "Ibirometero by'inkombe z'umugezi wa Nyabarongo n'ibishanga byateweho ibiti n'ibyatsi bitangiza mu metero 30 ziteganywa n'amategeko.",
      why_matters: "Inkombe zitarinzwe zicika iyo amazi yabaye menshi, ibyondo bikaziba imigezi bikangiza ibishanga. Metero 30 z'amashyamba zikora nk'akayunguruzo kamere k'amazi.",
      what_suncasa: "Hubahirizwa amategeko y'ibidukikije, SUNCASA ifatanya n'abaturage bafite amasambu ku nkombe kuhasimbuza imyaka ibiti gakondo, imigano, n'ubwatsi bwa vetiver.",
      limitations: "Bisaba gukomeza gukurikirana buri gihe kugira ngo abaturage batagira abongera kuhahinga cyangwa kuharagirira amatungo.",
      source: "Ikigo cy'Ibidukikije (REMA) na RFA (FMES-ECO-03)"
    }
  },
  water_quality_index: {
    en: {
      title: "Surface Water Quality & Turbidity Index",
      what_is: "Composite surface water quality and suspended sediment index monitored at the Yanze water treatment intake, which supplies over 60% of Kigali's potable water.",
      why_matters: "Excessive mud and agricultural runoff increase municipal water treatment costs, damage pumping turbines, and cause frequent potable water shut-offs across Kigali households.",
      what_suncasa: "Upstream slope restoration in the Yanze catchment drastically cuts sediment yield, delivering clearer raw water directly to the municipal water treatment facility.",
      limitations: "Water turbidity spikes sharply during intense localized storm events prior to full vegetative canopy establishment.",
      source: "Water and Sanitation Corporation (WASAC) & Rwanda Water Resources Board (FMES-WQ-05)"
    },
    rw: {
      title: "Isesengura ry'Ubuziranenge bw'Amazi n'Isuri",
      what_is: "Igipimo cy'isukura n'ingano y'ibyondo mu mazi y'umugezi wa Yanze aho uruganda rwa WASAC rutunganyiriza amazi akoreshwa mu mujyi wa Kigali ku kigero kirenga 60%.",
      why_matters: "Ibyondo byinshi mu mazi bituma kuyatunganya bihenda cyane, bikangiza imashini z'uruganda, kandi bigatuma amazi abura kenshi mu baturage b'i Kigali.",
      what_suncasa: "Gusana imisozi yo hejuru y'umugezi wa Yanze bigabanya ibyondo byinjira mu mazi, bigatuma amazi agera ku ruganda atanduye cyane.",
      limitations: "Iyo imvura yaguye ari nyinshi cyane ibyondo byiyongera mu gihe ibiti byatewe bitarakura ngo bifate ubutaka bwose neza.",
      source: "Ikigo cy'Amazi n'Isukura (WASAC) n'Ikigo cy'Amazi mu Rwanda (FMES-WQ-05)"
    }
  },
  women_leadership_catchment: {
    en: {
      title: "Women in Catchment Committee Leadership",
      what_is: "Proportion of leadership and executive governance roles held by women on community watershed, forestry, and water resource management committees.",
      why_matters: "Women bear primary household responsibility for water collection, subsistence agriculture, and family welfare. When women hold leadership power, climate adaptation projects reflect real community priorities and achieve higher sustainability.",
      what_suncasa: "SUNCASA establishes a 50%+ affirmative quota for female leadership across all catchment management structures and provides tailored leadership and financial governance training.",
      limitations: "Cultural barriers and unpaid care burdens require ongoing institutional support to sustain active participation over time.",
      source: "Ministry of Gender and Family Promotion (MIGEPROF) & City of Kigali (FMES-GESI-01)"
    },
    rw: {
      title: "Ijanisha ry'Abagore mu Buyobozi bw'Ibibaya",
      what_is: "Ijanisha ry'imyanya y'ubuyobozi yicayeho abagore muri komite z'abaturage zishinzwe gucunga ibibaya by'amazi n'amashyamba.",
      why_matters: "Abagore nibo ba mbere bashinzwe gushaka amazi, gutegura ibiribwa, no kwita ku muryango. Iyo bahawe ububasha bwo gufata ibyemezo, imishinga y'ikirere itanga umusaruro urambye.",
      what_suncasa: "SUNCASA yashyizeho intego yo kugira nibura 50% by'abagore mu buyobozi bwa komite z'ibibaya, ikanabaha amahugurwa y'ubuyobozi n'imicungire y'umutungo.",
      limitations: "Imyumvire gakondo n'inshingano zo mu rugo bisaba gukomeza gushyigikirwa kugira ngo babone umwanya uhagije wo kwitabira inama.",
      source: "Minisiteri y'Uburinganire (MIGEPROF) n'Umujyi wa Kigali (FMES-GESI-01)"
    }
  },
  participants_trained: {
    en: {
      title: "Community Members & Youth Trained in NbS",
      what_is: "Total community members, smallholder farmers, and youth certified in progressive slope terracing, native tree silviculture, and soil bio-engineering.",
      why_matters: "Long-term watershed resilience depends on local skills. Training local community members transforms passive recipients into active, certified environmental practitioners who maintain NbS infrastructure for decades.",
      what_suncasa: "Conducts practical vocational workshops in Yanze, Mount Kigali, and Mpazi, providing hands-on certification in agroforestry, vetiver planting, and nursery entrepreneurship.",
      limitations: "Training effectiveness requires ongoing seasonal refresher courses and access to quality seed and tool inputs.",
      source: "SUNCASA Capacity Building Framework & City of Kigali Technical Training Directorate (FMES-CAP-02)"
    },
    rw: {
      title: "Abaturage n'Urubyiruko Bahuguwe mu Bisubizo Kamere",
      what_is: "Umubare w'abaturage, abahinzi bato, n'urubyiruko bahawe impamyabumenyi mu guca amaterasi y'indagano, ubuhumbikiro bw'ibiti, no gufata amazi.",
      why_matters: "Kubungabunga ibibaya birambye bishingira ku bumenyi bw'abaturage. Guhugura abaturage bituma aribo ubwabo bita ku bikorwa byakozwe mu gihe kirekire.",
      what_suncasa: "Itanga amahugurwa ngiro mu mirenge ya Yanze, Mont Kigali, na Mpazi, igaha abaturage ubumenyi mu buhinzi buvanze n'amashyamba no gucunga ubuhumbikiro.",
      limitations: "Bisaba guhora bibutswa ubumenyi bahawe no kubaha imbuto nziza n'ibikoresho byo gukoresha mu mirima yabo.",
      source: "Gahunda y'Amahugurwa ya SUNCASA n'Ishami ry'Amahugurwa ry'Umujyi wa Kigali (FMES-CAP-02)"
    }
  },
  green_jobs_created: {
    en: {
      title: "Direct Green Jobs Created (Person-Days)",
      what_is: "Cumulative person-days of direct paid wage employment created through progressive terracing, seedling production, tree planting, and bio-engineering drainage maintenance.",
      why_matters: "Climate adaptation must generate tangible livelihood benefits. Injecting wage income into vulnerable hillside households builds direct economic resilience, reducing poverty while restoring the environment.",
      what_suncasa: "Directly hires community cooperative members, mandating fair living wages, safe working conditions, and direct digital mobile payments.",
      limitations: "Employment is tied to seasonal planting cycles; ongoing cooperative enterprise diversification is essential for permanent livelihood creation.",
      source: "SUNCASA Financial Registry & Rwanda Cooperative Agency (FMES-ECON-01)"
    },
    rw: {
      title: "Iminsi y'Akazi k'Icyatsi Kahanzwe (Person-Days)",
      what_is: "Umubare w'iminsi y'akazi kahembye amafaranga mu buryo butaziguye kahanzwe binyuze mu guca amaterasi, gutera ibiti, no gusana imikoki.",
      why_matters: "Gusana ibidukikije bigomba kwinjiriza abaturage amafaranga. Guha abaturage akazi kabaha amafaranga bigabanya ubukene bikongera imibereho myiza mu ngo zabo.",
      what_suncasa: "Iha akazi abanyamuryango b'amakoperative y'abaturage, ikabahemba imishahara ikwiriye binyuze kuri telefone (Mobile Money).",
      limitations: "Akazi kenshi kaboneka mu bihe by'imvura no gutera ibiti; bisaba kubafasha gukora ubundi bucuruzi butuma binjiza amafaranga umwaka wose.",
      source: "Igenzura ry'Imari rya SUNCASA n'Ikigo cy'Amakoperative (RCA FMES-ECON-01)"
    }
  },
  female_nursery_operators: {
    en: {
      title: "Women-Led Eco-Nursery Cooperative Enterprises",
      what_is: "Percentage of registered community seedling nurseries owned, managed, and operated by women's cooperatives, generating sustainable revenue from verified seedling supply contracts.",
      why_matters: "Women-led enterprises reinvest a higher proportion of income into family health, nutrition, and children's education, multiplying the socio-economic co-benefits of climate finance.",
      what_suncasa: "Provides guaranteed advance purchase contracts, technical agronomist mentorship, and automated water cisterns to women's cooperative nurseries across Kigali.",
      limitations: "Nurseries face water scarcity during extended dry spells, requiring supplementary rainwater harvesting infrastructure.",
      source: "Rwanda Cooperative Agency (RCA) & RFA Forest Nursery Register (FMES-GESI-02)"
    },
    rw: {
      title: "Amakoperative y'Ubuhumbikiro Ayobowe n'Abagore",
      what_is: "Ijanisha ry'ubuhumbikiro bw'ingemwe bwanditse buyobowe kandi bukorwamo n'amakoperative y'abagore, bwinjiza amafaranga binyuze mu kugurisha ingemwe z'ibiti.",
      why_matters: "Iyo abagore binjije amafaranga bayakoresha mu kurihira abana amashuri, kugura ibiribwa, no kwivuza, bigatuma umuryango wose utera imbere.",
      what_suncasa: "Iha amakoperative amasezerano yo kugura ingemwe mbere, ikabaha impuguke zibafasha, ikanabubakira ibigega bifata amazi y'imvura.",
      limitations: "Mu mpeshyi amazi yo kuhira ashobora kubura, bikaba bisaba gushyiraho ibigega binini byo gufata amazi mu bihe by'imvura.",
      source: "Ikigo cy'Amakoperative (RCA) na RFA (FMES-GESI-02)"
    }
  },
  vulnerable_youth_employed: {
    en: {
      title: "Vulnerable Youth Employed in Environmental Telemetry",
      what_is: "Number of vulnerable Rwandan youth (aged 18-30) employed directly in drone surveying, mobile GIS telemetry, check-dam construction, and nursery logistics.",
      why_matters: "Urban youth face significant underemployment. Integrating youth into green technology and digital forestry monitoring equips them with future-ready vocational skills while anchoring local stewardship.",
      what_suncasa: "Equips youth cohorts with GPS survey smartphones and drone mapping skills, employing them to audit tree survival compartments and log spatial polygon telemetry directly into FMES.",
      limitations: "Requires ongoing hardware maintenance, mobile data allowances, and software licence renewal.",
      source: "National Youth Council (NYC) & SUNCASA Field Directorate (FMES-YOUTH-03)"
    },
    rw: {
      title: "Urubyiruko Rwashyizwe mu Mirimo y'Ikoranabuhanga rya GIS",
      what_is: "Umubare w'urubyiruko (ruri hagati y'imyaka 18 na 30) rwahawe akazi ko gupima amashyamba hakoreshejwe drone, amatelefone ya GIS, no kubaka ingomero z'ibiti.",
      why_matters: "Urubyiruko rwinshi rubura akazi mu mujyi. Kubaha ubumenyi bw'ikoranabuhanga mu gupima ibidukikije bibaha ubumenyi bwo gukora indi mirimo y'igihe kizaza.",
      what_suncasa: "Iha urubyiruko amatelefone arimo porogaramu za GIS na drone, ikabakoresha mu kugenzura niba ibiti byatewe bikura neza mu mashyamba ya RFA.",
      limitations: "Bisaba gukomeza kubaha amakarita ya interineti no gusana ibikoresho by'ikoranabuhanga mu gihe byangiritse.",
      source: "Inama y'Igihugu y'Urubyiruko (NYC) n'Ishami rya SUNCASA (FMES-YOUTH-03)"
    }
  },
  building_permit_values: {
    en: {
      title: "Building Permit Values (MyPeg Benchmark)",
      what_is: "Building permit values measures the total value of residential and non residential permit values.",
      why_matters: "Building permit values indicate the level of investment and construction activity taking place in a community. High values signal economic confidence, job creation, and municipal expansion.",
      what_suncasa: "Integrated spatial zoning balances urban construction expansion with permeable surface protection, floodplain avoidance, and Nature-based Solutions (NbS).",
      limitations: "Permit values represent anticipated construction costs reported at the time of application, not actual final project expenditures.",
      source: "City of Winnipeg Planning, Property and Development Department & Statistics Canada"
    },
    rw: {
      title: "Agaciro k'Impushya zo Kubaka (MyPeg)",
      what_is: "Iki gipimo gipima agaciro k'impushya zo kubaka amazu yo guturamo n'ay'ubucuruzi cyangwa ibikorwa remezo.",
      why_matters: "Agaciro k'impushya zo kubaka kerekana urwego rw'ishoramari n'iterambere ry'ubwubatsi mu mujyi. Agaciro gakomeye kerekana ubukungu bwiyongera n'akazi gashya ku baturage.",
      what_suncasa: "Guhuza amakuru y'ubwubatsi n'amabwiriza yo kubungabunga ibidukikije bifasha umujyi gukura hatangijwe ibishanga cyangwa amashyamba.",
      limitations: "Agaciro kagaragara ku mpushya kagereranywa mbere yo gutangira kubaka, bishobora gutandukana n'amafaranga nyakuri yishyuwe.",
      source: "Ishami ry'Imyubakire n'Iterambere ry'Umujyi na Sitatisitiki"
    }
  }
};

fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
console.log(`Wrote narratives for ${Object.keys(narratives).length} indicators to indicator_narratives.json`);
