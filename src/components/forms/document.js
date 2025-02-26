"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { useEffect, useState } from "react";
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
import useMultiFileHandler from "@/hooks/use-multi-file-handler";

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
    defaultValues: { patient_id: patientId },
  });
  const [docs, setDocs] = useState([]);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchDocument(id),
    queryKey: [`document-${id}`],
    enabled: !!id && !!(type === "edit"),
  });
  const { handleFileChange, deleteFile, image, setImage } =
    useMultiFileHandler();
  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries([`documents-${patientId}`]);
      closeDialog(false);
    },
    onError: (error) => toast.error(error?.message || "Error creating."),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    const selectedFiles = Array.from(data.files);

    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    formData.append("patient_id", data.patient_id);
    formData.append("title", data.title);

    if (type === "edit") {
      formData.append("documents", JSON.stringify(docs));
      updateMutation.mutate(formData);
    }
    if (type === "create") {
      createMutation.mutate(formData);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("title", data.title);
      setDocs(data.documents);
    }
  }, [data, setValue, setImage]);
  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="w-full space-y-2">
          {/* title */}
          <div>
            <Label>Note</Label>
            <Input
              {...register("title", {
                required: "required*",
              })}
              placeholder="Enter note"
            />
            {errors.title && (
              <span className="text-red-500">{errors.title.message}</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              {type === "create" ? (
                <Input
                  type="file"
                  {...register("files", {
                    required: "required*",
                  })}
                  placeholder="Select Image"
                  multiple={true}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className={`max-w-56`}
                />
              ) : (
                <Input
                  type="file"
                  {...register("files")}
                  placeholder="Select Image"
                  multiple={true}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className={`max-w-56`}
                />
              )}
              {errors.files && (
                <span className="text-sm text-red-500">
                  {errors.files.message}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
              {docs.length > 0 ? (
                docs.map((doc, ind) => (
                  <figure className="relative size-32" key={ind}>
                    <Image
                      src={`${config.file_base}/${doc}`}
                      width={500}
                      height={500}
                      alt="image"
                      className="h-full w-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        setDocs((prev) => prev.filter((i) => i !== doc))
                      }
                      className="absolute -top-2 -right-2"
                      size="icon"
                    >
                      <Trash size={20} />
                    </Button>
                  </figure>
                ))
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
