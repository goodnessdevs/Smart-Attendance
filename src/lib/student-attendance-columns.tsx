import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "../components/ui/button"
import { ArrowUpDown } from "lucide-react"

export type StudentAttendance = {
  courseTitle: string
  courseCode: string
  status: "present" | "absent" | "late"
  date: string
}

export const studentAttendanceColumns: ColumnDef<StudentAttendance>[] = [
  {
    accessorKey: "courseTitle",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Course Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("courseTitle")}</div>,
  },
  {
    accessorKey: "courseCode",
    header: "Course Code",
    cell: ({ row }) => <div>{row.getValue("courseCode")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span
          className={
            status === "present"
              ? "text-green-600 font-medium"
              : status === "late"
              ? "text-yellow-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
]
