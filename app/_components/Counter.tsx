"use client";
import React, { useState } from "react";
import { CounterProps } from "../interfacetype";

// type Props = {};

export default function Counter({ users }: CounterProps) {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>There are {users.length} users</p>
      <button onClick={() => setCount((count) => count + 1)}>{count}</button>
    </>
  );
}
