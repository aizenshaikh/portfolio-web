"use client";
import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
};

export default function SafeImage({ src, alt = "", className, style, fallback }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{fallback ?? null}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  );
}
