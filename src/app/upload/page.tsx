import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UploadInterface from "@/components/upload-interface";

async function UploadContent() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/");
  }

  if (sessionClaims?.metadata?.role !== "admin") {
    redirect("/chat");
  }

  return <UploadInterface />;
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading upload page...</div>}>
      <UploadContent />
    </Suspense>
  );
}
