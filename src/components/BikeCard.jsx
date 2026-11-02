import { rupees } from '../lib/pricing.js';

export default function BikeCard({ bike, price, left, selected, onSelect }) {
  const soldOut = left === 0;
  return (
    <li className={`card${selected ? ' selected' : ''}${soldOut ? ' soldout' : ''}`} aria-label={bike.name}>
      <div>
        <h3>{bike.name}</h3>
        <p className="muted">{bike.type} · {bike.cc} cc · {price.freeKm} km free</p>
      </div>
      <div className="right">
        <p className="price">{rupees(price.total)}</p>
        <p className="muted small">incl. GST · {soldOut ? 'Sold out' : left === 1 ? 'Only 1 left' : `${left} left`}</p>
        <button type="button" disabled={soldOut} aria-pressed={selected} onClick={onSelect}>
          {soldOut ? 'Sold out' : selected ? 'Selected' : 'Select'}
        </button>
      </div>
    </li>
  );
}
