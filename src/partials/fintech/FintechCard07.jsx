import dayjs from "dayjs";
import React from "react";
import LineChart from "../../charts/LineChart06";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";

function FintechCard07({data}) {
  let dates = [];
  let billable = [];
  let nonBillable = [];

  data.map((item) => {
    dates.push(dayjs(item._id).format("MM-DD-YYYY"));
    billable.push(item.Billable);
    nonBillable.push(item.nonBillable);
  });

  const chartData = {
    labels:dates,
    datasets: [
      // Indigo line
      {
        label: "Non Billable",
        data: nonBillable,
        borderColor: tailwindConfig().theme.colors.red[500],
        fill: true,
        backgroundColor: `rgba(${hexToRGB(
          tailwindConfig().theme.colors.red[500]
        )}, 0.08)`,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.red[500],
        clip: 20,
      },
      // Gray line
      {
        label: "Billable",
        data: billable,
        borderColor: tailwindConfig().theme.colors.slate[400],
        fill: false,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.slate[300],
        clip: 20,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100 flex items-center">
        <h2 className="font-semibold text-slate-800">Client Hours Overview</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-center">
          <div className="text-3xl font-bold text-slate-800 mr-2">
          </div>
          <div className="text-sm">
            <span className="font-medium text-amber-500"></span>
          </div>
        </div>
        <div className="text-sm text-slate-500"></div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart data={chartData} width={800} height={300} />
      </div>
    </div>
  );
}

export default FintechCard07;
