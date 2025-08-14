import { type Row } from "../data/data";

type EditFormProps = {
  editRow: Row;
  onChange: (row: Row) => void;
};

export function EditForm({ editRow, onChange }: EditFormProps) {
  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex gap-3 justify-content-center align-items-center">
        <div className="col-12 col-md-6">
          <label className="form-label">구분</label>
          <select
            className="form-select"
            value={editRow.section}
            onChange={(e) => onChange({ ...editRow, section: e.target.value })}
          >
            <option value="월보장">월보장</option>
            <option value="미분류">미분류</option>
            <option value="슬롯">슬롯</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">PID</label>
          <input
            className="form-control"
            value={editRow.pid}
            onChange={(e) => onChange({ ...editRow, pid: e.target.value })}
          />
        </div>
      </div>
      <div className="d-flex gap-3 justify-content-center align-items-center">
        <div className="col-12 col-md-6">
          <label className="form-label">키워드</label>
          <input
            className="form-control"
            value={editRow.keyword}
            onChange={(e) => onChange({ ...editRow, keyword: e.target.value })}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">플레이스</label>
          <input
            className="form-control"
            value={editRow.place}
            onChange={(e) => onChange({ ...editRow, place: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
