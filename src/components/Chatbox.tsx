import { useState } from "react";

function Chatbox() {
  const [isKMP, setIsKMP] = useState(true);
  return (
    <div className="flex-col w-full items-center justify-center bg-white py-4 px-4 gap-4 h-full">
      <div className="flex-grow bg-slate-500"></div>
      <div className="flex justify-start items-stretch gap-2">
        <textarea className="w-full textarea textarea-bordered textarea-primary"></textarea>
        <button className="btn btn-primary h-full">Send</button>
        <div className="flex flex-col items-center justify-center gap-2"></div>
      </div>
    </div>
  );
}

export default Chatbox;
