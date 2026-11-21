import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  FileText,
  Search,
  MessageSquareText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Suspense } from "react";

async function HomeContent() {
  const { userId } = await auth();

  if (userId) {
    redirect("/chat");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          Your documents, now conversational
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Chat with your
          <span className="text-primary"> documents.</span>
          <br />
          Get answers that matter.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Upload your documents and turn them into a searchable knowledge base.
          Ask questions in plain language and get helpful answers grounded in
          your own content.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <SignUpButton mode="modal" forceRedirectUrl="/chat">
            <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
              Start chatting
              <ArrowRight className="size-4" />
            </button>
          </SignUpButton>

          <SignInButton mode="modal" forceRedirectUrl="/chat">
            <button className="h-12 rounded-xl border border-border bg-background px-7 text-sm font-semibold transition hover:bg-muted">
              I already have an account
            </button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <h3 className="font-semibold">Upload documents</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Upload your PDF files and build a knowledge base from your own
              information.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="size-5" />
            </div>
            <h3 className="font-semibold">Find relevant information</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Semantic search finds relevant sections of your documents based on
              your questions.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquareText className="size-5" />
            </div>
            <h3 className="font-semibold">Ask and get answers</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Have natural conversations with an AI assistant that uses your
              uploaded documents as context.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
          <span>© 2026 RAG-CHATBOT</span>
          <span>Powered by AI and your knowledge.</span>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
