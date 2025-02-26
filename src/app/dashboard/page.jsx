"use client";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  IndianRupee,
  Link2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useContext } from "react";
import { MainContext } from "@/store/context";
import { ClinicContext } from "@/store/clinic-context";
import { rupee } from "@/lib/Intl";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";

const getReports = async (clinicId) => {
  const { data } = await http().get(`${endpoints.reports.getAll}/${clinicId}`);
  return data ?? {};
};

const getAdminReports = async () => {
  const { data } = await http().get(`${endpoints.reports.getAll}`);
  return data ?? {};
};

export default function Home() {
  const { clinic } = useContext(ClinicContext);
  const { user } = useContext(MainContext);
  const {
    data: doctorReport = {},
    isLoading: isDoctorReportLoading,
    isError: isDoctorReportError,
    error: doctorReportError,
  } = useQuery({
    queryKey: ["reports", clinic?.id],
    queryFn: () => getReports(clinic.id),
    enabled: !!clinic.id,
  });
  const {
    data: adminReport = {},
    isLoading: isAdminReportLoading,
    isError: isAdminReportError,
    error: adminReportError,
  } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: getAdminReports,
    enabled: !!(user?.role === "admin"),
  });

  return (
    <div className="space-y-6">
      <PageContainer className={"space-y-4 border bg-white shadow-none"}>
        <Heading title={"Dashboard"} description={"Dashboard reports"} />
        {user?.role === "doctor" && (
          <Reports
            {...{
              data: doctorReport,
              isError: isDoctorReportError,
              isLoading: isDoctorReportLoading,
              error: doctorReportError,
            }}
          />
        )}
        {user?.role === "admin" && (
          <Reports
            {...{
              data: adminReport,
              isError: isAdminReportError,
              isLoading: isAdminReportLoading,
              error: adminReportError,
            }}
          />
        )}
      </PageContainer>

      <PageContainer className={"space-y-4 bg-transparent p-0 shadow-none"}>
        <Heading title={"Quick Access"} description={""} />
        <GridContainer
          className={"grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"}
        >
          <div className="hover:border-primary flex flex-col items-center justify-center rounded-lg border bg-white p-6 py-3 shadow">
            <div className="inline-block rounded-full border bg-white p-3">
              {<Users size={20} className="text-primary" />}
            </div>
            <div className="mb-3 flex flex-col items-start justify-start">
              <span className="text-base font-medium text-black">
                Clinic Patients
              </span>
            </div>
            <Link
              href={"/clinic-patients"}
              className={cn(
                buttonVariants({ variant: "priammry" }),
                "h-8 cursor-pointer bg-gray-500 text-white hover:bg-gray-500/80 hover:text-white",
              )}
              type="button"
              variant="outline"
            >
              View
              <Link2 />
            </Link>
          </div>

          <div className="hover:border-primary flex flex-col items-center justify-center rounded-lg border bg-white p-6 py-3 shadow">
            <div className="inline-block rounded-full border bg-white p-3">
              <UserPlus size={20} className="text-primary" />
            </div>
            <div className="mb-3 flex flex-col items-start justify-start">
              <span className="text-base font-medium text-black">
                Add Patient
              </span>
            </div>
            <Link
              href={"/users/create/patient"}
              className={cn(
                buttonVariants({ variant: "priammry" }),
                "h-8 cursor-pointer bg-gray-500 text-white hover:bg-gray-500/80 hover:text-white",
              )}
              type="button"
              variant="outline"
            >
              Create
              <Link2 />
            </Link>
          </div>

          <div className="hover:border-primary flex flex-col items-center justify-center rounded-lg border bg-white p-6 py-3 shadow">
            <div className="inline-block rounded-full border bg-white p-3">
              <CalendarDays size={20} className="text-primary" />
            </div>
            <div className="mb-3 flex flex-col items-start justify-start">
              <span className="text-base font-medium text-black">
                Add Appointment
              </span>
            </div>
            <Link
              href={"/users/create/patient"}
              className={cn(
                buttonVariants({ variant: "priammry" }),
                "h-8 cursor-pointer bg-gray-500 text-white hover:bg-gray-500/80 hover:text-white",
              )}
              type="button"
              variant="outline"
            >
              Create
              <Link2 />
            </Link>
          </div>

          <div className="hover:border-primary flex flex-col items-center justify-center rounded-lg border bg-white p-6 py-3 shadow">
            <div className="inline-block rounded-full border bg-white p-3">
              <CalendarDays size={20} className="text-primary" />
            </div>
            <div className="mb-3 flex flex-col items-start justify-start">
              <span className="text-base font-medium text-black">
                Taday Appointments
              </span>
            </div>
            <Link
              href={`/appointments?page=1&limit=10&start_date=${moment().format("YYYY-MM-DD")}&end_date=${moment().format("YYYY-MM-DD")}`}
              className={cn(
                buttonVariants({ variant: "priammry" }),
                "h-8 cursor-pointer bg-gray-500 text-white hover:bg-gray-500/80 hover:text-white",
              )}
              type="button"
              variant="outline"
            >
              View
              <Link2 />
            </Link>
          </div>
        </GridContainer>
      </PageContainer>
    </div>
  );
}

function Reports({ data, isError, isLoading, error }) {
  const { user, isUserLoading } = useContext(MainContext);
  if (isLoading || isUserLoading) return <Skelotons length={5} />;
  if (isError) return error?.message ?? "Error fetching reports";

  return (
    <GridContainer>
      <Card
        count={data?.today_appointments}
        title={"Today Appointments"}
        icon={CalendarDays}
      />
      <Card
        count={data?.today_patients}
        title={"New Patients Today"}
        icon={User}
      />
      <Card
        count={data?.today_visited_patients}
        title={"Patients Visited Today"}
        icon={User}
      />
      <Card
        count={rupee.format(data?.today_collection)}
        title={"Today's Collection"}
        icon={IndianRupee}
      />
      <Card
        count={rupee.format(data?.total_collection)}
        title={"Total Collection"}
        icon={IndianRupee}
      />
    </GridContainer>
  );
}

function GridContainer({ children, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Card(item) {
  const size = 25;

  return (
    <div className="flex items-center justify-start gap-2 rounded-lg border bg-gray-100 p-4 py-3">
      <div className="rounded-full border bg-white p-3">
        {<item.icon size={size} className="text-primary" />}
      </div>
      <div className="flex flex-col items-start justify-start">
        <span className="text-xs font-medium tracking-wide">{item?.title}</span>
        <span className="text-primary text-xl font-semibold">
          {item?.count}
        </span>
      </div>
    </div>
  );
}

function Skelotons({ length = 3 }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {Array.from({ length }).map((_, key) => (
        <Skeleton className={"h-[74.6px] bg-gray-200"} key={key} />
      ))}
    </div>
  );
}
