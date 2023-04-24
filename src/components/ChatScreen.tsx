import { useChatSessionContext } from "@/contexts/ChatSessionProvider";
import { useStringMatcherContext } from "@/contexts/StringMatcherProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ChatBox from "./ChatBox";
import ConversationBox from "./ConversationBox";
import LoadingCircle from "./LoadingCircle";

function ChatScreen() {
  const { chatSession } = useChatSessionContext();
  const { stringMatcher } = useStringMatcherContext();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["chat", chatSession],
    queryFn: async () =>
      await (await fetch("/api/chat/getChat/" + chatSession.toString())).json(),
  });
  const { mutateAsync: askQuestion, status: sendingStatus } = useMutation({
    mutationFn: async (question: string) =>
      await (
        await fetch("/api/chat/ask/", {
          method: "POST",
          body: JSON.stringify({
            chatSessionId: chatSession,
            question: question,
            stringMatchingAlgorithm: stringMatcher,
          }),
        })
      ).json(),
    onSuccess: (data) => {
      // queryClient.setQueryData(["chatSession"], data);
      queryClient.invalidateQueries(["chat", chatSession]);
    },
  });
  const { data: session } = useSession();
  useEffect(() => {
    console.log(sendingStatus);
  }, [sendingStatus]);
  return (
    <div className="flex flex-col w-full items-center justify-center bg-base-100 py-4 px-4 gap-4 h-full">
      {isLoading ? (
        <div className="flex flex-grow flex-col w-full items-center justify-center">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <ConversationBox chats={data ?? []} />
          <ChatBox
            sendQuestion={async (q) => askQuestion(q)}
            loading={sendingStatus === "loading"}
          />
        </>
      )}
    </div>
  );
}

export default ChatScreen;
