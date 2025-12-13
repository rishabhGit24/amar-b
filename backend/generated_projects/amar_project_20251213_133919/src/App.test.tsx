import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // Basic test to ensure app renders
  const appElement = document.querySelector('.App');
  expect(appElement).toBeInTheDocument();
});
