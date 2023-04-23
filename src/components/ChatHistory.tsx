import React from "react";

function ChatHistory() {
  return (
    <section
      className="w-60 flex  flex-col gap-2 flex-grow items-start justify-start
    overflow-y-hidden
    "
    >
      <h2 className="font-bold whitespace-nowrap self-start">
        Session History
      </h2>
      <button className="btn btn-primary self-start w-full btn-sm">
        + Add new session
      </button>

      <div className="flex w-full flex-col flex-grow h-full items-center justify-start gap-4 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-100">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(
          (key) => (
            <ChatHistoryIndividual
              key={key}
              title={key.toString()}
              onClick={() => {}}
            />
          )
        )}
      </div>
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
      className="btn btn-secondary font-normal normal-case w-full rounded-md p-2 hover:bg-neutral-focus"
      onClick={onClick}
    >
      <h3 className="text-lg text-ellipsis whitespace-nowrap overflow-hidden">
        {title}
      </h3>
    </button>
  );
}

export default ChatHistory;
