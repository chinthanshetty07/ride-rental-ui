# Ride Rental UI

[![CI](https://github.com/chinthanshetty07/ride-rental-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/chinthanshetty07/ride-rental-ui/actions/workflows/ci.yml)

**Live demo: https://chinthanshetty07.github.io/ride-rental-ui/**

A React front end for renting a bike: pick a city and your pickup and drop times, see which bikes are actually
free for those times, filter and sort them, and get a price breakdown with nothing hidden.

Built as an independent frontend prototype after applying for a frontend developer internship at a Bengaluru
bike-rental company. It is not affiliated with any rental company; the fleet, prices and bookings are made up.

## What it does

| Area | Behaviour |
|---|---|
| Search | City, pickup and drop (`datetime-local`). Errors appear in an alert region: pickup in the past, drop before pickup, outside 6 am–10 pm, under the 4-hour minimum, over 30 days. |
| Availability | Each bike has units per city. A unit is busy if an existing booking overlaps your trip; a booking that starts exactly when you drop does not count. Bikes a city doesn't stock aren't shown. |
| Sold out | Sold-out bikes stay visible (you want to know they exist) but move to the bottom with a disabled button. "Only 1 left" when it's the last one. |
| Filters and sort | Type chips (`aria-pressed`) and sort by lowest price or engine size. The result count updates in an `aria-live` region. |
| Pricing | Whole days at the daily rate; leftover hours at the hourly rate, **capped at one more day** (a 23-hour trip costs one day, not 23 hours). Partial hours round up. GST 18% on rent. The refundable deposit is shown separately, never added to the total. Free km scale with billed days. |
| Summary | Rent, GST, total, deposit and the free-km allowance for the selected bike; sticky beside the list on desktop, below it on mobile. |

Pricing and availability rules live in `src/lib/pricing.js`, separate from the components, so they're tested
directly.

## Tests (`npm test`, 21)

- **Rules:** hourly vs daily pricing, the 4-hour minimum, rounding up partial hours, the daily cap on leftover hours,
  free km per billed day, every validation message, overlapping and back-to-back bookings, other cities, never
  negative availability.
- **User flow (Testing Library):** an invalid trip shows the alert and no results; results are cheapest first with
  sold-out bikes last; overlapping bookings reduce units ("Only 1 left", then sold out); type filter and engine-size
  sort; selecting a bike fills the summary with the exact rent, GST, total and deposit.

Three tests failed on the first run, and all three were mistakes in my expectations, not in the app: I'd counted a
booking that starts exactly at drop time as overlapping (the app correctly doesn't), a date helper built
"2026-11-9" instead of "2026-11-09", and one sorting assertion was simply wrong. Each was fixed in the test, and
the back-to-back case now has its own test because it's an easy rule to get wrong.

## Run

```bash
npm install
npm test
npm run dev
```

Note: the demo bookings are dated 13–20 Nov 2026, so search those dates to see sold-out and "Only 1 left" states.

## Next steps

- Real data from an API, with loading, error and retry states.
- Store picker with a map, and helmet and add-on selection.
- A real booking flow: login, KYC (licence upload), payment and confirmation.
- Playwright end-to-end tests and a Lighthouse budget in CI.

Built with Claude Code; the tests are how I checked what it wrote.
