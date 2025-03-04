import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { aiOrchestrator } from "../services/ai-orchestrator";

const router = Router();

// Resumes
router.get("/resumes", isAuthenticated, async (req, res) => {
  const resume = await storage.getResume(req.user!.id);
  res.json(resume);
});

router.post("/resumes", isAuthenticated, async (req, res) => {
  const { content } = req.body;
  const resume = await storage.createResume(req.user!.id, content);

  // Generate AI suggestions for resume improvement
  const suggestions = await aiOrchestrator.generateEducationalContent(
    `Analyze this resume and provide detailed improvement suggestions:\n${JSON.stringify(content)}`
  );

  const updatedResume = await storage.createResume(req.user!.id, {
    ...content,
    aiSuggestions: suggestions
  });
  res.json(updatedResume);
});

// Mock Interviews
router.get("/mock-interviews", isAuthenticated, async (req, res) => {
  const interviews = await storage.getMockInterviews(req.user!.id);
  res.json(interviews);
});

router.post("/mock-interviews", isAuthenticated, async (req, res) => {
  const { jobTitle } = req.body;
  const interview = await storage.createMockInterview(req.user!.id, jobTitle);

  // Generate AI feedback for the mock interview
  const feedback = await aiOrchestrator.generateEducationalContent(
    `Generate detailed interview feedback and improvement suggestions for a ${jobTitle} position interview, including:\n` +
    "1. Communication skills assessment\n" +
    "2. Technical knowledge evaluation\n" +
    "3. Problem-solving approach analysis\n" +
    "4. Specific improvement recommendations"
  );

  const updatedInterview = await storage.createMockInterview(req.user!.id, {
    ...interview,
    feedback
  });
  res.json(updatedInterview);
});

export default router;