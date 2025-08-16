import { prisma } from "@/lib/db";
import { TableInput } from "@/lib/schemas";
import { json, serverError, badRequest} from "@/lib/http"
import { TIMEOUT } from "dns";

// GET /api/tables
export async function GET() {
    try {
        const tables = await prisma.table.findMany({
            orderBy: {createdAt: "desc"},
            select: {
                id: true, title: true, description: true, sides: true,
                createdAt: true, updatedAt: true
            },
        });
        return json({tables});
    } catch (e) {
        console.error(e);
        return serverError()
    }
}

// POST /api/tables
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = TableInput.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid input", { issues: parsed.error.issues });
    }
    const { title, description = "", sides = null, rows = [], source = ""} = parsed.data;

    const created = await prisma.table.create({
      data: {
        title, description, sides, source,
        rows: rows.length
          ? {
              create: rows.map(e => ({
                content: e.content,
                rangemin: e.rangemin ?? null,
                rangemax: e.rangemax ?? null,
                metadata: e.metadata ?? undefined,
              })),
            }
          : undefined,
      },
      include: { rows: true },
    });

    return json({ table: created }, { status: 201 });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}