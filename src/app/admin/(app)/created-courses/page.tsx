import type { Metadata } from "next";
import { CreatedCoursesView } from "@/features/courses/components/created-courses-view";

export const metadata: Metadata = {
  title: "Created Courses",
  description: "Every course currently published on the platform.",
};

export default function Page() {
  return <CreatedCoursesView />;
}
