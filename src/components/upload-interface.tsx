"use client";

import { useRef, useState } from "react";
import { ingestPdf } from "@/app/upload/actions";

type UploadStatus = "idle" | "processing" | "success" | "error";

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [filename, setFilename] = useState("");
  const [totalChunks, setTotalChunks] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setStatus("idle");
    setErrorMessage("");
    setFilename(file.name);

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setStatus("error");
      setErrorMessage("Please select a valid PDF document.");
      event.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("Your PDF must not exceed 4 MB.");
      event.target.value = "";
      return;
    }

    try {
      setStatus("processing");

      const formData = new FormData();
      formData.append("file", file);

      const result = await ingestPdf(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      setTotalChunks(result.totalChunks ?? 0);
      setFilename(result.filename ?? file.name);
      setStatus("success");
    } catch (error) {
      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while processing your PDF.",
      );
    } finally {
      // Allow selecting the same file again
      event.target.value = "";
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  return (
    <main className="min-h-[calc(100dvh-3.5rem)] bg-slate-50 px-4 py-6 dark:bg-[#09090b] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] max-w-4xl items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Heading */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Knowledge base
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Give your AI something
              <span className="block text-blue-600 dark:text-blue-400">
                to learn from.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
              Upload a PDF document and we'll extract its content, organize it
              into searchable chunks, and prepare it for intelligent retrieval.
            </p>
          </div>

          {/* Upload card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#111114] dark:shadow-black/20 sm:p-10">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              {/* PDF icon */}
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 text-rose-500 dark:from-rose-500/10 dark:to-orange-500/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-10 w-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 2v6h6M8 13h8M8 17h8"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Upload your PDF document
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Choose a document from your device to add it to your searchable
                knowledge base.
              </p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={status === "processing"}
              />

              {/* Upload button */}
              <button
                type="button"
                onClick={openFilePicker}
                disabled={status === "processing"}
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "processing" ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeOpacity=".25"
                        strokeWidth="3"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Processing document...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0L8 8m4-4 4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
                      />
                    </svg>

                    {status === "success"
                      ? "Upload another PDF"
                      : "Choose PDF document"}
                  </>
                )}
              </button>

              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                PDF files only · Maximum file size 4 MB
              </p>

              {/* Processing state */}
              {status === "processing" && (
                <div
                  aria-live="polite"
                  className="mt-8 w-full max-w-md rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-left dark:border-blue-500/20 dark:bg-blue-500/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeOpacity=".25"
                          strokeWidth="3"
                        />
                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                        Preparing your document
                      </p>

                      <p className="mt-1 truncate text-xs text-blue-700/80 dark:text-blue-400/80">
                        {filename}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-blue-800/80 dark:text-blue-300/70">
                    Extracting text, generating embeddings and storing
                    searchable chunks. This may take a moment.
                  </p>
                </div>
              )}

              {/* Success state */}
              {status === "success" && (
                <div
                  aria-live="polite"
                  className="mt-8 w-full max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left dark:border-emerald-500/20 dark:bg-emerald-500/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m5 12 4 4L19 6"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                        Your document is ready!
                      </p>

                      <p className="mt-1 truncate text-xs text-emerald-800/70 dark:text-emerald-400/70">
                        {filename}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-emerald-200 pt-4 dark:border-emerald-500/20">
                    <div>
                      <p className="text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {totalChunks}
                      </p>

                      <p className="mt-1 text-xs text-emerald-800/70 dark:text-emerald-400/70">
                        Searchable chunks created
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      Indexed
                    </span>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-emerald-800/80 dark:text-emerald-400/70">
                    Your document has been processed and its content is now
                    available for semantic search.
                  </p>
                </div>
              )}

              {/* Error state */}
              {status === "error" && (
                <div
                  aria-live="assertive"
                  className="mt-8 w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-4 text-left dark:border-red-500/20 dark:bg-red-500/5"
                >
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" d="M12 8v5m0 3h.01" />
                    </svg>

                    <div>
                      <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                        Unable to process document
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-700/80 dark:text-red-400/80">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs leading-6 text-slate-400 dark:text-slate-500">
            Your documents are transformed into searchable knowledge using
            AI-powered embeddings.
          </p>
        </div>
      </div>
    </main>
  );
}
