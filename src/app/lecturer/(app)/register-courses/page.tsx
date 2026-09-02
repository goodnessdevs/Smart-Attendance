import type { Metadata } from "next";
import { LecturerCoursesView } from "@/features/courses/components/lecturer-courses-view";

export const metadata: Metadata = {
  title: "Register Courses",
  description: "Choose the courses you teach this semester.",
};

export default function Page() {
  return <LecturerCoursesView />;
}
