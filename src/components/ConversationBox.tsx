import { useSession } from "next-auth/react";
import Image from "next/image";

function ConversationBox() {
  const { data: session } = useSession();
  return (
    <div className="flex-grow bg-slate-500 w-full flex flex-col items-start justify-start p-4 rounded-md gap-4">
      {[
        { text: "Bruh", profilePicture: undefined, user: false },
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
    <div
      className={`flex w-full items-start justify-center gap-4 ${
        user ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Image
        width={48}
        height={48}
        src={user ? profilePicture ?? "/white.jpeg" : "/bot.jpeg"}
        alt={user ? "You" : "Bot"}
        className="w-12 h-12 rounded-full"
      />
      <div className="p-3 flex-grow bg-primary rounded-xl">{text}</div>
    </div>
  );
}

export default ConversationBox;
