"use client";

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
import { useCompleteLecturerOnboarding } from "../api/onboarding-api";
import {
  lecturerOnboardingSchema,
  type LecturerOnboardingValues,
} from "../schema";

export function LecturerOnboarding() {
  const router = useRouter();
  const complete = useCompleteLecturerOnboarding();

  const form = useForm<LecturerOnboardingValues>({
    resolver: zodResolver(lecturerOnboardingSchema),
    defaultValues: { lecturerName: "", college: "", phoneNumber: "" },
  });

  function onSubmit(values: LecturerOnboardingValues) {
    complete.mutate(values, {
      onSuccess: () => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success("You are all set");
        router.replace("/lecturer/dashboard");
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
            A few details before you can publish attendance sessions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="lecturerName">Full name</Label>
              <Input
                id="lecturerName"
                placeholder="Dr. Jane Doe"
                {...form.register("lecturerName")}
              />
              <FieldError message={form.formState.errors.lecturerName?.message} />
            </div>

            <div className="space-y-1.5">
              <Label>College</Label>
              <Select
                value={form.watch("college")}
                onValueChange={(value) =>
                  form.setValue("college", value, { shouldValidate: true })
                }
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
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="08020184215"
                {...form.register("phoneNumber")}
              />
              <FieldError message={form.formState.errors.phoneNumber?.message} />
            </div>

            <Button type="submit" className="w-full" disabled={complete.isPending}>
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
