import type { JournalState } from "@/hooks/use-journals";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type JournalSwitcherProps = {
  state: JournalState;
};

// Journal selector used to scope future dashboard and trade screens.
export function JournalSwitcher({ state }: JournalSwitcherProps) {
  const { journals, loading, error, selectedJournalId, setSelectedJournalId, selectedJournal } = state;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Journal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading journals...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <label className="block text-sm font-medium" htmlFor="journal-select">
              Journal
            </label>
            <select
              id="journal-select"
              aria-label="Journal"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={selectedJournalId ?? ""}
              onChange={(event) => setSelectedJournalId(event.target.value)}
            >
              {journals.map((journal) => (
                <option key={journal.id} value={journal.id}>
                  {journal.name}
                </option>
              ))}
            </select>
            {selectedJournal && (
              <p className="text-sm text-muted-foreground">
                Broker: <span className="font-medium text-foreground">{selectedJournal.broker ?? "N/A"}</span>
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
