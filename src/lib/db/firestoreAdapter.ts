import { DatabaseAdapter, Indicator } from './types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Firestore
} from 'firebase/firestore';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export class FirestoreDatabaseAdapter implements DatabaseAdapter {
  name = 'Google Cloud Firestore';
  private db: Firestore | null = null;
  private collectionName = 'suncasa_indicators';

  constructor(config?: FirebaseClientConfig) {
    if (config && config.apiKey && config.projectId) {
      this.init(config);
    }
  }

  init(config: FirebaseClientConfig) {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    this.db = getFirestore(app);
  }

  private ensureDb(): Firestore {
    if (!this.db) {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCRN8CxDvVGh8n83C3k3kFvFLl-wSXnuro";
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nbs-project-7deac";
      if (apiKey && projectId) {
        this.init({
          apiKey,
          authDomain: `${projectId}.firebaseapp.com`,
          projectId,
          storageBucket: `${projectId}.firebasestorage.app`
        });
      }
    }
    if (!this.db) {
      throw new Error('Firestore is not configured. Please supply Firebase credentials.');
    }
    return this.db;
  }

  async getIndicators(): Promise<Indicator[]> {
    const db = this.ensureDb();
    const snap = await getDocs(collection(db, this.collectionName));
    return snap.docs.map(d => ({ ...(d.data() as Indicator), id: d.id }));
  }

  async getIndicatorById(id: string): Promise<Indicator | null> {
    const db = this.ensureDb();
    const docRef = doc(db, this.collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { ...(snap.data() as Indicator), id: snap.id };
  }

  async createIndicator(indicator: Indicator): Promise<Indicator> {
    const db = this.ensureDb();
    const docRef = doc(db, this.collectionName, indicator.id);
    await setDoc(docRef, indicator);
    return indicator;
  }

  async updateIndicator(id: string, updates: Partial<Indicator>): Promise<Indicator | null> {
    const db = this.ensureDb();
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, updates);
    return this.getIndicatorById(id);
  }

  async deleteIndicator(id: string): Promise<boolean> {
    const db = this.ensureDb();
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
    return true;
  }
}
