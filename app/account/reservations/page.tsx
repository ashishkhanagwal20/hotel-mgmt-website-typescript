import ReservationList from '@/app/_components/ReservationList';
import { auth } from '@/app/_lib/auth';
import { getBookings } from '@/app/_lib/data-service';
import { BookingType2 } from '@/app/interfacetype';
export const metadata = {
  title: 'Reservations',
};
import { User } from 'next-auth';
interface CustomUser extends User {
  guestId: string;
}
export default async function Page() {
  // CHANGE
  const session = await auth();

  const bookings: BookingType2[] = await getBookings(
    (session?.user as CustomUser)?.guestId
  );
  console.log('booking', bookings);
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{' '}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
