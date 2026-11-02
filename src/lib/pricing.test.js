import { describe, expect, it } from 'vitest';
import { quote, unitsAvailable, validateTrip } from './pricing.js';

const bike = { id: 'x', hourly: 40, daily: 450, freeKmPerDay: 120, extraKm: 4, deposit: 1000, units: { Bengaluru: 2 } };
const at = (s) => new Date(`2026-11-14T${s}`);
const day = (d, t) => new Date(`2026-11-${String(d).padStart(2, '0')}T${t}`);
const NOW = new Date('2026-11-10T09:00');

describe('quote', () => {
  it('charges hourly for a short trip, with GST on top and the deposit separate', () => {
    const q = quote(bike, at('09:00'), at('15:00'));
    expect(q).toMatchObject({ hours: 6, rent: 240, gst: 43, total: 283, deposit: 1000, freeKm: 120 });
  });

  it('applies the 4-hour minimum', () => {
    expect(quote(bike, at('09:00'), at('10:00')).hours).toBe(4);
    expect(quote(bike, at('09:00'), at('10:00')).rent).toBe(160);
  });

  it('rounds a partial hour up', () => {
    expect(quote(bike, at('09:00'), at('13:10')).hours).toBe(5);
  });

  it('caps leftover hours at one daily rate', () => {
    // 23 h at 40/h would be 920; one day is 450.
    expect(quote(bike, day(14, '07:00'), day(15, '06:00')).rent).toBe(450);
  });

  it('charges whole days plus leftover hours', () => {
    const q = quote(bike, day(14, '09:00'), day(15, '11:00'));    // 26 h
    expect(q.rent).toBe(450 + 2 * 40);
    expect(q.freeKm).toBe(240);                                   // 2 billed days
  });
});

describe('validateTrip', () => {
  it('accepts a normal trip', () => {
    expect(validateTrip(at('09:00'), at('18:00'), NOW)).toEqual([]);
  });

  it.each([
    [day(9, '09:00'), at('18:00'), 'Pickup time is in the past'],
    [at('18:00'), at('09:00'), 'Drop must be after pickup'],
    [at('09:00'), at('11:00'), 'Minimum rental is 4 hours'],
    [at('05:00'), at('12:00'), 'Pickup must be between 6 am and 10 pm'],
    [at('09:00'), at('23:30'), 'Drop must be between 6 am and 10 pm'],
    [day(14, '09:00'), new Date('2026-12-20T09:00'), 'Maximum rental is 30 days'],
  ])('rejects %s → %s with "%s"', (p, d, msg) => {
    expect(validateTrip(p, d, NOW)).toContain(msg);
  });

  it('asks for missing times instead of crashing', () => {
    expect(validateTrip(new Date(''), at('18:00'), NOW)).toEqual(['Choose a pickup time']);
  });
});

describe('unitsAvailable', () => {
  const bookings = [['x', 'Bengaluru', '2026-11-14T08:00', '2026-11-14T12:00']];

  it('subtracts bookings that overlap the trip', () => {
    expect(unitsAvailable(bike, 'Bengaluru', at('10:00'), at('16:00'), bookings)).toBe(1);
  });

  it('a booking ending exactly when the trip starts does not block it', () => {
    expect(unitsAvailable(bike, 'Bengaluru', at('12:00'), at('18:00'), bookings)).toBe(2);
  });

  it('ignores other cities and never goes negative', () => {
    expect(unitsAvailable(bike, 'Goa', at('10:00'), at('16:00'), bookings)).toBe(0);
    const many = [...bookings, ...bookings, ...bookings];
    expect(unitsAvailable(bike, 'Bengaluru', at('10:00'), at('16:00'), many)).toBe(0);
  });
});
