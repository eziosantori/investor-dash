import type { Instrument, Journal } from "@investor-dash/shared-types";

const seededAt = "2026-02-22T00:00:00.000Z";

export const journalSeed: Journal[] = [
  {
    id: "journal-ftmo",
    name: "FTMO Journal",
    broker: "FTMO",
    baseCurrency: "USD",
    timezone: "Europe/Rome",
    isActive: true,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "journal-ibkr",
    name: "IBKR Journal",
    broker: "IBKR",
    baseCurrency: "USD",
    timezone: "America/New_York",
    isActive: false,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
];

export const instrumentSeed: Instrument[] = [
  {
    id: "instrument-us100",
    journalId: "journal-ftmo",
    ticker: "US100",
    instrumentType: "index",
    defaultLeverage: 20,
    minLot: 0.1,
    lotStep: 0.1,
    marketTimezone: "Europe/Rome",
    sessionOpenTime: "08:00",
    sessionCloseTime: "22:00",
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "instrument-xauusd",
    journalId: "journal-ftmo",
    ticker: "XAUUSD",
    instrumentType: "commodity",
    defaultLeverage: 20,
    minLot: 0.01,
    lotStep: 0.01,
    marketTimezone: "Europe/Rome",
    sessionOpenTime: "01:00",
    sessionCloseTime: "23:00",
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "instrument-aapl",
    journalId: "journal-ibkr",
    ticker: "AAPL",
    instrumentType: "equity",
    defaultLeverage: 2,
    minLot: 1,
    lotStep: 1,
    marketTimezone: "America/New_York",
    sessionOpenTime: "15:30",
    sessionCloseTime: "22:00",
    createdAt: seededAt,
    updatedAt: seededAt,
  },
];
