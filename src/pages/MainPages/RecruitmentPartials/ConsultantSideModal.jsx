import React from "react";
import config from "../../../config";

const ConsultantSideModal = ({
  showConfirmBox,
  changeState,
  devRecruitData,
  stageColor,
  stage,
}) => {
  return (
    <>
      <div className="sm:flex sm:justify-between sm:items-center mb-8 py-3 border-b border-slate-200">
        <div className="mb-4 sm:mb-0">
          <select
            className={`pl-3 rounded-lg font-medium border-0 ${stageColor(
              stage
            )}`}
            style={{
              boxShadow: "none",
            }}
            value={stage}
            // onChange={(e) => showConfirmBox(e.target.value)}
            onChange={showConfirmBox}
          >
            <option value="Review">Review</option>
            <option value="1st Interview">1st Interview</option>
            <option value="2nd Interview">2nd Interview</option>
            <option value="Technical Test">Technical Test</option>
            <option value="Accepted">Accepted</option>
            <option value="Dear John">Dear John</option>
          </select>
        </div>

        <div className="grid grid-flow-col sm:auto-row-max justify-start sm:justify-end gap-2">
          <button
            className="text-slate-400 cursor-pointer hover:text-slate-500"
            // onClick={() => changeState(false)}
            onClick={changeState}
          >
            <div className="sr-only">Close</div>
            <svg className="w-4 h-4 fill-current Icon CloseIcon">
              <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex justify-between mt-5 pl-3 pb-3">
        <h1 className="text-3xl font-bold">{devRecruitData.name}</h1>
      </div>
      <table class="table-auto">
        <tbody>
          <tr>
            <td className="px-3 py-2 text-xs">Email:</td>
            <td className="px-5 text-sm text-zinc-600">
              <a href={`mailto:${devRecruitData.email}`}>
                {devRecruitData.email}
              </a>
            </td>
          </tr>

          <tr>
            <td className="px-3 py-3 text-xs">Cell:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.cell}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-3 text-xs">DOB:</td>
            <td className="px-5 text-sm text-zinc-600">{devRecruitData.dob}</td>
          </tr>
          <tr>
            <td className="px-3 py-3 text-xs">Nationality:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.nationality}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-3 text-xs">Gender:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.gender.charAt(0).toUpperCase() +
                devRecruitData.gender.slice(1)}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-3 text-xs">Currently Employed:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.currentlyEmployed.charAt(0).toUpperCase() +
                devRecruitData.currentlyEmployed.slice(1)}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-3 text-xs">Disability:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.disability.charAt(0).toUpperCase() +
                devRecruitData.disability.slice(1)}
            </td>
          </tr>
          {devRecruitData.disability === "yes" && (
            <tr>
              <td className="px-3 py-3 text-xs">Disability Type:</td>
              <td className="px-5 text-sm text-zinc-600">
                {devRecruitData.disabilityType.charAt(0).toUpperCase() +
                  devRecruitData.disabilityType.slice(1)}
              </td>
            </tr>
          )}
          <tr>
            <td className="px-3 py-3 text-xs">Reffered:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.reffered.charAt(0).toUpperCase() +
                devRecruitData.reffered.slice(1)}
            </td>
          </tr>
          {devRecruitData.reffered === "yes" && (
            <tr>
              <td className="px-3 py-3 text-xs">Reffered By:</td>
              <td className="px-5 text-sm text-zinc-600">
                {devRecruitData.refferedBy.charAt(0).toUpperCase() +
                  devRecruitData.refferedBy.slice(1)}
              </td>
            </tr>
          )}
          <tr>
            <td className="px-3 py-3 text-xs">Highest Qualification:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.highestQualification}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-3 text-xs">Institution:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.highestQualificationInstitution}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-3 text-xs">Interview Location:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.interviewLocation.charAt(0).toUpperCase() +
                devRecruitData.interviewLocation.slice(1)}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-3 text-xs">Current Residence:</td>
            <td className="px-5 text-sm text-zinc-600">
              {devRecruitData.currentAreaOfResidence.charAt(0).toUpperCase() +
                devRecruitData.currentAreaOfResidence.slice(1)}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-2 text-xs">Seniority:</td>
            <td className="px-5">
              <div
                className="inline-flex text-sm rounded-full text-center px-2.5 py-0.5"
                style={{
                  backgroundColor: "rgb(255 237 213)",
                  color: "rgb(234 88 12)",
                }}
              >
                {devRecruitData.seniority.charAt(0).toUpperCase() +
                  devRecruitData.seniority.slice(1)}
              </div>
            </td>
          </tr>
          <tr>
            <td className="px-3 py-2 text-xs">Experience:</td>
            <td className="px-5 text-sm">{devRecruitData.experience} Years</td>
          </tr>
        </tbody>
      </table>
      <div
        class="border border-slate-200 hover:border-slate-300 mx-0 my-6 p-3 rounded-md"
        style={{
          width: "150px",
        }}
      >
        <a
          href={`${config.url}/upload/${devRecruitData.cv}`}
          target="_blank"
          className="flex items-center h-10"
        >
          <div>
            <img
              src="https://i.ibb.co/RpYzvq6/pdf-icon.png"
              style={{
                width: "40px",
                height: "40px",
                color: "rgb(113 113 122)",
                margin: "auto",
              }}
            />
          </div>
          <div className="my-2 ml-3 py-2 text-sm">Open CV</div>
        </a>
      </div>
    </>
  );
};

export default ConsultantSideModal;
