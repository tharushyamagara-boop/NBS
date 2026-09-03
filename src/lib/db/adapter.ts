import { DatabaseAdapter } from './types';
import { memoryAdapter } from './memoryAdapter';
import { FirestoreDatabaseAdapter, FirebaseClientConfig } from './firestoreAdapter';
import { InHouseRestAdapter } from './inHouseRestAdapter';

export type DriverType = 'memory' | 'firestore' | 'inhouse';

class DatabaseManager {
  private activeDriver: DriverType = 'memory';
  private firestoreInstance: FirestoreDatabaseAdapter | null = null;
  private inHouseInstance: InHouseRestAdapter | null = null;

  constructor() {
    const envDriver = (process.env.NEXT_PUBLIC_DB_DRIVER || process.env.DB_DRIVER) as DriverType;
    if (envDriver && ['memory', 'firestore', 'inhouse'].includes(envDriver)) {
      this.activeDriver = envDriver;
    }
  }

  setDriver(driver: DriverType, config?: { firebase?: FirebaseClientConfig; inHouseUrl?: string; inHouseKey?: string }) {
    this.activeDriver = driver;
    if (driver === 'firestore' && config?.firebase) {
      this.firestoreInstance = new FirestoreDatabaseAdapter(config.firebase);
    }
    if (driver === 'inhouse' && config?.inHouseUrl) {
      this.inHouseInstance = new InHouseRestAdapter(config.inHouseUrl, config.inHouseKey);
    }
  }

  getDriverType(): DriverType {
    return this.activeDriver;
  }

  getAdapter(): DatabaseAdapter {
    switch (this.activeDriver) {
      case 'firestore':
        if (!this.firestoreInstance) {
          this.firestoreInstance = new FirestoreDatabaseAdapter();
        }
        return this.firestoreInstance;
      case 'inhouse':
        if (!this.inHouseInstance) {
          this.inHouseInstance = new InHouseRestAdapter();
        }
        return this.inHouseInstance;
      case 'memory':
      default:
        return memoryAdapter;
    }
  }
}

export const dbManager = new DatabaseManager();
export const getDatabase = () => dbManager.getAdapter();
