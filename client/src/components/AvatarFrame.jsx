function getInitials(name = "Vivek Kumar") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

import { useEffect, useState } from "react";

function AvatarFrame({ name, avatarUrl, size = "large" }) {
  const [hasError, setHasError] = useState(false);
  const dimensions = size === "small" ? "h-14 w-14 text-lg" : "h-36 w-36 text-4xl sm:h-44 sm:w-44 sm:text-5xl";
  const shouldShowImage = avatarUrl && !hasError;

  useEffect(() => {
    setHasError(false);
  }, [avatarUrl]);

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card-strong)] shadow-[var(--shadow)] ${dimensions}`}>
      {shouldShowImage ? (
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" onError={() => setHasError(true)} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--primary)] text-white">
          <span className="font-display font-bold">{getInitials(name)}</span>
        </div>
      )}
    </div>
  );
}

export default AvatarFrame;
