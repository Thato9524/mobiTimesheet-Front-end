import React, { useEffect, useState } from "react";
import config from "../../config";
import request from "../../handlers/request";
import PreLoader from "../../components/PreLoader";
import ModalBlank from "../../components/ModalBlank";

function NotificationsPanel() {
  //FUNCTIONAL STATES
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  //VARIABLE STATES
  const [comments, setComments] = useState(true);
  const [messages, setMessages] = useState(true);
  const [mentions, setMentions] = useState(false);

  useEffect(async () => {
    await refreshNotifications();
  }, [request]);

  //REFRESH NOTIFICATIONS
  async function refreshNotifications() {
    setLoading(true);
    let _id= localStorage.getItem("_id");
    const getUser = await request.get(
      `${config.path.profile.getProfile}/${_id}`
    );
    resetState(getUser.isSubscribed);
    setLoading(false);
  }

  function resetState(isSubscribed){
    setSuccess(false)
    setError(false)
    setMessage("")
    setComments(isSubscribed);
  }

  //WHEN SAVE CHANGES IS CLICKED
  async function saveChanges() {
    const _id = localStorage.getItem("_id");
    const req = {
      isSubscribed: comments,
    };

    try {
      const response = await request.patch(
        `${config.path.settings.updateNotifications}/${_id}`,
        req,
        true
      );
      if (response.err) {
        setError(true);
        setMessage(response.message);
      } else {
        setSuccess(true);
        setMessage(response.message);
      }
    } catch (ex) {
      setError(true);
      setMessage(ex.message);
    }
  }

  return (
    <div className="grow">
      {/* Panel body */}
      {loading ? (
        <PreLoader />
      ) : (
        <div className="p-6 space-y-6">
          <h2 className="text-2xl text-slate-800 font-bold mb-5">
            My Notifications
          </h2>

          {/* General */}
          <section>
            <h3 className="text-xl leading-snug text-slate-800 font-bold mb-1">
              General
            </h3>
            <ul>
              {/* <li className="flex justify-between items-center py-3 border-b border-slate-200"> */}
              {/* Left */}
              <div>
                <div className="text-slate-800 font-semibold">
                  C3 Portal Announcement
                </div>
                <div className="text-sm">
                  Public Holiday and General Portal Announcement.
                </div>
              </div>
              {/* Right */}
              <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">
                  {comments ? "On" : "Off"}
                </div>
                <div className="form-switch">
                  <input
                    type="checkbox"
                    id="comments"
                    className="sr-only"
                    checked={comments}
                    onChange={() => setComments(!comments)}
                  />
                  <label className="bg-slate-400" htmlFor="comments">
                    <span
                      className="bg-white shadow-sm"
                      aria-hidden="true"
                    ></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div>
              {/* </li> */}
              {/* <li className="flex justify-between items-center py-3 border-b border-slate-200">
              
              <div>
                <div className="text-slate-800 font-semibold">Teams </div>
                <div className="text-sm">Recieve email notification of any activity from your Microsoft Teams profile.</div>
              </div>
              
              <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{messages ? 'On' : 'Off'}</div>
                <div className="form-switch">
                  <input type="checkbox" id="messages" className="sr-only" checked={messages} onChange={() => setMessages(!messages)} />
                  <label className="bg-slate-400" htmlFor="messages">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div>
            </li> */}
              {/* <li className="flex justify-between items-center py-3 border-b border-slate-200"> */}
              {/* Left */}
              {/* <div>
                <div className="text-slate-800 font-semibold">Asana</div>
                <div className="text-sm">Recieve email notification of any activity from your Asana profile.</div>
              </div> */}
              {/* Right */}
              {/* <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{mentions ? 'On' : 'Off'}</div>
                <div className="form-switch">
                  <input type="checkbox" id="mentions" className="sr-only" checked={mentions} onChange={() => setMentions(!mentions)} />
                  <label className="bg-slate-400" htmlFor="mentions">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div> */}
              {/* </li> */}
              {/* <li className="flex justify-between items-center py-3 border-b border-slate-200"> */}
              {/* Left */}
              {/* <div>
                <div className="text-slate-800 font-semibold">Click Up</div>
                <div className="text-sm">Recieve email notification of any activity from your Click Up profile.</div>
              </div> */}
              {/* Right */}
              {/* <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{mentions ? 'On' : 'Off'}</div>
                <div className="form-switch">
                  <input type="checkbox" id="mentions" className="sr-only" checked={mentions} onChange={() => setMentions(!mentions)} />
                  <label className="bg-slate-400" htmlFor="mentions">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div> */}
              {/* </li> */}
            </ul>
            <div>
              <ModalBlank
                id="error-modal"
                modalOpen={error}
                setModalOpen={setError}
              >
                <div className="p-5 flex space-x-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
                    <svg
                      className="w-4 h-4 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
                    </svg>
                  </div>
                  {/* Content */}
                  <div>
                    {/* Modal header */}
                    <div className="mb-5">
                      <div className="text-lg font-semibold text-zinc-800">
                        Error: {message}
                      </div>
                    </div>
                    {/* Modal footer */}
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
              </ModalBlank>
              <ModalBlank
                id="success-modal"
                modalOpen={success}
                setModalOpen={setSuccess}
              >
                <div className="p-5 flex space-x-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
                    <svg
                      className="w-4 h-4 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
                    </svg>
                  </div>
                  {/* Content */}
                  <div>
                    {/* Modal header */}
                    <div className="mb-5">
                      <div className="text-lg font-semibold text-zinc-800">
                        {message}
                      </div>
                    </div>
                    {/* Modal footer */}
                    <div className="flex flex-wrap justify-end space-x-2">
                      <button
                        className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                        onClick={refreshNotifications}
                      >
                        Okay
                      </button>
                    </div>
                  </div>
                </div>
              </ModalBlank>
            </div>
          </section>

          {/* Shares */}

          {/* Panel footer */}
          <footer>
            <div className="flex flex-col px-6 py-5 border-t border-slate-200">
              <div className="flex self-end">
                <button
                  className="btn bg-rose-500 hover:bg-rose-600 text-white ml-3"
                  onClick={saveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default NotificationsPanel;
