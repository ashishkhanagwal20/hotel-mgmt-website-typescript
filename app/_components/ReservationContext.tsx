"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { DateRange } from "react-day-picker";

// Define the shape of the context
interface ReservationContextType {
  range: DateRange | undefined;
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  resetRange: () => void;
}

// Define the initial state for the date range
const initialState: DateRange = {
  from: undefined,
  to: undefined,
};

// Create the context with the correct type
const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

function ReservationProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange | undefined>(initialState);

  const resetRange = () => {
    setRange(initialState);
  };

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }

  return context;
}

export { ReservationProvider, useReservation };
