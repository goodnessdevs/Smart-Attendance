import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { toast } from "sonner";
import { X } from "lucide-react";

type Course = {
  id: number;
  code: string;
  title: string;
};

const allCourses: Course[] = [
  { id: 1, code: "MTS101", title: "Introduction to Mathematics" },
  { id: 2, code: "PHS102", title: "General Physics" },
  { id: 3, code: "CHM103", title: "Inorganic Chemistry" },
  { id: 4, code: "CSC104", title: "Intro to Programming" },
  { id: 5, code: "BIO105", title: "Cell Biology" },
  { id: 6, code: "GNS106", title: "English & Communication Skills" },
  { id: 7, code: "ABE204", title: "Workshop Practice" },
  { id: 8, code: "ELE202", title: "Applied Electricity" },
  { id: 9, code: "MTS205", title: "Calculus II" },
];

const SelectCourse = () => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);

  const handleSelect = (course: Course) => {
    const alreadyAdded = selectedCourses.find((c) => c.id === course.id);
    if (alreadyAdded) {
      toast.error("Course already selected");
      return;
    }
    setSelectedCourses((prev) => [...prev, course]);
    toast.success(`${course.code} added`);
    setOpen(false);
  };

  const removeCourse = (id: number) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-2xl px-8 mx-auto py-10 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Add Courses for Attendance</h2>
        <p className="text-muted-foreground">
          Select from the list of available courses to manage attendance.
        </p>
      </div>

      {/* Dropdown Search */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="default" className="w-full justify-start">
            Select courses...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command className="w-full dark:text-white">
            <CommandInput placeholder="Search courses..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Courses">
                {allCourses.map((course) => (
                  <CommandItem
                    key={course.id}
                    value={course.code + " " + course.title}
                    onSelect={() => handleSelect(course)}
                  >
                    <div>
                      <p className="font-medium">{course.code}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.title}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Courses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Selected Courses</h3>
        {selectedCourses.length === 0 ? (
          <p className="text-muted-foreground">No courses selected yet.</p>
        ) : (
          <div className="space-y-2">
            {selectedCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 border rounded-md bg-accent shadow-sm"
              >
                <div>
                  <p className="font-medium">{course.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.title}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCourse(course.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectCourse;
