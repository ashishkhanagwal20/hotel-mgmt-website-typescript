'use server';

import { revalidatePath } from 'next/cache';
import { SessionUserType } from '../interfacetype';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings } from './data-service';
import { redirect } from 'next/navigation';

export async function updateProfile(formData: FormData) {
  const session = await auth();
  let nationality: string | undefined;
  let countryFlag: string | undefined;
  if (!session) throw new Error('Not authenticated');
  const nationalID = formData.get('nationalID');
  const nationalityValue1 = formData.get('nationality');
  if (typeof nationalityValue1 === 'string') {
    const [nationalityValue, countryFlagValue] = nationalityValue1.split('%');
    nationality = nationalityValue;
    countryFlag = countryFlagValue;
  }
  const alphanumericRegex = /^[a-zA-Z0-9]{6,20}$/;
  if (nationalID === null) {
    throw new Error('National ID is missing');
  }
  const nationalIDString = nationalID as string;

  if (!alphanumericRegex.test(nationalIDString)) {
    throw new Error('Invalid national ID,Please provide valid national ID');
  } else {
    const updateData = { nationalID, nationality, countryFlag };
    const { data, error } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', (session?.user as SessionUserType)?.guestId);

    if (error) throw new Error('Guest could not be updated');
    revalidatePath('/account/profile');
  }
}

export async function createBooking(bookingData: any, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Not authenticated');

  const newBooking = {
    ...bookingData,
    guestId: (session?.user as SessionUserType)?.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations')?.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',
  };
  const { error } = await supabase.from('bookings').insert([newBooking]);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be created');
  }
  revalidatePath('/cabins/${bookingData.cabinId}');
  redirect('/cabins/thankyou');
}
export async function deleteReservation(bookingId: number) {
  const session = await auth();
  if (!session) throw new Error('Not authenticated');
  const guestBookings = await getBookings(
    (session?.user as SessionUserType)?.guestId
  );
  const guestBookingIds = guestBookings.map(
    (booking: { id: number }) => booking.id
  );

  if (!guestBookingIds.includes(bookingId)) {
    throw new Error('Not authorized to Delete');
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw new Error('Booking could not be deleted');
  revalidatePath('account/reservations');
}

export async function updateBooking(formData: FormData) {
  const bookingId = Number(formData.get('bookingId'));
  const session = await auth();
  if (!session) throw new Error('Not authenticated');
  const guestBookings = await getBookings(
    (session?.user as SessionUserType)?.guestId
  );
  const guestBookingIds = guestBookings.map(
    (booking: { id: number }) => booking.id
  );

  if (!guestBookingIds.includes(bookingId)) {
    throw new Error('Not authorized to Update');
  }
  const updateData = {
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations')?.slice(0, 1000),
  };

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath('/account/reservations');
  redirect('/account/reservations');
}
export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
