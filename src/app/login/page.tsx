"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createDraggable } from "animejs";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (imgRef.current) {
      createDraggable(imgRef.current, {
        releaseEase: "out(3)",
        releaseStiffness: 60,
        onGrab: () => console.log("Grabbed"),
        onDrag: () => console.log("Dragging"),
        onRelease: () => console.log("Released"),
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual API call for authentication
    if (email && password) {
      login();
    }
  };

  return (
    <div className={styles.container}>
      <div className="app-container-1440">
        <div
          ref={imgRef}
          className="d-flex justify-content-center align-items-center pb-5"
        >
          <Image src="/images/1dot.png" alt="logo" width={150} height={150} />
        </div>
      </div>
      <div className="bg-white d-flex flex-column justify-content-center align-items-center border rounded p-5 w-full">
        <h1 className={styles.title}>로그인</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.label}>
            <span className={styles.labelText}>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.label}>
            <span className={styles.labelText}>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
