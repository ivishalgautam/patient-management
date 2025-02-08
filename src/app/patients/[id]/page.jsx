"use client";
import ImageWithFallback from "@/components/image-with-fallback";
import PageContainer from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Large, Muted } from "@/components/ui/typography";
import { rupee } from "@/lib/Intl";
import { cn } from "@/lib/utils";
import {
  fetchPatient,
  getPatientDetailsByPatientAndClinicId,
} from "@/server/patient";
import { fetchTreatment } from "@/server/treatment";
import { ClinicContext } from "@/store/clinic-context";
import { ExaminationContext } from "@/store/examination-context";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const tabs = [
  {
    title: "Comprehensive Examination",
    desc: "Check comprehensive examination here",
    icon: "/images/icons/examination.png",
    url: "comprehensive-examination",
  },
  {
    title: "Treatments",
    desc: "Check treatments here",
    icon: "/images/icons/treatment-plan.png",
    url: "treatments",
  },
  {
    title: "Payments",
    desc: "Check payments here",
    icon: "/images/icons/dental-payment.png",
    url: "payment",
  },
  {
    title: "Doctor Notes",
    desc: "Notes for doctor",
    icon: "/images/icons/note.png",
    url: "notes",
  },
  {
    title: "Documents",
    desc: "Check documents here",
    icon: "/images/icons/document.png",
    url: "documents",
  },
];

export default function PatientDetailsPage({ params: { id } }) {
  const { clinic } = useContext(ClinicContext);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`treatment-${id}-${clinic.id}`],
    queryFn: () => getPatientDetailsByPatientAndClinicId(id, clinic.id),
    enabled: !!id && !!clinic?.id,
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
            <div className="bg-primary/30 border-primary relative flex w-max gap-4 rounded-lg border p-3">
              {data.cost > 0 && data?.balance <= 0 && (
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
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        <Link href={`${pathname}/${tabs[0].url}`}>
          <div className="flex cursor-pointer items-center justify-start gap-3 rounded-lg border p-3 shadow-xs">
            <figure className="size-16 grow-0">
              <Image
                src={tabs[0].icon}
                width={100}
                height={100}
                alt={tabs[0].title}
                className="h-full w-full object-cover object-center"
              />
            </figure>
            <div>
              <Large>{tabs[0].title}</Large>
              <Muted>{tabs[0].desc}</Muted>
            </div>
          </div>
        </Link>
        {(isExaminationLoading || isExaminationFetching) &&
          Array.from({ length: tabs.length - 1 }).map((_, ind) => (
            <Skeleton className={"h-[89.6px] w-full"} key={ind} />
          ))}
        {!(isExaminationLoading || isExaminationFetching) &&
          tabs
            .slice(1, tabs.length)
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
