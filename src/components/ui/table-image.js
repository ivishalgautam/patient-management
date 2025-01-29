import config from "@/config";
import ImageWithFallback from "./image-with-fallback";
import { cn } from "@/lib/utils";
import { Link } from "lucide-react";

export default function TableImage({ src }) {
  return (
    <a
      href={`${config.file_base}/${src}`}
      target="_blank"
      className={cn("group inline w-max")}
    >
      <figure className="group relative size-8 rounded border p-1">
        <span className="absolute inset-0 hidden rounded bg-black/80 group-hover:flex group-hover:items-center group-hover:justify-center">
          <Link className="text-white" size={15} />
        </span>
        <ImageWithFallback
          className={"h-full w-full object-cover object-center"}
          src={src}
          width={50}
          height={50}
        />
      </figure>
    </a>
  );
}
