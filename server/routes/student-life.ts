import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { aiOrchestrator } from "../services/ai-orchestrator";

const router = Router();

// Events
router.get("/events", isAuthenticated, async (req, res) => {
  const events = await storage.getEvents();
  res.json(events);
});

router.post("/events", isAuthenticated, async (req, res) => {
  const event = await storage.createEvent(req.body);
  res.json(event);
});

// Marketplace
router.get("/marketplace", isAuthenticated, async (req, res) => {
  const listings = await storage.getMarketplaceListings();
  res.json(listings);
});

router.post("/marketplace", isAuthenticated, async (req, res) => {
  const listing = await storage.createMarketplaceListing(req.user!.id, req.body);
  res.json(listing);
});

// Study Plans
router.get("/study-plans", isAuthenticated, async (req, res) => {
  const plans = await storage.getStudyPlans(req.user!.id);
  res.json(plans);
});

router.post("/study-plans", isAuthenticated, async (req, res) => {
  const { title, schedule } = req.body;
  const plan = await storage.createStudyPlan(req.user!.id, title, schedule);

  // Use AI to generate personalized study recommendations
  const recommendations = await aiOrchestrator.generateEducationalContent(
    `Generate personalized study recommendations for ${title} with the following schedule:\n${JSON.stringify(schedule)}\n` +
    "Include:\n" +
    "1. Optimal study techniques\n" +
    "2. Break scheduling\n" +
    "3. Review strategies"
  );

  const updatedPlan = await storage.createStudyPlan(req.user!.id, title, {
    ...schedule,
    aiRecommendations: recommendations
  });
  res.json(updatedPlan);
});

// Reminders
router.get("/reminders", isAuthenticated, async (req, res) => {
  const reminders = await storage.getReminders(req.user!.id);
  res.json(reminders);
});

router.post("/reminders", isAuthenticated, async (req, res) => {
  const reminder = await storage.createReminder(req.user!.id, req.body);
  res.json(reminder);
});

export default router;