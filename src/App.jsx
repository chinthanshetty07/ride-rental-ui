import { useMemo, useState } from 'react';
import { BIKES, BOOKINGS, CITIES } from './data/fleet.js';
import { quote, unitsAvailable, validateTrip } from './lib/pricing.js';
import SearchForm from './components/SearchForm.jsx';
import Filters from './components/Filters.jsx';
import BikeCard from './components/BikeCard.jsx';
import Summary from './components/Summary.jsx';

export default function App({ now = new Date(), bikes = BIKES, bookings = BOOKINGS }) {
  const [search, setSearch] = useState(null);           // { city, pickup, drop } once a valid search is made
  const [errors, setErrors] = useState([]);
  const [type, setType] = useState('All');
  const [sort, setSort] = useState('price');
  const [selected, setSelected] = useState(null);

  function onSearch({ city, pickup, drop }) {
    const p = new Date(pickup), d = new Date(drop);
    const problems = validateTrip(p, d, now);
    setErrors(problems);
    setSelected(null);
    setSearch(problems.length ? null : { city, pickup: p, drop: d });
  }

  const results = useMemo(() => {
    if (!search) return [];
    const rows = bikes
      .filter((b) => (b.units[search.city] ?? 0) > 0)
      .filter((b) => type === 'All' || b.type === type)
      .map((b) => ({ bike: b, price: quote(b, search.pickup, search.drop), left: unitsAvailable(b, search.city, search.pickup, search.drop, bookings) }));
    const byPrice = (a, b) => a.price.total - b.price.total;
    rows.sort(sort === 'price' ? byPrice : (a, b) => b.bike.cc - a.bike.cc || byPrice(a, b));
    // Sold-out bikes stay visible (people want to know they exist) but go to the bottom.
    return [...rows.filter((r) => r.left > 0), ...rows.filter((r) => r.left === 0)];
  }, [search, type, sort, bikes, bookings]);

  const types = ['All', ...new Set(bikes.map((b) => b.type))];
  const chosen = results.find((r) => r.bike.id === selected);

  return (
    <div className="page">
      <header><h1>Rent a bike</h1><p className="muted">Pick a city and your times to see what's free and exactly what you'll pay.</p></header>
      <SearchForm cities={CITIES} onSearch={onSearch} />
      {errors.length > 0 && (
        <ul className="errors" role="alert">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
      )}
      {search && (
        <main className="layout">
          <section aria-labelledby="results-heading">
            <h2 id="results-heading">Bikes in {search.city}</h2>
            <Filters types={types} type={type} onType={setType} sort={sort} onSort={setSort} />
            <p aria-live="polite" className="muted">{results.filter((r) => r.left > 0).length} available for your dates</p>
            {results.length === 0
              ? <p className="empty">No bikes of this type in {search.city}. Try another type.</p>
              : <ul className="cards">{results.map((r) => (
                  <BikeCard key={r.bike.id} {...r} selected={selected === r.bike.id} onSelect={() => setSelected(r.bike.id)} />
                ))}</ul>}
          </section>
          <Summary choice={chosen} search={search} />
        </main>
      )}
    </div>
  );
}
