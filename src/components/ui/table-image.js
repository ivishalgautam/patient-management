import ImageWithFallback from "./image-with-fallback";

export default function TableImage({ src }) {
  return (
    <figure className="size-8 rounded border p-1">
      <ImageWithFallback
        className={"h-full w-full object-cover object-center"}
        src={src}
        width={50}
        height={50}
      />
    </figure>
  );
}
