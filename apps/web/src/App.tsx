import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InstrumentCatalog } from "@/components/instrument/instrument-catalog";
import { JournalSwitcher } from "@/components/journal/journal-switcher";
import { useJournals } from "@/hooks/use-journals";

function App() {
  const journalState = useJournals();

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Investor Dash</h1>
      <div className="mb-6">
        <JournalSwitcher state={journalState} />
      </div>
      <div className="mb-6">
        <InstrumentCatalog selectedJournalId={journalState.selectedJournalId} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>UI Smoke Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input aria-label="Ticker" placeholder="Ticker" />
          <Button type="button">Create Trade</Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
