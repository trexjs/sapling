import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

const objectId = z
  .string({ required_error: 'Identifier is required' })
  .regex(objectIdRegex, 'Invalid identifier format');

const sectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  image: z.string().url().optional().or(z.literal('')),
  video: z.string().url().optional().or(z.literal('')),
  pdf: z.string().url().optional().or(z.literal('')),
  duration: z.number().int().nonnegative().optional().default(0),
  status: z.enum(['published', 'draft', 'unpublish']).optional().default('draft'),
});

const chapterSchema = z.object({
  title: z.string().min(1, 'Chapter title is required'),
  description: z.string().optional().default(''),
  order: z.number().int().nonnegative().optional(),
  sections: z.array(sectionSchema).optional().default([]),
});

export const courseCreateSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters'),
  description: z.string().min(10, 'Course description must be at least 10 characters'),
  prerequisites: z.array(z.string().min(1)).optional().default([]),
  image: z.string().url().optional().or(z.literal('')),
  price: z.number().nonnegative().optional().default(0),
  discount: z.number().min(0).max(100).optional().default(0),
  duration: z.number().nonnegative().optional().default(0),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional().default(''),
  tags: z.array(z.string().min(1)).optional().default([]),
  instructors: z.array(objectId).optional().default([]),
  status: z.enum(['published', 'draft', 'unpublish']).optional().default('draft'),
  chapters: z.array(chapterSchema).optional().default([]),
});

export const courseUpdateSchema = courseCreateSchema.partial();

export const courseStatusSchema = z.object({
  status: z.enum(['published', 'draft', 'unpublish']),
});

export const courseEnrollSchema = z.object({
  studentId: objectId.optional(),
});

export const chapterCreateSchema = chapterSchema;

export const chapterUpdateSchema = chapterSchema.partial();

export const sectionCreateSchema = sectionSchema;

export const sectionUpdateSchema = sectionSchema.partial();

export const sectionIdParamSchema = z.object({
  chapterId: objectId,
  sectionId: objectId.optional(),
});
