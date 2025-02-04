"use client";
import ComprehensiveExaminationForm from "@/components/forms/comprehensive-examination";
import PageContainer from "@/components/layout/page-container";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import config from "@/config";
import { ExaminationContext } from "@/store/examination-context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2Icon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { toast } from "sonner";

export default function ComprehensiveExamination({ params: { id } }) {
  const [type, setType] = useState("create");
  const { examination, isLoading, isFetching } = useContext(ExaminationContext);
  const queryClient = useQueryClient();
  const router = useRouter();
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await http().post(endpoints.comprehensiveExamination.getAll, {
        ...data,
        patient_id: id,
      });
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "Comprehensive examination created.",
      });
      localStorage.removeItem("gallery");
      // queryClient.invalidateQueries([`examination-${id}`]);
      router.replace(`/patients/${id}`);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error?.message ?? "Error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await http().put(
        `${endpoints.comprehensiveExamination.getAll}/${examination.id}`,
        data,
      );
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "Comprehensive examination updated.",
      });
      router.replace(`/patients/${id}`);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error?.message ?? "Error",
      });
    },
  });

  return (
    <PageContainer className={"min-h-[calc(100vh-3.2rem)] space-y-4"}>
      <Heading title={"Comprehensive examination"} description={""} />
      {isLoading || isFetching ? (
        <Spinner />
      ) : examination && type !== "edit" ? (
        <TreatmentCard data={examination} setType={setType} />
      ) : (
        <ComprehensiveExaminationForm
          createMutation={createMutation}
          updateMutation={updateMutation}
          type={type}
          defaultValues={examination ?? {}}
        />
      )}
    </PageContainer>
  );
}

function TreatmentCard({ data, setType }) {
  if (!data) {
    return (
      <Card className="mx-auto w-full max-w-4xl">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No treatment data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold">
          {data.treatment_name}
        </CardTitle>
        <Button
          type="button"
          className="absolute top-3 right-3"
          onClick={() => setType("edit")}
          variant="outline"
        >
          <Edit2Icon /> Edit
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-3">
        <Section title="Chief Complaint" content={data.chief_complaint} />
        <Section title="Medical History" content={data.medical_history} />
        <Section title="Dental History" content={data.dental_history} />
        <Section title="Examination" content={data.examination} />

        <div className="col-span-full">
          <h3 className="mb-2 font-semibold">Gallery</h3>
          <div className="flex items-start justify-start gap-4">
            {data.gallery.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={`${config.file_base}/${image}`}
                  alt={`Gallery image ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-muted-foreground text-xs">
          <p>Created: {moment(data.created_at).format("MMM DDD, YYYY")}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ title, content }) {
  return (
    <div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{content}</p>
    </div>
  );
}
