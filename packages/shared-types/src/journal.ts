export type Journal = {
  id: string;
  name: string;
  broker: string | null;
  baseCurrency: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateJournalInput = {
  name: string;
  broker?: string | null;
  baseCurrency?: string;
  timezone?: string;
};

export type UpdateJournalInput = {
  name?: string;
  broker?: string | null;
  baseCurrency?: string;
  timezone?: string;
  isActive?: boolean;
};
