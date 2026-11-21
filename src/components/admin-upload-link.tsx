import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Upload } from "lucide-react";

export default async function AdminUploadLink() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "admin") {
    return null;
  }

  return (
    <Link
      href="/upload"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Upload className="size-4" />
      Upload Document
    </Link>
  );
}
