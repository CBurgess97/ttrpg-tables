import { metadata } from "@/app/layout";
import { z } from "zod";

export const EntryInput = z.object({
    content: z.string().min(1),
    rangemin: z.number().int().positive(),
    rangemax: z.number().int().positive(),
    metadata: z.any().optional()
})

export const TableInput = z.object({
    title: z.string().min(1),
    description: z.string().optional().default(""),
    source: z.string().optional().default(""),
    sides: z.string().optional().nullable(),
    rows: z.array(EntryInput).optional()
})

export const BulkEntriesInput = z.object({
  rows: z.array(EntryInput).min(1),
});