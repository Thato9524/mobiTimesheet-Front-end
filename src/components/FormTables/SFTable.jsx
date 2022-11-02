import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { CSVLink } from "react-csv";

export default function SFTable({ attendances }) {
  return (
    <Container>
      <>
          <TableContainer component={Paper} className="mt-5">
            <Table sx={{ minWidth: 650 }} aria-label="SfTable">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Date of Training</TableCell>
                  <TableCell align="left">Training Description</TableCell>
                  <TableCell align="center">Start</TableCell>
                  <TableCell align="center">To CSV</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.map((attendance) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    key={attendance._id}
                  >
                    <TableCell align={"center"}>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                    <TableCell align={"left"}>{attendance.desc}</TableCell>
                    <TableCell align={"center"}>{new Date(attendance.date).toDateString()}</TableCell>
                    <TableCell align={"center"}>
                      {attendance.register && attendance.register.length > 0 ? (
                        <CSVLink
                          className="mr-3 btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                          data={attendance.register}
                          filename={`${attendance.desc}_${new Date(attendance.date).toDateString()}.csv`}
                        >
                          Download
                        </CSVLink>
                      ) : (
                        "No Attendance Available For Download"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      </>
    </Container>
  );
}
