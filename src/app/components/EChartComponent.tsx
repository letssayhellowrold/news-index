"use client";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const LineChartComponent: React.FC = () => {
  const [data, setData] = useState<{
    x: string[];
    y: number[];
    points: {
      dataIndex: number;
      name: string;
      symbolSize: number;
      value: number;
    }[];
  } | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 在数据请求的 useEffect
  useEffect(() => {
    // 在请求数据前显示加载动画
    if (chartInstance.current) {
      chartInstance.current.showLoading();
    }
    const fetchData = async () => {
      try {
        const response = await fetch("/api/get_data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // 数据加载完成后隐藏加载动画
        if (chartInstance.current) {
          chartInstance.current.hideLoading();
        }
      }
    };

    fetchData(); // 调用异步函数
  }, []);

  useEffect(() => {
    if (data && chartRef.current) {
      // 确保数据不为 null，并初始化 ECharts 实例
      if (chartInstance.current && !chartInstance.current.isDisposed()) {
        chartInstance.current.dispose();
      }

      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: "canvas",
      });

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
            showSymbol: false,
            markPoint: {
              data: marks,
            },
          },
        ],
      };

      chartInstance.current.setOption(option);

      const handleResize = () => {
        if (chartInstance.current && !chartInstance.current.isDisposed()) {
          chartInstance.current.resize();
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chartInstance.current && !chartInstance.current.isDisposed()) {
          chartInstance.current.dispose();
        }
      };
    }
  }, [data]);

  return <div ref={chartRef} style={{ height: "400px" }} />;
};

export default LineChartComponent;
