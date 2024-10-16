import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// 折线图需要的ECharts模块
echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CanvasRenderer,
]);

const LineChartComponent: React.FC<{
  data: { message: string[]; value: number[] };
}> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 确保DOM元素已经被渲染
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current, undefined, {
        renderer: "canvas",
      });

      // 指定图表的配置项和数据
      const option = {
        title: {
          text: "ECharts 折线图示例",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: data.message,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "示例系列",
            type: "line",
            data: data.value,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表
      chart.setOption(option);
    }
  }, []);

  return <div ref={chartRef} style={{ width: "100vw", height: "60vh" }} />;
};

export default LineChartComponent;
