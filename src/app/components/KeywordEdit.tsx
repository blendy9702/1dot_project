"use client";

import { useMemo, useState } from "react";

export type TextFileOption = {
  id: string;
  name: string;
  content?: string;
};

interface KeywordEditProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (data: { id: string; content: string }) => void;
  files?: TextFileOption[];
}

export default function KeywordEdit({
  isOpen,
  onClose,
  onApply,
  files,
}: KeywordEditProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const options = useMemo(
    () =>
      files ?? [
        {
          id: "kw-001",
          name: "keywords_cafe.txt",
          content: "카페\n커피\n디저트",
        },
        {
          id: "kw-002",
          name: "keywords_pizza.txt",
          content: "피자\n마르게리타\n포테이토",
        },
        {
          id: "kw-003",
          name: "keywords_sushi.txt",
          content: "스시\n사시미\n연어",
        },
        {
          id: "kw-004",
          name: "stopwords_common.txt",
          content: "그리고\n하지만\n또는",
        },
        {
          id: "kw-005",
          name: "replace_rules.txt",
          content: "강남->강남구\n홍대->마포구",
        },
      ],
    [files]
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
      width: "min(720px, 92vw)",
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
    return options.filter((opt) => opt.name.toLowerCase().includes(q));
  }, [options, query]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelected(id);
    const found = options.find((o) => o.id === id);
    setContent(found?.content ?? "");
  };

  const handleApply = () => {
    onApply?.({ id: selected, content });
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
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            Keyword Edit
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={labelStyle}>파일명 검색</label>
            <input
              className="form-control"
              placeholder="파일명을 검색하세요."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
            />
          </div>

          <div>
            <label style={labelStyle}>텍스트 파일 선택</label>
            <select
              className="form-select"
              size={1}
              value={selected}
              onChange={(e) => toggleSelect(e.target.value)}
            >
              {filtered.map((opt) => (
                <option
                  key={opt.id}
                  value={opt.id}
                  onDoubleClick={() => toggleSelect(opt.id)}
                >
                  {opt.name}
                </option>
              ))}
            </select>
            {selected && (
              <div style={{ marginTop: 12 }}>
                <label style={labelStyle}>파일 내용 편집</label>
                <textarea
                  className="form-control"
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="여기에 선택한 파일의 내용을 편집하세요."
                />
              </div>
            )}
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
            닫기
          </button>
          <button className="btn btn-primary" onClick={handleApply}>
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
