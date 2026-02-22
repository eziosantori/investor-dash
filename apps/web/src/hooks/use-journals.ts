import { useEffect, useMemo, useState } from "react";
import type { Journal } from "@investor-dash/shared-types";

export type JournalState = {
  journals: Journal[];
  loading: boolean;
  error: string | null;
  selectedJournalId: string | null;
  setSelectedJournalId: (id: string) => void;
  selectedJournal: Journal | null;
};

// Loads journals from local API and keeps the selected journal in component state.
export function useJournals(): JournalState {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadJournals() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/journals", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load journals (${response.status})`);
        }

        const data = (await response.json()) as Journal[];
        setJournals(data);

        if (data.length > 0) {
          setSelectedJournalId((current) => current ?? data[0].id);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Unable to load journals");
        }
      } finally {
        setLoading(false);
      }
    }

    void loadJournals();

    return () => controller.abort();
  }, []);

  const selectedJournal = useMemo(
    () => journals.find((journal) => journal.id === selectedJournalId) ?? null,
    [journals, selectedJournalId],
  );

  return {
    journals,
    loading,
    error,
    selectedJournalId,
    setSelectedJournalId,
    selectedJournal,
  };
}
