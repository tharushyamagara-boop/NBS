export interface TrendPoint {
  period: string;
  value: number;
}

export interface SiteBreakdown {
  site: string;
  value: number;
}

export interface Indicator {
  id: string;
  theme: 'climate' | 'biodiversity' | 'gesi' | 'economy';
  fmes_code: string;
  fmes_alignment: string;
  unit: string;
  baseline_2024: number;
  current_2025: number;
  target_2026: number;
  change_pct: number;
  status: 'on-track' | 'exceeded' | 'needs-acceleration';
  priority_rank: number;
  featured_in_hero: boolean;
  trend_history: TrendPoint[];
  site_breakdown: SiteBreakdown[];
}

export interface ProjectMetadata {
  name: string;
  funder: string;
  leads: string[];
  government_partners: string[];
  target_area: string;
  timeline: string;
  budget_mvp: string;
}

export interface DatabaseAdapter {
  name: string;
  getIndicators(): Promise<Indicator[]>;
  getIndicatorById(id: string): Promise<Indicator | null>;
  createIndicator(indicator: Indicator): Promise<Indicator>;
  updateIndicator(id: string, updates: Partial<Indicator>): Promise<Indicator | null>;
  deleteIndicator(id: string): Promise<boolean>;
}
