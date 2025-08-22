"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaFileWord } from "react-icons/fa";
import {
  MdAdd,
  MdChecklist,
  MdDashboard,
  MdDelete,
  MdLogout,
  MdManageAccounts,
  MdOutlineSettings,
  MdPlace,
  MdRateReview,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import styles from "./header.module.css";
import Add from "./Add";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (pathname === "/login") {
    return null;
  }

  const failAccount = () => {
    router.push("/fail_account");
  };

  return (
    <header className={styles.header}>
      <div className="app-container-1440">
        <div className={styles.inner}>
          <div className={styles.brand}>1DOT PLACE</div>
          <nav className={styles.nav} aria-label="Primary">
            {isAuthenticated && (
              <div className="d-flex gap-1">
                {pathname.startsWith("/dashboard") ? (
                  <>
                    <button
                      className="btn btn-primary d-flex align-items-center gap-1"
                      onClick={() => router.push("/")}
                    >
                      <MdPlace size={20} />
                      <span>Place</span>
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-1">
                      <MdRateReview size={20} />
                      <span>Review</span>
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center gap-1"
                      onClick={failAccount}
                    >
                      <MdOutlineSettings size={20} />
                      <span>Fail ID</span>
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center gap-1"
                      onClick={logout}
                    >
                      <MdLogout size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : pathname.startsWith("/fail_account") ? (
                  <>
                    <button
                      className="btn btn-primary d-flex align-items-center gap-1"
                      onClick={() => router.push("/")}
                    >
                      <MdPlace size={20} />
                      <span>Place</span>
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-1">
                      <MdRateReview size={20} />
                      <span>Review</span>
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center gap-1"
                      onClick={logout}
                    >
                      <MdLogout size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary d-flex align-items-center gap-1">
                      <MdRateReview size={20} />
                      <span>Review</span>
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-1">
                      <FaFileWord size={16} />
                      <span>Keyword Edit</span>
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-1">
                      <MdManageAccounts size={20} />
                      <span>Account Edit</span>
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center gap-1"
                      onClick={() => router.push("/dashboard")}
                    >
                      <MdDashboard size={20} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center gap-1"
                      onClick={() => setIsAddOpen(true)}
                    >
                      <MdAdd size={20} />
                      <span>Add</span>
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-1">
                      <MdDelete size={20} />
                      <span>Remove</span>
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-1">
                      <MdChecklist size={20} />
                      <span>Check All</span>
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center gap-1"
                      onClick={failAccount}
                    >
                      <MdOutlineSettings size={20} />
                      <span>Fail ID</span>
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center gap-1"
                      onClick={logout}
                    >
                      <MdLogout size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
      {isAuthenticated && (
        <Add
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={() => setIsAddOpen(false)}
        />
      )}
    </header>
  );
}
