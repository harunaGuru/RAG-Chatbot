import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

interface ChunkPdfOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

export async function chunkContent(
  content: string,
  options: ChunkPdfOptions = {},
) {
  const { chunkSize = 1000, chunkOverlap = 200 } = options;

  if (chunkOverlap >= chunkSize) {
    throw new Error("Chunk overlap must be smaller than chunk size");
  }

  // Split extracted pages into smaller chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ["\n\n", "\n", ". ", " ", ""],
  });

  const chunks = await splitter.splitText(content.trim());

  return chunks;
}
