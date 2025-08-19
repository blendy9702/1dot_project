import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { generatePcData, PcInfo } from "@/app/data/data";
import { Pagination } from "../Pagination";

export function PcWorkload() {
  // PC 현황 데이터 및 페이지네이션(10개 고정)
  const [pcList] = useState<PcInfo[]>(() => generatePcData(37));
  const [pcPage, setPcPage] = useState<number>(1);
  const PC_PAGE_SIZE = 10;

  // PC 현황 검색/조회 상태
  const [pcNameFilter, setPcNameFilter] = useState<string>("");
  const [pcQueryMode, setPcQueryMode] = useState<"daily" | "range">("daily");
  const [pcDate, setPcDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [pcDateStart, setPcDateStart] = useState<string>("");
  const [pcDateEnd, setPcDateEnd] = useState<string>("");

  const pcFiltered = useMemo(() => {
    return pcList
      .filter((pc) =>
        pc.name.toLowerCase().includes(pcNameFilter.toLowerCase())
      )
      .filter((pc) => {
        const lastDate = format(pc.lastCheckedAt, "yyyy-MM-dd");
        if (pcQueryMode === "daily") {
          if (!pcDate) return true;
          return lastDate === pcDate;
        }
        // range
        if (pcDateStart && pcDateEnd)
          return lastDate >= pcDateStart && lastDate <= pcDateEnd;
        if (pcDateStart && !pcDateEnd) return lastDate >= pcDateStart;
        if (!pcDateStart && pcDateEnd) return lastDate <= pcDateEnd;
        return true;
      });
  }, [pcList, pcNameFilter, pcQueryMode, pcDate, pcDateStart, pcDateEnd]);

  useEffect(() => {
    setPcPage(1);
  }, [pcNameFilter, pcQueryMode, pcDate, pcDateStart, pcDateEnd]);

  const pcTotalPages = useMemo(
    () => Math.max(1, Math.ceil(pcFiltered.length / PC_PAGE_SIZE)),
    [pcFiltered.length]
  );

  const pcVisible = useMemo(() => {
    const start = (pcPage - 1) * PC_PAGE_SIZE;
    return pcFiltered.slice(start, start + PC_PAGE_SIZE);
  }, [pcFiltered, pcPage]);

  return (
    <div>
      {/* PC 현황 */}
      <div className="mb-4 p-3 bg-light border rounded">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="m-2">PC 현황</h5>
          <div className="d-flex align-items-end gap-2">
            <div className="d-none d-md-block text-muted small">
              총 {pcFiltered.length}대
            </div>
          </div>
        </div>
        <div className="mb-3 d-flex gap-2 align-items-end">
          <div>
            <label className="form-label mb-1 small">PC 이름</label>
            <input
              className="form-control form-control-sm"
              placeholder="PC 이름 검색"
              value={pcNameFilter}
              onChange={(e) => setPcNameFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label mb-1 small">조회 방식</label>
            <select
              className="form-select form-select-sm"
              value={pcQueryMode}
              onChange={(e) =>
                setPcQueryMode(e.target.value as "daily" | "range")
              }
            >
              <option value="daily">일일조회</option>
              <option value="range">범위조회</option>
            </select>
          </div>
          {pcQueryMode === "daily" ? (
            <div>
              <label className="form-label mb-1 small">날짜</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={pcDate}
                onChange={(e) => setPcDate(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div>
                <label className="form-label mb-1 small">시작일</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={pcDateStart}
                  onChange={(e) => setPcDateStart(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label mb-1 small">종료일</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={pcDateEnd}
                  onChange={(e) => setPcDateEnd(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        <div className="table-responsive" style={{ minHeight: 400 }}>
          <table className="table table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: 200 }}>PC 이름</th>
                <th style={{ width: 220 }}>마지막 체크 시간</th>
                <th style={{ width: 120 }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {pcVisible.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-4">
                    조건에 맞는 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                pcVisible.map((pc) => (
                  <tr key={pc.name}>
                    <td>{pc.name}</td>
                    <td>
                      {format(pc.lastCheckedAt, "yyyy-MM-dd a hh:mm", {
                        locale: ko,
                      })}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          pc.status === "정상"
                            ? "text-bg-success"
                            : pc.status === "오류"
                            ? "text-bg-warning"
                            : "text-bg-secondary"
                        }`}
                      >
                        {pc.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2">
          <Pagination
            currentPage={pcPage}
            totalPages={pcTotalPages}
            onPageChange={setPcPage}
          />
        </div>
      </div>
    </div>
  );
}
