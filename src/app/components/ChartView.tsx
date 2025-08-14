"use client";

import { useMemo, useState } from "react";
import { addDays, format, subDays } from "date-fns";
import { type Row } from "../data/data";
import {
  CustomizedLabelLineChart,
  type SeriesPoint,
} from "./CustomizedLabelLineChart";

type ChartViewProps = {
  data: number[]; // 예: 최근 n일의 순위(숫자 낮을수록 상위)
  row?: Row | null;
};

export function ChartView({ data }: ChartViewProps) {
  // 기본: 최근 30일
  const [days, setDays] = useState<number>(30);
  const [startDate, setStartDate] = useState<Date>(
    subDays(new Date(), days - 1)
  );

  // data 길이에 맞춰 날짜 배열 생성 (가장 오래된 날부터 오늘까지)
  const series: SeriesPoint[] = useMemo(() => {
    // 표시 구간 기준 시작일 조정
    const start = startDate;
    const points: SeriesPoint[] = [];
    for (let i = 0; i < days; i++) {
      const d = addDays(start, i);
      const dateKey = format(d, "yyyy-MM-dd");
      // 데이터가 7일 기준일 경우 등 가용 길이와 매칭
      const value = data[i % data.length];
      points.push({ date: dateKey, rank: value });
    }
    return points;
  }, [data, days, startDate]);

  // const total = useMemo(() => series.reduce((a, b) => a + b.rank, 0), [series]);
  // const avg = useMemo(
  //   () => (series.length > 0 ? Math.round(total / series.length) : 0),
  //   [series, total]
  // );

  return (
    <div>
      <div className="row g-2 align-items-end justify-content-center mb-3">
        <div className="col-auto">
          <label className="form-label mb-1">기간(일)</label>
          <select
            className="form-select form-select-sm"
            value={days}
            onChange={(e) => {
              const v = Number(e.target.value);
              setDays(v);
              setStartDate(subDays(new Date(), v - 1));
            }}
          >
            <option value={7}>7</option>
            <option value={14}>14</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
            <option value={90}>90</option>
          </select>
        </div>
        <div className="col-auto">
          <label className="form-label mb-1">시작일</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={format(startDate, "yyyy-MM-dd")}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        {/* <div className="col text-end text-muted small">
          {row ? (
            <span>
              합계: {total.toLocaleString()} / 평균: {avg.toLocaleString()}
            </span>
          ) : null}
        </div> */}
      </div>

      <CustomizedLabelLineChart data={series} yDomain={[1, 100]} height={280} />
    </div>
  );
}
