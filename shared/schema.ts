import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["student", "teacher"] }).notNull(),
  fullName: text("full_name").notNull(),
  points: integer("points").default(0),
  created_at: timestamp("created_at").defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirements: jsonb("requirements").notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  badgeId: integer("badge_id").references(() => badges.id),
  earned_at: timestamp("earned_at").defaultNow(),
});

export const labReports = pgTable("lab_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  analysis: text("analysis"),
  feedback: text("feedback"),
  status: text("status", { enum: ["draft", "submitted", "reviewed"] }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  aiSuggestions: text("ai_suggestions"),
  created_at: timestamp("created_at").defaultNow(),
});

export const projectMembers = pgTable("project_members", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  userId: integer("user_id").references(() => users.id),
  role: text("role", { enum: ["leader", "member"] }).notNull(),
});

export const examPrep = pgTable("exam_prep", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  aiAnalysis: text("ai_analysis"),
  created_at: timestamp("created_at").defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: jsonb("content").notNull(),
  aiSuggestions: text("ai_suggestions"),
  created_at: timestamp("created_at").defaultNow(),
});

export const mockInterviews = pgTable("mock_interviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  jobTitle: text("job_title").notNull(),
  feedback: text("feedback"),
  recordingUrl: text("recording_url"),
  created_at: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["hackathon", "internship", "workshop"] }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  created_at: timestamp("created_at").defaultNow(),
});

export const marketplace = pgTable("marketplace", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  category: text("category", { enum: ["books", "electronics", "other"] }).notNull(),
  status: text("status", { enum: ["available", "sold"] }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const studyPlans = pgTable("study_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  schedule: jsonb("schedule").notNull(),
  aiRecommendations: text("ai_recommendations"),
  created_at: timestamp("created_at").defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  type: text("type", { enum: ["assignment", "exam", "other"] }).notNull(),
  status: text("status", { enum: ["pending", "completed"] }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Keep existing tables
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  summary: text("summary"),
  created_at: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Create insert schemas for all tables
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  fullName: true,
});

export const insertLabReportSchema = createInsertSchema(labReports).pick({
  title: true,
  content: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
});

export const insertExamPrepSchema = createInsertSchema(examPrep).pick({
  subject: true,
  content: true,
});

export const insertResumeSchema = createInsertSchema(resumes).pick({
  content: true,
});

export const insertMockInterviewSchema = createInsertSchema(mockInterviews).pick({
  jobTitle: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  type: true,
  startDate: true,
  endDate: true,
  location: true,
});

export const insertMarketplaceSchema = createInsertSchema(marketplace).pick({
  title: true,
  description: true,
  price: true,
  category: true,
});

export const insertStudyPlanSchema = createInsertSchema(studyPlans).pick({
  title: true,
  schedule: true,
});

export const insertReminderSchema = createInsertSchema(reminders).pick({
  title: true,
  description: true,
  dueDate: true,
  type: true,
});

// Export types for all tables
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type LabReport = typeof labReports.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type ExamPrep = typeof examPrep.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type MockInterview = typeof mockInterviews.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Marketplace = typeof marketplace.$inferSelect;
export type StudyPlan = typeof studyPlans.$inferSelect;
export type Reminder = typeof reminders.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;