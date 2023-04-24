import { useSession } from "next-auth/react";
import Image from "next/image";

function ConversationBox() {
  const { data: session } = useSession();
  return (
    <div className="flex-grow w-full flex flex-col items-start justify-start p-4 rounded-md gap-4 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-200">
      {[
        { text: "Bruh", profilePicture: undefined, user: false },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
        { text: "Bruh", profilePicture: session?.user?.image, user: true },
      ].map(({ profilePicture, text, user }) => (
        <Chat
          text={text}
          user={user}
          profilePicture={profilePicture}
          key={text}
        />
      ))}
    </div>
  );
}

export type ChatProps = {
  text: string;
  profilePicture: string | null | undefined;
  user: boolean;
};

function Chat({ text, profilePicture, user }: ChatProps) {
  return (
    <div className={`chat ${user ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-12 rounded-full">
          <Image
            width={48}
            height={48}
            src={user ? profilePicture ?? "/white.jpeg" : "/bot.jpeg"}
            alt={user ? "You" : "Bot"}
            className="w-12 h-12 rounded-full"
          />{" "}
        </div>
      </div>
      <div className="chat-bubble bg-primary">
        It was said that you would, destroy the Sith, not join them.
      </div>
      <div className="chat-footer">
        <time className="text-xs opacity-50">12:45</time>
      </div>
    </div>
    // <div
    //   className={`flex w-full items-start justify-start gap-4 ${
    //     user ? "flex-row-reverse" : "flex-row"
    //   }`}
    // >

    //   <div
    //     className={`p-3 flex-grow ${
    //       user ? "bg-primary" : "bg-accent"
    //     } rounded-xl`}
    //   >
    //     {text}
    //   </div>
    // </div>
  );
}

export default ConversationBox;
