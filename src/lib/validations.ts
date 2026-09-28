import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional()
})

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional()
})

export const ideaSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  targetAudience: z.string().optional(),
  contentType: z.string().optional(),
  keywords: z.string().optional(),
  difficulty: z.string().optional(),
  readingTime: z.number().optional(),
  tone: z.string().optional()
})

export const profileSchema = z.object({
  name: z.string().min(1).optional(),
  username: z.string().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  website: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  socialTwitter: z.string().optional().nullable(),
  socialGithub: z.string().optional().nullable(),
  socialLinkedin: z.string().optional().nullable(),
  defaultCategory: z.string().optional().nullable(),
  autoSaveInterval: z.number().int().min(5).max(300).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional()
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PostInput = z.infer<typeof postSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type IdeaInput = z.infer<typeof ideaSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
