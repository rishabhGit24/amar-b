import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders AMAR MVP title", () => {
  render(<App />);
  const titleElement = screen.getByText(/AMAR MVP/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders description textarea", () => {
  render(<App />);
  const textareaElement = screen.getByPlaceholderText(
    /Example: Build a landing page/i
  );
  expect(textareaElement).toBeInTheDocument();
});

test("renders generate button", () => {
  render(<App />);
  const buttonElement = screen.getByText(/Generate Application/i);
  expect(buttonElement).toBeInTheDocument();
});

test("form elements are initially disabled", () => {
  render(<App />);
  const textareaElement = screen.getByPlaceholderText(
    /Example: Build a landing page/i
  );
  const buttonElement = screen.getByText(/Generate Application/i);

  expect(textareaElement).toBeDisabled();
  expect(buttonElement).toBeDisabled();
});
