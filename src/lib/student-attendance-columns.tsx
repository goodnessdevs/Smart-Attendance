import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type StudentAttendance = {
  courseTitle: string;
  courseCode: string;
  status: "present" | "absent" | "late";
  date: string;
};

export const studentAttendanceColumns: ColumnDef<StudentAttendance>[] = [
  {
    accessorKey: "courseId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Course Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("courseId")}</div>,
  },
  {
    accessorKey: "isPresent",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={
          row.getValue("isPresent")
            ? "text-green-500 dark:text-green-700 font-semibold tracking-wide"
            : "text-red-500 font-semibold tracking-wide"
        }
      >
        {row.getValue("isPresent") ? "Present" : "Absent"}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
];
