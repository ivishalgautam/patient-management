"use client";
import ImageWithFallback from "@/components/image-with-fallback";
import PageContainer from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Large, Muted } from "@/components/ui/typography";
import { rupee } from "@/lib/Intl";
import { cn } from "@/lib/utils";
import { fetchLedgerByClinicAndPatient } from "@/server/ledger";
import { getPatientDetailsByPatientAndClinicId } from "@/server/patient";
import { fetchTreatmentVisits } from "@/server/treatment";
import { ClinicContext } from "@/store/clinic-context";
import { ExaminationContext } from "@/store/examination-context";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import VisitNotes from "./treatments/details/visits/_components/visit-notes";
import Spinner from "@/components/Spinner";
import { CreateDialog } from "./treatments/details/visits/_components/create-dialog";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

const tabs = [
  {
    title: "Comprehensive Examination",
    desc: "Check comprehensive examination here",
    icon: "/images/icons/examination.png",
    url: "comprehensive-examination",
    is_examination_required: false,
  },
  {
    title: "Treatments",
    desc: "Check treatments here",
    icon: "/images/icons/treatment-plan.png",
    url: "treatments",
    is_examination_required: true,
  },
  {
    title: "Payments",
    desc: "Check payments here",
    icon: "/images/icons/dental-payment.png",
    url: "payment",
    is_examination_required: true,
  },
  {
    title: "Doctor Notes",
    desc: "Notes for doctor",
    icon: "/images/icons/note.png",
    url: "notes",
    is_examination_required: true,
  },
  {
    title: "Documents",
    desc: "Check documents here",
    icon: "/images/icons/document.png",
    url: "documents",
    is_examination_required: true,
  },
  {
    title: "Ledger",
    desc: "Check patient ledger here",
    icon: "/images/icons/ledger.png",
    url: "ledgers",
    is_examination_required: false,
  },
];

export default function PatientDetailsPage({ params: { id } }) {
  const { clinic } = useContext(ClinicContext);
  const [isVisitCreateOpen, setIsVisitCreateOpen] = useState(false);
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
  const {
    data: ledger,
    isLoading: isLedgerLoading,
    isError: isLedgerError,
    error: lederError,
  } = useQuery({
    queryKey: [`ledger`],
    queryFn: () => fetchLedgerByClinicAndPatient(clinic.id, id),
    enabled: !!id && !!clinic?.id,
  });

  const {
    data: visits,
    isLoading: isVisitsLoading,
    isError: isVisitsError,
    error: visitsError,
  } = useQuery({
    queryKey: [`treatment-visits`],
    queryFn: () => fetchTreatmentVisits(`patients=${id}`),
    enabled: !!id,
  });

  if (isError) return error?.message ?? "error";

  return (
    <PageContainer className={"space-y-4"}>
      <Heading title={"Patient Details"} description={"Patient details"} />
      {isLoading ? (
        <Skeleton className={"h-[125.6px] w-1/2"} />
      ) : (
        <div className="relative flex w-max items-center justify-start gap-4 rounded-lg border p-3">
          <div>
            <ImageWithFallback
              src={data?.avatar}
              width={100}
              height={100}
              alt={data?.fullname}
              className={"aspect-square rounded-lg shadow-md"}
            />
          </div>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="capitalize">
              <Muted>Full Name:</Muted> {data?.fullname}
            </div>
            <div className="capitalize">
              <Muted>Contact:</Muted> {data?.mobile_number}, &nbsp;
              {data?.emergency_contact}
            </div>
            <div className="bg-primary/30 border-primary relative flex w-max gap-4 rounded-lg border p-3">
              {data?.cost > 0 && data?.balance <= 0 && (
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
                <Badge>{rupee.format(data?.cost ?? 0)}</Badge>
              </div>
              <div className="capitalize">
                <Muted className={"text-black"}>Balance:</Muted>
                <Badge>{rupee.format(data?.balance ?? 0)}</Badge>
              </div>
            </div>

            <div className="bg-primary/30 border-primary relative flex w-max gap-4 rounded-lg border p-3">
              <div className="capitalize">
                <Muted className={"text-black"}>Credit balance</Muted>
                <Badge>{rupee.format(ledger ?? 0)}</Badge>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {(isExaminationLoading || isExaminationFetching) &&
          Array.from({ length: tabs.length - 1 }).map((_, ind) => (
            <Skeleton className={"h-[89.6px] w-full"} key={ind} />
          ))}
        {!(isExaminationLoading || isExaminationFetching) &&
          tabs.map((item, ind) => (
            <Tab
              key={ind}
              item={item}
              disabled={item.is_examination_required && !examination}
            />
          ))}
      </div>

      <div className="mt-10 space-y-2">
        <div className="flex items-center justify-between">
          <Heading
            title={"Patient visits"}
            description={"All Patient visits"}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsVisitCreateOpen(true)}
          >
            <Plus /> Create visit
          </Button>
        </div>
        {isVisitsLoading ? (
          <Spinner />
        ) : isVisitsError ? (
          <Card className="border border-slate-200 bg-white">
            <div className="p-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="text-lg text-slate-600">No visits recorded yet</p>
            </div>
          </Card>
        ) : (
          <VisitNotes visits={visits?.visits ?? []} isHeaderDetails />
        )}
      </div>

      <CreateDialog
        {...{
          isOpen: isVisitCreateOpen,
          setIsOpen: setIsVisitCreateOpen,
          patientId: id,
        }}
      />
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
