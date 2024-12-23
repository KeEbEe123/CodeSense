"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const [inputVal, setInputVal] = useState("");
  const { push } = useRouter();
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    push(`/profile/${inputVal}`);
  };
  return (
    <div className="flex justify-center flex-col items-center">
      <div>
        <h1>Enter name: </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="text-black"
          type="text"
          placeholder="type your name"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button type="submit">predict data</button>
      </form>
    </div>
  );
}
