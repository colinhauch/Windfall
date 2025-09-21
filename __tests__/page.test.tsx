import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renders the main page', () => {
    render(<Home />);

    // Check for the Next.js logo
    const logo = screen.getByAltText('Next.js logo');
    expect(logo).toBeInTheDocument();

    // Check for the getting started text
    const getStartedText = screen.getByText(/Get started by editing/i);
    expect(getStartedText).toBeInTheDocument();
  });
});
