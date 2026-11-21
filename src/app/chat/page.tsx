import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatInterface from "../../components/chat-interface";

async function AuthenticatedChat() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <ChatInterface />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <AuthenticatedChat />
    </Suspense>
  );
}
