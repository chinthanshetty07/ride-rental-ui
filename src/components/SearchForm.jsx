import { useState } from 'react';

export default function SearchForm({ cities, onSearch }) {
  const [city, setCity] = useState(cities[0]);
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  return (
    <form className="search" onSubmit={(e) => { e.preventDefault(); onSearch({ city, pickup, drop }); }}>
      <label>City
        <select value={city} onChange={(e) => setCity(e.target.value)}>{cities.map((c) => <option key={c}>{c}</option>)}</select>
      </label>
      <label>Pickup
        <input type="datetime-local" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
      </label>
      <label>Drop
        <input type="datetime-local" value={drop} onChange={(e) => setDrop(e.target.value)} required />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}
