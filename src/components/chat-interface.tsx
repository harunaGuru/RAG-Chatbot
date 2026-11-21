"use client";

import { useState, Fragment } from "react";
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  RefreshCcwIcon,
  CopyIcon,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";

const ActionsDemo = () => {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, regenerate, error } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text.trim() && !isLoading) {
      sendMessage({ text: message.text });
      setInput("");
    }
  };

  return (
    <div className="mx-auto my-4 flex h-[calc(100dvh-5.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
      <div className="flex h-full min-h-0 flex-col bg-muted/20">
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6 sm:px-6">
            {messages.map((message, messageIndex) => {
              const isLastMessage = messageIndex === messages.length - 1;

              return (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => {
                    if (part.type !== "text") return null;

                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <Message from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                        </Message>

                        {message.role === "assistant" &&
                          isLastMessage &&
                          !isLoading && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>

                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                      </Fragment>
                    );
                  })}
                </Fragment>
              );
            })}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        <div className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6">
          <PromptInput onSubmit={handleSubmit} className="relative w-full">
            <PromptInputTextarea
              value={input}
              placeholder="Ask anything about your documents..."
              onChange={(e) => setInput(e.currentTarget.value)}
              className="min-h-12 rounded-xl border-border bg-background pr-12 shadow-sm focus-visible:ring-1"
            />

            <PromptInputSubmit
              status={status === "streaming" ? "streaming" : "ready"}
              disabled={!input.trim() || isLoading}
              className="absolute bottom-2 right-2"
            />
          </PromptInput>

          {isLoading && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              <span>
                {status === "submitted"
                  ? "Searching your documents..."
                  : "Generating response..."}
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>
                  {error?.message || "Something went wrong. Please try again."}
                </span>
              </div>

              <button
                onClick={() => regenerate()}
                className="shrink-0 font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                Retry
              </button>
            </div>
          )}

          <p className="mt-3 text-center text-xs text-muted-foreground">
            AI responses may not always be accurate. Verify important
            information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActionsDemo;
