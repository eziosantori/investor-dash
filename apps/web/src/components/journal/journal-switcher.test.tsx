import { render, screen, waitFor } from "@testing-library/react";

import { JournalSwitcher } from "./journal-switcher";

const journalsPayload = [
  {
    id: "j-1",
    name: "FTMO Journal",
    broker: "FTMO",
    baseCurrency: "USD",
    timezone: "UTC",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

// Mocks API response to test UI state transitions deterministically.
describe("JournalSwitcher", () => {
  it("renders journals from API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => journalsPayload,
    } as Response);

    render(<JournalSwitcher />);

    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: "Journal" })).toBeInTheDocument();
    });

    expect(screen.getByRole("option", { name: "FTMO Journal" })).toBeInTheDocument();
    expect(screen.getByText("FTMO")).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
