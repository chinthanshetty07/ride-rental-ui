export default function Filters({ types, type, onType, sort, onSort }) {
  return (
    <div className="filters">
      <div role="group" aria-label="Bike type" className="chips">
        {types.map((t) => (
          <button key={t} type="button" aria-pressed={type === t} onClick={() => onType(t)}>{t}</button>
        ))}
      </div>
      <label>Sort by
        <select value={sort} onChange={(e) => onSort(e.target.value)}>
          <option value="price">Lowest price</option>
          <option value="power">Engine size</option>
        </select>
      </label>
    </div>
  );
}
