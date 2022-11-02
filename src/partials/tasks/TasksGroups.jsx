import React from "react";

function TasksGroups({ children, title }) {
  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-3">
      {/* Column header */}
      <header>
        <div className="flex items-center justify-between mb-2">
          <h2 className="grow font-semibold text-slate-800 truncate">
            {title}
          </h2>
        </div>
        {/* Cards */}
        <div className="grid gap-2">{children}</div>
      </header>
    </div>
  );
}

export default TasksGroups;
