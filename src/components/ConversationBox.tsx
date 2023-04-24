import { useChatSessionContext } from "@/contexts/ChatSessionProvider";
import { Chat } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import LoadingCircle from "./LoadingCircle";

function ConversationBox({ chats }: { chats: Chat[] }) {
  const { data: session } = useSession();

  return (
    <div className="flex-grow w-full flex flex-col items-start justify-start p-4 rounded-md gap-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-200">
      {chats.map(({ fromUser, text, time }) => (
        <ChatBit
          text={text}
          fromUser={fromUser}
          profilePicture={!fromUser ? undefined : session?.user?.image}
          time={time}
          key={text}
        />
      ))}
    </div>
  );
}

export type ChatBitProps = {
  text: string;
  profilePicture: string | null | undefined;
  fromUser: boolean;
  time: Date;
};

function ChatBit({ text, profilePicture, fromUser, time }: ChatBitProps) {
  return (
    <div className={`chat ${fromUser ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-12 rounded-full">
          <Image
            width={48}
            height={48}
            src={fromUser ? profilePicture ?? "/white.jpeg" : "/bot.jpeg"}
            alt={fromUser ? "You" : "Bot"}
            className="w-12 h-12 rounded-full"
          />{" "}
        </div>
      </div>
      <div className="chat-bubble bg-primary">{text}</div>
      <div className="chat-footer">
        <time className="text-xs opacity-50">{time.toISOString()}</time>
      </div>
    </div>
  );
}

export default ConversationBox;
