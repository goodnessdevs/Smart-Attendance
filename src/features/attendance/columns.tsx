"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AttendanceRecord, StudentAttendanceRecord } from "./types";

function SortableHeader({
  label,
  column,
}: {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: any;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
    </Button>
  );
}

function PresenceBadge({ isPresent }: { isPresent: unknown }) {
  return (
    <Badge variant={isPresent ? "success" : "destructive"}>
      {isPresent ? "Present" : "Absent"}
    </Badge>
  );
}

/** Lecturer view: who showed up to this class. */
export const attendanceColumns: ColumnDef<AttendanceRecord>[] = [
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
    id: "serial",
    header: "S/N",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.index + 1}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => <SortableHeader label="Full name" column={column} />,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("fullName")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader label="Email" column={column} />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "matricNo",
    header: "Matric number",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("matricNo")}</span>
    ),
  },
  {
    accessorKey: "isPresent",
    header: "Status",
    cell: ({ row }) => <PresenceBadge isPresent={row.getValue("isPresent")} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader label="Date" column={column} />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.getValue("date")}
      </span>
    ),
  },
];

/** Student view: this student's own history for one course. */
export const studentAttendanceColumns: ColumnDef<StudentAttendanceRecord>[] = [
  {
    id: "serial",
    header: "S/N",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.index + 1}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "courseName",
    header: ({ column }) => (
      <SortableHeader label="Course code" column={column} />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("courseName")}</span>
    ),
  },
  {
    accessorKey: "venueName",
    header: "Venue",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("venueName")}</span>
    ),
  },
  {
    accessorKey: "isPresent",
    header: "Status",
    cell: ({ row }) => <PresenceBadge isPresent={row.getValue("isPresent")} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader label="Date" column={column} />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.getValue("date")}
      </span>
    ),
  },
];
