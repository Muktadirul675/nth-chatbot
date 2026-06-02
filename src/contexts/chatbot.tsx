"use client";

import {
  UIMessage,
  useChat,
} from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";

type ChatbotContextType = {
  messages: UIMessage[];
  stop: ReturnType<typeof useChat>["stop"];
  setMessages: ReturnType<typeof useChat>["setMessages"];
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  stopMessage: ReturnType<typeof useChat>["stop"];
  initialized : boolean;
  setInitialized: Dispatch<SetStateAction<boolean>>;
  setUid: Dispatch<SetStateAction<string>>,
  status: ReturnType<typeof useChat>["status"];
};

const ChatbotContext =
  createContext<ChatbotContextType | null>(
    null
  );

export function ChatbotProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [uid, setUid] = useState<string>(crypto.randomUUID())
  const [streaming, setStreaming] = useState<boolean>(false);

  const chat = useChat({
    transport: new DefaultChatTransport({api: `/api/chat?uid=${uid}`})
  });
  const [initialized, setInitialized] = useState<boolean>(false); 
  return (
    <ChatbotContext.Provider
      value={{
        messages: chat.messages,
        stop: chat.stop,
        setMessages: chat.setMessages,
        stopMessage: chat.stop,
        sendMessage: chat.sendMessage,
        status: chat.status,
        initialized,
        setInitialized,
        setUid
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);

  if (!context) {
    throw new Error(
      "useChatbot must be used inside ChatbotProvider"
    );
  }

  return context;
}