import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JournalSwitcher } from "@/components/journal/journal-switcher";

function App() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Investor Dash</h1>
      <div className="mb-6">
        <JournalSwitcher />
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
