// src/components/RollPanel.tsx
"use client";

export default function RollPanel({ result }: { result: any }) {
  if (!result) return null;

  return (
    <div className="rounded-xl border p-4">
      {"rolled" in result && result.rolled != null && (
        <p className="text-sm text-gray-600">
          Roll: <b>{result.rolled}</b>
        </p>
      )}
      <h3 className="mt-1 text-lg font-medium">{result.row?.content ?? "—"}</h3>
      {Array.isArray(result.trail) && result.trail.length > 0 && (
        <div className="mt-3">
          <details className="rounded-lg border p-3">
            <summary className="cursor-pointer text-sm font-medium">Trail ({result.trail.length})</summary>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
              {result.trail.map((s: any, i: number) => (
                <li key={i}>
                  {s.tableTitle ? <b>{s.tableTitle}:</b> : null}{" "}
                  {s.rolled != null ? `roll ${s.rolled} → ` : null}
                  {s.rowContent ?? "—"}
                </li>
              ))}
            </ol>
          </details>
        </div>
      )}
    </div>
  );
}
