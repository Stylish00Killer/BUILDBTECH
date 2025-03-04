import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { User, LabReport } from '../../shared/types';

interface BuildBTechDB extends DBSchema {
  users: {
    key: number;
    value: User;
    indexes: { 'by-username': string };
  };
  lab_reports: {
    key: number;
    value: LabReport;
    indexes: { 'by-userId': number };
  };
}

class StorageService {
  private dbPromise: Promise<IDBPDatabase<BuildBTechDB>>;

  constructor() {
    this.dbPromise = openDB<BuildBTechDB>('buildbtech-db', 1, {
      upgrade(db) {
        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          userStore.createIndex('by-username', 'username', { unique: true });
        }

        // Lab reports store
        if (!db.objectStoreNames.contains('lab_reports')) {
          const reportStore = db.createObjectStore('lab_reports', {
            keyPath: 'id',
            autoIncrement: true
          });
          reportStore.createIndex('by-userId', 'userId');
        }
      },
    });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await this.dbPromise;
    return db.getFromIndex('users', 'by-username', username);
  }

  async createUser(username: string, password: string): Promise<User> {
    const db = await this.dbPromise;
    const id = await db.add('users', {
      username,
      password,
      id: 0 // Will be auto-incremented
    });

    return {
      id: id as number,
      username,
      password
    };
  }

  async getLabReports(userId: number): Promise<LabReport[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('lab_reports', 'by-userId', userId);
  }

  async saveLabReport(report: Omit<LabReport, 'id' | 'createdAt'>): Promise<LabReport> {
    const db = await this.dbPromise;
    const id = await db.add('lab_reports', {
      ...report,
      id: 0, // Will be auto-incremented
      createdAt: new Date().toISOString()
    });

    return {
      id: id as number,
      ...report,
      createdAt: new Date().toISOString()
    };
  }
}

export const storage = new StorageService();