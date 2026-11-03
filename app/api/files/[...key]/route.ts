import { getMemoryFile } from "@/lib/services/storage";

export async function GET(_request: Request, context: { params: { key: string[] } }) {
  const key = decodeURIComponent(context.params.key.join("/"));
  const file = getMemoryFile(key);
  if (!file) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(new Uint8Array(file.content), {
    headers: {
      "Content-Type": file.mimeType ?? "application/octet-stream",
      "Cache-Control": "private, max-age=60"
    }
  });
}
