import React, { useState } from "react";
import {
  Box,
  Collapse,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScfTable({ forms, handleApproval, open, setOpen, searchTerm }) {
  function search(list) {
    if (searchTerm === "") {
      return list;
    } else {
      return list.filter((list) => {
        if (
          list.user.personalInfo.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (
          list.user.personalInfo.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (
          list.courseName.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (
          list.coursePrice
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (list.end.toLowerCase().includes(searchTerm.toLowerCase())) {
          return list;
        }
        if (list.start.toLowerCase().includes(searchTerm.toLowerCase())) {
          return list;
        }
      });
    }
  }
  return (
    <Container>
      {search(forms).length > 0 ? (
        <TableContainer sx={{ marginTop: 2 }} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="ScfTable">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="left">Date of submitted</TableCell>
                <TableCell align="left">User</TableCell>
                <TableCell align="left">Course Name</TableCell>
                <TableCell align="left">Cost of Course</TableCell>
                <TableCell align="left">Course Start Date</TableCell>
                <TableCell align="left">Course End Date</TableCell>
                <TableCell align="left">Course Link</TableCell>
                <TableCell align="center">Approval</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {search(forms).map((form) => (
                <>
                  <TableRow sx={{ borderBottom: "unset" }}>
                    <TableCell>
                      <IconButton
                        aria-label="expand"
                        size="small"
                        onClick={() => setOpen(!open)}
                      >
                        {open ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{new Date(form.created).toDateString()}</TableCell>
                    <TableCell>
                      {form.user}
                    </TableCell>
                    <TableCell>{form.courseName.length > 15 ? form.courseName.substring(0, 15).concat("...") : form.courseName}</TableCell>
                    <TableCell>R {form.coursePrice}</TableCell>
                    <TableCell>{new Date(form.start).toDateString()}</TableCell>
                    <TableCell>{new Date(form.end).toDateString()}</TableCell>
                    <TableCell>
                      <a
                        href={form.link}
                        target="_blank"
                        className="text-sky-500"
                      >
                        {form.link.length > 15 ? form.link.substring(0, 15).concat("...") : form.link}
                      </a>
                    </TableCell>
                    <TableCell>
                      {form.approval === "pending" ? (
                        <div className="flex justify-between">
                          <button
                            id={form._id}
                            className="mt-3 btn bg-emerald-500 hover:bg-emerald-600 text-white mr-3"
                            onClick={(e) =>
                              handleApproval(e, "Scf", "approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            id={form._id}
                            className="mt-3 btn bg-rose-500 hover:bg-rose-600 text-white"
                            onClick={(e) =>
                              handleApproval(e, "Scf", "declined")
                            }
                          >
                            Decline
                          </button>
                        </div>
                      ) : form.approval === "declined" ? (
                        <p className="flex text-rose-500 justify-center">
                          {form.approval}
                        </p>
                      ) : (
                        <p className="flex text-emerald-500 justify-center">
                          {form.approval}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={10}
                    >
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
                          <Typography variant="h6" gutterBottom component="div">
                            More Information
                          </Typography>
                        </Box>
                        <Table size="small" aria-label="extraInfo">
                          <TableHead>
                            <TableRow>
                              <TableCell>Course Description</TableCell>
                              <TableCell>Personally Identified</TableCell>
                              <TableCell>Motivation</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>{form.courseDesc.length > 15 ? form.courseDesc.substring(0, 15).concat("...") : form.courseDesc}</TableCell>
                              <TableCell>{form.isPersonal}</TableCell>
                              <TableCell>
                                {form.motivation !== ""
                                  ? form.motivation.length > 15 ? form.motivation.substring(0, 15).concat("...") : form.motivation
                                  : "No Motivation Provided"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="mt-5 flex justify-center text-zinc-400 text-xl">
          <h1>No Forms Found</h1>
        </div>
      )}
    </Container>
  );
}
