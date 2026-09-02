"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  Check,
  ChevronsUpDown,
  Loader2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PageHeader, PageShell } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { cn } from "@/lib/utils";
import { venues } from "@/config/venues";
import { useCourseCatalogue, useCreateCourse } from "../../courses/api/courses-api";
import {
  createCourseSchema,
  WEEKDAYS,
  type CreateCourseValues,
} from "../../courses/schema";

const EMPTY_FORM: CreateCourseValues = {
  courseName: "",
  courseTitle: "",
  courseId: "",
  courseDescription: "",
  unit: "",
  venueName: "",
  lecturers: [""],
  courseDays: [],
};

export function AdminDashboard() {
  const catalogue = useCourseCatalogue();
  const createCourse = useCreateCourse();
  const [venueOpen, setVenueOpen] = useState(false);

  const form = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: EMPTY_FORM,
  });

  // `lecturers` and `courseDays` are plain string arrays rather than object
  // arrays, so they are managed through form values directly instead of
  // useFieldArray.
  const lecturers = form.watch("lecturers");
  const courseDays = form.watch("courseDays");
  const venueName = form.watch("venueName");

  function onSubmit(values: CreateCourseValues) {
    const venue = venues.find((item) => item.venueName === values.venueName);

    createCourse.mutate(
      {
        courseId: values.courseId.trim(),
        courseName: values.courseName.trim(),
        courseTitle: values.courseTitle.trim(),
        courseDescription: values.courseDescription.trim(),
        unit: values.unit.trim(),
        venueName: values.venueName,
        // Coordinates come from the venue list rather than free-text entry.
        lat: venue?.lat ?? 0,
        long: venue?.long ?? 0,
        lecturers: values.lecturers.filter((name) => name.trim().length > 0),
        courseDays: values.courseDays,
        isActive: false,
      },
      {
        onSuccess: () => {
          toast.success("Course created");
          form.reset(EMPTY_FORM);
        },
        onError: () => toast.error("Could not create the course."),
      }
    );
  }

  return (
    <PageShell width="wide">
      <PageHeader
        title="Admin"
        description="Create and manage the courses available to lecturers and students."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Was hard-coded to 12 in the Vite dashboard and only ever incremented
            locally, so the number shown was fiction. */}
        <StatCard
          label="Total courses"
          value={catalogue.isLoading ? "--" : (catalogue.data ?? []).length}
          hint="Published on the platform"
          icon={BookOpen}
        />
        <StatCard
          label="Venues"
          value={venues.length}
          hint="Available for scheduling"
          icon={MapPin}
        />
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-primary" />
            Create a course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Course code"
                error={form.formState.errors.courseName?.message}
              >
                <Input placeholder="CSC 301" {...form.register("courseName")} />
              </Field>
              <Field
                label="Course title"
                error={form.formState.errors.courseTitle?.message}
              >
                <Input
                  placeholder="Introduction to Computer Science"
                  {...form.register("courseTitle")}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Course ID"
                error={form.formState.errors.courseId?.message}
              >
                <Input placeholder="csc301_MAH" {...form.register("courseId")} />
              </Field>
              <Field label="Units" error={form.formState.errors.unit?.message}>
                <Input
                  type="number"
                  min={1}
                  placeholder="3"
                  {...form.register("unit")}
                />
              </Field>
            </div>

            <Field
              label="Description"
              error={form.formState.errors.courseDescription?.message}
            >
              <Textarea
                rows={3}
                placeholder="What this course covers"
                {...form.register("courseDescription")}
              />
            </Field>

            <Field label="Venue" error={form.formState.errors.venueName?.message}>
              <Popover open={venueOpen} onOpenChange={setVenueOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={venueOpen}
                    className="w-full justify-between font-normal"
                  >
                    {venueName || "Select a venue"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search venues..." />
                    <CommandList>
                      <CommandEmpty>No venue found.</CommandEmpty>
                      {venues.map((venue) => (
                        <CommandItem
                          key={venue.venueName}
                          value={venue.venueName}
                          onSelect={() => {
                            form.setValue("venueName", venue.venueName, {
                              shouldValidate: true,
                            });
                            setVenueOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              venueName === venue.venueName
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {venue.venueName}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </Field>

            <Field
              label="Class days"
              error={form.formState.errors.courseDays?.message}
            >
              <div className="flex flex-wrap gap-3 pt-1">
                {WEEKDAYS.map((day) => (
                  <label
                    key={day}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <Checkbox
                      checked={courseDays.includes(day)}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "courseDays",
                          checked
                            ? [...courseDays, day]
                            : courseDays.filter((value) => value !== day),
                          { shouldValidate: true }
                        )
                      }
                    />
                    {day}
                  </label>
                ))}
              </div>
            </Field>

            <Field
              label="Lecturers"
              error={
                form.formState.errors.lecturers?.message ??
                form.formState.errors.lecturers?.root?.message
              }
            >
              <div className="space-y-2">
                {lecturers.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Dr. Jane Doe"
                      {...form.register(`lecturers.${index}` as const)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove lecturer"
                      disabled={lecturers.length === 1}
                      onClick={() =>
                        form.setValue(
                          "lecturers",
                          lecturers.filter((_, i) => i !== index),
                          { shouldValidate: true }
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    form.setValue("lecturers", [...lecturers, ""])
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add lecturer
                </Button>
              </div>
            </Field>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={createCourse.isPending} className="gap-2">
                {createCourse.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create course
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset(EMPTY_FORM)}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
