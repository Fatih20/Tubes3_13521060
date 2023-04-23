import { signOut } from "next-auth/react";

function Sidebar() {
  return (
    <div className="flex flex-col items-center justify-start w-fit px-8 py-4">
      <h1 className="text-3xl font-bold text-center">Rinum</h1>
      <div className="h-full flex-grow"></div>
      <button className="btn btn-primary normal-case" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}

export default Sidebar;
