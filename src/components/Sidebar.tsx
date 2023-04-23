import { useStringMatcherContext } from "@/contexts/StringMatcher";
import { signOut } from "next-auth/react";

function Sidebar() {
  const { stringMatcher, setBM, setKMP } = useStringMatcherContext();
  return (
    <div className="flex flex-col items-center justify-start w-fit px-8 py-4">
      <h1 className="text-3xl font-bold text-center">Rinum</h1>
      <div className="h-full flex-grow"></div>
      <div className="flex-row flex gap-2 mb-4">
        <button
          className={`btn btn-xs w-1/2 ${
            stringMatcher === "KMP" ? "btn-secondary" : "btn-ghost"
          }`}
          onClick={setKMP}
        >
          KMP
        </button>
        <button
          className={`btn btn-xs w-1/2 ${
            stringMatcher === "BM" ? "btn-secondary" : "btn-ghost"
          }`}
          onClick={setBM}
        >
          BM
        </button>
      </div>
      <button className="btn btn-primary normal-case" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}

export default Sidebar;
