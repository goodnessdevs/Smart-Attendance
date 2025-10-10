import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "../components/ui/badge";

export type Attendance = {
  fullName: string;
  email: string;
  matricNo: string;
  isPresent: boolean;
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
