// import { type ColumnDef } from "@tanstack/react-table"
// import { Checkbox } from "../components/ui/checkbox"
// import { Button } from "../components/ui/button"
// import { ArrowUpDown } from "lucide-react"

// export type Attendance = {
//   id: string
//   status: "present" | "absent" | "late"
//   email: string
//   date: string
// }

// export const attendanceColumns: ColumnDef<Attendance>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("status")}</div>
//     ),
//   },
//   {
//     accessorKey: "email",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Email
//         <ArrowUpDown />
//       </Button>
//     ),
//     cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//   },
//   {
//     accessorKey: "date",
//     header: "Date",
//     cell: ({ row }) => <div>{row.getValue("date")}</div>,
//   },
// ]

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Attendance = {
  id: string;
  fullName: string;
  email: string;
  matricNumber: string;
  status: "present" | "absent" | "late";
  date: string;
};

export const attendanceColumns: ColumnDef<Attendance>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "S/N",
    header: "S/N",
    cell: ({ row }) => <div>{row.index + 1}</div>, // auto serial number
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "matricNo",
    header: "Matric Number",
    cell: ({ row }) => <div>{row.getValue("matricNo")}</div>,
  },
  {
    accessorKey: "isPresent",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={
          row.getValue("isPresent") ? "text-green-500" : "text-red-500"
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
