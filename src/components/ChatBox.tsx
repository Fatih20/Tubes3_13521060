import { useEffect, useState } from "react";
import LoadingCircle from "./LoadingCircle";

export type ChatBoxProps = {
  sendQuestion: (arg0: string) => Promise<void>;
  loading: boolean;
};

function ChatBox({ sendQuestion, loading }: ChatBoxProps) {
  const [prompt, setPrompt] = useState("");
  const maxLength = 10000;

  async function handleSend() {
    if (prompt.length > maxLength) {
      return;
    }

    if (prompt.length <= 0) {
      return;
    }
    await sendQuestion(prompt);
    setPrompt("");
  }
  useEffect(() => {
    console.log(loading);
  }, [loading]);

  return (
    <div className="flex justify-start items-stretch gap-2 bg-base-200 rounded-md p-2 h-fit w-full relative">
      <div
        className={`absolute inset-0 h-full w-full bg-black/50 ${
          loading ? "display" : "hidden"
        } flex flex-col items-center justify-center`}
      >
        <LoadingCircle />
      </div>
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
      <button
        className="btn bg-transparent border-0 text-white"
        onClick={handleSend}
      >
        Send
      </button>
      <div className="flex flex-col items-center justify-center gap-2"></div>
    </div>
  );
}

export default ChatBox;
