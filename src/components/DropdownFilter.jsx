import { set } from "date-fns";
import React, { useState, useRef, useEffect } from "react";
import Transition from "../utils/Transition";

//function DropdownFilter({align}) {
function DropdownFilter(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  //const [options, setOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  const handleClick = (e) => {
    // console.log(e.target.checked); //CHECKED = TRUE OR FALSE

    //setIsChecked(e.target.checked)
    let optionName = e.target.name;

    if (e.target.name == "done") optionName = true;
    else if (e.target.name == "check") optionName = false;

    if (e.target.checked)
      props.setSelectedOptions((prevState) => [...prevState, optionName]);
    //setOptions((prevState) => [...prevState, optionName]);
    /*setOptions((prevState) =>
      prevState.filter((option) => option !== optionName)
    );*/ else
      props.setSelectedOptions((prevState) =>
        prevState.filter((option) => option !== optionName)
      );
  };

  //close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });
  const handleChangeone = () => {
    setCheckedone(!checkedone);
  };
  const handleChangetwo = () => {
    setCheckedtwo(!checkedtwo);
  };
  const handleChangethree = () => {
    setCheckedthree(!checkedthree);
  };
  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="btn bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Filter</span>
        <wbr />
        <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
          <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className={`origin-top-right z-10 absolute top-full min-w-56 bg-white border border-slate-200 pt-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          props.align === "right" ? "right-0" : "left-0"
        }`}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4">
            Filters
          </div>
          <ul className="mb-4">
            {props.filterOptions.map((option, i) => {
              return (
                <li className="py-1 px-3" key={i}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id={i}
                      name={option}
                      className="form-checkbox"
                      //checked = {isChecked}
                      onChange={handleClick}
                    />
                    <span className="text-sm font-medium ml-2">{option}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          {/*<div className="py-2 px-3 border-t border-slate-200 bg-slate-50">
            <ul className="flex items-center justify-between">
              <li>
                <button className="btn-xs bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                onClick={()=>{
                  setIsChecked(false)
                }}
                >
                  Clear
                </button>
              </li>
              <li>
                <button
                  className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    setDropdownOpen(false);
                    //props.setSelectedOptions(options)
                  }}
                  onBlur={() => {
                    setDropdownOpen(false);
                  }}
                >
                  Apply
                </button>
              </li>
            </ul>
                </div>*/}
        </div>
      </Transition>
    </div>
  );
}

export default DropdownFilter;
