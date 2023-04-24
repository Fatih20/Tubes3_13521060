import { useChatSessionContext } from "@/contexts/ChatSessionProvider";
import { useStringMatcherContext } from "@/contexts/StringMatcherProvider";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ConversationBox from "./ConversationBox";
import LoadingCircle from "./LoadingCircle";

function Chatbox() {
  const { stringMatcher } = useStringMatcherContext();
  const [prompt, setPrompt] = useState("");
  const { chatSession } = useChatSessionContext();
  const { data, isLoading, error } = useQuery({
    queryKey: ["chat", chatSession],
    queryFn: async () =>
      await (await fetch("/api/chat/getChat/" + chatSession.toString())).json(),
  });
  const { data: session } = useSession();
  useEffect(() => {
    console.log(error);
  }, [error]);
  const maxLength = 10000;

  return (
    <div className="flex flex-col w-full items-center justify-center bg-base-100 py-4 px-4 gap-4 h-full">
      {isLoading ? (
        <div className="flex flex-grow flex-col w-full items-center justify-center">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <ConversationBox chats={data ?? []} />
          <div className="flex justify-start items-stretch gap-2 bg-base-200 rounded-md p-2 h-fit w-full">
            <div className="flex flex-col w-full">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full textarea bg-transparent resize-none border-0 outline-0 focus:outline-none shadow-none h-28"
              ></textarea>
              <label
                className={`self-end label-text ${
                  prompt.length <= maxLength ? "" : "text-error"
                }`}
              >
                {prompt.length}/{maxLength}
              </label>
            </div>
            <button className="btn bg-transparent border-0 text-white">
              Send
            </button>
            <div className="flex flex-col items-center justify-center gap-2"></div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chatbox;
