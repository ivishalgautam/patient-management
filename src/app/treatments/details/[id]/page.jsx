"use client";
import ImageWithFallback from "@/components/image-with-fallback";
import PageContainer from "@/components/layout/page-container";
import Spinner from "@/components/Spinner";
import { Heading } from "@/components/ui/heading";
import { Large, Muted } from "@/components/ui/typography";
import { patientDetailTabs } from "@/data";
import { rupee } from "@/lib/Intl";
import { fetchTreatment } from "@/server/treatment";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PatientDetailsPage({ params: { id } }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`treatment-${id}`],
    queryFn: () => fetchTreatment(id),
    enabled: !!id,
  });

  if (isError) return error?.message ?? "error";

  return (
    <PageContainer className={"space-y-4"}>
      <Heading title={"Patient Details"} description={"Patient details"} />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex w-max items-center justify-start gap-4 rounded-lg border p-3">
          <div>
            <ImageWithFallback
              src={data.avatar}
              width={100}
              height={100}
              alt={data.fullname}
              className={"rounded-lg shadow-md"}
            />
          </div>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="capitalize">
              <Muted>Full Name:</Muted> {data.fullname}
            </div>
            <div className="capitalize">
              <Muted>Contact:</Muted> {data.mobile_number}, &nbsp;
              {data?.emergency_contact}
            </div>
            {/* <div className="capitalize">
              <Muted>Cost:</Muted> {rupee.format(data.cost ?? 0)}
            </div>
            <div className="capitalize">
              <Muted>Balance:</Muted> {rupee.format(data?.balance ?? 0)}
            </div> */}
          </div>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {patientDetailTabs.map((item) => (
          <Tab key={item.title} item={item} />
        ))}
      </div>
    </PageContainer>
  );
}

function Tab({ item }) {
  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${item.url}`}>
      <div className="flex cursor-pointer items-center justify-start gap-3 rounded-lg border p-3 shadow-sm">
        <figure className="size-16 flex-grow-0">
          <Image
            src={item.icon}
            width={100}
            height={100}
            alt={item.title}
            className="h-full w-full object-cover object-center"
          />
        </figure>
        <div>
          <Large>{item.title}</Large>
          <Muted>{item.desc}</Muted>
        </div>
      </div>
    </Link>
  );
}
