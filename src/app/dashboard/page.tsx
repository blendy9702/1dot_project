"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import { Pagination } from "../components/Pagination";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  type PcInfo,
  type AccountInfo,
  generatePcData,
  generateAccountData,
} from "../data/data";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

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

  // PC별 작업량 - 검색 필터
  const [pcNameQuery, setPcNameQuery] = useState<string>("");
  const [pcMinCount, setPcMinCount] = useState<string>("");
  const [pcMaxCount, setPcMaxCount] = useState<string>("");

  const filteredPcForChart = useMemo(() => {
    const min =
      pcMinCount === "" ? Number.NEGATIVE_INFINITY : Number(pcMinCount);
    const max =
      pcMaxCount === "" ? Number.POSITIVE_INFINITY : Number(pcMaxCount);
    return pcList
      .filter((pc) => pc.name.toLowerCase().includes(pcNameQuery.toLowerCase()))
      .filter((pc) => pc.jobCount >= min && pc.jobCount <= max);
  }, [pcList, pcNameQuery, pcMinCount, pcMaxCount]);
  // PC별 작업량 리스트 페이지네이션
  const [pcChartPage, setPcChartPage] = useState<number>(1);
  const PC_CHART_PAGE_SIZE = 10;
  useEffect(() => {
    setPcChartPage(1);
  }, [pcNameQuery, pcMinCount, pcMaxCount]);
  const pcChartTotalPages = useMemo(
    () =>
      Math.max(1, Math.ceil(filteredPcForChart.length / PC_CHART_PAGE_SIZE)),
    [filteredPcForChart.length]
  );
  const pcChartVisible = useMemo(() => {
    const start = (pcChartPage - 1) * PC_CHART_PAGE_SIZE;
    return filteredPcForChart.slice(start, start + PC_CHART_PAGE_SIZE);
  }, [filteredPcForChart, pcChartPage]);

  // 계정별 작업량 - 검색 필터
  const [accountList] = useState<AccountInfo[]>(() => generateAccountData(24));
  const [accountQuery, setAccountQuery] = useState<string>("");
  const [accountMinCount, setAccountMinCount] = useState<string>("");
  const [accountMaxCount, setAccountMaxCount] = useState<string>("");

  const filteredAccountForChart = useMemo(() => {
    const min =
      accountMinCount === ""
        ? Number.NEGATIVE_INFINITY
        : Number(accountMinCount);
    const max =
      accountMaxCount === ""
        ? Number.POSITIVE_INFINITY
        : Number(accountMaxCount);
    return accountList
      .filter((a) =>
        a.accountId.toLowerCase().includes(accountQuery.toLowerCase())
      )
      .filter((a) => a.jobCount >= min && a.jobCount <= max);
  }, [accountList, accountQuery, accountMinCount, accountMaxCount]);
  // 계정 리스트 페이지네이션
  const [accountPage, setAccountPage] = useState<number>(1);
  const ACCOUNT_PAGE_SIZE = 10;
  useEffect(() => {
    setAccountPage(1);
  }, [accountQuery, accountMinCount, accountMaxCount]);
  const accountTotalPages = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil(filteredAccountForChart.length / ACCOUNT_PAGE_SIZE)
      ),
    [filteredAccountForChart.length]
  );
  const accountVisible = useMemo(() => {
    const start = (accountPage - 1) * ACCOUNT_PAGE_SIZE;
    return filteredAccountForChart.slice(start, start + ACCOUNT_PAGE_SIZE);
  }, [filteredAccountForChart, accountPage]);

  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <div className="app-container-1440 py-4">
        {/* PC 현황 */}
        <div className="mb-4 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-2">PC 현황</h5>
            <div className="d-flex align-items-end gap-2">
              <div className="d-none d-md-block text-muted small">
                총 {pcFiltered.length}대
              </div>
              <div className="d-flex gap-2">
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
            </div>
          </div>
          <div className="table-responsive">
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

        {/* PC별 작업량 */}
        <div className="mb-4 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-2">PC별 작업량</h5>
          </div>
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pcList}
                margin={{ top: 8, right: 8, bottom: 32, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [v, "작업 수"]} />
                <Bar dataKey="jobCount" name="작업 수" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* PC별 작업량 리스트 */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-2">PC별 작업량 리스트</h5>
            <div className="text-muted small">
              총 {filteredPcForChart.length}건
            </div>
          </div>
          {/* PC 리스트 필터 */}
          <div className="mb-4 p-3 bg-light border rounded">
            <div className="d-flex gap-2 align-items-end mb-3">
              <div>
                <label className="form-label mb-1 small">PC 이름</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="PC 이름 검색"
                  value={pcNameQuery}
                  onChange={(e) => setPcNameQuery(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label mb-1 small">최소 작업 수</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="min"
                  value={pcMinCount}
                  onChange={(e) => setPcMinCount(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label mb-1 small">최대 작업 수</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="max"
                  value={pcMaxCount}
                  onChange={(e) => setPcMaxCount(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>PC 이름</th>
                    <th>작업 수</th>
                  </tr>
                </thead>
                <tbody>
                  {pcChartVisible.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted py-4">
                        조건에 맞는 데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    pcChartVisible.map((pc) => (
                      <tr key={pc.name}>
                        <td>{pc.name}</td>
                        <td>{pc.jobCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <Pagination
                currentPage={pcChartPage}
                totalPages={pcChartTotalPages}
                onPageChange={setPcChartPage}
              />
            </div>
          </div>
        </div>
        {/* 계정별 작업량 */}
        <div className="mb-4 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-2">계정별 작업량</h5>
          </div>
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={accountList}
                margin={{ top: 8, right: 8, bottom: 32, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="accountId"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [v, "작업 수"]} />
                <Bar dataKey="jobCount" name="작업 수" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-2">계정별 작업량 리스트</h5>
            <div className="text-muted small">
              총 {filteredAccountForChart.length}건
            </div>
          </div>
          {/* 계정 리스트 필터 */}
          <div className="mb-4 p-3 bg-light border rounded">
            <div className="d-flex gap-2 align-items-end mb-3">
              <div>
                <label className="form-label mb-1 small">계정</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="계정 검색"
                  value={accountQuery}
                  onChange={(e) => setAccountQuery(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label mb-1 small">최소 작업 수</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="min"
                  value={accountMinCount}
                  onChange={(e) => setAccountMinCount(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label mb-1 small">최대 작업 수</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="max"
                  value={accountMaxCount}
                  onChange={(e) => setAccountMaxCount(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>계정</th>
                    <th>작업 수</th>
                  </tr>
                </thead>
                <tbody>
                  {accountVisible.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted py-4">
                        조건에 맞는 데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    accountVisible.map((a) => (
                      <tr key={a.accountId}>
                        <td>{a.accountId}</td>
                        <td>{a.jobCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <Pagination
                currentPage={accountPage}
                totalPages={accountTotalPages}
                onPageChange={setAccountPage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
