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

  const pcTotalPages = useMemo(
    () => Math.max(1, Math.ceil(pcList.length / PC_PAGE_SIZE)),
    [pcList.length]
  );

  const pcVisible = useMemo(() => {
    const start = (pcPage - 1) * PC_PAGE_SIZE;
    return pcList.slice(start, start + PC_PAGE_SIZE);
  }, [pcList, pcPage]);

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

  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <div className="app-container-1440 py-4">
        {/* PC 현황 */}
        <div className="mb-4 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-2">PC 현황</h5>
            <div className="text-muted small">총 {pcList.length}대</div>
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
                {pcVisible.map((pc) => (
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
                ))}
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
            <div className="d-flex gap-2 align-items-end">
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
          </div>
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredPcForChart}
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
        </div>

        {/* 계정별 작업량 */}
        <div className="mb-4 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-2">계정별 작업량</h5>
            <div className="d-flex gap-2 align-items-end">
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
          </div>
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredAccountForChart}
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
        </div>
      </div>
    </>
  );
}
