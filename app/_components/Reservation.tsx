import React from "react";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import {
  getBookedDatesByCabinId,
  getCabin,
  getSettings,
} from "../_lib/data-service";
import { CabinType } from "../interfacetype";

export default async function Reservation({ cabin }: { cabin: CabinType }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);
  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      <ReservationForm cabin={cabin} />
    </div>
  );
}
