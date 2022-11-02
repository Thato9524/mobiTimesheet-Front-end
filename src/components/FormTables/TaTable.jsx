import React from "react";
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

export default function TaTable(props) {
  function search(list) {
    if (props.searchTerm === "") {
      return list;
    } else {
      return list.filter((list) => {
        if (
          list.user.personalInfo.firstName
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (
          list.user.personalInfo.lastName
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (
          list.vehicleRange
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (
          list.privateKilos
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (
          list.businessKilos
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (
          list.totalMonthlyKilos
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (
          list.totalAnnualKilos
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        ) {
          return list;
        }
      });
    }
  }
  return (
    <Container>
      {search(props.forms).length > 0 ? (
        <TableContainer component={Paper} className="mt-5">
          <Table sx={{ minWidth: 650 }} aria-label="TaTable">
            <TableHead>
              <TableRow>
              <TableCell align="left">Date submitted</TableCell>
                <TableCell align="left">User</TableCell>
                <TableCell align="left">Vehicle Price</TableCell>
                <TableCell align="left">Estimated Private (Km)</TableCell>
                <TableCell align="left">Estimated Business (Km)</TableCell>
                <TableCell align="left">Estimated Monthly (Km)</TableCell>
                <TableCell align="left">Estimated Annual (Km)</TableCell>
                <TableCell align="left">Approval</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {search(props.forms).map((form) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={form._id}
                >
                  <TableCell align="left">{new Date(form.created).toDateString()}</TableCell>
                  <TableCell align="left">
                    {form.user}
                  </TableCell>
                  <TableCell align="left">{form.vehicleRange}</TableCell>
                  <TableCell align="left">{form.privateKilos}</TableCell>
                  <TableCell align="left">{form.businessKilos}</TableCell>
                  <TableCell align="left">{form.totalMonthlyKilos}</TableCell>
                  <TableCell align="left">{form.totalAnnualKilos}</TableCell>
                  <TableCell align="center">
                    {form.approval === "pending" ? (
                      <div className="flex justify-between">
                        <button
                          id={form._id}
                          className="mt-3 btn bg-emerald-500 hover:bg-emerald-600 text-white mr-3"
                          onClick={(e) =>
                            props.handleApproval(e, "Ta", "approved")
                          }
                        >
                          Approve
                        </button>
                        <button
                          id={form._id}
                          className="mt-3 btn bg-rose-500 hover:bg-rose-600 text-white"
                          onClick={(e) =>
                            props.handleApproval(e, "Ta", "declined")
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
