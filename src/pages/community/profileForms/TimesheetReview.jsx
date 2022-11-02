import { Card, CardContent, Checkbox, FormControlLabel } from "@mui/material";
import { set } from "date-fns";
import React, { useState } from "react";
import Banner2 from "../../../components/Banner2";
import ModalBlank from "../../../components/ModalBlank";
import ReaModal from "../../../components/ReaModal";
import config from "../../../config";
import request from "../../../handlers/request";

export default function TimesheetReview() {
  //ERROR/SUCCESS STATE VARIABLES
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState(0);

  //INPUT STATE VARIABLES
  const [reviews, setReviews] = useState([
    {
      id: id,
      input: "",
    },
  ]);
  const [email, setEmail] = useState(true);

  //UPDATE FUNCTIONS
  function updateReview(event, id) {
    const index = reviews.findIndex((review) => review.id === id);
    let _reviews = [...reviews];
    _reviews[index].input = event.target.value;
    setReviews(_reviews);
  }
  function updateEmail(event) {
    setEmail(event.target.checked);
  }

  //OPERATIONAL FUNCTIONS
  function validate() {
    let valid = [];
    reviews.forEach((review) => {
      if (!review.input) {
        setError(true);
        setMessage("Suggestion/Issue is required.");
        valid.push(false);
      } else if (review.input.length < 5) {
        setError(true);
        setMessage("Answer cannot be less than 5 charachters.");
        valid.push(false);
      } else {
        valid.push(true);
      }
    });
    if (!valid.includes(false)) {
      submitForm();
    }
  }

  async function submitForm() {
    let _id = localStorage.getItem("_id");

    const req = {
      user: _id,
      reviews: reviews,
      emailed: email,
      created: new Date(),
    };

    try {
      const response = await request.post(
        config.path.profile.addReview,
        req,
        true
      );
      if (response.err) {
        setMessage(response.message);
        setErrorModalOpen(true);
      } else {
        setMessage(response.message);
        setSuccessModalOpen(true);
      }
    } catch (ex) {
      setMessage(ex.message);
      setErrorModalOpen(true);
    }
  }

  function resetState() {
    setSuccessModalOpen(false);
    setErrorModalOpen(false);
    setError(false);
    setId(0);
    setReviews([
      {
        id: id - id,
        input: "",
      },
    ]);
  }

  function closeModal() {
    setErrorModalOpen(false);
  }
  function addField() {
    let _reviews = [...reviews];
    setId(id + 1);
    console.log(id);
    _reviews.push({
      id: id + 1,
      input: "",
    });
    setReviews(_reviews);
  }
  function removeField(id) {
    if (reviews.length !== 1) {
      console.log("Removed");
      let _reviews = [...reviews];
      _reviews = _reviews.filter((review) => review.id !== id);
      setReviews(_reviews);
    }
  }

  //JSX FOR REQUIRED
  const required = <span className="text-rose-500">*</span>;
  return (
    <div className="flex justify-center">
      <div className="mt-5 w-1/2">
        <Card variant="outlined">
          <CardContent>
            <div className="mb-3 pb-4 rounded">
              <div>Required {required}</div>
            </div>
            <div>
              <div>
                <label
                  className="mt-1 block text-sm font-medium"
                  htmlFor="course-name"
                >
                  Please list your issues or recommendations for the portal
                  below (up to 10 per submission) {required}
                </label>

                {reviews.map((review) => (
                  <div key={review.id}>
                    <label
                      className="mt-3 block text-sm font-medium mb-1"
                      htmlFor="issue"
                    >
                      Issue/Recommendation
                    </label>
                    <div className="flex inline items-center">
                      <div className="flex-1 items-stretch">
                        <textarea
                          id={review.id}
                          name="review"
                          className="form-input w-full px-2 py-0.5 mt-2"
                          value={review.input}
                          onChange={(e) => updateReview(e, review.id)}
                        />
                      </div>
                      <div className="shrink items-center ml-2">
                        {reviews.length <= 9 && (
                          <button
                            className="p-1 btn bg-rose-500 hover:bg-rose-600 text-white"
                            onClick={addField}
                          >
                            <svg
                              className="w-4 h-4 shrink-0 fill-current text-white"
                              viewBox="0 0 24 24"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                            >
                              <path d="M11.5 0c6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5-11.5-5.153-11.5-11.5 5.153-11.5 11.5-11.5zm0 1c5.795 0 10.5 4.705 10.5 10.5s-4.705 10.5-10.5 10.5-10.5-4.705-10.5-10.5 4.705-10.5 10.5-10.5zm.5 10h6v1h-6v6h-1v-6h-6v-1h6v-6h1v6z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="shrink items-center ml-2">
                        {reviews.length > 1 && (
                          <button
                            className={`p-1 btn bg-rose-500 hover:bg-rose-600 text-white`}
                            onClick={() => removeField(review.id)}
                            disabled={reviews.length === 1 ? true : false}
                          >
                            <svg
                              className="w-4 h-4 shrink-0 fill-current text-white"
                              viewBox="0 0 24 24"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                            >
                              <path
                                d={`M11.5 0c6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5-11.5-5.153-11.5-11.5 5.153-11.5 11.5-11.5zm0 1c5.795 0 10.5 4.705 10.5 10.5s-4.705 10.5-10.5 10.5-10.5-4.705-10.5-10.5 4.705-10.5 10.5-10.5zm-6.5 10h13v1h-13v-1z`}
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <Banner2 type="error" open={error} setOpen={setError}>
                  {message}
                </Banner2>
              </div>
              <div>
                <div className="ml-1">
                  <FormControlLabel
                    control={
                      <Checkbox checked={email} onChange={updateEmail} />
                    }
                    label="Send me an email reciept of my responses"
                  />
                </div>
                <button
                  className="mt-3 btn bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={validate}
                >
                  Submit
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ReaModal
        id="success-modal"
        modalOpen={successModalOpen}
        setModalOpen={setSuccessModalOpen}
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
                onClick={resetState}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </ReaModal>
      <ReaModal
        id="error-modal"
        modalOpen={errorModalOpen}
        setModalOpen={setErrorModalOpen}
      >
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
                onClick={closeModal}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </ReaModal>
    </div>
    // <div className="mt-2 bg-white border text-center border-zinc-200 rounded-sm shadow-sm">
    //   <div className="flex justify-between mb-10 items-center"></div>

    //   <div className="grow flex justify-center text-center truncate  mb-2">
    //     <div className="truncate text-center">
    //       {" "}
    //       Please click below for the form
    //     </div>
    //   </div>

    //   <button
    //     className="text-rose-500"
    //     onClick={() =>
    //       window.open("https://forms.office.com/r/BgGsHrKb20", "_blank")
    //     }
    //   >
    //     Open
    //   </button>

    //   <div className="flex justify-between mb-10 items-center"></div>
    // </div>
  );
}
