import App from "@/App";
import { describe, expect, it } from "@/setupTests";
import { render, screen } from "@testing-library/react";

describe("App", () => {
  it("renders the main heading text", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { name: /^Forza Tuner Box$/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
