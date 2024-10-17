"use client";
import React, { useEffect, useState } from "react";
import EChartComponent from "./components/EChartComponent";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/get_data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // 调用异步函数
  }, []);

  return (
    <div>
      {/* 渲染图表组件并传递数据 */}
      {data && <EChartComponent data={data} />}
    </div>
  );
}
