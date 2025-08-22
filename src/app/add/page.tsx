"use client";

import Header from "../components/header";
import Add from "../components/Add";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AddPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <Add
        isOpen={open}
        onClose={() => {
          setOpen(false);
          router.push("/");
        }}
        onSubmit={(data) => {
          // TODO: 서버로 전송하는 로직을 연결하세요.
          // 현재는 성공 시 홈으로 이동합니다.
          console.log("Add submit:", data);
          setOpen(false);
          router.push("/");
        }}
      />
    </>
  );
}
