import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { InstrumentCatalog } from "./instrument-catalog";

const instrumentsPayload = [
  {
    id: "i-1",
    journalId: "j-1",
    ticker: "US100",
    instrumentType: "index",
    defaultLeverage: 20,
    minLot: 0.1,
    lotStep: 0.1,
    marketTimezone: "Europe/Rome",
    sessionOpenTime: "08:00",
    sessionCloseTime: "22:00",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("InstrumentCatalog", () => {
  it("loads instruments for the selected journal", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => instrumentsPayload,
    } as Response);

    render(<InstrumentCatalog selectedJournalId="j-1" />);

    await waitFor(() => {
      expect(screen.getByText("US100")).toBeInTheDocument();
    });

    expect(fetchSpy).toHaveBeenCalledWith("/api/instruments?journalId=j-1", expect.any(Object));

    vi.restoreAllMocks();
  });

  it("does not call api when no journal is selected", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<InstrumentCatalog selectedJournalId={null} />);

    expect(screen.getByText("Select a journal to view instruments.")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
