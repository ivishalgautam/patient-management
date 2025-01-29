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
import { createXray, fetchXray } from "@/server/treatment";
import useFileHandler from "@/hooks/use-file-handler";
import { xraySchema } from "@/validation-schemas/xray";
import { Trash } from "lucide-react";
import config from "@/config";
import Image from "next/image";
import dynamic from "next/dynamic";

export default function XrayForm({
  type = "create",
  treatmentId,
  updateMutation,
  closeDialog,
  id,
  affectedTooth,
}) {
  const [files, setFiles] = useState([]);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(xraySchema),
    defaultValues: { treatment_id: treatmentId, affected_tooth: affectedTooth },
  });
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchXray(id),
    queryKey: [`xray-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  // const { handleFileChange, deleteFile, image, setImage } = useFileHandler();
  const createMutation = useMutation({
    mutationFn: createXray,
    onSuccess: (data) => {
      queryClient.invalidateQueries([`xrays-${treatmentId}`]);
      closeDialog(false);
    },
    onError: (error) =>
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Error creating.",
      ),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("treatment_id", treatmentId);
    formData.append("title", data.title);

    if (data.files && data.files.length > 0) {
      Array.from(data.files).forEach((file, index) => {
        formData.append("file", file);
      });
    }

    if (type === "edit") {
      formData.append("filePaths", files);
      updateMutation.mutate(formData);
    }
    if (type === "create") {
      createMutation.mutate(formData);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("title", data.title);
      setFiles(data.files);
    }
  }, [data, setValue, setFiles]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-4">
        <div className="w-full space-y-2">
          {/* title */}
          <div>
            <Label>Title</Label>
            <Input {...register("title")} placeholder="Enter title" />
            {errors.title && (
              <span className="text-red-500">{errors.title.message}</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <Input
                type="file"
                {...register("files", { required: "required*" })}
                placeholder="Select Image"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className={`max-w-56`}
              />
              {errors.files && (
                <span className="text-sm text-red-500">
                  {errors.files.message}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
              {files.length ? (
                files.map((file) => (
                  <figure className="relative size-32" key={file}>
                    <Image
                      src={`${config.file_base}/${file}`}
                      width={500}
                      height={500}
                      alt="image"
                      className="h-full w-full"
                      onError={() => {
                        setFiles((prev) => prev.filter((f) => f !== file));
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        setFiles((prev) => prev.filter((f) => f !== file))
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
