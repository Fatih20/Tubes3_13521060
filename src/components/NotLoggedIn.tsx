import { signIn } from "next-auth/react";

function NotLoggedIn() {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <h1 className="text-3xl font-bold text-center">
        You must be logged in to use this app
      </h1>
      <button className="btn btn-primary btn-md" onClick={() => signIn()}>
        Sign In
      </button>
    </div>
  );
}

export default NotLoggedIn;
