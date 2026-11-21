"use server";

import "server-only";

import { PDFParse } from "pdf-parse";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { documents, documentChunks } from "@/lib/db/schema";

import { chunkContent } from "@/lib/chunking";
import { generateEmbeddings } from "@/lib/embeddings";
import { auth } from "@clerk/nextjs/server";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const INSERT_BATCH_SIZE = 100;

export async function ingestPdf(formData: FormData) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  let parser: PDFParse | undefined;
  let documentId: string | undefined;

  try {
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("Please upload a PDF file");
    }

    if (file.size === 0) {
      throw new Error("The uploaded file is empty");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("PDF must not exceed 4 MB");
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Only PDF files are supported");
    }

    // 2. Convert the uploaded file into a buffer
    const buffer = new Uint8Array(await file.arrayBuffer());

    // Check the PDF file signature
    const signature = new TextDecoder().decode(buffer.slice(0, 5));

    if (signature !== "%PDF-") {
      throw new Error("Invalid PDF file");
    }

    // 3. Extract text from the PDF
    parser = new PDFParse({
      data: buffer,
    });

    const pdfData = await parser.getText();
    const extractedText = pdfData.text.trim();

    // Release PDF parser resources
    await parser.destroy();
    parser = undefined;

    if (!extractedText) {
      throw new Error("No readable text found in this PDF. It may be scanned.");
    }

    // 4. Split extracted text into chunks
    const chunks = await chunkContent(extractedText);

    if (!chunks.length) {
      throw new Error("No chunks were generated");
    }

    // 5. Generate embeddings for the chunks
    const embeddings = await generateEmbeddings(chunks);

    if (embeddings.length !== chunks.length) {
      throw new Error("Embedding count does not match chunk count");
    }

    // 6. Store document information
    const [document] = await db
      .insert(documents)
      .values({
        filename: file.name,
        fileSize: file.size,
      })
      .returning({
        id: documents.id,
      });

    documentId = document.id;

    // 7. Prepare chunk records
    const chunkRecords = chunks.map((content, index) => ({
      documentId: document.id,
      chunkIndex: index,
      content,
      embedding: embeddings[index],
    }));

    // 8. Insert chunks in batches
    for (let i = 0; i < chunkRecords.length; i += INSERT_BATCH_SIZE) {
      const batch = chunkRecords.slice(i, i + INSERT_BATCH_SIZE);

      await db.insert(documentChunks).values(batch);
    }

    // 9. Return success response
    return {
      success: true,
      message: "PDF processed successfully",
      documentId: document.id,
      filename: file.name,
      totalChunks: chunks.length,
    };
  } catch (error) {
    console.error("PDF ingestion error:", error);

    // Clean up the document if chunk insertion failed
    if (documentId) {
      try {
        await db.delete(documents).where(eq(documents.id, documentId));
      } catch (cleanupError) {
        console.error("Document cleanup failed:", cleanupError);
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to process PDF",
    };
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}
