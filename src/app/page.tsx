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

  const [rows, setRows] = useState<Row[]>(() => [
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
  ]);

  const [activeRow, setActiveRow] = useState<Row | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "chart" | null>(
    null
  );
  const [editRow, setEditRow] = useState<Row | null>(null);

  const filtered = useMemo(() => {
    const sDate = startDate ? new Date(startDate) : null;
    const eDate = endDate ? new Date(endDate) : null;
    return rows
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
    rows,
    sectionFilter,
    keywordFilter,
    placeFilter,
    pidFilter,
    startDate,
    endDate,
  ]);

  const openView = (row: Row) => {
    setActiveRow(row);
    setModalType("view");
  };

  const openEdit = (row: Row) => {
    setEditRow({ ...row });
    setActiveRow(row);
    setModalType("edit");
  };

  const openChart = (row: Row) => {
    setActiveRow(row);
    setModalType("chart");
  };

  const closeModal = () => {
    setActiveRow(null);
    setEditRow(null);
    setModalType(null);
  };

  const saveEdit = () => {
    if (!editRow) return;
    setRows((prev) =>
      prev.map((r) => (r.pid === editRow.pid ? { ...editRow } : r))
    );
    closeModal();
  };

  const chartDataFor = (row: Row | null) => {
    if (!row) return [] as number[];
    const seed = row.pid
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return Array.from({ length: 7 }, (_, i) => ((seed + i * 17) % 50) + 10);
  };

  return (
    <div className={styles.center}>
      <div className={styles.centerBox}>
        <h1 className={styles.hTextCenter}>1DOT PLACE RANK CHECK</h1>
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
                  <th style={{ width: 220 }}>작업</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
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
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => openEdit(row)}
                          >
                            수정
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => openView(row)}
                          >
                            조회
                          </button>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => openChart(row)}
                          >
                            차트
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {modalType && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1050 }}
            onClick={closeModal}
          >
            <div
              className="bg-white text-dark shadow rounded"
              style={{ width: "min(720px, 96vw)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 className="m-0">
                  {modalType === "edit" && "항목 수정"}
                  {modalType === "view" && "상세 조회"}
                  {modalType === "chart" && "차트 보기"}
                </h6>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={closeModal}
                >
                  닫기
                </button>
              </div>
              <div className="p-3">
                {modalType === "view" && activeRow && (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <th style={{ width: 120 }}>날짜</th>
                          <td>{activeRow.date}</td>
                        </tr>
                        <tr>
                          <th>구분</th>
                          <td>{activeRow.section}</td>
                        </tr>
                        <tr>
                          <th>키워드</th>
                          <td>{activeRow.keyword}</td>
                        </tr>
                        <tr>
                          <th>플레이스</th>
                          <td>{activeRow.place}</td>
                        </tr>
                        <tr>
                          <th>PID</th>
                          <td>{activeRow.pid}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                {modalType === "edit" && editRow && (
                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label">날짜</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editRow.date}
                        onChange={(e) =>
                          setEditRow({
                            ...(editRow as Row),
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">구분</label>
                      <select
                        className="form-select"
                        value={editRow.section}
                        onChange={(e) =>
                          setEditRow({
                            ...(editRow as Row),
                            section: e.target.value,
                          })
                        }
                      >
                        <option value="월보장">월보장</option>
                        <option value="미분류">미분류</option>
                        <option value="슬롯">슬롯</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">PID</label>
                      <input
                        className="form-control"
                        value={editRow.pid}
                        onChange={(e) =>
                          setEditRow({
                            ...(editRow as Row),
                            pid: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">키워드</label>
                      <input
                        className="form-control"
                        value={editRow.keyword}
                        onChange={(e) =>
                          setEditRow({
                            ...(editRow as Row),
                            keyword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">플레이스</label>
                      <input
                        className="form-control"
                        value={editRow.place}
                        onChange={(e) =>
                          setEditRow({
                            ...(editRow as Row),
                            place: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {modalType === "chart" && (
                  <div>
                    <div className="mb-2">
                      <small className="text-muted">최근 7일 지표 (데모)</small>
                    </div>
                    <div
                      className="d-flex align-items-end gap-2"
                      style={{ height: 160 }}
                    >
                      {chartDataFor(activeRow).map((v, idx) => (
                        <div
                          key={idx}
                          className="bg-primary"
                          style={{ width: 24, height: v }}
                          title={`${v}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {modalType === "edit" && (
                <div className="p-3 border-top d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={closeModal}
                  >
                    취소
                  </button>
                  <button className="btn btn-primary" onClick={saveEdit}>
                    저장
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
