import { prisma } from "@/lib/db";
import { BulkEntriesInput } from "@/lib/schemas";
import { badRequest, json, notFound, serverError } from "@/lib/http";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = BulkEntriesInput.safeParse(body);
    if (!parsed.success) return badRequest("Invalid entries", { issues: parsed.error.issues });

    const table = await prisma.table.findUnique({ where: { id: params.id } });
    if (!table) return notFound("Table not found");

    const rows = parsed.data.rows;

    await prisma.$transaction(async (tx) => {
      await tx.row.deleteMany({ where: { tableId: table.id } });
      await tx.row.createMany({
        data: rows.map(e => ({
          tableId: table.id,
          content: e.content,
          rangemin: e.rangemin ?? null,
          rangemax: e.rangemax ?? null,
        })),
      });
    });

    const fresh = await prisma.row.findMany({ where: { tableId: table.id }});
    return json({ rows: fresh });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.row.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Entry not found");
    console.error(e);
    return serverError();
  }
}
