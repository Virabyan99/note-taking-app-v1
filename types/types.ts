import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  body: z.string(),
  updatedAt: z.number().int(),
});

export type Note = z.infer<typeof noteSchema>;

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  fontSize: z.number().min(12).max(24).default(16),
  fontFamily: z.enum(['system', 'serif', 'mono']).default('system'),
});

export type AppSettings = z.infer<typeof settingsSchema>;