import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function TablesPage() {
  const tables = await prisma.table.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, description: true, source: true, updatedAt: true },
  });

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Tables</h1>
        <Link
          href="/tables/new"
          className="rounded-xl px-4 py-2 bg-black text-white hover:opacity-90"
        >
          New Table
        </Link>
      </header>

      {tables.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center">
          <p className="mb-4 text-gray-600">No tables yet.</p>
          <Link href="/tables/new" className="underline">
            Create your first table
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4">
          {tables.map((t) => (
            <li key={t.id}>
              <Link
                href={`/tables/${t.id}`}
                className="block rounded-2xl border p-5 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium">{t.title}</h2>
                  <time className="text-xs text-gray-500">
                    {new Date(t.updatedAt).toLocaleString()}
                  </time>
                </div>
                {t.description && (
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                    {t.description}
                  </p>
                )}
                {t.source && (
                  <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                    Source: {t.source}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}