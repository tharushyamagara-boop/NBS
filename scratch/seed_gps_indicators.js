const fs = require('fs');
const path = require('path');

const indPath = path.join(__dirname, '../src/data/indicators.json');
const raw = fs.readFileSync(indPath, 'utf-8');
const data = JSON.parse(raw);

const GPS_PRESETS = {
  area_restored_ha: [
    { id: 'gps-ar-1', name: 'Yanze Micro-Catchment Upper Terraces', name_rw: 'Amaterasi ya Yanze yo Hejuru', lat: -1.9045, lng: 30.0381, value: 410, sector: 'Gatsata', district: 'Gasabo', status: 'Active', notes: 'Continuous contour stone bunds and bamboo stabilization.' },
    { id: 'gps-ar-2', name: 'Mount Kigali Reforestation Slope', name_rw: 'Imisozi ya Mont Kigali Yateweho Ibiti', lat: -1.9852, lng: 30.0245, value: 295, sector: 'Kanyinya', district: 'Nyarugenge', status: 'Verified', notes: 'Native tree canopy restoration on >30% steep gradient.' },
    { id: 'gps-ar-3', name: 'Mpazi Drainage Upper Swales', name_rw: 'Ibyobo bifata amazi mu Mpazi', lat: -1.9442, lng: 30.0514, value: 160, sector: 'Gitega', district: 'Nyarugenge', status: 'Active', notes: 'Bio-engineering live check-dams and swales.' },
    { id: 'gps-ar-4', name: 'Nyabugogo Wetland Restoration Node', name_rw: 'Ahasanwa Igishanga cya Nyabugogo', lat: -1.9360, lng: 30.0442, value: 120, sector: 'Muhima', district: 'Nyarugenge', status: 'Completed', notes: 'Wetland marsh vegetation re-establishment.' },
  ],
  flood_risk_reduction: [
    { id: 'gps-fr-1', name: 'Mpazi Check-Dam 01 (Upper Sector)', name_rw: 'Urugomero rw\'ibiti rwa Mpazi 01', lat: -1.9460, lng: 30.0490, value: 31.2, sector: 'Gitega', district: 'Nyarugenge', status: 'Verified', notes: 'Peak velocity slowed by 31.2% in hydraulic tests.' },
    { id: 'gps-fr-2', name: 'Mpazi Vegetative Infiltration Trench', name_rw: 'Icyobo gifata amazi mu Mpazi', lat: -1.9425, lng: 30.0535, value: 26.8, sector: 'Kimisagara', district: 'Nyarugenge', status: 'Active', notes: 'High absorption gravel-bamboo bed.' },
    { id: 'gps-fr-3', name: 'Nyabugogo Basin Sump Inlet', name_rw: 'Inzira y\'amazi y\'isoko rya Nyabugogo', lat: -1.9372, lng: 30.0450, value: 28.5, sector: 'Muhima', district: 'Nyarugenge', status: 'Active', notes: 'Culvert protection monitoring station.' },
  ],
  soil_erosion_prevented: [
    { id: 'gps-se-1', name: 'Yanze Micro-Catchment Sediment Trap A', name_rw: 'Icyobo gifata ibyondo cya Yanze A', lat: -1.9120, lng: 30.0320, value: 1840, sector: 'Gatsata', district: 'Gasabo', status: 'Active', notes: 'Prevents sediment washing into Yanze water treatment intake.' },
    { id: 'gps-se-2', name: 'Mont Kigali South Terraces', name_rw: 'Amaterasi y\'amajyepfo ya Mont Kigali', lat: -1.9920, lng: 30.0180, value: 1420, sector: 'Mageragere', district: 'Nyarugenge', status: 'Verified', notes: 'Vetiver hedge contour barriers firmly anchoring topsoil.' },
    { id: 'gps-se-3', name: 'Kimisagara Gully Bio-Barrier', name_rw: 'Urukuta rw\'ibimera rwa Kimisagara', lat: -1.9510, lng: 30.0390, value: 890, sector: 'Kimisagara', district: 'Nyarugenge', status: 'Completed', notes: 'Stabilized slope with deep-rooted Markamia lutea trees.' },
  ],
  trees_planted: [
    { id: 'gps-tp-1', name: 'Yanze Cooperative Community Nursery', name_rw: 'Ubuhumbikiro bwa Yanze', lat: -1.9080, lng: 30.0410, value: 215000, sector: 'Gatsata', district: 'Gasabo', status: 'Active', notes: 'Women-led seedling nursery producing native Markamia & bamboo.' },
    { id: 'gps-tp-2', name: 'Mount Kigali Arbor Day Plantation Zone', name_rw: 'Agace k\'Ibiti ka Mont Kigali', lat: -1.9810, lng: 30.0310, value: 175000, sector: 'Kanyinya', district: 'Nyarugenge', status: 'Verified', notes: 'Planted with City of Kigali community volunteers.' },
    { id: 'gps-tp-3', name: 'Mageragere Agroforestry Farm Compartment', name_rw: 'Amashyamba n\'Ubuhinzi i Mageragere', lat: -2.0150, lng: 30.0210, value: 130000, sector: 'Mageragere', district: 'Nyarugenge', status: 'Completed', notes: 'Fruit and timber agroforestry on smallholder parcels.' },
  ],
  riparian_buffer_km: [
    { id: 'gps-rb-1', name: 'Lower Nyabarongo 30m Buffer North', name_rw: 'Inkombe za Nyabarongo mu Majyaruguru', lat: -1.9720, lng: 29.9880, value: 6.8, sector: 'Mageragere', district: 'Nyarugenge', status: 'Active', notes: '30-meter continuous native vegetative buffer strictly protected.' },
    { id: 'gps-rb-2', name: 'Yanze Confluence Buffer Reach', name_rw: 'Inkombe z\'Ihuriro rya Yanze', lat: -1.9180, lng: 30.0350, value: 5.4, sector: 'Gatsata', district: 'Gasabo', status: 'Verified', notes: 'Bamboo and pennisetum vegetative filtration band.' },
    { id: 'gps-rb-3', name: 'Nyabugogo Wetland Perimeter Band', name_rw: 'Inkombe z\'Igishanga cya Nyabugogo', lat: -1.9390, lng: 30.0420, value: 4.2, sector: 'Muhima', district: 'Nyarugenge', status: 'Completed', notes: 'Prevents commercial encroachment into delicate wetlands.' },
  ],
  water_quality_index: [
    { id: 'gps-wq-1', name: 'Yanze Water Intake Hydrometric Station', name_rw: 'Icyuma gipima amazi cya Yanze', lat: -1.9010, lng: 30.0390, value: 78, sector: 'Gatsata', district: 'Gasabo', status: 'Active', notes: 'Turbidity and dissolved oxygen sensors reporting real-time telemetry.' },
    { id: 'gps-wq-2', name: 'Nyabarongo Mid-Stream Gauging Sensor', name_rw: 'Icyuma cya Nyabarongo yo Hagati', lat: -1.9680, lng: 29.9920, value: 64, sector: 'Mageragere', district: 'Nyarugenge', status: 'Active', notes: 'Continuous WQI score calculation.' },
    { id: 'gps-wq-3', name: 'Nyabugogo Urban Discharge Monitor', name_rw: 'Icyuma gipima amazi y\'i Nyabugogo', lat: -1.9380, lng: 30.0460, value: 58, sector: 'Muhima', district: 'Nyarugenge', status: 'Under Monitoring', notes: 'Monitors runoff from dense commercial area.' },
  ],
};

data.indicators = data.indicators.map((ind) => {
  if (!ind.gps_coordinates || ind.gps_coordinates.length === 0) {
    if (GPS_PRESETS[ind.id]) {
      ind.gps_coordinates = GPS_PRESETS[ind.id];
    } else {
      // Default 3 sample points in Kigali for any other indicator
      ind.gps_coordinates = [
        {
          id: `gps-${ind.id}-1`,
          name: `${ind.definition || ind.id} - Yanze Station`,
          name_rw: 'Agace ka Yanze',
          lat: -1.9050,
          lng: 30.0380,
          value: Math.round(ind.current_2025 * 0.45),
          sector: 'Gatsata',
          district: 'Gasabo',
          status: 'Active',
          notes: 'Intervention zone in Upper Yanze.',
        },
        {
          id: `gps-${ind.id}-2`,
          name: `${ind.definition || ind.id} - Mount Kigali Slope`,
          name_rw: 'Agace ka Mont Kigali',
          lat: -1.9840,
          lng: 30.0250,
          value: Math.round(ind.current_2025 * 0.35),
          sector: 'Kanyinya',
          district: 'Nyarugenge',
          status: 'Verified',
          notes: 'Intervention zone on Mount Kigali hillside.',
        },
        {
          id: `gps-${ind.id}-3`,
          name: `${ind.definition || ind.id} - Mpazi Corridor`,
          name_rw: 'Agace ka Mpazi',
          lat: -1.9440,
          lng: 30.0510,
          value: Math.round(ind.current_2025 * 0.20),
          sector: 'Gitega',
          district: 'Nyarugenge',
          status: 'Completed',
          notes: 'Bio-engineering corridor in Mpazi basin.',
        },
      ];
    }
  }
  return ind;
});

fs.writeFileSync(indPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Successfully seeded GPS coordinates for ${data.indicators.length} indicators in indicators.json.`);
