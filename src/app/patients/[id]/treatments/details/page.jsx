"use client";
import ImageWithFallback from "@/components/image-with-fallback";
import PageContainer from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { H2, Large, Muted, Small } from "@/components/ui/typography";
import { rupee } from "@/lib/Intl";
import { cn } from "@/lib/utils";
import { fetchTreatment } from "@/server/treatment";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const patientDetailTabs = [
  {
    title: "Prescriptions",
    desc: "Check prescriptions here",
    icon: "/images/icons/dental-prescription.png",
    url: "prescription",
  },
  {
    title: "Payments",
    desc: "Check payments here",
    icon: "/images/icons/dental-payment.png",
    url: "payment",
  },
  {
    title: "Treatment Plan",
    desc: "Check treatment plan here",
    icon: "/images/icons/treatment-plan.png",
    url: "treatment-plan",
  },
];

export default function TreatmentDetailsPage({ params: { id } }) {
  const searchParams = useSearchParams();
  const tid = searchParams.get("tid");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`treatment-${tid}`],
    queryFn: () => fetchTreatment(tid),
    enabled: !!tid,
  });
  console.log({ data });
  if (isError) return error?.message ?? "error";

  return (
    <PageContainer className={"space-y-4"}>
      {/* <Heading title={"Treatment details"} description={"Treatment details"} /> */}
      {isLoading ? (
        <Skeleton className={"h-[125.6px] w-1/2"} />
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div>
            <H2>{data.service_name}</H2>
          </div>
          <div className="bg-primary/30 border-primary relative flex w-max gap-4 rounded-lg border p-3">
            {data.cost && data?.balance <= 0 && (
              <Badge
                className={
                  "absolute -top-2 -right-2 border-emerald-600 bg-emerald-500"
                }
              >
                Paid
              </Badge>
            )}
            <div className="capitalize">
              <Muted className={"text-black"}>Total Cost:</Muted>
              <Badge>{rupee.format(data.cost ?? 0)}</Badge>
            </div>
            <div className="capitalize">
              <Muted className={"text-black"}>Balance:</Muted>
              <Badge>{rupee.format(data?.balance ?? 0)}</Badge>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {patientDetailTabs.map((item, ind) => (
          <Tab key={ind} item={item} treatmentId={tid} />
        ))}
      </div>
    </PageContainer>
  );
}

function Tab({ item, treatmentId }) {
  const pathname = usePathname();
  return (
    <div className={cn("relative")}>
      <Link href={`${pathname}/${item.url}?tid=${treatmentId}`}>
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
