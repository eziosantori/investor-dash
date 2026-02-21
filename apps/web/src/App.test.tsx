import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App", () => {
  it("renders base shell", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Investor Dash" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Trade" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Ticker" })).toBeInTheDocument();
  });
});
