import NavBar from "@/components/NavBar";
import React from "react";

export default function UploadLayout({ children }) {
  return (
    <div>
      <NavBar />
      <main className="mt-1">{children}</main>
    </div>
  );
}
