export interface User {
  id: number;
  name: string;
}

export type CounterProps = { users: User[] };

export type CabinType = {
  id?: number;
  name: string;
  maxCapacity?: number;
  regularPrice: number;
  discount: number;
  image: string;
};

export type BookingType = {
  id: number;
  guestId: number;
  startDate: string;
  endDate: string;
  numNights: number;
  totalPrice: number;
  numGuests: number;
  status: boolean;
  created_at: string;
  cabins: { name: string; image: string };
};

export type SelectCountryType = {
  defaultCountry: string;
  name: string;
  id: string;
  className: string;
};

export type SelectCountryType2 = {
  name: string;
  flag: string;
};
