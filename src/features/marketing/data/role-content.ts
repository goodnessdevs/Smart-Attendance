import type { Role } from "@/features/auth/types";

export type Slide = { title: string; description: string };

export type RoleContent = {
  heading: string;
  description: string;
  loginPath: string;
  buttonText: string;
  slides: Slide[];
};

export const ROLE_CONTENT: Record<Role, RoleContent> = {
  student: {
    heading: "Welcome to Smart Attendance",
    description:
      "Track your classes, mark attendance, and stay connected with your lecturers.",
    loginPath: "/login",
    buttonText: "Sign In",
    slides: [
      {
        title: "Welcome Student",
        description: "Access your courses and track progress.",
      },
      {
        title: "Attendance",
        description: "Mark and review your attendance easily.",
      },
      {
        title: "Updates",
        description:
          "Stay updated with session calendars, dedicated support, and direct messages from lecturers or admins.",
      },
    ],
  },
  lecturer: {
    heading: "Welcome Lecturer",
    description:
      "Manage attendance, oversee your courses, and monitor student engagement in real-time.",
    loginPath: "/lecturer/login",
    buttonText: "Sign In",
    slides: [
      {
        title: "Welcome Lecturer",
        description: "Manage your courses and students.",
      },
      {
        title: "Publish Courses",
        description:
          "Easily publish courses to your students for marking attendance.",
      },
      {
        title: "Track Attendance",
        description: "Monitor student engagement in real-time.",
      },
    ],
  },
  admin: {
    heading: "Welcome Admin",
    description:
      "Oversee the platform, manage courses, and support both lecturers and students.",
    loginPath: "/admin/login",
    buttonText: "Sign In",
    slides: [
      {
        title: "Welcome Admin",
        description: "Oversee the platform at a glance.",
      },
      {
        title: "Manage Courses",
        description: "Create, delete, or update courses for students.",
      },
      {
        title: "Support",
        description: "Provide support for both lecturers and students.",
      },
    ],
  },
};
