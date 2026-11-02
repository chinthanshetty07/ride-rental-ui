import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

const NOW = new Date('2026-11-10T09:00');

async function searchFor(user, { city = 'Bengaluru', pickup = '2026-11-14T10:00', drop = '2026-11-14T18:00' } = {}) {
  await user.selectOptions(screen.getByLabelText('City'), city);
  fireEvent.change(screen.getByLabelText('Pickup'), { target: { value: pickup } });
  fireEvent.change(screen.getByLabelText('Drop'), { target: { value: drop } });
  await user.click(screen.getByRole('button', { name: 'Search' }));
}
const cardNames = () => screen.getAllByRole('listitem').map((li) => within(li).getByRole('heading').textContent);

describe('booking flow', () => {
  it('shows validation errors and no results for a bad trip', async () => {
    const user = userEvent.setup();
    render(<App now={NOW} />);
    await searchFor(user, { pickup: '2026-11-14T10:00', drop: '2026-11-14T11:00' });
    expect(screen.getByRole('alert')).toHaveTextContent('Minimum rental is 4 hours');
    expect(screen.queryByRole('heading', { name: /Bikes in/ })).not.toBeInTheDocument();
  });

  it('lists only bikes the city stocks, cheapest first, with sold-out bikes last', async () => {
    const user = userEvent.setup();
    render(<App now={NOW} />);
    await searchFor(user);                                        // Himalayan is booked all of 14 Nov in Bengaluru
    const names = cardNames();
    expect(names[0]).toBe('Splendor Plus');
    expect(names.at(-1)).toBe('Himalayan 450');
    expect(within(screen.getByRole('listitem', { name: 'Himalayan 450' })).getByRole('button')).toBeDisabled();
    expect(screen.getByText('5 available for your dates')).toBeInTheDocument();
  });

  it('counts down units when bookings overlap, and a booking that starts at drop time does not count', async () => {
    const user = userEvent.setup();
    render(<App now={NOW} />);
    // Classic 350: 2 units; one booked 09:00 14 Nov – 09:00 15 Nov (overlaps), one from 18:00 (starts as we drop).
    await searchFor(user);
    expect(screen.getByRole('listitem', { name: 'Classic 350' })).toHaveTextContent('Only 1 left');
    await searchFor(user, { drop: '2026-11-14T19:00' });          // now both bookings overlap
    expect(within(screen.getByRole('listitem', { name: 'Classic 350' })).getByRole('button')).toBeDisabled();
  });

  it('filters by type and re-sorts by engine size', async () => {
    const user = userEvent.setup();
    render(<App now={NOW} />);
    await searchFor(user, { city: 'Goa' });
    await user.click(screen.getByRole('button', { name: 'Scooter' }));
    expect(cardNames()).toEqual(['Activa 6G', 'Ntorq 125']);
    await user.click(screen.getByRole('button', { name: 'All' }));
    await user.selectOptions(screen.getByLabelText('Sort by'), 'power');
    // Biggest engine first among bikes you can book; the Duke 390 is booked all week in Goa, so it goes last.
    expect(cardNames()).toEqual(['Himalayan 450', 'Classic 350', 'Ntorq 125', 'Activa 6G', 'Duke 390']);
  });

  it('selecting a bike fills the summary with a full price breakdown', async () => {
    const user = userEvent.setup();
    render(<App now={NOW} />);
    await searchFor(user);
    await user.click(within(screen.getByRole('listitem', { name: 'Activa 6G' })).getByRole('button', { name: 'Select' }));
    const summary = screen.getByRole('complementary', { name: 'Booking summary' });
    expect(summary).toHaveTextContent('Activa 6G');
    expect(summary).toHaveTextContent('Rent (8 h)₹312');
    expect(summary).toHaveTextContent('GST (18%)₹56');
    expect(summary).toHaveTextContent('Total₹368');
    expect(summary).toHaveTextContent('Refundable deposit₹1,000');
  });
});
