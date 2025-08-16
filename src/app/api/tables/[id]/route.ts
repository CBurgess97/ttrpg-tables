import { prisma } from "@/lib/db";
import { json, notFound, serverError, badRequest } from "@/lib/http";
import { TableInput } from "@/lib/schemas";

// Get api/tables/[id]
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const table = await prisma.table.findUnique({
      where: { id: params.id },
      include: { rows: true },
    });
    if (!table) return notFound("Table not found");
    return json({ table });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

// PUT api/tables/[id]
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();
    const parsed = TableInput.partial().safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid input", { issues: parsed.error.issues });
    }

    const updated = await prisma.table.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        sides: parsed.data.sides,
      },
      include: { rows: true },
    });

    return json({ table: updated });
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Table not found");
    console.error(e);
    return serverError();
  }
}

// DELETE api/tables/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.table.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Table not found");
    console.error(e);
    return serverError();
  }
}