import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useInstruments } from "@/hooks/use-instruments";

type InstrumentCatalogProps = {
  selectedJournalId: string | null;
};

// Displays instrument catalog data filtered by active journal context.
export function InstrumentCatalog({ selectedJournalId }: InstrumentCatalogProps) {
  const { instruments, loading, error } = useInstruments(selectedJournalId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instruments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!selectedJournalId && <p className="text-sm text-muted-foreground">Select a journal to view instruments.</p>}
        {selectedJournalId && loading && <p className="text-sm text-muted-foreground">Loading instruments...</p>}
        {selectedJournalId && error && <p className="text-sm text-red-600">{error}</p>}

        {selectedJournalId && !loading && !error && instruments.length === 0 && (
          <p className="text-sm text-muted-foreground">No instruments configured for this journal.</p>
        )}

        {selectedJournalId && instruments.length > 0 && (
          <ul className="space-y-2">
            {instruments.map((instrument) => (
              <li key={instrument.id} className="rounded-md border border-border p-3 text-sm">
                <p className="font-medium">{instrument.ticker}</p>
                <p className="text-muted-foreground">{instrument.instrumentType}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
