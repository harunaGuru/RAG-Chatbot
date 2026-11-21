import { tool } from "ai";
import { z } from "zod";

import { searchSimilarChunks } from "@/lib/search";

export const searchKnowledgeBase = tool({
  description:
    "Search the user's uploaded documents for information relevant to their question. Use this tool whenever the answer may be contained in the uploaded documents.",

  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "A specific question or search query to look up in the knowledge base.",
      ),
  }),

  execute: async ({ query }) => {
    const results = await searchSimilarChunks(query, 5);

    return results.map((chunk) => ({
      filename: chunk.filename,
      content: chunk.content,
      similarity: chunk.similarity,
    }));
  },
});
