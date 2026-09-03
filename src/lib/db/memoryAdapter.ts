import { DatabaseAdapter, Indicator } from './types';
import rawData from '../../data/indicators.json';

class MemoryDatabaseAdapter implements DatabaseAdapter {
  name = 'In-Memory / Local JSON';
  private indicators: Indicator[];

  constructor() {
    this.indicators = JSON.parse(JSON.stringify(rawData.indicators));
  }

  async getIndicators(): Promise<Indicator[]> {
    return [...this.indicators];
  }

  async getIndicatorById(id: string): Promise<Indicator | null> {
    const found = this.indicators.find(ind => ind.id === id);
    return found ? { ...found } : null;
  }

  async createIndicator(indicator: Indicator): Promise<Indicator> {
    const exists = this.indicators.some(ind => ind.id === indicator.id);
    if (exists) {
      throw new Error(`Indicator with ID '${indicator.id}' already exists.`);
    }
    this.indicators.push(indicator);
    return { ...indicator };
  }

  async updateIndicator(id: string, updates: Partial<Indicator>): Promise<Indicator | null> {
    const index = this.indicators.findIndex(ind => ind.id === id);
    if (index === -1) return null;

    this.indicators[index] = {
      ...this.indicators[index],
      ...updates
    };

    return { ...this.indicators[index] };
  }

  async deleteIndicator(id: string): Promise<boolean> {
    const initialLen = this.indicators.length;
    this.indicators = this.indicators.filter(ind => ind.id !== id);
    return this.indicators.length < initialLen;
  }
}

export const memoryAdapter = new MemoryDatabaseAdapter();
