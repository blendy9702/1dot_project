"use client";

import { useMemo, useState } from "react";

type RemoveItem = {
  id: string;
  keyword: string;
  place: string;
};

interface RemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemove?: (id: string) => void;
  items?: RemoveItem[];
}

export default function RemoveModal({
  isOpen,
  onClose,
  onRemove,
  items,
}: RemoveModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("");

  const options = useMemo<RemoveItem[]>(
    () =>
      items ?? [
        { id: "rm-001", keyword: "커피", place: "서울" },
        { id: "rm-002", keyword: "피자", place: "부산" },
        { id: "rm-003", keyword: "스시", place: "인천" },
        { id: "rm-004", keyword: "파스타", place: "대구" },
        { id: "rm-005", keyword: "라멘", place: "대전" },
      ],
    [items]
  );

  const overlayStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }),
    []
  );

  const modalStyle = useMemo<React.CSSProperties>(
    () => ({
      backgroundColor: "#fff",
      borderRadius: 8,
      width: "min(640px, 92vw)",
      padding: 20,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    }),
    []
  );

  const labelStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: 13,
      color: "#333",
      fontWeight: 600,
      marginBottom: 6,
    }),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.keyword.toLowerCase().includes(q) || o.place.toLowerCase().includes(q)
    );
  }, [options, query]);

  if (!isOpen) return null;

  const handleRemove = () => {
    if (!selected) return onClose();
    onRemove?.(selected);
    onClose();
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Remove</h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={labelStyle}>검색 (키워드/플레이스)</label>
            <input
              className="form-control"
              placeholder="예: 커피 또는 서울"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
            />
          </div>

          <div>
            <label style={labelStyle}>삭제할 항목 선택</label>
            <select
              className="form-select"
              size={1}
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {filtered.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.keyword} - {opt.place}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 16,
          }}
        >
          <button className="btn btn-outline-secondary" onClick={onClose}>
            취소
          </button>
          <button className="btn btn-danger" onClick={handleRemove}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
