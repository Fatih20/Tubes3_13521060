import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

const ChatSessionContext = createContext({
  chatSession: "",
  setChatSession: () => {},
} as { chatSession: string; setChatSession: Dispatch<SetStateAction<string>> });

export function useChatSessionContext() {
  return useContext(ChatSessionContext);
}

function ChatSessionProvider({ children }: { children: ReactNode }) {
  const [chatSession, setChatSession] = useState("");
  return (
    <ChatSessionContext.Provider value={{ chatSession, setChatSession }}>
      {children}
    </ChatSessionContext.Provider>
  );
}

export default ChatSessionProvider;
