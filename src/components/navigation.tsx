import React, { Suspense } from "react";
import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { MessageSquareText, ArrowRight, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import AdminUploadLink from "./admin-upload-link";

const Navigation = () => {
  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MessageSquareText className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              RAG-CHATBOT
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Suspense>
              <Show when="signed-out">
                <SignInButton mode="modal" forceRedirectUrl="/chat">
                  <Button variant="ghost" size="lg">
                    Sign in
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal" forceRedirectUrl="/chat">
                  <Button size="lg" className="gap-2">
                    Sign up
                    <ArrowRight className="size-4" />
                  </Button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <AdminUploadLink />
                {/* <Link
                  href="/upload"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Upload className="size-4" />
                  Upload Document
                </Link> */}

                <SignOutButton redirectUrl="/">
                  <Button variant="outline" size="lg">
                    Sign out
                  </Button>
                </SignOutButton>

                <UserButton />
              </Show>
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
