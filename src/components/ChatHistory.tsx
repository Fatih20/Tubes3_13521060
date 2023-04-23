import React from "react";

function ChatHistory() {
  return (
    <section className="w-full flex flex-col gap-2 h-full flex-grow">
      <h2 className="font-bold whitespace-nowrap">Chat History</h2>
      {[0, 1, 2, 3].map((key) => (
        <ChatHistoryIndividual key={key} title={"Bruh"} onClick={() => {}} />
      ))}
    </section>
  );
}

export type ChatHistoryIndividualProps = {
  title: string;
  onClick: () => void;
};

function ChatHistoryIndividual({ onClick, title }: ChatHistoryIndividualProps) {
  return (
    <div className="bg-primary w-full" onClick={onClick}>
      {title}
    </div>
  );
}

export default ChatHistory;
