"use client";
import ImageWithFallback from "@/components/image-with-fallback";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Large, Muted } from "@/components/ui/typography";
import { patientDetailTabs } from "@/data";
import { cn } from "@/lib/utils";
import { fetchTreatment } from "@/server/treatment";
import { ExaminationContext } from "@/store/examination-context";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export default function PatientDetailsPage({ params: { id } }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`treatment-${id}`],
    queryFn: () => fetchTreatment(id),
    enabled: !!id,
  });
  const pathname = usePathname();
  const {
    examination,
    isLoading: isExaminationLoading,
    isFetching: isExaminationFetching,
  } = useContext(ExaminationContext);
  if (isError) return error?.message ?? "error";

  return (
    <PageContainer className={"space-y-4"}>
      <Heading title={"Patient Details"} description={"Patient details"} />
      {isLoading ? (
        <Skeleton className={"h-[125.6px] w-1/2"} />
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
        <Link href={`${pathname}/${patientDetailTabs[0].url}`}>
          <div className="flex cursor-pointer items-center justify-start gap-3 rounded-lg border p-3 shadow-xs">
            <figure className="size-16 grow-0">
              <Image
                src={patientDetailTabs[0].icon}
                width={100}
                height={100}
                alt={patientDetailTabs[0].title}
                className="h-full w-full object-cover object-center"
              />
            </figure>
            <div>
              <Large>{patientDetailTabs[0].title}</Large>
              <Muted>{patientDetailTabs[0].desc}</Muted>
            </div>
          </div>
        </Link>
        {(isExaminationLoading || isExaminationFetching) &&
          Array.from({ length: patientDetailTabs.length - 1 }).map((_, ind) => (
            <Skeleton className={"h-[89.6px] w-full"} key={ind} />
          ))}
        {!(isExaminationLoading || isExaminationFetching) &&
          patientDetailTabs
            .slice(1, patientDetailTabs.length)
            .map((item, ind) => (
              <Tab key={ind} item={item} disabled={!examination} />
            ))}
      </div>
    </PageContainer>
  );
}

function Tab({ item, disabled }) {
  const pathname = usePathname();
  return (
    <div
      className={cn("relative", {
        "cursor-not-allowed before:absolute before:inset-0 before:bg-gray-100/20 before:backdrop-grayscale-100":
          disabled,
      })}
    >
      <Link href={`${pathname}/${item.url}`}>
        <div className="flex cursor-pointer items-center justify-start gap-3 rounded-lg border p-3 shadow-xs">
          <figure className="size-16 grow-0">
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
    </div>
  );
}
