import "server-only";

import { asc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { documents, documentChunks } from "@/lib/db/schema";
import { generateEmbedding } from "@/lib/embeddings";

const EMBEDDING_DIMENSIONS = 3072;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 10;

export async function searchSimilarChunks(
  query: string,
  limit = DEFAULT_LIMIT,
) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    throw new Error("Search query cannot be empty");
  }

  const queryEmbedding = await generateEmbedding(trimmedQuery);

  if (queryEmbedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error("Invalid query embedding dimensions");
  }

  const vectorString = `[${queryEmbedding.join(",")}]`;

  const distance = sql<number>`
    ${documentChunks.embedding}::halfvec(3072)
    <=> ${vectorString}::halfvec(3072)
  `.mapWith(Number);

  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), MAX_LIMIT);

  const results = await db
    .select({
      id: documentChunks.id,
      documentId: documentChunks.documentId,
      filename: documents.filename,
      chunkIndex: documentChunks.chunkIndex,
      content: documentChunks.content,
      distance,
    })
    .from(documentChunks)
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
    .orderBy(asc(distance))
    .limit(safeLimit);

  return results.map(({ distance, ...chunk }) => ({
    ...chunk,
    similarity: 1 - distance,
  }));
}
