import { type Row } from "../data/data";

export function ViewDetails({ row }: { row: Row }) {
  return (
    <div className="table-responsive">
      <table className="table table-sm">
        <tbody>
          <tr>
            <th>구분</th>
            <td>{row.section}</td>
          </tr>
          <tr>
            <th>키워드</th>
            <td>{row.keyword}</td>
          </tr>
          <tr>
            <th>플레이스</th>
            <td>{row.place}</td>
          </tr>
          <tr>
            <th>PID</th>
            <td>{row.pid}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
