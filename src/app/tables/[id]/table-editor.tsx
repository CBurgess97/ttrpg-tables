// src/app/tables/[id]/table-editor.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import RowsEditor from "@/components/RowsEditor";
import RollPanel from "@/components/RollPanel";

type RowDTO = {
  id: string;
  content: string;
  rangemin: number;
  rangemax: number;
};

type TableDTO = {
  id: string;
  title: string;
  description: string;
  source: string | null;
  sides: string | null;
  rows: RowDTO[];
};

export default function TableEditor({ initialTable }: { initialTable: TableDTO }) {
  const [title, setTitle] = useState(initialTable.title);
  const [description, setDescription] = useState(initialTable.description ?? "");
  const [source, setSource] = useState(initialTable.source ?? "");
  const [sides, setSides] = useState(initialTable.sides ?? "");
  const [rows, setRows] = useState<RowDTO[]>(initialTable.rows.map((r) => ({ ...r })));
  const [rolling, setRolling] = useState(false);
  const [rollResult, setRollResult] = useState<any>(null);

  async function saveMetadata() {
    const res = await fetch(`/api/tables/${initialTable.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        source: source || null,
        sides: sides || null,
      }),
    });
    if (!res.ok) alert(await res.text());
  }

  async function saveRows() {
    const res = await fetch(`/api/tables/${initialTable.id}/entries`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    if (!res.ok) alert(await res.text());
  }

  async function roll() {
    setRolling(true);
    setRollResult(null);
    try {
      const res = await fetch(`/api/tables/${initialTable.id}/roll`, { method: "POST" });
      const data = await res.json();
      setRollResult(data);
    } finally {
      setRolling(false);
    }
  }

  async function exportJson() {
    const res = await fetch(`/api/tables/${initialTable.id}/export`);
    if (!res.ok) return alert("Export failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "table"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteTable() {
    if (!confirm("Delete this table? This cannot be undone.")) return;
    const res = await fetch(`/api/tables/${initialTable.id}`, { method: "DELETE" });
    if (!res.ok) return alert("Delete failed");
    window.location.href = "/";
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-600 hover:underline">← Back</Link>
        <div className="flex gap-2">
          <button onClick={exportJson} className="rounded-xl border px-3 py-2">Export JSON</button>
          <button onClick={deleteTable} className="rounded-xl border px-3 py-2 text-red-600">Delete</button>
        </div>
      </div>

      {/* Metadata */}
      <section className="rounded-2xl border p-5 space-y-3">
        <h2 className="text-lg font-medium">Table</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Sides (optional)</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={sides}
              onChange={(e) => setSides(e.target.value)}
              placeholder='e.g. "20" or "1d20"'
            />
            <p className="mt-1 text-xs text-gray-500">
              Used to validate ranges and guide the roll domain.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea className="mt-1 w-full rounded-xl border px-3 py-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Source (optional)</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Book/Module" />
          </div>
        </div>

        <button onClick={saveMetadata} className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90">
          Save Table
        </button>
      </section>

      {/* Rows */}
      <section className="rounded-2xl border p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Rows</h2>
          <button onClick={saveRows} className="rounded-xl bg-black px-3 py-2 text-white hover:opacity-90">
            Save Rows
          </button>
        </div>
        <RowsEditor rows={rows} onChange={setRows} />
      </section>

      {/* Roll */}
      <section className="rounded-2xl border p-5 space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={roll}
            disabled={rolling}
            className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
          >
            {rolling ? "Rolling..." : "Roll"}
          </button>
          <p className="text-sm text-gray-500">
            Rolls within the sides/range domain and picks the matching row.
          </p>
        </div>
        <RollPanel result={rollResult} />
      </section>
    </div>
  );
}
