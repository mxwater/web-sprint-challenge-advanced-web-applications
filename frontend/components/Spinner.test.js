import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

test('sanity', () => {
  expect(true).toBe(true);
});

test('Spinner renders when "on" is true', () => {
  const { container } = render(<Spinner on={true} />);
  expect(container.firstChild).not.toBeNull();
});

test('Spinner does not render when "on" is false', () => {
  const { container } = render(<Spinner on={false} />);
  expect(container.firstChild).toBeNull();
});
