import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { authKeys } from "@/features/auth/api/auth-api";
import { getDeviceInfo } from "@/lib/device";
import type {
  LecturerOnboardingValues,
  StudentOnboardingValues,
} from "../schema";

/**
 * Both endpoints also receive the device identifiers captured on this browser,
 * which the backend stores so it can later tie a student to one device.
 */
function withDevice<T extends object>(values: T) {
  return getDeviceInfo().then((device) => ({ ...values, ...device }));
}

export function useCompleteStudentOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: StudentOnboardingValues) =>
      (await api.post("/backend/update-profile", await withDevice(values))).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session });
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
  });
}

export function useCompleteLecturerOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: LecturerOnboardingValues) =>
      (await api.post("/backend/update-lecturer", await withDevice(values))).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session });
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
  });
}
