import { DataExample } from "@workspace/ui/components/DataExample";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Admin Dashboard</h1>
      <DataExample />
    </main>
  );
}
