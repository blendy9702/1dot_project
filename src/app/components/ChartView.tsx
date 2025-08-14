import { type Row } from "../data/data";

type ChartViewProps = {
  data: number[];
  row?: Row | null;
};

export function ChartView({ data, row }: ChartViewProps) {
  const total = data.reduce((a, b) => a + b, 0);
  const avg = data.length > 0 ? Math.round(total / data.length) : 0;
  return (
    <div>
      <div className="mb-2">
        <small className="text-muted">최근 7일 지표 (데모)</small>
      </div>
      <div className="d-flex align-items-end gap-2" style={{ height: 160 }}>
        {data.map((v, index) => (
          <div
            key={index}
            className="bg-primary"
            style={{ width: 24, height: v }}
            title={`${v}`}
          ></div>
        ))}
      </div>
      {row && (
        <div className="mt-2 text-muted small">
          합계: {total.toLocaleString()} / 평균: {avg.toLocaleString()}
        </div>
      )}
    </div>
  );
}
