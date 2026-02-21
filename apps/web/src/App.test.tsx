import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import App from "./App";

describe("App", () => {
  it("renders base shell", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    render(<App />);

    expect(screen.getByRole("heading", { name: "Investor Dash" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Trade" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Ticker" })).toBeInTheDocument();
    // Waits for journal loader side effects to complete to avoid React act warnings.
    await waitFor(() => {
      expect(screen.getByText("Journal")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });
});
