"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Header from "../components/header";
import { useAuth } from "../context/AuthContext";
import { Pagination } from "../components/Pagination";
import { FailAccountItem, generateFailAccountData } from "../data/data";

export default function FailAccountPage() {
  const { isAuthenticated } = useAuth();

  // 더미 데이터
  const [rows, setRows] = useState<FailAccountItem[]>(() =>
    generateFailAccountData(127)
  );

  // 검색 상태: PC, ID, 날짜(from~to)
  const [pcQuery, setPcQuery] = useState<string>("");
  const [idQuery, setIdQuery] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // 선택 상태
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 필터링
  const filtered = useMemo(() => {
    return rows
      .filter((r) => r.pcName.toLowerCase().includes(pcQuery.toLowerCase()))
      .filter((r) => r.accountId.toLowerCase().includes(idQuery.toLowerCase()))
      .filter((r) => {
        const d = format(r.date, "yyyy-MM-dd");
        if (dateFrom && d < dateFrom) return false;
        if (dateTo && d > dateTo) return false;
        return true;
      });
  }, [rows, pcQuery, idQuery, dateFrom, dateTo]);

  // 페이지네이션
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 10;
  useEffect(() => {
    setPage(1);
  }, [pcQuery, idQuery, dateFrom, dateTo]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    [filtered.length]
  );
  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // 선택 토글
  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const isChecked = (id: string) => selectedIds.has(id);

  // 현재 페이지 전체 선택/해제
  const toggleCurrentPageAll = () => {
    const allOn = visible.every((r) => selectedIds.has(r.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOn) {
        visible.forEach((r) => next.delete(r.id));
      } else {
        visible.forEach((r) => next.add(r.id));
      }
      return next;
    });
  };

  // 선택 삭제
  const removeSelected = () => {
    if (selectedIds.size === 0) return;
    setRows((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  // 개별 삭제
  const removeOne = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <div className="app-container-1440 py-4">
        <div className="mb-3 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="m-2">Fail Account 삭제</h5>
            <div>
              <button
                className="btn btn-danger btn-sm"
                onClick={removeSelected}
                disabled={selectedIds.size === 0}
              >
                선택 삭제
              </button>
            </div>
          </div>
          <div className="mt-2 d-flex gap-2 align-items-end flex-wrap">
            <div>
              <label className="form-label mb-1 small">PC</label>
              <input
                className="form-control form-control-sm"
                placeholder="PC 검색"
                value={pcQuery}
                onChange={(e) => setPcQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label mb-1 small">ID</label>
              <input
                className="form-control form-control-sm"
                placeholder="ID 검색"
                value={idQuery}
                onChange={(e) => setIdQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label mb-1 small">시작일</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label mb-1 small">종료일</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-light border rounded">
          <div className="table-responsive" style={{ minHeight: 400 }}>
            <table className="table table-sm table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={toggleCurrentPageAll}
                      checked={
                        visible.length > 0 &&
                        visible.every((r) => selectedIds.has(r.id))
                      }
                      aria-label="현재 페이지 전체 선택"
                    />
                  </th>
                  <th style={{ width: 80 }}>순번</th>
                  <th style={{ width: 140 }}>PC</th>
                  <th style={{ width: 160 }}>ID</th>
                  <th style={{ width: 120 }}>유형</th>
                  <th style={{ width: 160 }}>날짜</th>
                  <th style={{ width: 100 }}>삭제</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      조건에 맞는 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  visible.map((r, idx) => (
                    <tr key={r.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isChecked(r.id)}
                          onChange={() => toggleOne(r.id)}
                          aria-label={`Select ${r.id}`}
                        />
                      </td>
                      <td>{(page - 1) * PAGE_SIZE + (idx + 1)}</td>
                      <td>{r.pcName}</td>
                      <td>{r.accountId}</td>
                      <td>{r.type}</td>
                      <td>
                        {format(r.date, "yyyy-MM-dd a hh:mm", { locale: ko })}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeOne(r.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
