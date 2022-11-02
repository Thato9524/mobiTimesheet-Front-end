import React from "react";
import BarChart from "../../charts/BarChart01";

// Import utilities
import { tailwindConfig } from "../../utils/Utils";

function DashboardCard04({ data }) {
  const chartData = {
    labels: ["Managers", "Non-Managers", "Disruptive Tech"],
    datasets: [
      // Light blue bars
      {
        label: "Utilization",
        data: [
          data.managers?.averageUtilization,
          data.nonManagers?.averageUtilization,
          data.devs?.averageUtilization,
        ],
        backgroundColor: tailwindConfig().theme.colors.blue[400],
        hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
      // Blue bars
      {
        label: "Billable Utilization",
        data: [
          data.managers?.averageBillable,
          data.nonManagers?.averageBillable,
          data.devs?.averageBillable,
        ],
        backgroundColor: tailwindConfig().theme.colors.indigo[500],
        hoverBackgroundColor: tailwindConfig().theme.colors.indigo[600],
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Utilization Overview</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={800} height={300} />
    </div>
  );
}

export default DashboardCard04;
