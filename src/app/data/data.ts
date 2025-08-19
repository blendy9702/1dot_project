import { addMinutes, subMinutes } from "date-fns";

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

// 대시보드: PC/계정 더미 데이터 및 타입
export type PcStatus = "정상" | "오류" | "오프라인";

export type PcInfo = {
  name: string;
  lastCheckedAt: Date;
  status: PcStatus;
  jobCount: number;
};

export type AccountInfo = {
  accountId: string;
  jobCount: number;
};

const pcStatuses: PcStatus[] = ["정상", "오류", "오프라인"];

export const generatePcData = (count: number): PcInfo[] => {
  const base = new Date();
  return Array.from({ length: count }, (_, idx) => {
    const name = `PC-${String(idx + 1).padStart(3, "0")}`;
    const offsetMin = (idx * 13) % 720; // 최대 12시간 ± 분 산포
    const lastCheckedAt =
      idx % 2 === 0
        ? subMinutes(base, offsetMin)
        : addMinutes(base, offsetMin % 120);
    const status = pcStatuses[(idx * 7) % pcStatuses.length];
    const jobCount = ((idx * 17) % 200) + (status === "오프라인" ? 0 : 5);
    return { name, lastCheckedAt, status, jobCount } as PcInfo;
  });
};

export const generateAccountData = (count: number): AccountInfo[] =>
  Array.from({ length: count }, (_, idx) => {
    const accountId = `user${String(idx + 1).padStart(3, "0")}`;
    const jobCount = ((idx * 23) % 300) + 3;
    return { accountId, jobCount } as AccountInfo;
  });

// 플레이스/키워드/블로그 더미 데이터 및 타입
export type PlaceInfo = {
  placeName: string;
  placeKey: string;
  jobCount: number;
};

export const generatePlaceData = (count: number): PlaceInfo[] => {
  const places = [
    "서울",
    "부산",
    "인천",
    "대구",
    "대전",
    "광주",
    "울산",
    "수원",
    "창원",
    "용인",
    "고양",
    "성남",
  ];
  return Array.from({ length: count }, (_, idx) => {
    const placeName = places[idx % places.length];
    const placeKey = `PL-${String(idx + 1).padStart(3, "0")}`;
    const jobCount = ((idx * 19) % 400) + 5;
    return { placeName, placeKey, jobCount } as PlaceInfo;
  });
};

export type KeywordInfo = {
  keyword: string;
  jobCount: number;
};

export const generateKeywordData = (count: number): KeywordInfo[] => {
  const candidates = [
    "커피",
    "피자",
    "스시",
    "파스타",
    "라멘",
    "버거",
    "샐러드",
    "디저트",
    "파니니",
    "스테이크",
    "쌀국수",
  ];
  return Array.from({ length: count }, (_, idx) => {
    const base = candidates[idx % candidates.length];
    const keyword = `${base}${idx + 1}`;
    const jobCount = ((idx * 29) % 350) + 4;
    return { keyword, jobCount } as KeywordInfo;
  });
};

export type BlogUsage = {
  url: string;
  accessCount: number;
};

export const generateBlogUsageData = (count: number): BlogUsage[] => {
  return Array.from({ length: count }, (_, idx) => {
    const n = idx + 1;
    const url = `https://blog.example.com/post-${String(n).padStart(3, "0")}`;
    const accessCount = ((idx * 37) % 500) + 10;
    return { url, accessCount } as BlogUsage;
  });
};

// Fail Account 삭제 페이지 데이터
export type FailAccountItem = {
  id: string; // unique id (row key)
  pcName: string;
  accountId: string;
  type: "자동" | "수동" | "시스템";
  date: Date;
};

export const generateFailAccountData = (count: number): FailAccountItem[] => {
  const types: Array<FailAccountItem["type"]> = ["자동", "수동", "시스템"];
  const pcPool = [
    "PC-001",
    "PC-002",
    "PC-003",
    "PC-004",
    "PC-005",
    "PC-006",
    "PC-007",
    "PC-008",
  ];
  const now = new Date();
  return Array.from({ length: count }, (_, idx) => {
    const id = `F-${String(idx + 1).padStart(4, "0")}`;
    const pcName = pcPool[idx % pcPool.length];
    const accountId = `user${String((idx % 120) + 1).padStart(3, "0")}`;
    const type = types[idx % types.length];
    // 최근 60일 내 랜덤 분포
    const daysBack = (idx * 7) % 60;
    const date = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    return { id, pcName, accountId, type, date } as FailAccountItem;
  });
};
