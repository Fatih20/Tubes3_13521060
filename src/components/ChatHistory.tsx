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
  const { setChatSession, chatSession } = useChatSessionContext();
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
  const { mutateAsync: deleteHistory, isLoading: deleteHistoryLoading } =
    useMutation({
      mutationFn: async (id: string) =>
        await (
          await fetch("/api/history/deleteHistory/" + id, {
            method: "DELETE",
          })
        ).json(),
      onSuccess: (data, id) => {
        // queryClient.setQueryData(["chatSession"], data);
        queryClient.invalidateQueries(["chatSession"]);
        if (id === chatSession) {
          setChatSession("");
        }
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
      {isLoading || addHistoryLoading || deleteHistoryLoading ? (
        <div className="flex flex-col items-center justify-center flex-grow w-full">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <div className="flex flex-col w-full items-start justify-center gap-2">
            <div className="flex flex-col items-start justify-center  w-full">
              <textarea
                placeholder="Title of new chat session"
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
          {(data as ChatSession[]).length > 0 && (
            <div className="divider m-0"></div>
          )}
          <div className="flex w-full flex-col flex-grow h-full items-center justify-start gap-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-100">
            {(data as ChatSession[]).map(({ id, title }) => (
              <ChatHistoryIndividual
                key={`${id} ${title}`}
                selected={id === chatSession}
                title={title}
                onClick={() => setChatSession(id)}
                onDelete={async () => await deleteHistory(id)}
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
  selected: boolean;
  onClick: () => void;
  onDelete: () => Promise<void>;
};

function ChatHistoryIndividual({
  onClick,
  title,
  onDelete,
  selected,
}: ChatHistoryIndividualProps) {
  return (
    <div
      className={`btn btn-secondary ${
        selected ? "bg-base-200 hover:bg-base-200" : ""
      } font-normal normal-case w-full rounded-md p-2 hover:bg-neutral-focus btn-sm relative group`}
      onClick={onClick}
    >
      <div className="absolute z-10 right-0 h-full top-0 bottom-0 group-hover:opacity-100 group-hover:pointer-events-auto opacity-0 pointer-events-none flex flex-row items-center justify-center bg-gradient-to-r from-transparent to-primary pl-12 pr-2 transition-opacity">
        <button
          className=""
          onClick={async (e) => {
            e.stopPropagation();
            await onDelete();
          }}
        >
          <svg
            className="aspect-square w-4 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <line x1="18" y1="6" x2="6" y2="18" />{" "}
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <h3 className="text-ellipsis whitespace-nowrap overflow-hidden">
        {title}
      </h3>
    </div>
  );
}

export default ChatHistory;
