import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { courseKeys } from "@/features/courses/api/courses-api";
import {
  toRecordList,
  type AttendanceRecord,
  type StudentAttendanceRecord,
} from "../types";

export const attendanceKeys = {
  all: ["attendance"] as const,
  student: (courseId: string) => [...attendanceKeys.all, "student", courseId] as const,
  class: (courseId: string) => [...attendanceKeys.all, "class", courseId] as const,
};

/** This student's own history for one course. */
export function useStudentAttendance(courseId: string) {
  return useQuery({
    queryKey: attendanceKeys.student(courseId),
    queryFn: async () =>
      toRecordList<StudentAttendanceRecord>(
        (await api.post("/backend/student-attendance", { courseId })).data,
        "records"
      ),
    enabled: Boolean(courseId),
  });
}

/** The full class register, for lecturers. */
export function useClassAttendance(courseId: string) {
  return useQuery({
    queryKey: attendanceKeys.class(courseId),
    queryFn: async () =>
      toRecordList<AttendanceRecord>(
        (await api.post("/backend/attendance", { courseId })).data,
        "records"
      ),
    enabled: Boolean(courseId),
  });
}

export type MarkAttendancePayload = {
  courseId: string;
  courseName: string;
  courseTitle: string;
  venueName: string;
  day: string;
  date: string;
  /** Where the device says it is, so the server can verify the geofence. */
  latitude: number;
  longitude: number;
  accuracy: number;
  device_uuid: string;
  fingerprint: string;

  // ---------------------------------------------------------------------
  // Carried over from the Vite client because the backend contract is not
  // verifiable from this repo and may still require them. They are exactly
  // the fields that make attendance forgeable: a caller can put anyone's
  // name, email or matric number here and assert isPresent.
  //
  // The server should derive all five from the JWT and ignore what is sent.
  // Once it does, delete these and the corresponding lines in the caller.
  // ---------------------------------------------------------------------
  fullName?: string;
  email?: string;
  matricNo?: string;
  isPresent: boolean;
};

/**
 * Marks the current student present.
 *
 * Coordinates are sent so the server can run the geofence check itself. The
 * client-side check is only a UX affordance and can be spoofed with devtools.
 */
export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MarkAttendancePayload) =>
      (await api.post("/backend/mark-attendance", payload)).data,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.student(variables.courseId),
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.active() });
    },
  });
}
