import React from "react";

function ChatHistory() {
  return (
    <section className="w-60 flex flex-col gap-2 h-full flex-grow">
      <h2 className="font-bold whitespace-nowrap">Chat History</h2>
      {[0, 1, 2, 3].map((key) => (
        <ChatHistoryIndividual
          key={key}
          title={"lkvmfdmvmfdlklkkmlmlmlkrvmdlmldskmlxld"}
          onClick={() => {}}
        />
      ))}
      <button className="btn btn-primary">+ Add new session</button>
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
