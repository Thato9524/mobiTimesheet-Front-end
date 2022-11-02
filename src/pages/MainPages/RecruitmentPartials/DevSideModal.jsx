import React from "react";
import config from "../../../config";
import { BsFillCheckCircleFill } from "react-icons/bs";

const DevSideModal = ({
  showConfirmBox,
  changeState,
  devRecruitData,
  stageColor,
  stage,
}) => {
  const formatDate = (date) => {
    let d = new Date(date);
    let month = d.getMonth();
    let day = `${d.getDate()}`;
    let year = d.getFullYear();

    day.length === 1 ? (day = `0${day}`) : day;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${day} ${monthNames[month]} ${year}`;
  };

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
            onChange={showConfirmBox}
          >
            <option value="Review">Review</option>
            <option value="1st Interview">1st Interview</option>
            <option value="Stefan Interview">Stefan Interview</option>
            <option value="Accepted">Accepted</option>
            <option value="Dear John">Dear John</option>
          </select>
        </div>

        <div className="grid grid-flow-col sm:auto-row-max justify-start sm:justify-end gap-2">
          <button
            className="text-slate-400 cursor-pointer hover:text-slate-500"
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
            <td className="px-3 py-2 text-xs">Seniority:</td>
            <td className="px-5">
              <div
                className={`${
                  devRecruitData.seniority === "senior"
                    ? "text-green-500 bg-green-100"
                    : devRecruitData.seniority === "intermediate"
                    ? "text-orange-400 bg-orange-100"
                    : "text-rose-500 bg-rose-100"
                } inline-flex text-sm rounded-full text-center px-2.5 py-0.5`}
                // style={{
                //   backgroundColor: "rgb(255 237 213)",
                //   color: "rgb(234 88 12)",
                // }}
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
          <tr>
            <td className="px-3 py-2 text-xs">Salary Expectation:</td>
            <td className="px-5 text-sm">{devRecruitData.salary}</td>
          </tr>
          <tr>
            <td className="px-3 py-2 text-xs">Available From:</td>
            <td className="px-5 text-sm">{devRecruitData.availableFrom}</td>
          </tr>
          <tr>
            <td className="px-3 py-2 text-xs">Aptitude Score:</td>
            <td className="px-5 text-sm">{devRecruitData.aptitudeScore}/5</td>
          </tr>
          <tr>
            <td className="px-3 py-2 text-xs flex items-center">
              GitHub Repo
              {devRecruitData.repository !== "Not submitted" && (
                <span className="text-green-600 ml-2">
                  <BsFillCheckCircleFill />
                </span>
              )}
            </td>
            <td className="px-5 text-sm">
              {devRecruitData.repository === "Not submitted" ? (
                <span>{devRecruitData.repository}</span>
              ) : (
                <a href={devRecruitData.repository} target="_blank">
                  {devRecruitData.repository}
                </a>
              )}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-2 text-xs">Date Applied:</td>
            <td className="px-5 text-sm">
              {formatDate(devRecruitData.createdAt)}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mx-0 mt-3 py-2 w-full border border-slate-200 hover:border-slate-300 rounded-md">
        <div className="px-3 font-semibold text-sm">Reason for Applying:</div>
        <div className="px-3 mb-6 text-sm">
          {devRecruitData.reasonForApplying}
        </div>
        <div className="px-3 font-semibold text-sm">Hardest Ever Worked:</div>

        <div className="px-3 mb-6 text-sm">{devRecruitData.hardestWorked}</div>
      </div>
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

export default DevSideModal;
