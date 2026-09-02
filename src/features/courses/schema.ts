import { z } from "zod";

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export const createCourseSchema = z.object({
  courseName: z.string().trim().min(1, "Course code is required"),
  courseTitle: z.string().trim().min(1, "Course title is required"),
  courseId: z.string().trim().min(1, "Course ID is required"),
  courseDescription: z.string().trim().min(1, "A short description is required"),
  unit: z
    .string()
    .trim()
    .min(1, "Units are required")
    .refine((value) => Number(value) > 0, "Units must be a positive number"),
  venueName: z.string().trim().min(1, "Pick a venue"),
  lecturers: z
    .array(z.string().trim())
    .transform((names) => names.filter((name) => name.length > 0))
    .pipe(z.array(z.string()).min(1, "Add at least one lecturer")),
  courseDays: z.array(z.string()).min(1, "Pick at least one day"),
});

export type CreateCourseValues = z.input<typeof createCourseSchema>;
export type CreateCourseParsed = z.output<typeof createCourseSchema>;
