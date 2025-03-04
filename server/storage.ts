import { User, Note, Quiz, InsertUser, LabReport, Project, ExamPrep, Resume, 
  MockInterview, Event, Marketplace, StudyPlan, Reminder, Badge, UserBadge,
  ProjectMember } from "@shared/schema";
import session from "express-session";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, notes, quizzes, labReports, projects, examPrep, resumes,
  mockInterviews, events, marketplace, studyPlans, reminders, badges,
  userBadges, projectMembers } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import postgres from "postgres";
import connectPgSimple from "connect-pg-simple";

const PostgresStore = connectPgSimple(session);
const client = postgres(process.env.DATABASE_URL!);

export interface IStorage {
  // Existing methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getNotes(userId: number): Promise<Note[]>;
  createNote(userId: number, content: string): Promise<Note>;
  summarizeNote(noteId: number, summary: string): Promise<Note>;
  getQuizzes(teacherId: number): Promise<Quiz[]>;
  createQuiz(teacherId: number, title: string, content: string): Promise<Quiz>;

  // Lab Reports
  createLabReport(userId: number, title: string, content: string): Promise<LabReport>;
  getLabReports(userId: number): Promise<LabReport[]>;
  updateLabReportAnalysis(reportId: number, analysis: string): Promise<LabReport>;

  // Projects
  createProject(title: string, description: string): Promise<Project>;
  getProjects(): Promise<Project[]>;
  addProjectMember(projectId: number, userId: number, role: "leader" | "member"): Promise<ProjectMember>;

  // Exam Prep
  createExamPrep(userId: number, subject: string, content: string): Promise<ExamPrep>;
  getExamPrep(userId: number): Promise<ExamPrep[]>;
  updateExamPrepAnalysis(prepId: number, analysis: string): Promise<ExamPrep>;

  // Career Support
  createResume(userId: number, content: any): Promise<Resume>;
  getResume(userId: number): Promise<Resume | undefined>;
  createMockInterview(userId: number, jobTitle: string): Promise<MockInterview>;
  getMockInterviews(userId: number): Promise<MockInterview[]>;

  // Events and Marketplace
  createEvent(eventData: Partial<Event>): Promise<Event>;
  getEvents(): Promise<Event[]>;
  createMarketplaceListing(userId: number, listingData: Partial<Marketplace>): Promise<Marketplace>;
  getMarketplaceListings(): Promise<Marketplace[]>;

  // Study Management
  createStudyPlan(userId: number, title: string, schedule: any): Promise<StudyPlan>;
  getStudyPlans(userId: number): Promise<StudyPlan[]>;
  createReminder(userId: number, reminder: Partial<Reminder>): Promise<Reminder>;
  getReminders(userId: number): Promise<Reminder[]>;

  // Gamification
  updateUserPoints(userId: number, pointsToAdd: number): Promise<User>;
  getUserBadges(userId: number): Promise<Badge[]>;
  awardBadge(userId: number, badgeId: number): Promise<UserBadge>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  private db;
  sessionStore: session.Store;

  constructor() {
    this.db = drizzle(client);
    this.sessionStore = new PostgresStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  // Existing methods implementation
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getNotes(userId: number): Promise<Note[]> {
    return await this.db.select().from(notes).where(eq(notes.userId, userId));
  }

  async createNote(userId: number, content: string): Promise<Note> {
    const result = await this.db.insert(notes).values({
      userId,
      content,
      summary: null,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async summarizeNote(noteId: number, summary: string): Promise<Note> {
    const result = await this.db
      .update(notes)
      .set({ summary })
      .where(eq(notes.id, noteId))
      .returning();
    return result[0];
  }

  async getQuizzes(teacherId: number): Promise<Quiz[]> {
    return await this.db.select().from(quizzes).where(eq(quizzes.teacherId, teacherId));
  }

  async createQuiz(teacherId: number, title: string, content: string): Promise<Quiz> {
    const result = await this.db.insert(quizzes).values({
      teacherId,
      title,
      content,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  // Lab Reports
  async createLabReport(userId: number, title: string, content: string): Promise<LabReport> {
    const result = await this.db.insert(labReports).values({
      userId,
      title,
      content,
      status: "draft",
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getLabReports(userId: number): Promise<LabReport[]> {
    return await this.db.select().from(labReports).where(eq(labReports.userId, userId));
  }

  async updateLabReportAnalysis(reportId: number, analysis: string): Promise<LabReport> {
    const result = await this.db
      .update(labReports)
      .set({ analysis })
      .where(eq(labReports.id, reportId))
      .returning();
    return result[0];
  }

  // Projects
  async createProject(title: string, description: string): Promise<Project> {
    const result = await this.db.insert(projects).values({
      title,
      description,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getProjects(): Promise<Project[]> {
    return await this.db.select().from(projects);
  }

  async addProjectMember(projectId: number, userId: number, role: "leader" | "member"): Promise<ProjectMember> {
    const result = await this.db.insert(projectMembers).values({
      projectId,
      userId,
      role,
    }).returning();
    return result[0];
  }

  // Exam Prep
  async createExamPrep(userId: number, subject: string, content: string): Promise<ExamPrep> {
    const result = await this.db.insert(examPrep).values({
      userId,
      subject,
      content,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getExamPrep(userId: number): Promise<ExamPrep[]> {
    return await this.db.select().from(examPrep).where(eq(examPrep.userId, userId));
  }

  async updateExamPrepAnalysis(prepId: number, analysis: string): Promise<ExamPrep> {
    const result = await this.db
      .update(examPrep)
      .set({ aiAnalysis: analysis })
      .where(eq(examPrep.id, prepId))
      .returning();
    return result[0];
  }

  // Career Support
  async createResume(userId: number, content: any): Promise<Resume> {
    const result = await this.db.insert(resumes).values({
      userId,
      content,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getResume(userId: number): Promise<Resume | undefined> {
    const result = await this.db.select().from(resumes).where(eq(resumes.userId, userId));
    return result[0];
  }

  async createMockInterview(userId: number, jobTitle: string): Promise<MockInterview> {
    const result = await this.db.insert(mockInterviews).values({
      userId,
      jobTitle,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getMockInterviews(userId: number): Promise<MockInterview[]> {
    return await this.db.select().from(mockInterviews).where(eq(mockInterviews.userId, userId));
  }

  // Events and Marketplace
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const { title, description, type, startDate, endDate, location } = eventData;
    const result = await this.db.insert(events).values({
      title: title!,
      description: description!,
      type: type!,
      startDate: startDate!,
      endDate: endDate!,
      location,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getEvents(): Promise<Event[]> {
    return await this.db.select().from(events);
  }

  async createMarketplaceListing(userId: number, listingData: Partial<Marketplace>): Promise<Marketplace> {
    const { title, description, price, category } = listingData;
    const result = await this.db.insert(marketplace).values({
      title: title!,
      description: description!,
      price: price!,
      category: category!,
      userId,
      status: "available",
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getMarketplaceListings(): Promise<Marketplace[]> {
    return await this.db.select().from(marketplace);
  }

  // Study Management
  async createStudyPlan(userId: number, title: string, schedule: any): Promise<StudyPlan> {
    const result = await this.db.insert(studyPlans).values({
      userId,
      title,
      schedule,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getStudyPlans(userId: number): Promise<StudyPlan[]> {
    return await this.db.select().from(studyPlans).where(eq(studyPlans.userId, userId));
  }

  async createReminder(userId: number, reminder: Partial<Reminder>): Promise<Reminder> {
    const result = await this.db.insert(reminders).values({
      ...reminder,
      userId,
      status: "pending",
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getReminders(userId: number): Promise<Reminder[]> {
    return await this.db.select().from(reminders).where(eq(reminders.userId, userId));
  }

  // Gamification
  async updateUserPoints(userId: number, pointsToAdd: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const result = await this.db
      .update(users)
      .set({ points: (user.points || 0) + pointsToAdd })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async getUserBadges(userId: number): Promise<Badge[]> {
    const userBadgesList = await this.db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId));

    if (!userBadgesList.length) return [];

    const badgeIds = userBadgesList.map(ub => ub.badgeId);
    return await this.db
      .select()
      .from(badges)
      .where(and(eq(badges.id, badgeIds))); // Using first badge for now, will implement proper join later

  }

  async awardBadge(userId: number, badgeId: number): Promise<UserBadge> {
    const result = await this.db.insert(userBadges).values({
      userId,
      badgeId,
      earnedAt: new Date(),
    }).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();