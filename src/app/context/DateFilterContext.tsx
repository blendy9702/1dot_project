"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

type DateFilterContextType = {
  dateFrom: string;
  dateTo: string;
  allDates: boolean;
  setDateFrom: (v: string) => void;
  setDateTo: (v: string) => void;
  setAllDates: (v: boolean) => void;
  resetToToday: () => void;
};

const DateFilterContext = createContext<DateFilterContextType | undefined>(
  undefined
);

const getTodayStr = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const DateFilterProvider = ({ children }: { children: ReactNode }) => {
  const initial = useMemo(() => getTodayStr(), []);
  const [dateFrom, setDateFrom] = useState<string>(initial);
  const [dateTo, setDateTo] = useState<string>(initial);
  const [allDates, setAllDates] = useState<boolean>(false);

  const resetToToday = () => {
    const todayStr = getTodayStr();
    setDateFrom(todayStr);
    setDateTo(todayStr);
    setAllDates(false);
  };

  const value = useMemo(
    () => ({
      dateFrom,
      dateTo,
      allDates,
      setDateFrom,
      setDateTo,
      setAllDates,
      resetToToday,
    }),
    [dateFrom, dateTo, allDates]
  );

  return (
    <DateFilterContext.Provider value={value}>
      {children}
    </DateFilterContext.Provider>
  );
};

export const useDateFilter = () => {
  const ctx = useContext(DateFilterContext);
  if (!ctx)
    throw new Error("useDateFilter must be used within a DateFilterProvider");
  return ctx;
};
