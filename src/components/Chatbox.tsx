import { useState } from "react";

function Chatbox() {
  const [isKMP, setIsKMP] = useState(true);
  return (
    <div className="flex-col w-full items-center justify-center bg-white py-4 px-4 gap-4 h-full">
      <div className="flex-grow bg-slate-500"></div>
      <div className="flex justify-start items-center gap-2">
        <input className="input w-full input-bordered input-primary" />
        <div className="flex flex-col items-center justify-center gap-2">
          <button className="btn btn-xs w-full">KMP</button>
          <button className="btn btn-xs w-full">BM</button>
        </div>
        <button className="btn btn-primary">Send</button>
      </div>
    </div>
  );
}

export default Chatbox;
