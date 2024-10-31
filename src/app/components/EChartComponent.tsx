"use client";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import styles from "../styles/BasicStyles.module.css";

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
            position: "outside",
            fontSize: "15px",
            textAlign: "auto",
            color: "#FFF",
            formatter: () => {
              return "{Bg|" + point.name + "}";
            },
            rich: {
              Bg: {
                backgroundColor: "sky",
                borderRadius: 4,
                padding: [5, 5],
              },
            },
          },
          symbol: "circle", // 设置特殊点的形状为圆形
          symbolSize: 10, // 设置特殊点的大小
          itemStyle: {
            color: "#00008B", // 设置特殊点的颜色为深蓝色
          },
          z: 100,
        }));

      const option = {
        legend: {
          orient: "horizontal", //图例布局方式：水平 'horizontal' 、垂直 'vertical'
          x: "center", // 横向放置位置，选项：'center'、'left'、'right'、'number'（横向值 px）
          y: "top", // 纵向放置位置，选项：'top'、'bottom'、'center'、'number'（纵向值 px）
          data: ["index"],
        },
        title: {
          text: "News Index",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器配置项。
            type: "cross", // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
            axis: "auto", // 指示器的坐标轴。
            snap: true, // 坐标轴指示器是否自动吸附到点上
          },
          showContent: true,
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
          label: {
            backgroundColor: "#777",
          },
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: false,
            },
            brush: {
              type: ["lineX", "clear"],
            },
            saveAsImage: {}, //下载按钮
          },
        },
        brush: {
          xAxisIndex: "all",
          brushLink: "all",
          outOfBrush: {
            colorAlpha: 0.1,
          },
        },
        xAxis: {
          type: "category",
          data: data.x,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          splitNumber: 20,
        },
        yAxis: {
          type: "value",
          splitArea: {
            show: true,
          },
        },
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0],
            start: 0,
            end: 100,
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: "slider",
            top: "90%",
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            name: "index",
            type: "line",
            data: data.y,
            showSymbol: false,
            markPoint: {
              data: marks,
              label: {
                normal: {
                  show: false, // 默认不显示
                },
                emphasis: {
                  show: true, // 鼠标悬浮时显示
                },
              },
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

  return (
    <div
      ref={chartRef}
      className={styles.Container}
      style={{ height: "500px" }}
    />
  );
};

export default LineChartComponent;
