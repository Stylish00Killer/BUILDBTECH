import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

// Points
router.post("/points", isAuthenticated, async (req, res) => {
  const { points } = req.body;
  const user = await storage.updateUserPoints(req.user!.id, points);
  res.json(user);
});

// Badges
router.get("/badges", isAuthenticated, async (req, res) => {
  const badges = await storage.getUserBadges(req.user!.id);
  res.json(badges);
});

router.post("/badges/:badgeId", isAuthenticated, async (req, res) => {
  const userBadge = await storage.awardBadge(req.user!.id, parseInt(req.params.badgeId));
  res.json(userBadge);
});

export default router;
