import { type ColumnDef } from "@tanstack/react-table";
// import { Button } from "../components/ui/button";
// import { ArrowUpDown } from "lucide-react";
import { Badge } from "../components/ui/badge";

export type StudentAttendance = {
  courseName: string;
  courseTitle: string;
  venueName: string;
  isPresent: boolean;
  date: string;
};

export const studentAttendanceColumns: ColumnDef<StudentAttendance>[] = [
  {
    id: "S/N",
    header: "S/N",
    cell: ({ row }) => <div>{row.index + 1}</div>, // auto serial number
  },
  // {
  //   accessorKey: "courseName",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Course Code
  //       <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => <div>{row.getValue("courseName")}</div>,
  // },
  {
    accessorKey: "matricNumber",
    header: "Matric Number",
    cell: ({ row }) => <div>{row.getValue("matricNumber")}</div>,
  },
  {
    accessorKey: "venueName",
    header: "Venue",
    cell: ({ row }) => <div>{row.getValue("venueName")}</div>,
  },
  {
    accessorKey: "isPresent",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.getValue("isPresent") ? "success" : "destructive"}
        className="tracking-wide"
      >
        {row.getValue("isPresent") ? "Present" : "Absent"}
      </Badge>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
];
