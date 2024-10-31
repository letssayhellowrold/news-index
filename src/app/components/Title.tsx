import React from "react";
import styles from "../styles/BasicStyles.module.css"; // 导入CSS模块

const Title: React.FC = () => {
  return (
    <div className={styles.Container}>
      <h1 className={styles.title}>News Index</h1>
    </div>
  );
};

export default Title;
