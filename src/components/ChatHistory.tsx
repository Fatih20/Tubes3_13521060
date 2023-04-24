import { useChatSessionContext } from "@/contexts/ChatSessionProvider";
import { ChatSession } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LoadingCircle from "./LoadingCircle";

function ChatHistory() {
  const [newSessionName, setNewSessionName] = useState("");
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["chatSession"],
    queryFn: async () => await (await fetch("/api/history/getHistory")).json(),
  });
  useEffect(() => {
    if (!isLoading) {
      console.log(data);
    }
  }, [isLoading, data]);
  const { setChatSession } = useChatSessionContext();
  const { mutateAsync: addNewHistory, isLoading: addHistoryLoading } =
    useMutation({
      mutationFn: async () =>
        await (
          await fetch("/api/history/addHistory", {
            method: "POST",
            body: JSON.stringify({ title: newSessionName }),
          })
        ).json(),
      onSuccess: (data) => {
        // queryClient.setQueryData(["chatSession"], data);
        queryClient.invalidateQueries(["chatSession"]);
      },
    });
  const maxLength = 100;
  async function handleAddHistory() {
    if (newSessionName.length > maxLength) {
      return;
    }

    if (newSessionName.length <= 0) {
      return;
    }

    await addNewHistory();
    setNewSessionName("");
  }

  return (
    <section
      className="w-60 flex  flex-col gap-4 flex-grow items-start justify-start
    overflow-y-hidden
    "
    >
      <h2 className="font-bold whitespace-nowrap self-start">
        Session History
      </h2>
      {isLoading || addHistoryLoading ? (
        <div className="flex flex-col items-center justify-center flex-grow w-full">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <div className="flex flex-col w-full items-start justify-center gap-2">
            <div className="flex flex-col items-start justify-center  w-full">
              <textarea
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                className="w-full textarea bg-base-100 resize-none border-0 outline-0 focus:outline-none shadow-none"
              ></textarea>
              <label
                className={`self-end label-text ${
                  newSessionName.length <= maxLength ? "" : "text-error"
                }`}
              >
                {newSessionName.length}/{maxLength}
              </label>
            </div>

            <button
              onClick={handleAddHistory}
              className="btn btn-primary self-start w-full btn-sm"
            >
              + Add new session
            </button>
          </div>
          <div className="flex w-full flex-col flex-grow h-full items-center justify-start gap-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-100">
            {(data as ChatSession[]).map(({ id, title }) => (
              <ChatHistoryIndividual
                key={`${id} ${title}`}
                title={title}
                onClick={() => setChatSession(id)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export type ChatHistoryIndividualProps = {
  title: string;
  onClick: () => void;
};

function ChatHistoryIndividual({ onClick, title }: ChatHistoryIndividualProps) {
  return (
    <button
      className="btn btn-secondary font-normal normal-case w-full rounded-md p-2 hover:bg-neutral-focus btn-sm"
      onClick={onClick}
    >
      <h3 className="text-ellipsis whitespace-nowrap overflow-hidden">
        {title}
      </h3>
    </button>
  );
}

export default ChatHistory;
