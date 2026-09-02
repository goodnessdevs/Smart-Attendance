"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colleges } from "@/config/colleges";
import { useCompleteStudentOnboarding } from "../api/onboarding-api";
import {
  LEVELS,
  studentOnboardingSchema,
  type StudentOnboardingValues,
} from "../schema";

export function StudentOnboarding() {
  const router = useRouter();
  const complete = useCompleteStudentOnboarding();

  const form = useForm<StudentOnboardingValues>({
    resolver: zodResolver(studentOnboardingSchema),
    defaultValues: {
      matricNumber: "",
      college: "",
      department: "",
      level: "",
      phoneNumber: "",
    },
  });

  const college = form.watch("college");
  const departments = useMemo(
    () => colleges.find((item) => item.value === college)?.departments ?? [],
    [college]
  );

  function onSubmit(values: StudentOnboardingValues) {
    complete.mutate(values, {
      onSuccess: () => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success("You are all set");
        router.replace("/dashboard");
        router.refresh();
      },
      onError: () =>
        toast.error("Could not save your details. Please try again."),
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="mb-6 flex items-center gap-2.5">
        <Image
          src="/funaab.png"
          alt=""
          width={40}
          height={40}
          className="object-contain"
          priority
        />
        <span className="font-semibold">Smart Attendance</span>
      </div>

      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle>Complete your profile</CardTitle>
          <CardDescription>
            We need a few details before you can start marking attendance.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="matricNumber">Matric number</Label>
              <Input
                id="matricNumber"
                placeholder="20184215"
                {...form.register("matricNumber")}
              />
              <FieldError message={form.formState.errors.matricNumber?.message} />
            </div>

            <div className="space-y-1.5">
              <Label>College</Label>
              <Select
                value={college}
                onValueChange={(value) => {
                  form.setValue("college", value, { shouldValidate: true });
                  // Departments are scoped to the college, so clear the stale one.
                  form.setValue("department", "");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={form.formState.errors.college?.message} />
            </div>

            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select
                value={form.watch("department")}
                onValueChange={(value) =>
                  form.setValue("department", value, { shouldValidate: true })
                }
                disabled={!college}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      college ? "Select your department" : "Select a college first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.value} value={department.value}>
                      {department.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={form.formState.errors.department?.message} />
            </div>

            <div className="space-y-1.5">
              <Label>Level</Label>
              <Select
                value={form.watch("level")}
                onValueChange={(value) =>
                  form.setValue("level", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={form.formState.errors.level?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="08020184215"
                {...form.register("phoneNumber")}
              />
              <FieldError message={form.formState.errors.phoneNumber?.message} />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={complete.isPending}
            >
              {complete.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Finish setup"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}
