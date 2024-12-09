import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <section className="bg-gray-200">
      <div className="mx-auto grid h-full min-h-screen w-full bg-white md:grid-cols-12">
        {/* left */}
        <div className="flex h-auto flex-1 items-center justify-center bg-gray-200 py-0 md:col-span-8 lg:py-16">
          <figure>
            <Image
              src={"/login.svg"}
              width={500}
              height={500}
              alt="jcb"
              className="scale-125"
            />
          </figure>
        </div>

        {/* right */}
        <div className="mx-auto flex items-center justify-center md:col-span-4">
          {children}
        </div>
      </div>
    </section>
  );
}
