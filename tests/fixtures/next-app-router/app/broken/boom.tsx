"use client";

// Deliberately fails during render so the route error boundary (app/error.tsx) takes over.
export default function Boom(): never {
  throw new Error("unitary fixture error boundary");
}
