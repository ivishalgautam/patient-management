"use client";
import Image from "next/image";
import { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_DRDIPTI_IMAGE_DOMAIN;
export default function ImageWithFallback({
  width,
  height,
  alt,
  src,
  className,
}) {
  const [isImageError, setIsImageError] = useState(false);
  return (
    <Image
      src={isImageError ? "/images/not-found.png" : `${baseUrl}/${src}`}
      width={width ?? 100}
      height={height ?? 100}
      alt={alt ?? "not found"}
      className={className}
      onError={() => setIsImageError(true)}
    />
  );
}
