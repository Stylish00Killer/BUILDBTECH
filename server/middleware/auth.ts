import { Request, Response, NextFunction } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}

export function isTeacher(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.role === "teacher") {
    return next();
  }
  res.sendStatus(403);
}

export function isStudent(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.role === "student") {
    return next();
  }
  res.sendStatus(403);
}
