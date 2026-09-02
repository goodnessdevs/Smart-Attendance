import type { Metadata } from "next";
import { MyCoursesView } from "@/features/courses/components/my-courses-view";

export const metadata: Metadata = {
  title: "My Courses",
  description: "The courses you have registered for this semester.",
};

export default function Page() {
  return <MyCoursesView />;
}
