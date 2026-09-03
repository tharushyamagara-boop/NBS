import { DatabaseAdapter, Indicator } from './types';

export class InHouseRestAdapter implements DatabaseAdapter {
  name = 'In-House Database (REST/PostgreSQL)';
  private baseUrl: string;
  private apiKey: string | null;

  constructor(baseUrl = process.env.IN_HOUSE_DB_URL || 'http://localhost:8000/api/v1', apiKey = process.env.IN_HOUSE_DB_KEY || null) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    return headers;
  }

  async getIndicators(): Promise<Indicator[]> {
    const res = await fetch(`${this.baseUrl}/indicators`, {
      headers: this.getHeaders()
    });
    if (!res.ok) {
      throw new Error(`In-House DB request failed: ${res.statusText}`);
    }
    return res.json();
  }

  async getIndicatorById(id: string): Promise<Indicator | null> {
    const res = await fetch(`${this.baseUrl}/indicators/${id}`, {
      headers: this.getHeaders()
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`In-House DB request failed: ${res.statusText}`);
    }
    return res.json();
  }

  async createIndicator(indicator: Indicator): Promise<Indicator> {
    const res = await fetch(`${this.baseUrl}/indicators`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(indicator)
    });
    if (!res.ok) {
      throw new Error(`Failed to create indicator in In-House DB: ${res.statusText}`);
    }
    return res.json();
  }

  async updateIndicator(id: string, updates: Partial<Indicator>): Promise<Indicator | null> {
    const res = await fetch(`${this.baseUrl}/indicators/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Failed to update indicator in In-House DB: ${res.statusText}`);
    }
    return res.json();
  }

  async deleteIndicator(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/indicators/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.ok;
  }
}
