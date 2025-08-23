"use client";
import { Button } from "./ui/button";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";

function NavBar() {
  const router = useRouter();
  const session = useSession();
  console.log(session.data);
  const goToUpload = () => {
    router.push("/upload");
  };
  const goToHome = () => {
    router.push("/");
  };
  return (
    <nav className="top-0 flex items-center justify-between p-4 bg-white text-black shadow-md sticky z-10">
      <div>
        <h1
          onClick={goToHome}
          className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-blue-500 bg-clip-text text-transparent
                       transition-transform duration-300 hover:scale-105 cursor-pointer"
        >
          Youtube
        </h1>
      </div>
      <SearchBar/>
      <div className="hidden md:flex space-x-4">
        {session.data?.user && (
          <div className=" flex gap-2">
            <Button
              onClick={() => signOut()}
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl
                      focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800
                      font-medium rounded-lg text-sm px-5 py-2.5 text-center
                      transition-all duration-300 hover:scale-105 transform cursor-pointer"
              variant="ghost"
              size="lg"
            >
              Sign Out
            </Button>
            <Button
              onClick={goToUpload}
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl
                      focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800
                      font-medium rounded-lg text-sm px-5 py-2.5 text-center
                      transition-all duration-300 hover:scale-105 transform cursor-pointer"
              variant="ghost"
              size="lg"
            >
              Upload
            </Button>
          </div>
        )}
        {!session.data?.user && (
          <Button
            onClick={() => signIn()}
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl
                      focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800
                      font-medium rounded-lg text-sm px-5 py-2.5 text-center
                      transition-all duration-300 hover:scale-105 transform cursor-pointer"
            variant="ghost"
            size="lg"
          >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
