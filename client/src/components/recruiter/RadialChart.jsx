import React from "react";
import ReactApexChart from "react-apexcharts";

const RadialChart = ({ growth, color, size = "65%" }) => {
  const safeGrowth = typeof growth === "number" && !isNaN(growth) ? growth : 0;

  const options = {
    chart: { type: "radialBar", sparkline: { enabled: true } },
    colors: [color],
    plotOptions: {
      radialBar: {
        hollow: { size: size },
        track: { background: color, opacity: 0.1, strokeWidth: "100%" },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            offsetY: 5,
            color: color,
            fontSize: "12px",
            fontWeight: "bold",
            formatter: (val) => `${parseInt(val)}%`,
          },
        },
      },
    },
    stroke: { lineCap: "round" },
  };

  const series = [Math.min(safeGrowth, 100)];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="radialBar"
      height={100}
    />
  );
};

export default RadialChart;
