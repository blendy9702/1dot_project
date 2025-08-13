"use client";

import styles from "./page.module.css";
import { useMemo, useState } from "react";
import { type Row, generateDummyRows } from "./data";

export default function Home() {
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

  return (
    <div className={styles.center}>
      <div className={styles.centerBox}>
        <h1 className={styles.hTextCenter}>1DOT PLACE RANK CHECK</h1>
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
            <small className="text-muted">총 {filtered.length}건</small>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 110 }}>구분</th>
                  <th style={{ width: 200 }}>키워드</th>
                  <th style={{ width: 300 }}>플레이스</th>
                  <th style={{ width: 140 }}>PID</th>
                  <th>미니 차트</th>
                  <th style={{ width: 220 }}>작업</th>
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
                  filtered.map((row) => (
                    <tr key={row.pid}>
                      <td>{row.section}</td>
                      <td>{row.keyword}</td>
                      <td>{row.place}</td>
                      <td>{row.pid}</td>
                      <td>
                        <div
                          className="d-flex justify-content-center align-items-end gap-3"
                          style={{ height: 60 }}
                        >
                          {row.stats7d.map((v, i) => (
                            <div
                              key={i}
                              className="d-flex flex-column align-items-center gap-1"
                              style={{ width: 22 }}
                            >
                              <small
                                className="text-muted"
                                style={{ fontSize: 12, lineHeight: "12px" }}
                              >
                                {v}
                              </small>
                              <div
                                className="bg-primary"
                                style={{
                                  width: 12,
                                  height: Math.max(
                                    4,
                                    Math.round((v / 60) * 36)
                                  ),
                                }}
                              ></div>
                              <small
                                className="text-muted"
                                style={{ fontSize: 12, lineHeight: "12px" }}
                              >
                                {dateLabels[i]}
                              </small>
                            </div>
                          ))}
                        </div>
                      </td>
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
                    {activeRow && (
                      <div className="mt-2 text-muted small">
                        합계:{" "}
                        {activeRow.stats7d
                          .reduce((a, b) => a + b, 0)
                          .toLocaleString()}{" "}
                        / 평균:{" "}
                        {Math.round(
                          activeRow.stats7d.reduce((a, b) => a + b, 0) /
                            activeRow.stats7d.length
                        ).toLocaleString()}
                      </div>
                    )}
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
