import React from "react";
import styles from "../styles/BasicStyles.module.css"; // 导入CSS模块

const About: React.FC = () => {
  return (
    <div className={styles.Container}>
      <h1 className={styles.title}>关于我们</h1>
      <p className={styles.paragraph}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum facere
        nobis provident totam fuga corporis fugiat repudiandae rerum aliquid
        praesentium reiciendis enim nihil expedita, natus amet laudantium quasi
        ipsa repellendus?
      </p>
    </div>
  );
};

export default About;
