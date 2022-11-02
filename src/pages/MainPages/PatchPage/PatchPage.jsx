import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PreLoader from "../../../components/PreLoader";
import React, { useEffect, useState } from "react";
import patches from "./PatchNotes";
import request from "../../../handlers/request";
import config from "../../../config";
import { useParams } from "react-router";

export default function PatchPage() {
  const { version } = useParams();
  const [loading, setLoading] = useState(false);
  const [patchNotes, setPatchNotes] = useState({
    version: "",
    releaseDate: "",
    data: [{}],
  });
  const [versions, setVersions] = useState([]);
  // const [version, setVersion] = useState("");
  const [gotData, setGotData] = useState(false);

  useEffect(async () => {
    setLoading(true);
    // let currentVersion = localStorage.getItem("patch");
    
    const getPatch = await request.get(`${config.path.profile.getPatch}/${version}`);
    setPatchNotes(getPatch.message.currentPatch);
    setVersions(getPatch.message.versions);
    // setVersion(getPatch.message.currentPatch.version);
    setGotData(true);
    setLoading(false);
  }, [request]);
  
  return (
    <div className="">
      {loading ? (
        <PreLoader />
      ) : (
        <main>
          <div className="mt-5">
            <div className="max-w-md mx-auto">
              <h3 className="mt-1 text-center text-2xl text-zinc-500 italic pb-3">
                Release Notes{" "}
                <span className="text-rose-500">v{patchNotes.version}</span>
              </h3>
            </div>
          </div>
          <Container>
            <div className="m-3">
              {gotData &&
                patchNotes.data.map((patch, index) => (
                  <div key={index}>
                    <PatchAccord
                      key={index}
                      header={patch.header}
                      changes={patch.changes}
                    />
                  </div>
                ))}
            </div>
          </Container>
        </main>
      )}
    </div>
  );
}

const PatchAccord = ({ header, changes }) => {
  return (
    <>
      <Accordion sx={{ borderColor: "black" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ borderRadius: "2", background: "white", color: "#f43f5e" }}
        >
          <Typography>{header}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ background: "#f8fafc", color: "#71717a", typography: 'body1'}}>
          {changes.map((change) => (
            <div key={change.id}>
              <Typography> - {change.message}</Typography>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
