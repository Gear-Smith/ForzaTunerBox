import App from '@/App';
import { describe, expect, it } from '@/setupTests';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  it('renders the main heading text', () => {
    render(<App />);
    const heading = screen.getByText(/Forza Motorsport Tuner/i);
    expect(heading).toBeInTheDocument();
  });
});
