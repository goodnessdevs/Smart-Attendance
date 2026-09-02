export type Course = {
  _id: string;
  courseId: string;
  courseName: string;
  courseTitle: string;
  courseDescription?: string;
  unit?: string;
  lecturers?: string[];
  venueName?: string;
  lat?: number;
  long?: number;
  courseDays?: string[];
  isActive?: boolean;
};

/**
 * The API is inconsistent about list shapes: some endpoints return
 * `{ courses: [...] }`, others a bare array. The Vite pages assumed one or the
 * other and crashed on `.filter` / `.map` of undefined when they guessed wrong
 * — with no error boundary, that meant a white screen.
 */
export function toCourseList(payload: unknown): Course[] {
  if (Array.isArray(payload)) return payload as Course[];

  if (payload && typeof payload === "object") {
    const courses = (payload as { courses?: unknown }).courses;
    if (Array.isArray(courses)) return courses as Course[];
  }

  return [];
}

/** Lecturer names are sometimes absent; render something sane either way. */
export function lecturerNames(course: Course): string {
  return Array.isArray(course.lecturers) && course.lecturers.length > 0
    ? course.lecturers.join(", ")
    : "Not assigned";
}

export function courseDayList(course: Course): string {
  return Array.isArray(course.courseDays) && course.courseDays.length > 0
    ? course.courseDays.join(", ")
    : "Not scheduled";
}
