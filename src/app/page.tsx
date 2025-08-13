"use client";

import styles from "./page.module.css";
import { useMemo, useState } from "react";

export default function Home() {
  type Row = {
    date: string; // YYYY-MM-DD
    section: string; // 구분
    keyword: string; // 키워드
    place: string; // 플레이스
    pid: string; // PID
  };

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const defaultEnd = formatDate(today);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6); // 총 7일 포함
  const defaultStart = formatDate(sevenDaysAgo);

  const [sectionFilter, setSectionFilter] = useState<string>("전체");
  const [keywordFilter, setKeywordFilter] = useState<string>("");
  const [placeFilter, setPlaceFilter] = useState<string>("");
  const [pidFilter, setPidFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);

  const data: Row[] = useMemo(
    () => [
      {
        date: formatDate(new Date()),
        section: "월보장",
        keyword: "커피",
        place: "서울",
        pid: "P1001",
      },
      {
        date: formatDate(new Date()),
        section: "미분류",
        keyword: "베이커리",
        place: "부산",
        pid: "P1002",
      },
      {
        date: formatDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
        section: "슬롯",
        keyword: "피자",
        place: "인천",
        pid: "P1003",
      },
      {
        date: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
        section: "월보장",
        keyword: "스시",
        place: "대구",
        pid: "P1004",
      },
      {
        date: formatDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)),
        section: "월보장",
        keyword: "파스타",
        place: "대전",
        pid: "P1005",
      },
      {
        date: formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
        section: "슬롯",
        keyword: "라멘",
        place: "광주",
        pid: "P1006",
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const sDate = startDate ? new Date(startDate) : null;
    const eDate = endDate ? new Date(endDate) : null;
    return data
      .filter((row) => {
        if (sectionFilter !== "전체" && row.section !== sectionFilter)
          return false;
        if (
          keywordFilter &&
          !row.keyword.toLowerCase().includes(keywordFilter.toLowerCase())
        )
          return false;
        if (
          placeFilter &&
          !row.place.toLowerCase().includes(placeFilter.toLowerCase())
        )
          return false;
        if (
          pidFilter &&
          !row.pid.toLowerCase().includes(pidFilter.toLowerCase())
        )
          return false;
        if (sDate && new Date(row.date) < sDate) return false;
        if (eDate && new Date(row.date) > eDate) return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [
    data,
    sectionFilter,
    keywordFilter,
    placeFilter,
    pidFilter,
    startDate,
    endDate,
  ]);

  return (
    <div className={styles.center}>
      <div className={styles.centerBox}>
        <h1 className={styles.hTextCenter}>1DOT PLACE MANAGEMENT</h1>
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
          <button className="btn btn-primary">
            <span>Remove</span>
          </button>
        </div>

        <div>
          <button className="btn btn-primary">Review</button>
          <button className="btn btn-primary">Dashboard</button>
          <button className="btn btn-primary">Fail ID</button>
          <button className="btn btn-primary">Check All</button>
        </div>
      </div>
      <div className="app-container-1280">
        <div className="mt-4 p-3 bg-light border rounded">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-2">
              <label className="form-label">구분</label>
              <select
                className="form-select"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                <option value="전체">전체</option>
                <option value="월보장">월보장</option>
                <option value="미분류">미분류</option>
                <option value="슬롯">슬롯</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">키워드</label>
              <input
                className="form-control"
                placeholder="키워드 입력"
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">플레이스</label>
              <input
                className="form-control"
                placeholder="플레이스 입력"
                value={placeFilter}
                onChange={(e) => setPlaceFilter(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">PID</label>
              <input
                className="form-control"
                placeholder="PID 입력"
                value={pidFilter}
                onChange={(e) => setPidFilter(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">날짜 (최근 7일 기본)</label>
              <div className="d-flex gap-2">
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="align-self-center">~</span>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">데이터 리스트</h5>
            <small className="text-muted">총 {filtered.length}건</small>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 130 }}>날짜</th>
                  <th style={{ width: 110 }}>구분</th>
                  <th>키워드</th>
                  <th>플레이스</th>
                  <th style={{ width: 140 }}>PID</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      조건에 맞는 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={`${row.date}-${row.pid}`}>
                      <td>{row.date}</td>
                      <td>{row.section}</td>
                      <td>{row.keyword}</td>
                      <td>{row.place}</td>
                      <td>{row.pid}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
