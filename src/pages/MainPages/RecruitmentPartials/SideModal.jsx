import React, { useEffect, useState } from "react";
import config from "../../../config";
import request from "../../../handlers/request";
import PreLoader from "../../../components/PreLoader";
import ConfirmBox from "./ConfirmBox";
import DevSideModal from "./DevSideModal";
import ConsultantSideModal from "./ConsultantSideModal";

const SideModal = ({ id, changeState, type, changeStage }) => {
  const [loading, setLoading] = useState(true);
  const [devRecruitData, setDevRecruitData] = useState({});
  const [stage, setStage] = useState("");
  const [tempStage, setTempStage] = useState("");
  const [confirmBox, setConfirmBox] = useState(false);

  const stageColor = (stage) => {
    switch (stage) {
      case "Review":
        return "text-orange-400 bg-orange-100";
      case "1st Interview":
        return "text-yellow-500 bg-yellow-100";
      case "Technical Test":
        return "text-lime-500 bg-lime-100";
      case "Stefan Interview":
        return "text-green-500 bg-green-100";
      case "Accepted":
        return "text-teal-500 bg-teal-100";
      case "Dear John":
        return "text-rose-500 bg-rose-100";
      default:
        return "";
    }
  };

  useEffect(async () => {
    setLoading(true);

    if (type === "dev") {
      let devRecruits = await request.post(
        config.path.recruitment.getDevDetails,
        { id },
        true
      );

      if (!devRecruits.err) {
        setDevRecruitData(devRecruits);
        setStage(devRecruits.stage);
      }
    } else if (type === "consultants") {
      let devRecruits = await request.post(
        config.path.recruitment.getConsultantDetails,
        { id },
        true
      );

      if (!devRecruits.err) {
        setDevRecruitData(devRecruits);
        setStage(devRecruits.stage);
      }
    }

    setLoading(false);
  }, [id]);

  const showConfirmBox = (val) => {
    setConfirmBox(true);
    setTempStage(val);
  };

  const changeValue = async () => {
    setConfirmBox(false);

    switch (tempStage) {
      case "1st Interview":
        setLoading(true);
        await request.post(
          config.path.recruitment.changeStage,
          { id, stage: tempStage, type },
          true
        );
        setStage(tempStage);
        changeStage(tempStage);

        if (type === "consultants") {
          await request.post(
            config.path.recruitment.sendConsultantEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
        } else {
          await request.post(
            config.path.recruitment.sendDevEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
        }

        setLoading(false);
        break;
      case "2nd Interview":
        setLoading(true);
        await request.post(
          config.path.recruitment.changeStage,
          { id, stage: tempStage, type },
          true
        );
        setStage(tempStage);
        changeStage(tempStage);

        if (type === "consultants") {
          await request.post(
            config.path.recruitment.sendConsultantEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
          setLoading(false);
        } else {
          setLoading(false);
        }

        break;
      case "Technical Test":
        setLoading(true);
        await request.post(
          config.path.recruitment.changeStage,
          { id, stage: tempStage, type },
          true
        );
        setStage(tempStage);
        changeStage(tempStage);

        if (type === "consultants") {
          await request.post(
            config.path.recruitment.sendConsultantEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
        }

        setLoading(false);
        break;
      case "Stefan Interview":
        setLoading(true);
        await request.post(
          config.path.recruitment.changeStage,
          { id, stage: tempStage, type },
          true
        );
        setStage(tempStage);
        changeStage(tempStage);

        if (type === "consultants") {
          await request.post(
            config.path.recruitment.sendConsultantEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
        } else {
          await request.post(
            config.path.recruitment.sendDevEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
        }

        setLoading(false);
        break;
      case "Accepted":
        setLoading(true);
        await request.post(
          config.path.recruitment.changeStage,
          { id, stage: tempStage, type },
          true
        );
        setStage(tempStage);
        changeStage(tempStage);

        if (type === "consultants") {
          await request.post(
            config.path.recruitment.sendConsultantEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
        } else {
          await request.post(
            config.path.recruitment.sendDevEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
        }

        setLoading(false);
        break;
      case "Dear John":
        setLoading(true);
        await request.post(
          config.path.recruitment.changeStage,
          { id, stage: tempStage, type },
          true
        );
        setStage(tempStage);
        changeStage(tempStage);

        if (type === "consultants") {
          await request.post(
            config.path.recruitment.sendConsultantEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
        } else {
          await request.post(
            config.path.recruitment.sendDevEmail,
            {
              email: devRecruitData.email,
              name: devRecruitData.name,
              stage: tempStage,
            },
            true
          );
        }

        setLoading(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="fixed right-0 bg-white shadow-lg px-6 h-screen overflow-auto"
      style={{ width: "30vw", paddingBottom: "80px" }}
    >
      {confirmBox && (
        <ConfirmBox
          showModal={() => setConfirmBox(false)}
          changeValue={changeValue}
        />
      )}
      {loading ? (
        <div>
          <PreLoader />
        </div>
      ) : (
        <>
          {type === "dev" ? (
            <DevSideModal
              devRecruitData={devRecruitData}
              changeState={() => changeState(false)}
              showConfirmBox={(e) => showConfirmBox(e.target.value)}
              stageColor={stageColor}
              stage={stage}
            />
          ) : (
            <ConsultantSideModal
              devRecruitData={devRecruitData}
              changeState={() => changeState(false)}
              showConfirmBox={(e) => showConfirmBox(e.target.value)}
              stageColor={stageColor}
              stage={stage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SideModal;
