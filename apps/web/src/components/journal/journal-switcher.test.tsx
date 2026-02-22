import { render, screen } from "@testing-library/react";
import type { Journal } from "@investor-dash/shared-types";
import { vi } from "vitest";

import { JournalSwitcher } from "./journal-switcher";
import type { JournalState } from "@/hooks/use-journals";

const journalsPayload: Journal[] = [
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

const state: JournalState = {
  journals: journalsPayload,
  loading: false,
  error: null,
  selectedJournalId: "j-1",
  setSelectedJournalId: vi.fn(),
  selectedJournal: journalsPayload[0],
};

// Renders deterministic journal selection from preloaded state.
describe("JournalSwitcher", () => {
  it("renders journals from state", () => {
    render(<JournalSwitcher state={state} />);

    expect(screen.getByRole("combobox", { name: "Journal" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "FTMO Journal" })).toBeInTheDocument();
    expect(screen.getByText("FTMO")).toBeInTheDocument();
  });
});
