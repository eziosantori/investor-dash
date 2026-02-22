import { useEffect, useState } from "react";
import type { Instrument } from "@investor-dash/shared-types";

export type InstrumentState = {
  instruments: Instrument[];
  loading: boolean;
  error: string | null;
};

// Loads instruments scoped to the currently selected journal.
export function useInstruments(journalId: string | null): InstrumentState {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInstruments() {
      if (!journalId) {
        setInstruments([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams({ journalId });
        const response = await fetch(`/api/instruments?${query.toString()}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load instruments (${response.status})`);
        }

        const data = (await response.json()) as Instrument[];
        setInstruments(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Unable to load instruments");
          setInstruments([]);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadInstruments();

    return () => controller.abort();
  }, [journalId]);

  return {
    instruments,
    loading,
    error,
  };
}
