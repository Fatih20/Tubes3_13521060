import { createContext, ReactNode, useContext, useState } from "react";

type StringMatchingAlgorithm = "KMP" | "BM";
const StringMatcherContext = createContext({
  stringMatcher: "KMP",
  setKMP: () => {},
  setBM: () => {},
} as {
  stringMatcher: StringMatchingAlgorithm;
  setKMP: () => void;
  setBM: () => void;
});

export function useStringMatcherContext() {
  return useContext(StringMatcherContext);
}

function StringMatcherProvider({ children }: { children: ReactNode }) {
  const [stringMatcher, setStringMatcher] = useState(
    "KMP" as StringMatchingAlgorithm
  );
  return (
    <StringMatcherContext.Provider
      value={{
        stringMatcher,
        setKMP: () => setStringMatcher("KMP"),
        setBM: () => setStringMatcher("BM"),
      }}
    >
      {children}
    </StringMatcherContext.Provider>
  );
}

export default StringMatcherProvider;
