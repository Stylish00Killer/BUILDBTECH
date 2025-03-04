import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import academicRoutes from "./routes/academic";
import careerRoutes from "./routes/career";
import studentLifeRoutes from "./routes/student-life";
import gamificationRoutes from "./routes/gamification";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Register feature-specific routes
  app.use("/api/academic", academicRoutes);
  app.use("/api/career", careerRoutes);
  app.use("/api/student-life", studentLifeRoutes);
  app.use("/api/gamification", gamificationRoutes);

  // Keep existing notes and quizzes endpoints
  app.get("/api/notes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const notes = await storage.getNotes(req.user.id);
    res.json(notes);
  });

  app.post("/api/notes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const note = await storage.createNote(req.user.id, req.body.content);
    res.json(note);
  });

  app.post("/api/notes/:id/summarize", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    // Mock AI summarization with a more sophisticated approach
    const content = req.body.content;
    const sentences = content.split(/[.!?]+/).filter(Boolean);
    const keyPoints = sentences.slice(0, 3).join('. '); // Take first 3 sentences
    const summary = `Key points: ${keyPoints}${sentences.length > 3 ? '...' : ''}`;

    const note = await storage.summarizeNote(parseInt(req.params.id), summary);
    res.json(note);
  });

  // Quiz endpoints
  app.get("/api/quizzes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "teacher") return res.sendStatus(403);
    const quizzes = await storage.getQuizzes(req.user.id);
    res.json(quizzes);
  });

  app.post("/api/quizzes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "teacher") return res.sendStatus(403);

    // Mock AI quiz generation with a template-based approach
    const { title, content } = req.body;
    const paragraphs = content.split('\n').filter(Boolean);

    // Generate a structured quiz from the content
    const formattedContent = paragraphs.map((paragraph, index) => {
      const words = paragraph.split(' ');
      const question = `Question ${index + 1}: What is the main concept discussed in: "${words.slice(0, 5).join(' ')}..."?`;
      return question;
    }).join('\n\n');

    const quiz = await storage.createQuiz(
      req.user.id,
      title,
      formattedContent
    );
    res.json(quiz);
  });

  const httpServer = createServer(app);
  return httpServer;
}