// src/app/tables/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTablePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [sides, setSides] = useState(""); // accept "20" or "1d20"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/tables", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        source: source || null,
        sides: sides || null,
      }),
    });
    if (!res.ok) return alert(await res.text());
    const data = await res.json();
    router.push(`/tables/${data.table.id}`);
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Create a Table</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Treasure Hoard"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full rounded-xl border px-3 py-2"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Gold and curios"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Source (optional)</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Book/Module name"
            />
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
              Used to guide rolls and validate ranges.
            </p>
          </div>
        </div>

        <button type="submit" className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90">
          Create
        </button>
      </form>
    </main>
  );
}
