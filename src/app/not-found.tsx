"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.content}
      >
        <h1 className={styles.title}>404</h1>
        <p className={styles.description}>페이지를 찾을 수 없습니다.</p>
        <Link href="/" className={styles.link}>
          홈으로 돌아가기
        </Link>
      </motion.div>
    </div>
  );
}
