"use client";

import { useMemo, useState } from "react";

export type TextFileOption = {
  id: string;
  name: string;
  content?: string;
};

interface AccountEditProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (data: { id: string; content: string }) => void;
  files?: TextFileOption[];
}

export default function AccountEdit({
  isOpen,
  onClose,
  onApply,
  files,
}: AccountEditProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const options = useMemo(
    () =>
      files ?? [
        {
          id: "ac-001",
          name: "accounts_group_a.txt",
          content: "user001\nuser002\nuser003",
        },
        {
          id: "ac-002",
          name: "accounts_group_b.txt",
          content: "user101\nuser102\nuser103",
        },
        { id: "ac-003", name: "blocklist.txt", content: "spam_user\nbot_123" },
        { id: "ac-004", name: "replace_rules.txt", content: "admin->manager" },
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
            Account Edit
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
