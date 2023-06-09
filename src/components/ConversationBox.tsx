import { useChatSessionContext } from "@/contexts/ChatSessionProvider";
import { Chat } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ReactNode, useEffect, useRef } from "react";
import LoadingCircle from "./LoadingCircle";

function ConversationBox({ chats }: { chats: Chat[] }) {
  const { data: session } = useSession();
  const messageEndRef = useRef(null);
  useEffect(() => {
    (messageEndRef.current as any)?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div className="flex-grow w-full flex flex-col items-start justify-start p-4 rounded-md gap-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-200">
      {chats.map(({ fromUser, text, time }) => (
        <ChatBit
          text={text}
          fromUser={fromUser}
          profilePicture={!fromUser ? undefined : session?.user?.image}
          time={time}
          key={`${time} ${text}`}
        />
      ))}
      <div className="opacity-0" ref={messageEndRef}></div>
    </div>
  );
}

export type ChatBitProps = {
  text: string;
  profilePicture: string | null | undefined;
  fromUser: boolean;
  time: string;
};

function ChatBit({ text, profilePicture, fromUser, time }: ChatBitProps) {
  const date = new Date(time);
  return (
    <div
      className={`chat ${
        fromUser ? "chat-end self-end" : "chat-start self-start"
      }`}
    >
      <div className="chat-image avatar">
        <div className="w-12 rounded-full">
          <Image
            width={48}
            height={48}
            src={fromUser ? profilePicture ?? "/white.jpg" : "/simsimi.jpeg"}
            alt={fromUser ? "You" : "Bot"}
            className="w-12 h-12 rounded-full"
          />{" "}
        </div>
      </div>
      <div className="chat-bubble min-w-fit bg-primary">{text}</div>
      <div className="chat-footer">
        <time className="text-xs opacity-50">{`${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")} ${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`}</time>
      </div>
    </div>
  );
}

export default ConversationBox;
