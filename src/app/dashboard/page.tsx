"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, memo, useDeferredValue } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BlogWorkList } from "../components/ds_components/BlogWorkList";
import { PcWorkload } from "../components/ds_components/PcWorkload";
import Header from "../components/header";
import { Pagination } from "../components/Pagination";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import {
  type AccountInfo,
  generateAccountData,
  generateKeywordData,
  generatePcData,
  generatePlaceData,
  type KeywordInfo,
  type PcInfo,
  type PlaceInfo,
} from "../data/data";

// 메모이즈, 검색 입력 시 부모 리렌더에도 불필요한 차트 리렌더 방지
const PcBarChart = memo(function PcBarChart({ data }: { data: PcInfo[] }) {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
          <Bar
            dataKey="jobCount"
            name="작업 수"
            fill="#2563eb"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

const AccountBarChart = memo(function AccountBarChart({
  data,
}: {
  data: AccountInfo[];
}) {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
          <Bar
            dataKey="jobCount"
            name="작업 수"
            fill="#16a34a"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

const PlaceBarChart = memo(function PlaceBarChart({
  data,
}: {
  data: PlaceInfo[];
}) {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 32, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="placeName"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => [v, "작업 수"]} />
          <Bar
            dataKey="jobCount"
            name="작업 수"
            fill="#7c3aed"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

const KeywordBarChart = memo(function KeywordBarChart({
  data,
}: {
  data: KeywordInfo[];
}) {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 32, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="keyword"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => [v, "작업 수"]} />
          <Bar
            dataKey="jobCount"
            name="작업 수"
            fill="#ef4444"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const [pcList] = useState<PcInfo[]>(() => generatePcData(37));
  // 대시보드 조회 모드: 일일/범위
  const [queryMode, setQueryMode] = useState<"daily" | "range">("daily");
  const [dailyDate, setDailyDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [rangeStart, setRangeStart] = useState<string>("");
  const [rangeEnd, setRangeEnd] = useState<string>("");

  // 범위조회 선택 시 기본값을 오늘로 설정
  useEffect(() => {
    if (queryMode === "range") {
      const today = format(new Date(), "yyyy-MM-dd");
      setRangeStart(today);
      setRangeEnd(today);
    }
  }, [queryMode]);

  // PC별 작업량 - 검색 필터
  const [pcNameQuery, setPcNameQuery] = useState<string>("");
  const [pcMinCount, setPcMinCount] = useState<string>("");
  const [pcMaxCount, setPcMaxCount] = useState<string>("");
  const deferredPcNameQuery = useDeferredValue(pcNameQuery);
  const deferredPcMin = useDeferredValue(pcMinCount);
  const deferredPcMax = useDeferredValue(pcMaxCount);

  const filteredPcForChart = useMemo(() => {
    const min =
      deferredPcMin === "" ? Number.NEGATIVE_INFINITY : Number(deferredPcMin);
    const max =
      deferredPcMax === "" ? Number.POSITIVE_INFINITY : Number(deferredPcMax);
    return pcList
      .filter((pc) =>
        pc.name.toLowerCase().includes(deferredPcNameQuery.toLowerCase())
      )
      .filter((pc) => {
        const d = format(pc.lastCheckedAt, "yyyy-MM-dd");
        if (queryMode === "daily") {
          return d === dailyDate;
        }
        if (queryMode === "range") {
          if (rangeStart && rangeEnd) return d >= rangeStart && d <= rangeEnd;
          if (rangeStart && !rangeEnd) return d >= rangeStart;
          if (!rangeStart && rangeEnd) return d <= rangeEnd;
          return true;
        }
        return true;
      })
      .filter((pc) => pc.jobCount >= min && pc.jobCount <= max);
  }, [
    pcList,
    deferredPcNameQuery,
    deferredPcMin,
    deferredPcMax,
    dailyDate,
    queryMode,
    rangeStart,
    rangeEnd,
  ]);
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
  const deferredAccountQuery = useDeferredValue(accountQuery);
  const deferredAccountMin = useDeferredValue(accountMinCount);
  const deferredAccountMax = useDeferredValue(accountMaxCount);

  const filteredAccountForChart = useMemo(() => {
    const min =
      deferredAccountMin === ""
        ? Number.NEGATIVE_INFINITY
        : Number(deferredAccountMin);
    const max =
      deferredAccountMax === ""
        ? Number.POSITIVE_INFINITY
        : Number(deferredAccountMax);
    // NOTE: 더미 account 데이터에는 날짜가 없어, 일일조회 개념을 맞추기 위해
    // 대시보드 전체 일일조회 시 차트/리스트는 동일하게 표시하되,
    // 실제 날짜 필터는 PC 데이터에만 엄격히 적용됩니다.
    return accountList
      .filter((a) =>
        a.accountId.toLowerCase().includes(deferredAccountQuery.toLowerCase())
      )
      .filter((a) => a.jobCount >= min && a.jobCount <= max);
  }, [
    accountList,
    deferredAccountQuery,
    deferredAccountMin,
    deferredAccountMax,
  ]);
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

  // 플레이스별 작업량 (차트/리스트)
  const [placeList] = useState<PlaceInfo[]>(() => generatePlaceData(36));
  const [placeQuery, setPlaceQuery] = useState<string>("");
  const [placeKeyQuery, setPlaceKeyQuery] = useState<string>("");
  const deferredPlaceQuery = useDeferredValue(placeQuery);
  const deferredPlaceKeyQuery = useDeferredValue(placeKeyQuery);
  const filteredPlaceForList = useMemo(() => {
    const nameQ = deferredPlaceQuery.toLowerCase();
    const keyQ = deferredPlaceKeyQuery.toLowerCase();
    return placeList
      .filter((p) => p.placeName.toLowerCase().includes(nameQ))
      .filter((p) => p.placeKey.toLowerCase().includes(keyQ));
  }, [placeList, deferredPlaceQuery, deferredPlaceKeyQuery]);
  const [placePage, setPlacePage] = useState<number>(1);
  const PLACE_PAGE_SIZE = 10;
  useEffect(() => {
    setPlacePage(1);
  }, [placeQuery, placeKeyQuery]);
  const placeTotalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredPlaceForList.length / PLACE_PAGE_SIZE)),
    [filteredPlaceForList.length]
  );
  const placeVisible = useMemo(() => {
    const start = (placePage - 1) * PLACE_PAGE_SIZE;
    return filteredPlaceForList.slice(start, start + PLACE_PAGE_SIZE);
  }, [filteredPlaceForList, placePage]);

  // 키워드별 작업량 (차트/리스트)
  const [keywordList] = useState<KeywordInfo[]>(() => generateKeywordData(40));
  const [keywordQuery, setKeywordQuery] = useState<string>("");
  const deferredKeywordQuery = useDeferredValue(keywordQuery);
  const filteredKeywordForList = useMemo(() => {
    return keywordList.filter((k) =>
      k.keyword.toLowerCase().includes(deferredKeywordQuery.toLowerCase())
    );
  }, [keywordList, deferredKeywordQuery]);
  const [keywordPage, setKeywordPage] = useState<number>(1);
  const KEYWORD_PAGE_SIZE = 10;
  useEffect(() => {
    setKeywordPage(1);
  }, [keywordQuery]);
  const keywordTotalPages = useMemo(
    () =>
      Math.max(1, Math.ceil(filteredKeywordForList.length / KEYWORD_PAGE_SIZE)),
    [filteredKeywordForList.length]
  );
  const keywordVisible = useMemo(() => {
    const start = (keywordPage - 1) * KEYWORD_PAGE_SIZE;
    return filteredKeywordForList.slice(start, start + KEYWORD_PAGE_SIZE);
  }, [filteredKeywordForList, keywordPage]);

  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <div className="app-container-1440 py-4">
        {/* 대시보드 일일조회 바 */}
        <div className="mb-3 p-3 bg-light border rounded">
          <div className="d-flex align-items-end gap-2 flex-wrap">
            <div>
              <label className="form-label mb-1 small">조회 방식</label>
              <select
                className="form-select form-select-sm"
                value={queryMode}
                onChange={(e) =>
                  setQueryMode(e.target.value as "daily" | "range")
                }
              >
                <option value="daily">일일조회</option>
                <option value="range">범위조회</option>
              </select>
            </div>
            {queryMode === "daily" ? (
              <>
                <div>
                  <label className="form-label mb-1 small">날짜</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={dailyDate}
                    onChange={(e) => setDailyDate(e.target.value)}
                  />
                </div>
                {/* <div className="mb-1">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      setDailyDate(format(new Date(), "yyyy-MM-dd"))
                    }
                  >
                    오늘
                  </button>
                </div> */}
              </>
            ) : (
              <>
                <div>
                  <label className="form-label mb-1 small">시작일</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label mb-1 small">종료일</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* PC 현황 */}
        <div className="d-flex gap-4">
          <div className="col-md-6">
            <PcWorkload
              dailyDate={dailyDate}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              queryMode={queryMode}
            />
          </div>
          <div className="col-md-6">
            <BlogWorkList />
          </div>
        </div>

        {/* PC별 작업량 */}
        <div className="mb-4 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-2">PC별 작업량</h5>
          </div>
          <PcBarChart data={filteredPcForChart} />
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
            <div className="table-responsive" style={{ minHeight: 400 }}>
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
          <AccountBarChart data={accountList} />
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
            <div className="table-responsive" style={{ minHeight: 400 }}>
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
        {/* 플레이스별 작업량 */}
        <div className="mb-4 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-2">플레이스별 작업량</h5>
          </div>
          <PlaceBarChart data={placeList} />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-2">플레이스별 작업량 리스트</h5>
            <div className="text-muted small">
              총 {filteredPlaceForList.length}건
            </div>
          </div>
          <div className="mb-4 p-3 bg-light border rounded">
            <div className="d-flex gap-2 align-items-end mb-3">
              <div>
                <label className="form-label mb-1 small">플레이스명</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="플레이스명 검색"
                  value={placeQuery}
                  onChange={(e) => setPlaceQuery(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label mb-1 small">플레이스키</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="플레이스키 검색"
                  value={placeKeyQuery}
                  onChange={(e) => setPlaceKeyQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive" style={{ minHeight: 400 }}>
              <table className="table table-sm table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>플레이스명</th>
                    <th>플레이스키</th>
                    <th>작업 수</th>
                  </tr>
                </thead>
                <tbody>
                  {placeVisible.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-4">
                        조건에 맞는 데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    placeVisible.map((p) => (
                      <tr key={p.placeKey}>
                        <td>{p.placeName}</td>
                        <td>{p.placeKey}</td>
                        <td>{p.jobCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <Pagination
                currentPage={placePage}
                totalPages={placeTotalPages}
                onPageChange={setPlacePage}
              />
            </div>
          </div>
        </div>

        {/* 키워드별 작업량 */}
        <div className="mb-4 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-2">키워드별 작업량</h5>
          </div>
          <KeywordBarChart data={keywordList} />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-2">키워드별 작업량 리스트</h5>
            <div className="text-muted small">
              총 {filteredKeywordForList.length}건
            </div>
          </div>
          <div className="mb-4 p-3 bg-light border rounded">
            <div className="d-flex gap-2 align-items-end mb-3">
              <div>
                <label className="form-label mb-1 small">키워드</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="키워드 검색"
                  value={keywordQuery}
                  onChange={(e) => setKeywordQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive" style={{ minHeight: 400 }}>
              <table className="table table-sm table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>키워드</th>
                    <th>작업 수</th>
                  </tr>
                </thead>
                <tbody>
                  {keywordVisible.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted py-4">
                        조건에 맞는 데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    keywordVisible.map((k) => (
                      <tr key={k.keyword}>
                        <td>{k.keyword}</td>
                        <td>{k.jobCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <Pagination
                currentPage={keywordPage}
                totalPages={keywordTotalPages}
                onPageChange={setKeywordPage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
