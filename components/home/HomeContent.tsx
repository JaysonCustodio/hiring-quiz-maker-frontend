"use client";

import Link from "next/link";
import QuizIdModal from "./QuizIdModal";
import { useState } from "react";

export function HomeContent() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white h-lvh flex flex-col gap-3 items-center justify-center">
      <h1 className="text-black font-bold text-3xl">Quiz Maker</h1>
      <p className="text-sm text-gray-500">Please choose your action</p>
      <div className="flex flex-row gap-3">
        <Link
          href="/builder"
          className="bg-black w-52 rounded-md font-bold text-center p-3 transition-colors hover:bg-gray-800"
        >
          Create Quiz
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-700 w-52 rounded-md font-bold text-center p-3 transition-colors hover:bg-gray-800"
        >
          Take Quiz
        </button>
      </div>
      <QuizIdModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
