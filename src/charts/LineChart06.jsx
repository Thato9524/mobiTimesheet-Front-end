import React, { useRef, useEffect } from "react";

import {
  Chart,
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";

// Import utilities
import { formatValue } from "../utils/Utils";

Chart.register(
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip
);

function LineChart06({ data, width, height }) {
  const canvas = useRef(null);

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const chart = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        layout: {
          padding: {
            top: 12,
            bottom: 16,
            left: 20,
            right: 20,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 7,
              callback: (value) => formatValue(value),
            },
          },
          x: {
            type: "time",
            time: {
              parser: "MM-DD-YYYY",
              displayFormats: {
                'millisecond': 'MMM DD',
                'second': 'MMM DD',
                'minute': 'MMM DD',
                'hour': 'MMM DD',
                'day': 'MMM DD',
                'week': 'MMM DD',
                'month': 'MMM DD',
                'quarter': 'MMM DD',
                'year': 'MMM DD',
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => formatValue(context.parsed.y),
            },
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              fontColor: "#000080",
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "nearest",
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    return () => chart.destroy();
  }, []);

  return <canvas ref={canvas} width={width} height={height}></canvas>;
}

export default LineChart06;
