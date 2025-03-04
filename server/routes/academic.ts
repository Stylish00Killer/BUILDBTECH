import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { aiOrchestrator } from "../services/ai-orchestrator";

const router = Router();

// Lab Reports
router.get("/lab-reports", isAuthenticated, async (req, res) => {
  const reports = await storage.getLabReports(req.user!.id);
  res.json(reports);
});

router.post("/lab-reports", isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const report = await storage.createLabReport(req.user!.id, title, content);

  // Use AI to analyze the lab report
  const analysis = await aiOrchestrator.analyzeLabReport(content);
  const updatedReport = await storage.updateLabReportAnalysis(report.id, analysis);
  res.json(updatedReport);
});

// Projects
router.get("/projects", isAuthenticated, async (req, res) => {
  const projects = await storage.getProjects();
  res.json(projects);
});

router.post("/projects", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const project = await storage.createProject(title, description);

  // Add creator as project leader
  await storage.addProjectMember(project.id, req.user!.id, "leader");
  res.json(project);
});

router.post("/projects/:id/members", isAuthenticated, async (req, res) => {
  const { userId, role } = req.body;
  const member = await storage.addProjectMember(parseInt(req.params.id), userId, role);
  res.json(member);
});

// Exam Prep
router.get("/exam-prep", isAuthenticated, async (req, res) => {
  const preps = await storage.getExamPrep(req.user!.id);
  res.json(preps);
});

router.post("/exam-prep", isAuthenticated, async (req, res) => {
  const { subject, content } = req.body;
  const prep = await storage.createExamPrep(req.user!.id, subject, content);

  // Use AI to provide learning recommendations
  const analysis = await aiOrchestrator.provideLearningRecommendations(subject, content);
  const updatedPrep = await storage.updateExamPrepAnalysis(prep.id, analysis);
  res.json(updatedPrep);
});

export default router;