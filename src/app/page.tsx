"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChartView } from "./components/ChartView";
import { EditForm } from "./components/EditForm";
import Header from "./components/header";
import { Pagination } from "./components/Pagination";
import { ViewDetails } from "./components/ViewDetails";
import { useAuth } from "./context/AuthContext";
import { type Row, generateDummyRows } from "./data/data";
import styles from "./page.module.css";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const [sectionFilter, setSectionFilter] = useState<string>("전체");
  const [keywordFilter, setKeywordFilter] = useState<string>("");
  const [placeFilter, setPlaceFilter] = useState<string>("");
  const [pidFilter, setPidFilter] = useState<string>("");

  const [rows, setRows] = useState<Row[]>(() => generateDummyRows());

  const [activeRow, setActiveRow] = useState<Row | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "chart" | null>(
    null
  );
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [openMenuPid, setOpenMenuPid] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleDocumentMouseDown = (e: MouseEvent) => {
      if (!openMenuPid) return;
      const target = e.target as Node | null;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setOpenMenuPid(null);
      }
    };
    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () =>
      document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, [openMenuPid]);

  const filtered = useMemo(() => {
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
        return true;
      })
      .sort((a, b) => (a.pid < b.pid ? -1 : 1));
  }, [rows, sectionFilter, keywordFilter, placeFilter, pidFilter]);

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

  const chartDataFor = (row: Row | null) =>
    row ? row.stats7d : ([] as number[]);

  const dateLabels = useMemo(() => {
    const labels: string[] = [];
    for (let d = 6; d >= 0; d--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - d);
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const dd = String(dt.getDate()).padStart(2, "0");
      labels.push(`${mm}/${dd}`);
    }
    return labels;
  }, []);

  const totalPages = useMemo(() => {
    if (pageSize === "all") return 1;
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const visibleRows = useMemo(() => {
    if (pageSize === "all") return filtered;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, pageSize, currentPage]);

  // 페이지 버튼 렌더링은 `Pagination` 컴포넌트에서 처리
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <div className={styles.center}>
        <div className={styles.centerBox}>
          <div className={styles.hTextCenter} id="animatedText">
            1DOT PLACE RANK CHECK
          </div>
        </div>
        <div className="app-container-1440">
          <div className="mt-4 p-3 bg-light border rounded">
            <div className="d-flex gap-4 justify-content-center align-items-center">
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
            </div>
          </div>

          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">데이터 리스트</h5>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label small text-nowrap m-0">
                    페이지 수
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={pageSize === "all" ? "all" : String(pageSize)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPageSize(val === "all" ? "all" : Number(val));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">전체</option>
                    <option value="5">5개</option>
                    <option value="10">10개</option>
                    <option value="15">15개</option>
                  </select>
                </div>
              </div>
              <div className="text-muted">총 {filtered.length}건</div>
            </div>
            {pageSize !== "all" && totalPages > 1 && (
              <div className="my-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 110 }}>구분</th>
                    <th style={{ width: 200 }}>키워드</th>
                    <th style={{ width: 300 }}>플레이스</th>
                    <th style={{ width: 140 }}>PID</th>
                    <th>
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        {dateLabels.map((d, i) => (
                          <small
                            key={i}
                            style={{
                              fontSize: 16,
                              lineHeight: "20px",
                              width: 50,
                              textAlign: "center",
                              paddingBottom: "2px",
                            }}
                          >
                            {d}
                          </small>
                        ))}
                      </div>
                    </th>
                    <th style={{ width: 180 }}>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        조건에 맞는 데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((row) => (
                      <tr key={row.pid}>
                        <td>{row.section}</td>
                        <td>{row.keyword}</td>
                        <td>{row.place}</td>
                        <td>{row.pid}</td>
                        <td>
                          <div className="d-flex justify-content-center align-items-center gap-3">
                            {row.stats7d.map((v, i) => (
                              <div
                                key={i}
                                className="d-flex flex-column align-items-center"
                                style={{ width: 50 }}
                              >
                                <small
                                  className="text-muted"
                                  style={{ fontSize: 16, lineHeight: "16px" }}
                                >
                                  {v}
                                </small>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div
                            className="position-relative"
                            ref={openMenuPid === row.pid ? menuRef : null}
                          >
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                setOpenMenuPid((prev) =>
                                  prev === row.pid ? null : row.pid
                                )
                              }
                            >
                              메뉴
                            </button>
                            {openMenuPid === row.pid && (
                              <div
                                className="position-absolute mt-1 bg-white border rounded shadow-sm"
                                style={{
                                  minWidth: 110,
                                  zIndex: 10,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                }}
                              >
                                <button
                                  className={`dropdown-item w-100 p-2 ${styles.menuItem}`}
                                  onClick={() => {
                                    openEdit(row);
                                    setOpenMenuPid(null);
                                  }}
                                >
                                  수정
                                </button>
                                <button
                                  className={`dropdown-item w-100 p-2 ${styles.menuItem}`}
                                >
                                  조회
                                </button>
                                <button
                                  className={`dropdown-item w-100 p-2 ${styles.menuItem}`}
                                  onClick={() => {
                                    openChart(row);
                                    setOpenMenuPid(null);
                                  }}
                                >
                                  차트
                                </button>
                              </div>
                            )}
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
                    {modalType === "edit" && "플레이스 수정"}
                    {modalType === "view" && "무슨 조회지?"}
                    {modalType === "chart" && "플레이스 랭크 차트"}
                  </h6>
                  {modalType === "chart" && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={closeModal}
                    >
                      닫기
                    </button>
                  )}
                </div>
                <div className="p-3">
                  {modalType === "view" && activeRow && (
                    <ViewDetails row={activeRow} />
                  )}
                  {modalType === "edit" && editRow && (
                    <EditForm
                      editRow={editRow as Row}
                      onChange={(row) => setEditRow(row)}
                    />
                  )}
                  {modalType === "chart" && (
                    <ChartView data={chartDataFor(activeRow)} row={activeRow} />
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
    </>
  );
}
