// src/components/RowsEditor.tsx
"use client";

import { useId, useMemo } from "react";

type Row = {
  id: string;
  content: string;
  rangemin: number;
  rangemax: number;
};

export default function RowsEditor({
  rows,
  onChange,
}: {
  rows: Row[];
  onChange: (rows: Row[]) => void;
}) {
  const descId = useId();

  function addRow() {
    onChange([
      ...rows,
      {
        id: crypto.randomUUID(),
        content: "",
        rangemin: 1,
        rangemax: 1,
      },
    ]);
  }

  function update(idx: number, patch: Partial<Row>) {
    const next = [...rows];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }

  function remove(idx: number) {
    const next = [...rows];
    next.splice(idx, 1);
    onChange(next);
  }

  // simple client-side checks (non-blocking)
  const issues = useMemo(() => validateRanges(rows), [rows]);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2" aria-describedby={descId}>
          <thead className="text-left text-sm text-gray-600">
            <tr>
              <th className="px-2">Content</th>
              <th className="px-2">Min</th>
              <th className="px-2">Max</th>
              <th className="px-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td className="px-2">
                  <input
                    className="w-full rounded-xl border px-3 py-2"
                    value={r.content}
                    onChange={(ev) => update(i, { content: ev.target.value })}
                    placeholder="e.g. 50 gp"
                  />
                </td>
                <td className="px-2">
                  <input
                    type="number"
                    className="w-24 rounded-xl border px-3 py-2"
                    value={r.rangemin}
                    onChange={(ev) => update(i, { rangemin: toInt(ev.target.value, 1) })}
                  />
                </td>
                <td className="px-2">
                  <input
                    type="number"
                    className="w-24 rounded-xl border px-3 py-2"
                    value={r.rangemax}
                    onChange={(ev) => update(i, { rangemax: toInt(ev.target.value, 1) })}
                  />
                </td>
                <td className="px-2">
                  <button
                    onClick={() => remove(i)}
                    className="rounded-xl border px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-2" colSpan={4}>
                <button onClick={addRow} className="mt-2 rounded-xl border px-4 py-2 hover:bg-gray-50">
                  + Add row
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {issues.length > 0 ? (
        <ul className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          {issues.map((msg, i) => (
            <li key={i}>• {msg}</li>
          ))}
        </ul>
      ) : (
        <p id={descId} className="text-xs text-gray-500">
          Ensure ranges cover your intended dice domain and don’t overlap.
        </p>
      )}
    </div>
  );
}

function toInt(v: string, fallback: number) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function validateRanges(rows: Row[]): string[] {
  const msgs: string[] = [];
  for (const r of rows) {
    if (r.rangemin > r.rangemax) msgs.push(`Row "${r.content || "…" }": min > max`);
    if (r.rangemin < 1) msgs.push(`Row "${r.content || "…"}": min < 1`);
  }
  // overlap detection
  const sorted = [...rows].sort((a, b) => a.rangemin - b.rangemin || a.rangemax - b.rangemax);
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1], cur = sorted[i];
    if (cur.rangemin <= prev.rangemax) {
      msgs.push(`Overlap between "${prev.content || "…"}" and "${cur.content || "…"}"`);
    }
  }
  return msgs;
}
