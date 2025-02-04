"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { useEffect } from "react";
import {
  createDocument,
  createXray,
  fetchDocument,
  fetchXray,
} from "@/server/treatment";
import useFileHandler from "@/hooks/use-file-handler";
import { Trash } from "lucide-react";
import config from "@/config";
import Image from "next/image";
import { documentSchema } from "@/validation-schemas/document";

export default function DocumentForm({
  type = "create",
  patientId,
  updateMutation,
  closeDialog,
  id,
  affectedTooth,
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: { patient_id: patientId, affected_tooth: affectedTooth },
  });
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchDocument(id),
    queryKey: [`document-${id}`],
    enabled: !!id && !!(type === "edit"),
  });
  const { handleFileChange, deleteFile, image, setImage } = useFileHandler();
  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries([`documents-${patientId}`]);
      closeDialog(false);
    },
    onError: (error) => toast.error(error?.message || "Error creating."),
  });

  const onSubmit = async (data) => {
    const payload = {
      patient_id: patientId,
      title: data.title,
      document: image,
      notes: data.notes,
    };

    if (type === "edit") {
      updateMutation.mutate(payload);
    }
    if (type === "create") {
      createMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("title", data.title);
      setValue("document", data.document);
      setImage(data.document);
    }
  }, [data, setValue]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="w-full space-y-2">
          {/* title */}
          <div>
            <Label>Notes</Label>
            <Input {...register("title")} placeholder="Enter title" />
            {errors.title && (
              <span className="text-red-500">{errors.title.message}</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <Input
                type="file"
                placeholder="Select Image"
                onChange={(e) => {
                  handleFileChange(
                    e,
                    "document",
                    setValue,
                    type === "edit" ? updateMutation.mutate : null,
                    type,
                  );
                }}
                multiple={false}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className={`max-w-56`}
              />
              {errors.document && (
                <span className="text-sm text-red-500">
                  {errors.document.message}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
              {image ? (
                <figure className="relative size-32">
                  <Image
                    src={`${config.file_base}/${image}`}
                    width={500}
                    height={500}
                    alt="image"
                    className="h-full w-full"
                    onError={() => setImage(null)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteFile(image, setValue, "document")}
                    className="absolute -top-2 -right-2"
                    size="icon"
                  >
                    <Trash size={20} />
                  </Button>
                </figure>
              ) : (
                <div>No file selected</div>
              )}
            </div>
          </div>
        </div>
        <div className="text-end">
          <Button className="" disabled={createMutation.isLoading}>
            Submit
            {createMutation.isLoading && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
