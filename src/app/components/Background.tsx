import React from "react";
import styles from "../styles/BasicStyles.module.css"; // 导入CSS模块

const Background: React.FC = () => {
  return (
    <div className={styles.Container}>
      <h1 className={styles.title}>项目背景</h1>
      <p className={styles.paragraph}>
        这里是项目的背景介绍。可以包含项目的起源、目标、愿景等信息。
      </p>
    </div>
  );
};

export default Background;
