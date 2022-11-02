import React, { useState } from "react";
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
import config from "../../config";
import ReaModal from "../ReaModal";

export default function ErTable(props) {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
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
          list.amount.toLowerCase().includes(props.searchTerm.toLowerCase())
        ) {
          return list;
        }
        if (list.vat.toLowerCase().includes(props.searchTerm.toLowerCase())) {
          return list;
        }
        if (
          list.reason.toLowerCase().includes(props.searchTerm.toLowerCase())
        ) {
          return list;
        }
      });
    }
  }

  async function getFile(id) {
    try {
      props.setLoading(true);
      let img,
        url,
        extension,
        file = {
          _id: "",
          fileName: "",
          fileKey: "",
        };
      const formIndex = props.forms.findIndex(
        (form) => form._id === id.substring(0, 24)
      );
      const fileIndex = props.forms
        .find((form) => form._id === id.substring(0, 24))
        .fileKeys.findIndex((file) => file._id === id.substring(25, id.length));
      file = props.forms[formIndex].fileKeys[fileIndex];

      extension = file.fileName.substring(
        file.fileName.lastIndexOf("."),
        file.fileName.length
      );
      console.log(extension);
      if (extension !== ".pdf") {
        props.setLoading(false);
        url = `${config.url}/${config.path.s3.getFile}/${file.fileKey}`;
        img = await (await fetch(url)).blob();
        setSelectedFile({
          file: file,
          url: window.URL.createObjectURL(img),
        });
        setFileModalOpen(true);
      } else {
        props.setLoading(false);
        window.open(`${config.url}/${config.path.s3.getFile}/${file.fileKey}`);
      }
    } catch (err) {
      props.setLoading(false);
      setMessage(err);
      setError(true);
      console.log(err);
    }
  }

  const downloadImage = () => {
    let tempLink;
    tempLink = document.createElement("a");
    tempLink.href = selectedFile.url;
    tempLink.setAttribute("download", selectedFile.file.fileName);
    tempLink.click();
  };
  return (
    <Container>
      <ReaModal id="error-modal" modalOpen={error} setModalOpen={setError}>
        <div className="p-5 flex space-x-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
            <svg
              className="w-4 h-4 shrink-0 fill-current text-emerald-500"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
            </svg>
          </div>
          <div>
            <div className="mb-5">
              <div className="text-lg font-semibold text-zinc-800">
                {message}
              </div>
            </div>
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                onClick={() => setError(false)}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </ReaModal>
      <ReaModal
        id="file-modal"
        modalOpen={fileModalOpen}
        setModalOpen={setFileModalOpen}
      >
        <div className="p-3">
          <img src={selectedFile.url} alt="Image" />
        </div>
        <div className="flex justify-end p-3">
          <button
            className="btn bg-rose-500 hover:bg-rose-600 text-white mr-2"
            onClick={downloadImage}
          >
            Download
          </button>
          <button
            className="btn-sm border-zinc-200 hover:border-zinc-300 text-zinc-600"
            onClick={(e) => {
              e.stopPropagation();
              setFileModalOpen(false);
            }}
          >
            Close
          </button>
        </div>
      </ReaModal>
      <>
        {search(props.forms).length > 0 ? (
          <TableContainer component={Paper} className="mt-5">
            <Table sx={{ minWidth: 650 }} aria-label="TaTable">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Date Submitted</TableCell>
                  <TableCell align="left">User</TableCell>
                  <TableCell align="left">Amount</TableCell>
                  <TableCell align="left">Date of transaction</TableCell>
                  <TableCell align="left">Vat</TableCell>
                  <TableCell align="left">Reason</TableCell>
                  <TableCell align="left">Attachment</TableCell>
                  <TableCell align="center">Approval</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {search(props.forms).map((form) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    key={form._id}
                  >
                    <TableCell align="left">
                      {new Date(form.created).toDateString()}
                    </TableCell>
                    <TableCell align="left">{form.user}</TableCell>
                    <TableCell align="left">{form.amount}</TableCell>
                    <TableCell align="left">
                      {new Date(form.transactionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="left">{form.vat}</TableCell>
                    <TableCell align="left">{form.reason}</TableCell>
                    <TableCell align="left">
                      {form.fileKeys &&
                        form.fileKeys.map((fileKey) => (
                          <>
                            <div>
                              <div
                                class="border border-slate-200 hover:border-slate-300 mx-0 p-3 ml-2 mb-2 rounded-md"
                                style={{
                                  width: "80px",
                                }}
                              >
                                <button
                                  id={`${form._id} ${fileKey._id}`}
                                  className="flex items-center h-3"
                                  onClick={(e) => getFile(e.currentTarget.id)}
                                >
                                  <div>
                                    <svg
                                      className="shrink-0 h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill-rule="evenodd"
                                      clip-rule="evenodd"
                                    >
                                      <path d="M22 24h-20v-24h14l6 6v18zm-7-23h-12v22h18v-16h-6v-6zm3 15v1h-12v-1h12zm0-3v1h-12v-1h12zm0-3v1h-12v-1h12zm-2-4h4.586l-4.586-4.586v4.586z" />
                                    </svg>
                                  </div>
                                  <div className="my-2 ml-3 py-2 text-sm font-bold">
                                    File
                                  </div>
                                </button>
                              </div>
                            </div>
                          </>
                        ))}
                    </TableCell>
                    <TableCell align="left">
                      {form.approval === "pending" ? (
                        <div className="flex justify-center">
                          <button
                            id={form._id}
                            className="mt-3 btn bg-emerald-500 hover:bg-emerald-600 text-white mr-3"
                            onClick={(e) =>
                              props.handleApproval(e, "Er", "approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            id={form._id}
                            className="mt-3 btn bg-rose-500 hover:bg-rose-600 text-white"
                            onClick={(e) =>
                              props.handleApproval(e, "Er", "declined")
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
      </>
    </Container>
  );
}
