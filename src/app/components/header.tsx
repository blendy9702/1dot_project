"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./header.module.css";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className="app-container-1440">
        <div className={styles.inner}>
          <div className={styles.brand}>1DOT PLACE</div>
          <nav className={styles.nav} aria-label="Primary">
            {isAuthenticated && (
              <>
                <button className="btn btn-primary">
                  <span>Review</span>
                </button>
                <button className="btn btn-primary">
                  <span>Keyword Edit</span>
                </button>
                <button className="btn btn-primary">
                  <span>Account Edit</span>
                </button>
                <button className="btn btn-primary">
                  <span>Add</span>
                </button>
                <button className="btn btn-primary">
                  <span>Remove</span>
                </button>
                <button className="btn btn-primary">
                  <span>Dashboard</span>
                </button>
                <button className="btn btn-primary">
                  <span>Fail ID</span>
                </button>
                <button className="btn btn-primary" onClick={logout}>
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
