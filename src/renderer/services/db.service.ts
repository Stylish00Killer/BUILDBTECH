import SQLite from 'better-sqlite3';
import path from 'path';

interface User {
  id: number;
  username: string;
  password: string;
}

interface LabReport {
  id: number;
  userId: number;
  title: string;
  content: string;
  data: string;
  createdAt: string;
}

class DatabaseService {
  private db: SQLite.Database;

  constructor() {
    const dbPath = path.join(process.env.APPDATA || '', 'buildbtech', 'data.db');
    this.db = new SQLite(dbPath);
    this.initializeTables();
  }

  private initializeTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS lab_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        data TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);
  }

  async createUser(username: string, password: string): Promise<User> {
    const stmt = this.db.prepare(
      'INSERT INTO users (username, password) VALUES (?, ?)'
    );
    const result = stmt.run(username, password);
    return {
      id: result.lastInsertRowid as number,
      username,
      password
    };
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | null;
  }

  async saveLabReport(report: Omit<LabReport, 'id' | 'createdAt'>): Promise<LabReport> {
    const stmt = this.db.prepare(
      'INSERT INTO lab_reports (userId, title, content, data) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(report.userId, report.title, report.content, report.data);
    return {
      id: result.lastInsertRowid as number,
      ...report,
      createdAt: new Date().toISOString()
    };
  }

  async getLabReports(userId: number): Promise<LabReport[]> {
    const stmt = this.db.prepare('SELECT * FROM lab_reports WHERE userId = ?');
    return stmt.all(userId) as LabReport[];
  }
}

export const dbService = new DatabaseService();
export const setupDatabase = () => new DatabaseService();
