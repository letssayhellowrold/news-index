import React from "react";
import Background from "./components/Background";
import Model from "./components/Model";
import Resource from "./components/Resource";
import Appliaction from "./components/Application";
import About from "./components/About";
import EChartComponent from "./components/EChartComponent";
import Title from "./components/Title";

export default function Home() {
  return (
    <div className="container m-auto">
      <div>
        <Title />
      </div>
      <div>
        <Background />
      </div>
      <div>
        <Model />
      </div>
      <div>
        <EChartComponent />
      </div>
      <div>
        <Resource />
      </div>
      <div>
        <Appliaction />
      </div>
      <div>
        <About />
      </div>
    </div>
  );
}
