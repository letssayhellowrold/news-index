"use client";
import React, { useEffect, useState } from "react";
import EChartComponent from "./components/EChartComponent";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "home",
// };

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

  return <div>{data && <EChartComponent data={data} />}</div>;
}
