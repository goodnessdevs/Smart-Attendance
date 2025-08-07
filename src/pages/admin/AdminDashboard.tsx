// import { useState } from "react";
// import { Button } from "../../components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "../../components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "../../components/ui/popover";
// import { toast } from "sonner";
// import { X } from "lucide-react";

// type Course = {
//   id: number;
//   code: string;
//   title: string;
// };

// const allCourses: Course[] = [
//   { id: 1, code: "MTS101", title: "Introduction to Mathematics" },
//   { id: 2, code: "PHS102", title: "General Physics" },
//   { id: 3, code: "CHM103", title: "Inorganic Chemistry" },
//   { id: 4, code: "CSC104", title: "Intro to Programming" },
//   { id: 5, code: "BIO105", title: "Cell Biology" },
//   { id: 6, code: "GNS106", title: "English & Communication Skills" },
//   { id: 7, code: "ABE204", title: "Workshop Practice" },
//   { id: 8, code: "ELE202", title: "Applied Electricity" },
//   { id: 9, code: "MTS205", title: "Calculus II" },
// ];

// const SelectCourse = () => {
//   const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
//   const [open, setOpen] = useState(false);

//   const handleSelect = (course: Course) => {
//     const alreadyAdded = selectedCourses.find((c) => c.id === course.id);
//     if (alreadyAdded) {
//       toast.error("Course already selected");
//       return;
//     }
//     setSelectedCourses((prev) => [...prev, course]);
//     toast.success(`${course.code} added`);
//     setOpen(false);
//   };

//   const removeCourse = (id: number) => {
//     setSelectedCourses((prev) => prev.filter((c) => c.id !== id));
//   };

//   return (
//     <div className="max-w-2xl px-8 mx-auto py-10 space-y-8">
//       <div className="space-y-2">
//         <h2 className="text-2xl font-bold">Add Courses for Attendance</h2>
//         <p className="text-muted-foreground">
//           Select from the list of available courses to manage attendance.
//         </p>
//       </div>

//       {/* Dropdown Search */}
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button variant="default" className="w-full justify-start">
//             Select courses...
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-[300px] p-0">
//           <Command className="w-full dark:text-white">
//             <CommandInput placeholder="Search courses..." />
//             <CommandList>
//               <CommandEmpty>No results found.</CommandEmpty>
//               <CommandGroup heading="Courses">
//                 {allCourses.map((course) => (
//                   <CommandItem
//                     key={course.id}
//                     value={course.code + " " + course.title}
//                     onSelect={() => handleSelect(course)}
//                   >
//                     <div>
//                       <p className="font-medium">{course.code}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {course.title}
//                       </p>
//                     </div>
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>

//       {/* Selected Courses */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Selected Courses</h3>
//         {selectedCourses.length === 0 ? (
//           <p className="text-muted-foreground">No courses selected yet.</p>
//         ) : (
//           <div className="space-y-2">
//             {selectedCourses.map((course) => (
//               <div
//                 key={course.id}
//                 className="flex items-center justify-between p-3 border rounded-md bg-accent shadow-sm"
//               >
//                 <div>
//                   <p className="font-medium">{course.code}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {course.title}
//                   </p>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeCourse(course.id)}
//                 >
//                   <X className="w-4 h-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SelectCourse;

'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Button,
} from '../../components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'

type Course = {
  id: string
  code: string
  title: string
}

type Attendance = {
  name: string
  matricNo: string
  date: string
  time: string
}

// Sample list of all available courses
const allCourses: Course[] = [
  { id: 'mts101', code: 'MTS101', title: 'Introduction to Mathematics' },
  { id: 'phs102', code: 'PHS102', title: 'General Physics' },
  { id: 'chm103', code: 'CHM103', title: 'Inorganic Chemistry' },
  { id: 'csc104', code: 'CSC104', title: 'Intro to Programming' },
  { id: 'bio105', code: 'BIO105', title: 'Cell Biology' },
  { id: 'gns106', code: 'GNS106', title: 'English & Communication Skills' },
  { id: 'abe204', code: 'ABE204', title: 'Workshop Practice' },
  { id: 'ele202', code: 'ELE202', title: 'Applied Electricity' },
  { id: 'mts205', code: 'MTS205', title: 'Calculus II' },
]

// Simulated student attendance records
const mockAttendance: Record<string, Attendance[]> = {
  csc104: [
    { name: 'John Doe', matricNo: 'CSC/20/001', date: '2025-08-07', time: '08:15 AM' },
    { name: 'Jane Smith', matricNo: 'CSC/20/002', date: '2025-08-07', time: '08:17 AM' },
  ],
  mts101: [
    { name: 'Alice Brown', matricNo: 'MTS/20/003', date: '2025-08-07', time: '09:05 AM' },
  ],
}

export default function AttendanceDashboard() {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const [selectedCourseToView, setSelectedCourseToView] = useState<Course | null>(null)
  const [open, setOpen] = useState(false)

  const handleSelect = (course: Course) => {
    const alreadyAdded = selectedCourses.find((c) => c.id === course.id)
    if (alreadyAdded) {
      toast.error('Course already selected')
      return
    }
    setSelectedCourses((prev) => [...prev, course])
    toast.success(`${course.code} added`)
    setOpen(false)
  }

  const removeCourse = (id: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== id))
    if (selectedCourseToView?.id === id) {
      setSelectedCourseToView(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      {/* Course selection section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Add Courses for Attendance</h2>
          <p className="text-muted-foreground">
            Select from the list of available courses to manage attendance.
          </p>
        </div>

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
                      value={course.code + ' ' + course.title}
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

        {/* Selected courses list */}
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCourseToView(course)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCourse(course.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attendance Viewer Section */}
      {selectedCourseToView && (
        <Card>
          <CardHeader>
            <CardTitle>
              Attendance for {selectedCourseToView.code} - {selectedCourseToView.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockAttendance[selectedCourseToView.id]?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Matric No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendance[selectedCourseToView.id].map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.matricNo}</TableCell>
                      <TableCell>{student.date}</TableCell>
                      <TableCell>{student.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">
                No attendance records yet for this course.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
