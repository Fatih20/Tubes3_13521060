import { useStringMatcherContext } from "@/contexts/StringMatcher";
import { useState } from "react";

function Chatbox() {
  const { stringMatcher } = useStringMatcherContext();
  const [prompt, setPrompt] = useState("");
  const maxLength = 10000;

  return (
    <div className="flex-col w-full items-center justify-center bg-white py-4 px-4 gap-4 h-full">
      <div className="flex-grow bg-slate-500"></div>
      <div className="flex justify-start items-stretch gap-2 bg-secondary rounded-md p-2 h-fit">
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
        <button className="btn bg-transparent border-0 text-white">Send</button>
        <div className="flex flex-col items-center justify-center gap-2"></div>
      </div>
    </div>
  );
}

export default Chatbox;
