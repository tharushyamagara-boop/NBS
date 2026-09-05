const fs = require('fs');
const path = require('path');

const indicatorsPath = path.join(__dirname, '..', 'src', 'data', 'indicators.json');
const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'locales', 'indicator_narratives.json');

const existingData = JSON.parse(fs.readFileSync(indicatorsPath, 'utf8'));
const existingNarratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const themes = [
  {
    id: "built_environment",
    name: "Built Environment",
    icon: "building",
    color: "#eb6b23"
  },
  {
    id: "basic_needs",
    name: "Basic Needs",
    icon: "home",
    color: "#d93829"
  },
  {
    id: "economy",
    name: "Economy",
    icon: "dollar-sign",
    color: "#f1c40f"
  },
  {
    id: "education",
    name: "Education & Learning",
    icon: "book-open",
    color: "#38bdf8"
  },
  {
    id: "health",
    name: "Health",
    icon: "heart-pulse",
    color: "#2980b9"
  },
  {
    id: "natural_environment",
    name: "Natural Environment",
    icon: "leaf",
    color: "#27ae60"
  },
  {
    id: "social_vitality",
    name: "Social Vitality",
    icon: "users",
    color: "#9b59b6"
  },
  {
    id: "governance",
    name: "Governance & Civics",
    icon: "landmark",
    color: "#34495e"
  }
];

// Re-map existing indicators to the 8 MyPeg themes
const remappedExisting = existingData.indicators.map(ind => {
  let newTheme = ind.theme;
  if (ind.theme === 'climate') {
    if (ind.id === 'hectares_restored' || ind.id === 'soil_erosion_prevented') {
      newTheme = 'natural_environment';
    } else {
      newTheme = 'basic_needs';
    }
  } else if (ind.theme === 'biodiversity') {
    newTheme = 'natural_environment';
  } else if (ind.theme === 'gesi') {
    newTheme = 'social_vitality';
  } else if (ind.theme === 'economy') {
    newTheme = 'economy';
  }
  return {
    ...ind,
    theme: newTheme,
    dual_icon: ind.dual_icon || (newTheme === 'natural_environment' ? 'leaf' : 'tree')
  };
});

// Built Environment Indicators (Matching Screenshot 1 & 2)
const builtEnvIndicators = [
  {
    id: "building_permit_values",
    theme: "built_environment",
    fmes_code: "PEG-BE-01",
    fmes_alignment: "Municipal Construction & Infrastructure Investment Registry",
    unit: "CAD ($)",
    baseline_2024: 372000,
    current_2025: 2142000,
    target_2026: 2500000,
    change_pct: 475.8,
    status: "on-track",
    priority_rank: 1,
    featured_in_hero: true,
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
        target_desc: "Enhance inclusive and sustainable urbanization and capacity for participatory, integrated human settlement planning.",
        color: "#f99d26"
      },
      {
        sdg_number: 8,
        sdg_title: "8. Decent Work & Economic Growth",
        target_code: "8.1",
        target_desc: "Sustain per capita economic growth in accordance with national circumstances.",
        color: "#a21942"
      }
    ],
    measurement_method: "Aggregated municipal building inspection valuations and architectural permit filings compiled on an annual schedule.",
    data_source_citation: "City of Winnipeg Planning, Property and Development Department & Statistics Canada Building Permits Database"
  },
  {
    id: "collision_victims",
    theme: "built_environment",
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
      },
      {
        sdg_number: 11,
        sdg_title: "11. Sustainable Cities & Communities",
        target_code: "11.2",
        target_desc: "Provide access to safe, affordable, accessible and sustainable transport systems for all.",
        color: "#f99d26"
      }
    ],
    measurement_method: "Police accident collision reporting registries cross-referenced with regional health trauma center admissions.",
    data_source_citation: "Manitoba Public Insurance & City Police Traffic Analysis Division"
  },
  {
    id: "commuting_patterns",
    theme: "built_environment",
    fmes_code: "PEG-BE-03",
    fmes_alignment: "Sustainable Urban Mobility Index",
    unit: "% Sustainable Transit",
    baseline_2024: 21.0,
    current_2025: 24.8,
    target_2026: 30.0,
    change_pct: 18.1,
    status: "on-track",
    priority_rank: 3,
    featured_in_hero: false,
    dual_icon: "none",
    legend_label: "Winnipeg (City)",
    definition: "Proportion of workforce commuters using public transit, active walking, cycling, or shared carpool modes.",
    trend_history: [
      { period: "2011", value: 19.5 },
      { period: "2016", value: 21.2 },
      { period: "2021", value: 23.4 },
      { period: "2022", value: 24.8 }
    ],
    site_breakdown: [
      { site: "Public Transit Ridership", value: 14.5 },
      { site: "Active Walking & Cycling", value: 6.8 },
      { site: "Carpooling & Shared", value: 3.5 }
    ],
    sdgs: [
      {
        sdg_number: 11,
        sdg_title: "11. Sustainable Cities & Communities",
        target_code: "11.2",
        target_desc: "Expand public transport, with special attention to the needs of those in vulnerable situations.",
        color: "#f99d26"
      }
    ],
    measurement_method: "Census journey-to-work demographic statistics augmented by transit smart-card tap telemetry.",
    data_source_citation: "Statistics Canada Census & Municipal Transit Authority"
  },
  {
    id: "core_housing_need",
    theme: "built_environment",
    fmes_code: "PEG-BE-04",
    fmes_alignment: "National Housing Strategy Affordability Standard",
    unit: "% of Households",
    baseline_2024: 12.8,
    current_2025: 11.2,
    target_2026: 8.5,
    change_pct: -12.5,
    status: "on-track",
    priority_rank: 4,
    featured_in_hero: false,
    dual_icon: "house",
    legend_label: "Winnipeg (City)",
    definition: "Households living in dwellings that are unsuitable, inadequate, or unaffordable (costing 30%+ of income).",
    trend_history: [
      { period: "2011", value: 10.3 },
      { period: "2016", value: 12.1 },
      { period: "2021", value: 11.8 },
      { period: "2022", value: 11.2 }
    ],
    site_breakdown: [
      { site: "Renter Households", value: 17.4 },
      { site: "Owner Households", value: 6.1 }
    ],
    sdgs: [
      {
        sdg_number: 11,
        sdg_title: "11. Sustainable Cities & Communities",
        target_code: "11.1",
        target_desc: "Ensure access for all to adequate, safe and affordable housing and basic services.",
        color: "#f99d26"
      }
    ],
    measurement_method: "CMHC Core Housing Need definition evaluated against Census income and shelter cost distributions.",
    data_source_citation: "Canada Mortgage and Housing Corporation (CMHC)"
  },
  {
    id: "dwelling_condition",
    theme: "built_environment",
    fmes_code: "PEG-BE-05",
    fmes_alignment: "Housing Quality & Structural Integrity Index",
    unit: "% Major Repairs",
    baseline_2024: 9.5,
    current_2025: 8.2,
    target_2026: 6.0,
    change_pct: -13.7,
    status: "on-track",
    priority_rank: 5,
    featured_in_hero: false,
    dual_icon: "house",
    legend_label: "Winnipeg (City)",
    definition: "Proportion of private occupied dwellings in need of major repairs (plumbing, structural framing, electrical, roof).",
    trend_history: [
      { period: "2006", value: 11.2 },
      { period: "2011", value: 10.4 },
      { period: "2016", value: 9.1 },
      { period: "2021", value: 8.2 }
    ],
    site_breakdown: [
      { site: "Inner City Historical Sector", value: 14.2 },
      { site: "Mature Neighborhoods", value: 7.8 },
      { site: "New Subdivisions", value: 2.1 }
    ],
    sdgs: [
      {
        sdg_number: 11,
        sdg_title: "11. Sustainable Cities & Communities",
        target_code: "11.1",
        target_desc: "Ensure access for all to adequate, safe and affordable housing and basic services.",
        color: "#f99d26"
      }
    ],
    measurement_method: "Self-reported census structural condition corroborated by municipal building standards violation audits.",
    data_source_citation: "Statistics Canada Housing Census & City By-law Enforcement Division"
  },
  {
    id: "dwelling_density",
    theme: "built_environment",
    fmes_code: "PEG-BE-06",
    fmes_alignment: "Urban Land Efficiency & Density Metric",
    unit: "Dwellings / km²",
    baseline_2024: 685,
    current_2025: 724,
    target_2026: 780,
    change_pct: 5.7,
    status: "on-track",
    priority_rank: 6,
    featured_in_hero: false,
    dual_icon: "none",
    legend_label: "Winnipeg (City)",
    definition: "Gross residential density measured as the average number of private dwelling units per square kilometre of urban land.",
    trend_history: [
      { period: "2006", value: 630 },
      { period: "2011", value: 658 },
      { period: "2016", value: 692 },
      { period: "2021", value: 724 }
    ],
    site_breakdown: [
      { site: "Downtown Core", value: 3450 },
      { site: "Transit-Oriented Corridors", value: 1420 },
      { site: "Outer Suburbs", value: 480 }
    ],
    sdgs: [
      {
        sdg_number: 11,
        sdg_title: "11. Sustainable Cities & Communities",
        target_code: "11.3",
        target_desc: "Enhance inclusive and sustainable urbanization and integrated human settlement planning.",
        color: "#f99d26"
      }
    ],
    measurement_method: "GIS spatial cadastral analysis intersecting residential parcel counts with contiguous municipal boundary area.",
    data_source_citation: "City Land Planning & GIS Spatial Information Services"
  },
  {
    id: "housing_starts",
    theme: "built_environment",
    fmes_code: "PEG-BE-07",
    fmes_alignment: "Residential Construction Activity Index",
    unit: "Units / Year",
    baseline_2024: 4200,
    current_2025: 5120,
    target_2026: 5800,
    change_pct: 21.9,
    status: "on-track",
    priority_rank: 7,
    featured_in_hero: false,
    dual_icon: "dollar",
    legend_label: "Winnipeg (City)",
    definition: "Total number of new residential housing units (single-family, semi-detached, apartment) breaking ground in the calendar year.",
    trend_history: [
      { period: "2015", value: 3950 },
      { period: "2017", value: 4420 },
      { period: "2019", value: 4810 },
      { period: "2021", value: 5430 },
      { period: "2022", value: 5120 }
    ],
    site_breakdown: [
      { site: "Multi-family Apartments", value: 3240 },
      { site: "Single Detached Homes", value: 1480 },
      { site: "Row / Townhouses", value: 400 }
    ],
    sdgs: [
      {
        sdg_number: 11,
        sdg_title: "11. Sustainable Cities & Communities",
        target_code: "11.1",
        target_desc: "Ensure access for all to adequate, safe and affordable housing.",
        color: "#f99d26"
      }
    ],
    measurement_method: "CMHC Starts and Completions Survey monitoring physical site excavation and foundation placement.",
    data_source_citation: "Canada Mortgage and Housing Corporation (CMHC) Housing Market Information"
  },
  {
    id: "public_transit_trips",
    theme: "built_environment",
    fmes_code: "PEG-BE-08",
    fmes_alignment: "Mass Transit Utilization Rate",
    unit: "Rides / Capita",
    baseline_2024: 58.0,
    current_2025: 64.2,
    target_2026: 75.0,
    change_pct: 10.7,
    status: "on-track",
    priority_rank: 8,
    featured_in_hero: false,
    dual_icon: "none",
    legend_label: "Winnipeg (City)",
    definition: "Total municipal regular and rapid transit revenue passenger trips divided by the permanent urban population.",
    trend_history: [
      { period: "2016", value: 68.4 },
      { period: "2018", value: 71.2 },
      { period: "2020", value: 38.5 },
      { period: "2021", value: 49.0 },
      { period: "2022", value: 64.2 }
    ],
    site_breakdown: [
      { site: "Bus Rapid Transit Corridors", value: 24.8 },
      { site: "Regular Fixed Routes", value: 35.1 },
      { site: "On-Request Microtransit", value: 4.3 }
    ],
    sdgs: [
      {
        sdg_number: 11,
        sdg_title: "11. Sustainable Cities & Communities",
        target_code: "11.2",
        target_desc: "Provide access to safe, affordable, accessible and sustainable transport systems for all.",
        color: "#f99d26"
      },
      {
        sdg_number: 13,
        sdg_title: "13. Climate Action",
        target_code: "13.2",
        target_desc: "Integrate climate change measures into national policies and planning.",
        color: "#3f7e44"
      }
    ],
    measurement_method: "Electronic automated passenger count (APC) telemetry logged across municipal transit fleets.",
    data_source_citation: "Winnipeg Transit Authority Annual Performance Review"
  },
  {
    id: "waste_landfill",
    theme: "built_environment",
    fmes_code: "PEG-BE-09",
    fmes_alignment: "Municipal Waste Diversion & Landfill Metric",
    unit: "kg / Capita / Year",
    baseline_2024: 258,
    current_2025: 232,
    target_2026: 195,
    change_pct: -10.1,
    status: "on-track",
    priority_rank: 9,
    featured_in_hero: false,
    dual_icon: "leaf",
    legend_label: "Winnipeg (City)",
    definition: "Residential solid waste sent directly to landfill disposal facilities per resident per year.",
    trend_history: [
      { period: "2012", value: 295 },
      { period: "2015", value: 280 },
      { period: "2018", value: 262 },
      { period: "2021", value: 245 },
      { period: "2022", value: 232 }
    ],
    site_breakdown: [
      { site: "Single Family Dwellings", value: 148 },
      { site: "Multi-family Residential", value: 84 }
    ],
    sdgs: [
      {
        sdg_number: 12,
        sdg_title: "12. Responsible Consumption & Production",
        target_code: "12.5",
        target_desc: "By 2030, substantially reduce waste generation through prevention, reduction, recycling and reuse.",
        color: "#bf8b2e"
      }
    ],
    measurement_method: "Weigh-scale manifests recorded at municipal landfill transfer gates for all residential collection routes.",
    data_source_citation: "Water and Waste Department, Solid Waste Services Division"
  },
  {
    id: "waste_recycling",
    theme: "built_environment",
    fmes_code: "PEG-BE-10",
    fmes_alignment: "Residential Recycling Diversion Rate",
    unit: "kg / Capita / Year",
    baseline_2024: 64,
    current_2025: 78,
    target_2026: 95,
    change_pct: 21.9,
    status: "on-track",
    priority_rank: 10,
    featured_in_hero: false,
    dual_icon: "leaf",
    legend_label: "Winnipeg (City)",
    definition: "Total mass of recyclables collected via residential blue-box programs and diverted from landfills per capita.",
    trend_history: [
      { period: "2012", value: 52 },
      { period: "2015", value: 61 },
      { period: "2018", value: 69 },
      { period: "2021", value: 74 },
      { period: "2022", value: 78 }
    ],
    site_breakdown: [
      { site: "Curbside Blue Cart Program", value: 58 },
      { site: "Community Depot Drops", value: 20 }
    ],
    sdgs: [
      {
        sdg_number: 12,
        sdg_title: "12. Responsible Consumption & Production",
        target_code: "12.5",
        target_desc: "Substantially reduce waste generation through recycling and circular resource management.",
        color: "#bf8b2e"
      }
    ],
    measurement_method: "Audited material recovery facility (MRF) scale logs and end-market sorting audits.",
    data_source_citation: "Solid Waste Services Division & Multi-Material Stewardship Agency"
  },
  {
    id: "water_use",
    theme: "built_environment",
    fmes_code: "PEG-BE-11",
    fmes_alignment: "Municipal Potable Water Consumption Metric",
    unit: "Litres / Capita / Day",
    baseline_2024: 212,
    current_2025: 188,
    target_2026: 165,
    change_pct: -11.3,
    status: "on-track",
    priority_rank: 11,
    featured_in_hero: false,
    dual_icon: "leaf",
    legend_label: "Winnipeg (City)",
    definition: "Average daily residential per capita consumption of treated potable water distributed through municipal mains.",
    trend_history: [
      { period: "2010", value: 245 },
      { period: "2014", value: 228 },
      { period: "2018", value: 205 },
      { period: "2021", value: 194 },
      { period: "2022", value: 188 }
    ],
    site_breakdown: [
      { site: "Single Family Residential", value: 118 },
      { site: "Multi-family Residential", value: 70 }
    ],
    sdgs: [
      {
        sdg_number: 6,
        sdg_title: "6. Clean Water & Sanitation",
        target_code: "6.4",
        target_desc: "Substantially increase water-use efficiency across all sectors and ensure sustainable withdrawals.",
        color: "#00aed9"
      }
    ],
    measurement_method: "Municipal utility metered consumption billing records calculated against census population totals.",
    data_source_citation: "City Water and Waste Department, Water Services Division"
  }
];

// Combine all indicators
const allIndicators = [...builtEnvIndicators, ...remappedExisting];

const updatedIndicatorsData = {
  ...existingData,
  themes,
  indicators: allIndicators
};

fs.writeFileSync(indicatorsPath, JSON.stringify(updatedIndicatorsData, null, 2), 'utf8');
console.log(`Updated indicators.json: ${allIndicators.length} indicators, ${themes.length} themes.`);

// Expand indicator narratives
const builtEnvNarratives = {
  building_permit_values: {
    en: {
      title: "Building Permit Values",
      what_is: "Building permit values measures the total value of residential and non residential permit values.",
      why_matters: "Building permit values indicate the level of investment and construction activity taking place in a community. High values signal economic confidence, job creation, and municipal expansion.",
      what_suncasa: "By tracking permit activity alongside green zoning bylaws, city planners can balance economic expansion with permeable surface protection, floodplain avoidance, and Nature-based Solutions (NbS).",
      limitations: "Permit values represent anticipated construction costs reported at the time of application, not actual final project expenditures.",
      source: "City of Winnipeg Planning, Property and Development Department & Statistics Canada"
    },
    rw: {
      title: "Agaciro k'Impushya zo Kubaka",
      what_is: "Iki gipimo gipima agaciro k'impushya zo kubaka amazu yo guturamo n'ay'ubucuruzi cyangwa ibikorwa remezo.",
      why_matters: "Agaciro k'impushya zo kubaka kerekana urwego rw'ishoramari n'iterambere ry'ubwubatsi mu mujyi. Agaciro gakomeye kerekana ubukungu bwiyongera n'akazi gashya ku baturage.",
      what_suncasa: "Guhuza amakuru y'ubwubatsi n'amabwiriza yo kubungabunga ibidukikije bifasha umujyi gukura hatangijwe ibishanga cyangwa amashyamba.",
      limitations: "Agaciro kagaragara ku mpushya kagereranywa mbere yo gutangira kubaka, bishobora gutandukana n'amafaranga nyakuri yishyuwe.",
      source: "Ishami ry'Imyubakire n'Iterambere ry'Umujyi na Sitatisitiki"
    }
  },
  collision_victims: {
    en: {
      title: "Collision Victims",
      what_is: "Measures annual traffic collision victims and casualty injury rates per 100,000 population.",
      why_matters: "Road safety is a core measure of liveability and public health. Lower casualty rates reflect effective street design, traffic calming, and safe pedestrian infrastructure.",
      what_suncasa: "Green streetscapes, bioswales, and roadside tree canopies naturally calm vehicular speeds, creating safer transit corridors for pedestrians and cyclists.",
      limitations: "Includes only reported collisions with police or insurance records; minor unreported incidents are excluded.",
      source: "Manitoba Public Insurance & City Police Traffic Analysis Division"
    },
    rw: {
      title: "Abagize Impanuka zo mu Muhanda",
      what_is: "Bipima umubare w'abakomerekeye cyangwa abaguye mu mpanuka zo mu muhanda ku baturage 100,000 ku mwaka.",
      why_matters: "Umutekano wo mu muhanda ni ingenzi ku buzima bw'abaturage. Imihanda ifite ibiti n'inzira z'abanyamaguru igabanya impanuka.",
      what_suncasa: "Gutera ibiti ku mihanda no gukora imiferege y'ibyatsi bituma imodoka zigabanya umuvuduko, bikarinda abanyamaguru.",
      limitations: "Bifata gusa impanuka zanditswe na polisi cyangwa amakompanyi y'ubwishingizi.",
      source: "Polisi y'Umujyi n'Ishami ry'Umutekano wo mu Muhanda"
    }
  },
  core_housing_need: {
    en: {
      title: "Core Housing Need",
      what_is: "Proportion of private households whose housing falls below at least one of adequacy, suitability or affordability standards.",
      why_matters: "Affordable and safe shelter is fundamental to household stability, family health, and civic prosperity.",
      what_suncasa: "Ecological restoration and NbS drainage works prevent flood damages to vulnerable informal housing located along hillside ravines.",
      limitations: "Derived from periodic census intervals and CMHC survey estimates.",
      source: "Canada Mortgage and Housing Corporation (CMHC)"
    },
    rw: {
      title: "Ingano y'Abakeneye Amazu Akwiye",
      what_is: "Ijanisha ry'ingo zituye mu mazu atujuje ibisabwa mu bucuti, agaciro cyangwa ubushobozi bwo kwishyura.",
      why_matters: "Inzu nziza kandi idahenze ni inkingi ya mwamba mu mibereho myiza y'umuryango n'ubuzima.",
      what_suncasa: "Ibikorwa bya NbS birinda amazu ahegereye imikoki n'ibishanga kwangizwa n'imyuzure n'inkangu.",
      limitations: "Bishingira ku ibarura rusange n'isesengura ry'ubushobozi bw'ingo.",
      source: "Ikigo Gishinzwe Amazu n'Imiturire"
    }
  },
  water_use: {
    en: {
      title: "Residential Water Use",
      what_is: "Average daily potable water consumption per capita supplied by the municipal water distribution system.",
      why_matters: "Efficient water consumption ensures water security, conserves regional freshwater aquifers, and reduces pumping energy costs.",
      what_suncasa: "Protecting upstream catchments like the Yanze River guarantees high-quality raw water supply to municipal treatment plants.",
      limitations: "Reflects billed treated municipal supply; rainwater harvesting and private borehole usage are not captured.",
      source: "City Water and Waste Department, Water Services Division"
    },
    rw: {
      title: "Ikoreshwa ry'Amazi mu Ngo",
      what_is: "Impuzandengo ya litiro z'amazi meza akoreshwa n'umuntu umwe ku munsi akwirakwizwa n'umuyoboro w'amazi.",
      why_matters: "Gukoresha amazi neza birinda ko akendera, bikarinda amasoko y'amazi kandi bikagabanya amafaranga yo kuyatunganya.",
      what_suncasa: "Kubungabunga ikibaya cya Yanze birinda amasoko y'amazi meza yinjira mu ruganda ruyatunganya rukayageza mu mujyi.",
      limitations: "Bipima gusa amazi aca mu matiyo y'umujyi, ntibirimo amazi y'imvura afatwa cyangwa ay'amasoko y'akarere.",
      source: "Ikigo Gishinzwe Amazi n'Isukura"
    }
  }
};

const updatedNarratives = {
  ...existingNarratives,
  ...builtEnvNarratives
};

fs.writeFileSync(narrativesPath, JSON.stringify(updatedNarratives, null, 2), 'utf8');
console.log(`Updated indicator_narratives.json successfully.`);
