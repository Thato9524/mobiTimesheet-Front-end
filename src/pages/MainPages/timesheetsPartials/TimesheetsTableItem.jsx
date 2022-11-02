import React, { useState } from "react";

function TimesheetsTableItem(props) {
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "declined":
        return "bg-red-100 text-red-600";
      default:
        return "bg-zinc-100 text-zinc-500";
    }
  };

  return (
    <>
      {!props.leaveDay ? (
        //NORMAL DAY
        !(props.description == "PUBLIC HOLIDAY") ? (
          <>
            <tbody className={`text-sm `}>
              {/* Row */}
              <tr className="">
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div>{props.date}</div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div>{props.dayName}</div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="text-left ml-5">{props.hours}</div>{" "}
                  {/* WAS "text-left"  WITH NO "ml-5"*/}
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="text-left ml-5">{props.totalHours}</div>{" "}
                  {/* WAS "text-left"  WITH NO "ml-5"*/}
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="flex items-center">
                    {/*typeIcon(props.type) make it description*/}
                    <div>{props.description.substring(0, 15)}</div>
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div
                    className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor(
                      props.approval
                    )}`}
                  >
                    {props.approval}
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div
                    className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${
                      props.status
                        ? "bg-green-100 text-green-600"
                        : " bg-amber-200 text-zinc-500"
                    }`}
                  >
                    {props.status ? "done" : "check"}
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="flex items-center">
                    <button
                      className="flex items-center"
                      onClick={(e) => {
                        props.editable == true
                          ? props.editTimesheet(e, props.id)
                          : props.handleError(e, props.id);
                      }}
                    >
                      {" "}
                      <svg className="w-4 h-4 shrink-0 fill-current text-zinc-400 mr-2">
                        <path d="M1 16h3c.3 0 .5-.1.7-.3l11-11c.4-.4.4-1 0-1.4l-3-3c-.4-.4-1-.4-1.4 0l-11 11c-.2.2-.3.4-.3.7v3c0 .6.4 1 1 1zm1-3.6l10-10L13.6 4l-10 10H2v-1.6z" />
                      </svg>
                    </button>
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <button
                      className={`text-zinc-400 hover:text-zinc-500 transform ${
                        descriptionOpen && "rotate-180"
                      }`}
                      aria-expanded={descriptionOpen}
                      onClick={() => setDescriptionOpen(!descriptionOpen)}
                      aria-controls={`description-${props.id}`}
                    >
                      <span className="sr-only">Menu</span>
                      <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                        <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                id={`description-${props.id}`}
                role="region"
                className={`${!descriptionOpen && "hidden"}`}
              >
                <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-0.2">
                  <div className="flex items-center bg-zinc-50 p-3 -mt-3">
                    <div className="italic">{props.description}</div>
                  </div>
                </td>
              </tr>
              <tr
                id={`description-${props.id}`}
                role="region"
                className={`${!descriptionOpen && "hidden"}`}
              >
                <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-0.2">
                  <div className="flex items-center  p-3 -mt-3">
                    {" "}
                    Reason For Declined Entry:
                  </div>
                  <div className="flex items-center bg-zinc-50 p-3 -mt-3">
                    <div className="italic">{props.message}</div>
                  </div>
                </td>
              </tr>
            </tbody>
            {props.dayName == "Friday" ? (
              <tbody className={`text-sm `}>
                <tr>
                  <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-1">
                    <div className="font-bold items-center bg-zinc-200 py-1 px-5 ">
                      <div className="text-center items-center self-center">
                        Weekend
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : null}
          </>
        ) : (
          //PUBLIC HOLIDAYS
          <>
            <tbody
              className={`${
                props.dayName == "Friday" ? "border-b-5" : ""
              } text-sm bg-indigo-100`}
            >
              {/* Row */}
              <tr>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div>{props.date}</div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div>{props.dayName}</div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div className="text-left ml-5">{props.hours}</div>{" "}
                  {/* WAS "text-left"  WITH NO "ml-5"*/}
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div className="text-left ml-5">{props.totalHours}</div>{" "}
                  {/* WAS "text-left"  WITH NO "ml-5"*/}
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="flex items-center">
                    {/*typeIcon(props.type) make it description*/}
                    <div className="text-left text-zinc-400">
                      {props.description}
                    </div>
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-500">
                  <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 text-zinc-400">
                    -
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 text-zinc-400">
                    -
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="flex items-center">
                    <button
                      disabled={true}
                      className="flex items-center"
                      onClick={(e) => props.editTimesheet(e, props.id)}
                    >
                      {" "}
                      <svg className="w-4 h-4 shrink-0 fill-current text-zinc-300 mr-2">
                        <path d="M1 16h3c.3 0 .5-.1.7-.3l11-11c.4-.4.4-1 0-1.4l-3-3c-.4-.4-1-.4-1.4 0l-11 11c-.2.2-.3.4-.3.7v3c0 .6.4 1 1 1zm1-3.6l10-10L13.6 4l-10 10H2v-1.6z" />
                      </svg>
                    </button>
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <button
                      disabled={true}
                      className={`text-zinc-300 hover:text-zinc-300 transform ${
                        descriptionOpen && "rotate-180"
                      }`}
                      aria-expanded={descriptionOpen}
                      onClick={() => setDescriptionOpen(!descriptionOpen)}
                      aria-controls={`description-${props.id}`}
                    >
                      <span className="sr-only">Menu</span>
                      <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                        <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            {props.dayName == "Friday" ? (
              <tbody className={`text-sm `}>
                <tr>
                  <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-2">
                    <div className="font-bold items-center bg-zinc-200 py-2 px-5 ">
                      <div className="text-center items-center self-center">
                        Weekend
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : null}
          </>
        )
      ) : (
        //LEAVE DAYS
        <>
          {props.isHalfDay != false ? (
            <tbody
              className={`${
                props.dayName == "Friday" ? "border-b-5" : ""
              } text-sm bg-violet-100`}
            >
              {/* Row */}
              <tr>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div>{props.date}</div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div>{props.dayName}</div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div className="text-left ml-5">{props.hours}</div>{" "}
                  {/* WAS "text-left"  WITH NO "ml-5"*/}
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div className="text-left ml-5">{props.totalHours}</div>{" "}
                  {/* WAS "text-left"  WITH NO "ml-5"*/}
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="flex items-center">
                    {/*typeIcon(props.type) make it description*/}
                    <div className="text-left text-zinc-400">
                      {props.description}
                    </div>
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-500">
                  <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 text-zinc-400">
                    {props.approval}
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 text-zinc-400">
                    {props.status ? "done" : "check"}
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="flex items-center">
                    <button
                      disabled={true}
                      className="flex items-center"
                      onClick={(e) => props.editTimesheet(e, props.id)}
                    >
                      <svg className="w-4 h-4 shrink-0 fill-current text-zinc-300 mr-2">
                        <path d="M1 16h3c.3 0 .5-.1.7-.3l11-11c.4-.4.4-1 0-1.4l-3-3c-.4-.4-1-.4-1.4 0l-11 11c-.2.2-.3.4-.3.7v3c0 .6.4 1 1 1zm1-3.6l10-10L13.6 4l-10 10H2v-1.6z" />
                      </svg>
                    </button>
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <button
                      disabled={true}
                      className={`text-zinc-300 hover:text-zinc-300 transform ${
                        descriptionOpen && "rotate-180"
                      }`}
                      aria-expanded={descriptionOpen}
                      onClick={() => setDescriptionOpen(!descriptionOpen)}
                      aria-controls={`description-${props.id}`}
                    >
                      <span className="sr-only">Menu</span>
                      <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                        <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody
              className={`${
                props.dayName == "Friday" ? "border-b-5" : ""
              } text-sm bg-violet-100`}
            >
              {/* Row */}
              <tr>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div>{props.date}</div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div>{props.dayName}</div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div className="text-left ml-5">{props.hours}</div>{" "}
                  {/* WAS "text-left"  WITH NO "ml-5"*/}
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-400">
                  <div className="text-left ml-5">{props.totalHours}</div>{" "}
                  {/* WAS "text-left"  WITH NO "ml-5"*/}
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="flex items-center">
                    {/*typeIcon(props.type) make it description*/}
                    <div className="text-left text-zinc-400">
                      {props.description}
                    </div>
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap text-zinc-500">
                  <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 text-zinc-400">
                    -
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 text-zinc-400">
                    -
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap">
                  <div className="flex items-center">
                    <button
                      disabled={false}
                      className="flex items-center"
                      onClick={(e) => props.editTimesheet(e, props.id)}
                    >
                      {" "}
                      <svg className="w-4 h-4 shrink-0 fill-current text-zinc-300 mr-2">
                        <path d="M1 16h3c.3 0 .5-.1.7-.3l11-11c.4-.4.4-1 0-1.4l-3-3c-.4-.4-1-.4-1.4 0l-11 11c-.2.2-.3.4-.3.7v3c0 .6.4 1 1 1zm1-3.6l10-10L13.6 4l-10 10H2v-1.6z" />
                      </svg>
                    </button>
                  </div>
                </td>

                <td className="px-2 first:pl-5 last:pr-5 py-0.2 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <button
                      disabled={false}
                      className={`text-zinc-300 hover:text-zinc-300 transform ${
                        descriptionOpen && "rotate-180"
                      }`}
                      aria-expanded={descriptionOpen}
                      onClick={() => setDescriptionOpen(!descriptionOpen)}
                      aria-controls={`description-${props.id}`}
                    >
                      <span className="sr-only">Menu</span>
                      <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                        <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
          {props.dayName == "Friday" ? (
            <tbody className={`text-sm `}>
              <tr>
                <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-2">
                  <div className="font-bold items-center bg-zinc-200 py-2 px-5 ">
                    <div className="text-center items-center self-center">
                      Weekend
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
}

export default TimesheetsTableItem;
