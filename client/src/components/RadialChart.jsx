import React from "react";
import ReactApexChart from 'react-apexcharts';


const RadialChart = ({ growth, label, color, size }) => {

  const safeGrowth = (typeof growth === 'number' && !isNaN(growth)) ? growth : 0;

    const options = {
        chart: {
            type: "radialBar",
            height: 280,
          },
          colors: [color],
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 15,
                size: size,
              },
              dataLabels: {
                showOn: "always",
                name: {
                  offsetY: 0,
                  show: true,
                  color: color,
                  fontSize: "13px",
                },
                value: {
                  color: color,
                  fontSize: "30px",
                  show: true,
                  offsetY: 0,
                  offsetX: 0,
                  formatter: () => `${safeGrowth}%`,
                },
              },
            },
          },
          stroke: {
            lineCap: "round",
          },
          labels: [label],
    }

    const series = [safeGrowth];

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type='radialBar' height={150} />
    </div>
  )
}

export default RadialChart
