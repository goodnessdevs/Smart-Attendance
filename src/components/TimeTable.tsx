import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

function TableComp() {
  return (
    <div className="w-full px-2">
      <Table className="w-full table-fixed text-[12px] md:text-sm">
        <TableCaption className="text-base font-medium mb-2">
          Your course time table
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">DAYS</TableHead>
            <TableHead className="text-center">Monday</TableHead>
            <TableHead className="text-center">Tuesday</TableHead>
            <TableHead className="text-center">Wednesday</TableHead>
            <TableHead className="text-center ps-4">Thursday</TableHead>
            <TableHead className="text-center">Friday</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["9am - 11am", "PHS 101", "MTS 101", "CSC 101", "MCE 101", "ABE 101"],
            ["11am - 1pm", "CVE 101", "", "MTE 101", "ELE 101", "GNS 101"],
            ["Break", "Break", "Break", "Break", "Break", "Break"],
            ["2pm - 4pm", "CSC 101", "BIO 101", "PHS 101", "MTS 101", "MCE 101"],
            ["4pm - 6pm", "CHM 101", "STS 101", "ETS 101", "CHM 101", "ABE 101"],
          ].map((row, idx) => (
            <TableRow key={idx} className="text-center">
              {row.map((cell, i) => {
                const isFirstColumn = i === 0;
                const isBreak = cell.toLowerCase() === "break";

                if (isFirstColumn || isBreak) {
                  return (
                    <TableCell
                      key={i}
                      className={`px-2 py-2 ${isFirstColumn ? "font-medium text-left" : ""}`}
                    >
                      {cell}
                    </TableCell>
                  );
                }

                const slug = `/courses/${cell.toLowerCase()}`;

                return (
                  <TableCell key={i} className="px-2 py-2">
                    <Link
                      to={slug}
                      className="inline-flex items-center justify-center w-full h-10 rounded-md bg-[#80B530] text-white text-xs md:text-sm py-1 text-wrap md:py-2 px-2 md:px-3 text-center hover:bg-[#4F700F] transition"
                    >
                      {cell}
                    </Link>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableComp;
