"use client";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.center}>
      <div className={styles.centerBox}>
        <h1>1DOT PLACE MANAGEMENT</h1>
        <div>
          <button className="btn btn-primary">
            <span>Keyword Edit</span>
          </button>
          <button className="btn btn-primary">
            <span>Account Edit</span>
          </button>
          <button className="btn btn-primary">
            <span>Add</span>
          </button>
        </div>
        <div>
          <button className="btn btn-primary">Review</button>
          <button className="btn btn-primary">Dashboard</button>
          <button className="btn btn-primary">Fail ID</button>
          <button className="btn btn-primary">Remove</button>
          <button className="btn btn-primary">Check All</button>
        </div>
      </div>
    </div>
  );
}
