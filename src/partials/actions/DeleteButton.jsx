import React from "react";

//function DeleteButton({ selectedItems, deleteTimesheetModal }) {
function DeleteButton(props) {
  return (
    <div className={`${props.selectedItems.length < 1 && "hidden"}`}>
      <div className="flex items-center">
        <div className="hidden xl:block text-sm italic mr-2= whitespace-nowrap">
          <span>{props.selectedItems.length}</span> items selected
        </div>
        <button
          className="btn bg-white border-slate-200 hover:border-slate-300 text-rose-500 hover:text-rose-600"
          onClick={(e) => {
            e.stopPropagation();
            props.setDangerModalOpen(true);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteButton;
