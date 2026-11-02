// Rental rules, kept out of the UI so they can be tested directly.
export const OPEN_HOUR = 6;      // pickups and drops allowed 6 am – 10 pm
export const CLOSE_HOUR = 22;
export const MIN_HOURS = 4;
export const MAX_DAYS = 30;
export const GST_RATE = 0.18;
const HOUR = 3_600_000;

/** Returns a list of human-readable problems with the chosen times; empty when they're valid. */
export function validateTrip(pickup, drop, now = new Date()) {
  const errors = [];
  if (!(pickup instanceof Date) || isNaN(pickup)) return ['Choose a pickup time'];
  if (!(drop instanceof Date) || isNaN(drop)) return ['Choose a drop time'];
  if (pickup < now) errors.push('Pickup time is in the past');
  for (const [label, d] of [['Pickup', pickup], ['Drop', drop]]) {
    const h = d.getHours() + d.getMinutes() / 60;
    if (h < OPEN_HOUR || h > CLOSE_HOUR) errors.push(`${label} must be between 6 am and 10 pm`);
  }
  const hours = (drop - pickup) / HOUR;
  if (hours <= 0) errors.push('Drop must be after pickup');
  else if (hours < MIN_HOURS) errors.push(`Minimum rental is ${MIN_HOURS} hours`);
  else if (hours > MAX_DAYS * 24) errors.push(`Maximum rental is ${MAX_DAYS} days`);
  return errors;
}

/**
 * Price for a trip: whole days at the daily rate, leftover hours at the hourly rate but never more than one more
 * day. So a 26-hour trip costs 1 day + 2 hours, while a 23-hour trip costs 1 day, not 23 hours.
 */
export function quote(bike, pickup, drop) {
  const hours = Math.max(MIN_HOURS, Math.ceil((drop - pickup) / HOUR));
  const fullDays = Math.floor(hours / 24);
  const rest = hours - fullDays * 24;
  const restCost = Math.min(rest * bike.hourly, rest > 0 ? bike.daily : 0);
  const rent = fullDays * bike.daily + restCost;
  const billedDays = fullDays + (rest > 0 ? 1 : 0);
  const gst = Math.round(rent * GST_RATE);
  return {
    hours, rent, gst, total: rent + gst, deposit: bike.deposit,
    freeKm: billedDays * bike.freeKmPerDay, extraKmRate: bike.extraKm,
  };
}

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;

/** Units of a bike still free in a city for the whole trip, after existing bookings. */
export function unitsAvailable(bike, city, pickup, drop, bookings) {
  const total = bike.units[city] ?? 0;
  const busy = bookings.filter(([id, c, s, e]) => id === bike.id && c === city && overlaps(pickup, drop, new Date(s), new Date(e))).length;
  return Math.max(0, total - busy);
}

export const rupees = (n) => `₹${n.toLocaleString('en-IN')}`;
