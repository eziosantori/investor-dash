export type Instrument = {
  id: string;
  journalId: string;
  ticker: string;
  instrumentType: string;
  defaultLeverage: number;
  minLot: number;
  lotStep: number;
  marketTimezone: string;
  sessionOpenTime: string;
  sessionCloseTime: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateInstrumentInput = {
  journalId: string;
  ticker: string;
  instrumentType: string;
  defaultLeverage: number;
  minLot: number;
  lotStep: number;
  marketTimezone: string;
  sessionOpenTime: string;
  sessionCloseTime: string;
};

export type UpdateInstrumentInput = {
  ticker?: string;
  instrumentType?: string;
  defaultLeverage?: number;
  minLot?: number;
  lotStep?: number;
  marketTimezone?: string;
  sessionOpenTime?: string;
  sessionCloseTime?: string;
};
