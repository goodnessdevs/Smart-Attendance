import type { Metadata } from "next";
import { RegisterCoursesView } from "@/features/courses/components/register-courses-view";

export const metadata: Metadata = {
  title: "Register Courses",
  description:
    "Register for courses and manage your academic schedule with Smartendance.",
};

export default function Page() {
  return <RegisterCoursesView />;
}
