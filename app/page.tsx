"use client"

import styles from "./page.module.css";

const HomePage: React.FC = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gemini 2.0</h1>
      <button className={styles.button}>Add Question Bot</button>
      <button className={styles.button}>Remove Question Bot</button>
    </div>
  );
};

export default HomePage;