// src/app/tables/[id]/page.tsx
import { prisma } from "@/lib/db";
import TableEditor from "./table-editor";

type Props = { params: { id: string } };

export default async function TableDetailPage({ params }: Props) {
  const table = await prisma.table.findUnique({
    where: { id: params.id },
    include: {
      rows: {
        orderBy: [{ rangemin: "asc" }, { content: "asc" }],
        select: { id: true, content: true, rangemin: true, rangemax: true },
      },
    },
  });

  if (!table) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-red-600">Table not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <TableEditor initialTable={table} />
    </main>
  );
}
