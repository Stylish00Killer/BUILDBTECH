import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(50),
  password: z.string().min(6)
});

export const labReportSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  content: z.string(),
  data: z.string(),
  createdAt: z.string()
});

export const projectIdeaSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string())
});

export type User = z.infer<typeof userSchema>;
export type LabReport = z.infer<typeof labReportSchema>;
export type ProjectIdea = z.infer<typeof projectIdeaSchema>;
