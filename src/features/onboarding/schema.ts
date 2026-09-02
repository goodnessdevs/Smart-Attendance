import { z } from "zod";

const phoneNumber = z
  .string()
  .trim()
  .min(10, "Enter a valid phone number")
  .max(15, "Enter a valid phone number")
  .regex(/^[0-9+\s-]+$/, "Phone number can only contain digits");

export const studentOnboardingSchema = z.object({
  matricNumber: z.string().trim().min(1, "Matric number is required"),
  college: z.string().trim().min(1, "Select your college"),
  department: z.string().trim().min(1, "Select your department"),
  level: z.string().trim().min(1, "Select your level"),
  phoneNumber,
});

export const lecturerOnboardingSchema = z.object({
  lecturerName: z.string().trim().min(1, "Your full name is required"),
  college: z.string().trim().min(1, "Select your college"),
  phoneNumber,
});

export type StudentOnboardingValues = z.infer<typeof studentOnboardingSchema>;
export type LecturerOnboardingValues = z.infer<typeof lecturerOnboardingSchema>;

export const LEVELS = ["100", "200", "300", "400", "500", "600"] as const;
