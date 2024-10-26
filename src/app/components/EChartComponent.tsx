import React, { useEffect, useRef } from "react";

import * as echarts from "echarts";

const LineChartComponent: React.FC<{
  data: {
    x: string[];
    y: number[];
    points: {
      dataIndex: number;
      name: string;
      symbolSize: number;
      value: number;
    }[];
  };
}> = ({ data }) => {
  console.log(data.x, data.y, data.points);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      let chart = echarts.getInstanceByDom(chartRef.current);
      if (!chart) {
        chart = echarts.init(chartRef.current, undefined, {
          renderer: "canvas",
        });
      }

      const marks = data.points
        .filter((point) => data.x[point.dataIndex] && point.value !== undefined)
        .map((point) => ({
          coord: [data.x[point.dataIndex], point.value],
          label: {
            show: true,
            position: "inside",
            formatter: point.name,
            fontSize: "auto",
            textAlign: "auto",
          },
          itemStyle: {
            color: "#f0f0f0",
          },
        }));
      console.log(marks);
      const option = {
        animation: false,
        legend: {
          data: ["index"],
        },
        title: {
          text: "linechart",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: data.x,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "index",
            type: "line",
            data: data.y,
            markPoint: {
              data: marks,
            },
          },
        ],
      };

      chart.setOption(option);

      return () => {
        if (chart && !chart.isDisposed()) {
          chart.dispose();
        }
      };
    }
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "60vh" }} />;
};

export default LineChartComponent;
