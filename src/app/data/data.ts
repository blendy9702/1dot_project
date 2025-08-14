export type Row = {
  section: string; // 구분
  keyword: string; // 키워드
  place: string; // 플레이스
  pid: string; // PID
  stats7d: number[]; // 최근 7일 값
};

const statsFromPid = (pid: string): number[] => {
  const seed = pid.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return Array.from({ length: 7 }, (_, i) => ((seed + i * 17) % 50) + 10);
};

export const generateDummyRows = (): Row[] =>
  [
    {
      section: "월보장",
      keyword: "커피",
      place: "서울",
      pid: "P1001",
      stats7d: statsFromPid("P1001"),
    },
    {
      section: "미분류",
      keyword: "베이커리",
      place: "부산",
      pid: "P1002",
      stats7d: statsFromPid("P1002"),
    },
    {
      section: "슬롯",
      keyword: "피자",
      place: "인천",
      pid: "P1003",
      stats7d: statsFromPid("P1003"),
    },
    {
      section: "월보장",
      keyword: "스시",
      place: "대구",
      pid: "P1004",
      stats7d: statsFromPid("P1004"),
    },
    {
      section: "월보장",
      keyword: "파스타",
      place: "대전",
      pid: "P1005",
      stats7d: statsFromPid("P1005"),
    },
    {
      section: "슬롯",
      keyword: "라멘",
      place: "광주",
      pid: "P1006",
      stats7d: statsFromPid("P1006"),
    },

    // 임의로 더미 데이터 생성
    ...(() => {
      const sections = ["월보장", "미분류", "슬롯"];
      const keywordsPool = [
        "커피",
        "피자",
        "스시",
        "파스타",
        "라멘",
        "버거",
        "샐러드",
        "디저트",
      ];
      const placesPool = [
        "서울",
        "부산",
        "인천",
        "대구",
        "대전",
        "광주",
        "울산",
        "수원",
      ];
      return Array.from({ length: 50 }, (_, idx) => {
        const n = idx + 1;
        const pid = `P2${String(n).padStart(3, "0")}`;
        return {
          section: sections[n % sections.length],
          keyword: `${keywordsPool[idx % keywordsPool.length]}${n}`,
          place: placesPool[idx % placesPool.length],
          pid,
          stats7d: statsFromPid(pid),
        } as Row;
      });
    })(),
  ].flat();
