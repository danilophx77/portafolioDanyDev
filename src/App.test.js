import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the redesigned portfolio content", () => {
  render(<App />);

  expect(screen.getByText(/Portfolio reimaginado 2026/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Explorar proyectos/i })).toBeInTheDocument();
  expect(screen.getByText(/Hablemos de tu siguiente build/i)).toBeInTheDocument();
});
