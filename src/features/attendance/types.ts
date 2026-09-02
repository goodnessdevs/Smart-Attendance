/** One row of a lecturer's class register. */
export type AttendanceRecord = {
  fullName: string;
  email: string;
  matricNo: string;
  isPresent: boolean;
  date: string;
};

/** One row of a student's own attendance history for a course. */
export type StudentAttendanceRecord = {
  courseName: string;
  courseTitle: string;
  venueName: string;
  isPresent: boolean;
  date: string;
};

/**
 * As with courses, attendance endpoints disagree on shape: `/attendance`
 * returns a bare array while `/student-attendance` returns `{ records: [...] }`.
 */
export function toRecordList<T>(payload: unknown, key: string): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const value = (payload as Record<string, unknown>)[key];
    if (Array.isArray(value)) return value as T[];
  }

  return [];
}
