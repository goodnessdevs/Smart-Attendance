// import { useEffect, useState } from "react";
// import { useAuthContext } from "../../hooks/use-auth";
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   type SortingState,
//   useReactTable,
//   type VisibilityState,
// } from "@tanstack/react-table";
// import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { Checkbox } from "../../components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";
// import { Input } from "../../components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";

// // --- Attendance Type ---
// export type Attendance = {
//   id: string;
//   studentName: string;
//   email: string;
//   course: string;
//   date: string; // ISO string from backend
//   status: "present" | "absent" | "late";
// };

// // --- Columns Config ---
// export const columns: ColumnDef<Attendance>[] = [
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
//     accessorKey: "studentName",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Student <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => <div className="font-medium">{row.getValue("studentName")}</div>,
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//     cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//   },
//   {
//     accessorKey: "course",
//     header: "Course",
//     cell: ({ row }) => <div>{row.getValue("course")}</div>,
//   },
//   {
//     accessorKey: "date",
//     header: "Date",
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("date"));
//       return <div>{date.toLocaleDateString()}</div>;
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.getValue("status") as Attendance["status"];
//       const color =
//         status === "present"
//           ? "text-green-600"
//           : status === "absent"
//           ? "text-red-600"
//           : "text-yellow-600";

//       return <div className={`capitalize font-semibold ${color}`}>{status}</div>;
//     },
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const record = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(record.id)}
//             >
//               Copy ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View details</DropdownMenuItem>
//             <DropdownMenuItem>Edit record</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

// // --- Attendance List Component ---
// export default function AttendanceList() {
//   const { token } = useAuthContext();
//   const [data, setData] = useState<Attendance[]>([]);

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/attendance`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await res.json();
//         if (res.ok) setData(data);
//       } catch (error) {
//         console.error("Error fetching attendance:", error);
//       }
//     };

//     fetchAttendance();
//   }, [token]);

//   // Table state
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   return (
//     <div className="w-full">
//       {/* Search & Column Controls */}
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Filter by student email..."
//           value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
//           onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columns <ChevronDown />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((c) => c.getCanHide())
//               .map((column) => (
//                 <DropdownMenuCheckboxItem
//                   key={column.id}
//                   className="capitalize"
//                   checked={column.getIsVisible()}
//                   onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                 >
//                   {column.id}
//                 </DropdownMenuCheckboxItem>
//               ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((hg) => (
//               <TableRow key={hg.id}>
//                 {hg.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(header.column.columnDef.header, header.getContext())}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No attendance records.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination + Row Info */}
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="text-muted-foreground flex-1 text-sm">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/use-auth";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  attendanceColumns,
  type Attendance,
} from "../../lib/attendance-columns";
import { useParams } from "react-router-dom";

const AttendanceList = () => {
  const { token } = useAuthContext();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const { courseId } = useParams();

  console.log(courseId)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/attendance`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ courseId }),
          }
        );

        const data = await res.json();
        if (res.ok) setAttendance(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAttendance();
  }, [courseId, token]);

  const table = useReactTable({
    data: attendance,
    columns: attendanceColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full p-6 md:p-8">
      <div className="flex items-center gap-x-2 py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:text-white">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(val) => col.toggleVisibility(!!val)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (header.column.columnDef.header as React.ReactNode)}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={attendanceColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceList;
