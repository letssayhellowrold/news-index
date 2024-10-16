"use client";
import React from "react";
import { useEffect, useState } from "react";
import EChartComponent from "../components/EChartComponent";

export default function LineChartPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    // 调用 API 路由
    fetch("/api/get_data")
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>我的ECharts折线图</h1>
      {data ? <EChartComponent data={data} /> : <p>Loading...</p>}
    </div>
  );
}
