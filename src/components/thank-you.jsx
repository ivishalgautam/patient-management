import Image from "next/image";
import React from "react";
import { Muted } from "./ui/typography";

export default function ThankYou() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <figure>
        <Image
          src={"/thank-you.svg"}
          width={300}
          height={300}
          alt="Thank You"
        />
      </figure>
      <Muted className="p-4 text-center uppercase">
        Thank you for taking the time to review this.
      </Muted>
    </div>
  );
}
