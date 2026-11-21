import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

const embeddingModel = google.embedding("gemini-embedding-001");
// gemini-embedding-001 produces 3,072-dimensional embeddings by default.
export async function generateEmbedding(value: string) {
  if (!value.trim()) {
    throw new Error("Query cannot be empty");
  }

  const { embedding } = await embed({
    model: embeddingModel,
    value,
    providerOptions: {
      google: {
        taskType: "RETRIEVAL_QUERY",
      },
    },
  });

  return embedding;
}

export async function generateEmbeddings(values: string[]) {
  if (!values.length) {
    throw new Error("No document chunks provided");
  }

  if (values.some((value) => !value.trim())) {
    throw new Error("Document chunks cannot be empty");
  }

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values,
    maxParallelCalls: 2,
    providerOptions: {
      google: {
        taskType: "RETRIEVAL_DOCUMENT",
      },
    },
  });

  return embeddings;
}
