import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="app-container-1280">
        <div className={styles.inner}>
          <div className={styles.brand}>1DOT PLACE</div>
          <nav className={styles.nav} aria-label="Primary">
            <button className="btn btn-primary">
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
