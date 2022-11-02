import React from "react";
import config from "../../../config";
import { BsFillCheckCircleFill } from "react-icons/bs";

function RecruitmentCard({ recruit }) {
  const formatDate = (date) => {
    let d = new Date(date);
    let month = d.getMonth();
    let day = `${d.getDate()}`;
    let year = d.getFullYear();

    day.length === 1 ? (day = `0${day}`) : day;

    console.log(recruit);

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
    <div className="shadow-lg rounded-sm border border-slate-400 p-4 bg-zinc-200">
      {/* Body */}
      <div className="mb-3 flex items-center justify-between bg-zinc-200">
        <div className="flex items-center">
          <h2 className="font-semibold text-slate-800 mb-1">{recruit.name}</h2>
          {recruit.repository !== "Not submitted" && (
            <span className="text-green-600 ml-2">
              <BsFillCheckCircleFill />
            </span>
          )}
        </div>
        {/* <div>
          <div className="text-sm">
            <a href={`${config.url}/upload/${recruit.cv}`} target="_blank">
              Open CV
            </a>
          </div>
        </div> */}
        <div
          className="border border-slate-400 bg-white hover:border-slate-300 mx-0 p-3 ml-2 rounded-md"
          style={{
            width: "80px",
          }}
        >
          <a
            href={`${config.url}/upload/${recruit.cv}`}
            target="_blank"
            className="flex items-center h-3"
          >
            <div>
              <img
                src="https://i.ibb.co/RpYzvq6/pdf-icon.png"
                style={{
                  width: "20px",
                  height: "20px",
                  color: "rgb(113 113 122)",
                  margin: "auto",
                }}
              />
            </div>
            <div className="my-2 ml-3 py-2 text-sm font-bold">CV</div>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Right side */}
        <div className="flex items-center">
          <div
            className={`${
              recruit.seniority === "senior"
                ? "text-green-500 bg-green-100 border border-slate-400"
                : recruit.seniority === "intermediate"
                ? "text-orange-400 bg-orange-100 border border-slate-300"
                : "text-rose-500 bg-rose-100 border border-slate-300"
            } inline-flex text-sm rounded-full text-center px-2.5 py-0.5`}
          >
            {recruit.seniority.charAt(0).toUpperCase() +
              recruit.seniority.slice(1)}
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center text-xs">
          {/* Replies button */}
          {formatDate(recruit.createdAt)}
          {/* <button className="flex items-center text-slate-400 hover:text-indigo-500 ml-3">
            <svg
              className="w-4 h-4 shrink-0 fill-current mr-1.5"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
            </svg>
            <div className="text-sm text-slate-500">7</div>
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default RecruitmentCard;
