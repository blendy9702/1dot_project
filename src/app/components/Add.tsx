"use client";

import { useState, useMemo } from "react";

type AddPlaceFormData = {
  keyword: string;
  placeName: string;
  placeNumber: string;
  placeType: string;
};

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddPlaceFormData) => void;
}

export default function Add({ isOpen, onClose, onSubmit }: AddModalProps) {
  const [form, setForm] = useState<AddPlaceFormData>({
    keyword: "",
    placeName: "",
    placeNumber: "",
    placeType: "미분류",
  });

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
      width: "min(960px, 92vw)",
      padding: 20,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    }),
    []
  );

  const rowStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }),
    []
  );

  const groupStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minWidth: 180,
      flex: "1 1 auto",
    }),
    []
  );

  const labelStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: 13,
      color: "#333",
      fontWeight: 600,
    }),
    []
  );

  if (!isOpen) return null;

  const handleChange = (field: keyof AddPlaceFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit?.(form);
    onClose();
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            플레이스 추가
          </h3>
        </div>

        <div style={rowStyle}>
          <div style={groupStyle}>
            <label style={labelStyle}>키워드</label>
            <input
              className="form-control"
              type="text"
              placeholder="예: 강남 카페"
              value={form.keyword}
              onChange={(e) => handleChange("keyword", e.target.value)}
            />
          </div>
          <div style={groupStyle}>
            <label style={labelStyle}>플레이스명</label>
            <input
              className="form-control"
              type="text"
              placeholder="예: 일닷 플레이스"
              value={form.placeName}
              onChange={(e) => handleChange("placeName", e.target.value)}
            />
          </div>
          <div style={groupStyle}>
            <label style={labelStyle}>플레이스번호</label>
            <input
              className="form-control"
              type="text"
              placeholder="예: 12345678"
              value={form.placeNumber}
              onChange={(e) => handleChange("placeNumber", e.target.value)}
            />
          </div>
          <div style={{ ...groupStyle, minWidth: 160, maxWidth: 220 }}>
            <label style={labelStyle}>유형</label>
            <select
              className="form-select"
              value={form.placeType}
              onChange={(e) => handleChange("placeType", e.target.value)}
            >
              <option value="미분류">미분류</option>
              <option value="월보장">월보장</option>
              <option value="슬롯">슬롯</option>
              <option value="태스트">태스트</option>
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
          <button className="btn btn-primary" onClick={handleSubmit}>
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
