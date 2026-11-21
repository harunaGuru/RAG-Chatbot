import {
  pgTable,
  uuid,
  text,
  bigint,
  integer,
  timestamp,
  vector,
  index,
  unique,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),

  filename: text("filename").notNull(),

  fileSize: bigint("file_size", {
    mode: "number",
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const documentChunks = pgTable(
  "document_chunks",
  {
    id: bigint("id", {
      mode: "number",
    })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, {
        onDelete: "cascade",
      }),

    chunkIndex: integer("chunk_index").notNull(),

    content: text("content").notNull(),

    embedding: vector("embedding", {
      dimensions: 3072,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("document_chunks_document_id_idx").on(table.documentId),

    unique("document_chunks_document_chunk_unique").on(
      table.documentId,
      table.chunkIndex,
    ),

    index("document_chunks_embedding_hnsw_idx").using(
      "hnsw",
      sql`(${table.embedding}::halfvec(3072)) halfvec_cosine_ops`,
    ),
  ],
);
