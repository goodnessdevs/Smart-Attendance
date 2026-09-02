import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toCourseList, type Course } from "../types";

export const courseKeys = {
  all: ["courses"] as const,
  catalogue: () => [...courseKeys.all, "catalogue"] as const,
  registered: () => [...courseKeys.all, "registered"] as const,
  active: () => [...courseKeys.all, "active"] as const,
  lecturerAll: () => [...courseKeys.all, "lecturer"] as const,
  lecturerActive: () => [...courseKeys.all, "lecturer", "active"] as const,
};

/** Every course in the catalogue, for registration screens. */
export function useCourseCatalogue() {
  return useQuery({
    queryKey: courseKeys.catalogue(),
    queryFn: async () => toCourseList((await api.get("/backend/courses")).data),
  });
}

/** Courses this student has registered for. */
export function useRegisteredCourses() {
  return useQuery({
    queryKey: courseKeys.registered(),
    queryFn: async () =>
      toCourseList((await api.get("/backend/all-courses")).data),
  });
}

/** Courses currently open for marking attendance. */
export function useActiveCourses() {
  return useQuery({
    queryKey: courseKeys.active(),
    queryFn: async () =>
      toCourseList((await api.get("/backend/active-courses")).data),
    // Attendance windows open and close during a class, so keep this fresher.
    staleTime: 15_000,
  });
}

export function useRegisterCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) =>
      (await api.post("/backend/register-course", { courseId })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.registered() });
      queryClient.invalidateQueries({ queryKey: courseKeys.active() });
    },
  });
}

/* ---------------------------------- lecturer --------------------------------- */

export function useLecturerCourses() {
  return useQuery({
    queryKey: courseKeys.lecturerAll(),
    queryFn: async () =>
      toCourseList((await api.get("/backend/lecturer-courses")).data),
  });
}

export function useLecturerActiveCourses() {
  return useQuery({
    queryKey: courseKeys.lecturerActive(),
    queryFn: async () =>
      toCourseList((await api.get("/backend/lecturer-active-courses")).data),
    staleTime: 15_000,
  });
}

export function useSelectCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) =>
      (await api.post("/backend/lecturer-select", { courseId })).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: courseKeys.lecturerAll() }),
  });
}

export function usePublishAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) =>
      (await api.post("/backend/publish-attendance", { courseId })).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: courseKeys.all }),
  });
}

export function useEndAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) =>
      (await api.post("/backend/end-attendance", { courseId })).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: courseKeys.all }),
  });
}

/* ----------------------------------- admin ----------------------------------- */

export type CreateCoursePayload = {
  courseId: string;
  courseName: string;
  courseTitle: string;
  courseDescription: string;
  unit: string;
  lecturers: string[];
  venueName: string;
  long: number;
  lat: number;
  courseDays: string[];
  isActive: boolean;
};

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCoursePayload) =>
      (await api.post("/backend/create-course", payload)).data as Course,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: courseKeys.catalogue() }),
  });
}
