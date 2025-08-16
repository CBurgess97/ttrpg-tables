export function requireId(id: string | undefined) {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error("MISSING_ID");
  }
  return id;
}