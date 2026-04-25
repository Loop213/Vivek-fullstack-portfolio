import { useEffect, useState } from "react";

function TypingIntro({ name, role }) {
  const message = `${name || "Vivek Kumar"} | ${role || "Full Stack Developer"}`;
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setTyped(message.slice(0, index + 1));
      index += 1;
      if (index >= message.length) {
        clearInterval(timer);
      }
    }, 55);

    return () => clearInterval(timer);
  }, [message]);

  return (
    <div className="inline-flex min-h-11 items-center rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-4 py-2 text-sm text-[var(--text)] [box-shadow:var(--shadow)] backdrop-blur-xl">
      <span className="font-medium">{typed}</span>
      <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-[var(--primary)]" />
    </div>
  );
}

export default TypingIntro;
