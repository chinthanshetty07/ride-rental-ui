// Made-up fleet and bookings for the demo. Prices are illustrative, not any company's real tariff.
export const CITIES = ['Bengaluru', 'Mysuru', 'Goa'];

export const BIKES = [
  { id: 'act-6g', name: 'Activa 6G', type: 'Scooter', cc: 110, hourly: 39, daily: 449, freeKmPerDay: 120, extraKm: 4, deposit: 1000, units: { Bengaluru: 3, Mysuru: 2, Goa: 4 } },
  { id: 'ntorq', name: 'Ntorq 125', type: 'Scooter', cc: 125, hourly: 45, daily: 529, freeKmPerDay: 120, extraKm: 4, deposit: 1000, units: { Bengaluru: 2, Mysuru: 1, Goa: 2 } },
  { id: 'splendor', name: 'Splendor Plus', type: 'Commuter', cc: 100, hourly: 35, daily: 399, freeKmPerDay: 150, extraKm: 3, deposit: 1000, units: { Bengaluru: 2, Mysuru: 2, Goa: 0 } },
  { id: 'classic-350', name: 'Classic 350', type: 'Cruiser', cc: 349, hourly: 89, daily: 1149, freeKmPerDay: 150, extraKm: 6, deposit: 3000, units: { Bengaluru: 2, Mysuru: 1, Goa: 3 } },
  { id: 'himalayan', name: 'Himalayan 450', type: 'Adventure', cc: 452, hourly: 129, daily: 1699, freeKmPerDay: 200, extraKm: 8, deposit: 5000, units: { Bengaluru: 1, Mysuru: 0, Goa: 1 } },
  { id: 'duke-390', name: 'Duke 390', type: 'Sports', cc: 399, hourly: 119, daily: 1599, freeKmPerDay: 150, extraKm: 8, deposit: 5000, units: { Bengaluru: 1, Mysuru: 1, Goa: 1 } },
];

// Existing bookings: [bikeId, city, start ISO, end ISO]. Used to compute live availability.
export const BOOKINGS = [
  ['himalayan', 'Bengaluru', '2026-11-14T08:00', '2026-11-16T20:00'],
  ['classic-350', 'Bengaluru', '2026-11-14T09:00', '2026-11-15T09:00'],
  ['classic-350', 'Bengaluru', '2026-11-14T18:00', '2026-11-15T18:00'],
  ['duke-390', 'Goa', '2026-11-13T10:00', '2026-11-20T10:00'],
];
