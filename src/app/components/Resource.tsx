import React from "react";
import styles from "../styles/BasicStyles.module.css"; // 导入CSS模块

const Resource: React.FC = () => {
  return (
    <div className={styles.Container}>
      <h1 className={styles.title}>数据来源</h1>
      <p className={styles.paragraph}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet vero
        voluptate iusto totam dolores? Suscipit ipsam, quasi laboriosam velit
        nostrum ullam ipsa placeat ut natus autem fuga corporis eveniet in.
      </p>
    </div>
  );
};

export default Resource;
