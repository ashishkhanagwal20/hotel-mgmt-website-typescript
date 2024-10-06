'use client';
import { useOptimistic } from 'react';
import { BookingType2 } from '../interfacetype';
import ReservationCard from './ReservationCard';
import { deleteReservation } from '../_lib/actions';

export default function ReservationList({
  bookings,
}: {
  bookings: BookingType2[];
}) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }
  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
