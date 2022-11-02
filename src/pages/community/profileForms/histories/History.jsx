import React, { useEffect, useState } from "react";
import PreLoader from "../../../../components/PreLoader";
import ErHistoryCard from "../../../../components/HistoryCards/ErHistoryCard";
import ScfHistoryCard from "../../../../components/HistoryCards/ScfHistoryCard";
import TaHistoryCard from "../../../../components/HistoryCards/TaHistoryCard";
import SfHistoryCard from "../../../../components/HistoryCards/SfHistoryCard";
import config from "../../../../config";
import request from "../../../../handlers/request";

export default function History(props) {
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);
  const [noForms, setNoForms] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    try{
    setLoading(true);
    const _id = localStorage.getItem("_id");
    let getCompletedForms;
    //CHECK WHICH FORM HAS BEEN SELECTED
    if (props.form === "studyCostFunding") {
      getCompletedForms = await request.get(
        `${config.path.profile.history.getScfForms}/${_id}`
      );
    } else if (props.form === "travelAllowance") {
      getCompletedForms = await request.get(
        `${config.path.profile.history.getTaForms}/${_id}`
      );
    } else if (props.form === "expenseReimbursement") {
      getCompletedForms = await request.get(
        `${config.path.profile.history.getErForms}/${_id}`
      );
    } else {
      getCompletedForms = await request.get(
        `${config.path.profile.history.getSfForms}/${_id}`
      );
    }
    //CHECK IF THERE IS ANY INFORMATION RECIEVED
    if (!getCompletedForms.err) {
      setForms(getCompletedForms.message);
    } else {
      setForms([]);
      setNoForms(true);
    }
    setLoading(false);
  }catch(err){
    setLoading(false);
    setForms([]);
    setNoForms(true);
  }
  }
  return (
    <div>
      {loading ? (
        <PreLoader />
      ) : (
        <div>
          {!noForms ? (
            <div className="grid grid-cols-12 gap-6 mt-5">
              {props.form === "studyCostFunding" &&
                forms.map((form) => (
                  <ScfHistoryCard form={form} key={form._id} />
                ))}
              {props.form === "travelAllowance" &&
                forms.map((form) => (
                  <TaHistoryCard form={form} key={form._id} />
                ))}
              {props.form === "expenseReimbursement" &&
                forms.map((form) => (
                  <ErHistoryCard form={form} key={form._id} />
                ))}
              {props.form === "skillsFriday" &&
                forms.map((form) => (
                  <SfHistoryCard form={form} key={form._id} />
                ))}
            </div>
          ) : (
            <div className="flex justify-center text-zinc-400 text-xl">
              <h1>No Previous Submissions</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
