import { rupees } from '../lib/pricing.js';

const fmt = (d) => d.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export default function Summary({ choice, search }) {
  if (!choice) return <aside className="summary" aria-label="Booking summary"><p className="muted">Select a bike to see the full price breakdown.</p></aside>;
  const { bike, price } = choice;
  return (
    <aside className="summary" aria-label="Booking summary">
      <h2>{bike.name}</h2>
      <p className="muted">{search.city} · {fmt(search.pickup)} → {fmt(search.drop)}</p>
      <dl>
        <dt>Rent ({price.hours} h)</dt><dd>{rupees(price.rent)}</dd>
        <dt>GST (18%)</dt><dd>{rupees(price.gst)}</dd>
        <dt className="strong">Total</dt><dd className="strong">{rupees(price.total)}</dd>
        <dt>Refundable deposit</dt><dd>{rupees(price.deposit)}</dd>
        <dt>Free km</dt><dd>{price.freeKm} km, then {rupees(price.extraKmRate)}/km</dd>
      </dl>
      <button type="button" className="primary">Continue to book</button>
    </aside>
  );
}
