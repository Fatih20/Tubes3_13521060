import { useStringMatcherContext } from "@/contexts/StringMatcherProvider";
import { signOut } from "next-auth/react";
import ChatHistory from "./ChatHistory";

function Sidebar() {
  const { stringMatcher, setBM, setKMP } = useStringMatcherContext();
  return (
    <div className="flex flex-col items-center justify-start w-fit px-8 py-4 h-full gap-4 bg-base-200">
      <h1 className="text-3xl font-bold text-center">Rinum</h1>
      <ChatHistory />
      <div className="flex flex-col items-center justify-start gap-4 w-full">
        <div className="flex-row flex gap-2 w-full">
          <button
            className={`btn btn-xs w-1/2 ${
              stringMatcher === "KMP" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={setKMP}
          >
            KMP
          </button>
          <button
            className={`btn btn-xs w-1/2 ${
              stringMatcher === "BM" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={setBM}
          >
            BM
          </button>
        </div>
        <button
          className="btn btn-primary normal-case w-full btn-sm"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
