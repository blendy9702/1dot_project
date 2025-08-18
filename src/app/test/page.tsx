"use client";

import { useEffect } from "react";
import { createTimeline, text } from "animejs";

export default function TextAnimation() {
  useEffect(() => {
    // 텍스트를 글자 단위로 분리
    const { chars } = text.split("#title", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chars: { wrap: "span" as any }, // 각 글자를 <span>으로 감쌈
    });

    // 타임라인 생성
    const tl = createTimeline();

    // 한 글자씩 위에서 떨어지듯 등장
    tl.add(chars, {
      opacity: [0, 1],
      translateY: [-50, 0],
      delay: (el, i) => i * 70, // 글자 순서대로 지연
      duration: 500,
      easing: "easeOutExpo",
    });

    tl.play(); // 실행
  }, []);

  return (
    <div>
      <h1 id="title" className="text-white">
        1DOT PLACE RANK CHECK
      </h1>
    </div>
  );
}
