"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "../Spinner";
import { useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Large, Muted } from "../ui/typography";
import { Trash } from "lucide-react";
import Image from "next/image";
import useFileHandler from "@/hooks/use-file-handler";
import { fetchProcedure } from "@/server/procedure";
import { procedureSchema } from "@/validation-schemas/procedure";

export default function ProcedureForm({
  type = "create",
  id,
  updateMutation,
  createMutation,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(procedureSchema),
  });

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchProcedure(id),
    queryKey: [`procedure-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (type === "edit") {
      updateMutation.mutate(payload);
    }
    if (type === "create") {
      createMutation.mutate(payload);
    }
  };

  const { handleFileChange, deleteFile, image, setImage } = useFileHandler();

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("image", data.image);
      setValue("is_featured", data.is_featured);
      setValue("meta_title", data.meta_title);
      setValue("meta_description", data.meta_description);
      setValue("meta_keywords", data.meta_keywords);
      setImage(data.image);
    }
  }, [data, setValue, setImage]);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";
  const isButtonLoading =
    createMutation?.isLoading || (type === "edit" && updateMutation?.isLoading);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mx-auto flex items-center justify-start">
        <div className="w-full space-y-2">
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <Input
                  type="file"
                  placeholder="Select Image"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      "image",
                      setValue,
                      type === "edit" ? updateMutation.mutate : null,
                      type,
                    )
                  }
                  multiple={false}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className={`max-w-56`}
                />
                {errors.image && (
                  <span className="text-sm text-red-500">
                    {errors.image.message}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
                {image ? (
                  <figure className="relative size-32">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`}
                      width={500}
                      height={500}
                      alt="image"
                      className="h-full w-full"
                      priority={true}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteFile(image)}
                      className="absolute -right-2 -top-2"
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

            {/* Name */}
            <div>
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Enter name" />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            {/* Is Featured */}
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="is_featured"
                render={({ field }) => (
                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                    <div>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                    <div className="space-y-1 leading-none">
                      <Label>Featured</Label>
                      <Muted>Mark this procedure as featured.</Muted>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          {/* seo */}
          <Large className={"!mt-10"}>Seo</Large>
          <div className="grid grid-cols-2 gap-4">
            {/* Meta Title */}
            <div>
              <Label>Meta Title</Label>
              <Input
                {...register("meta_title")}
                placeholder="Enter meta title"
              />
            </div>

            {/* Meta Description */}
            <div>
              <Label>Meta Description</Label>
              <Input
                {...register("meta_description")}
                placeholder="Enter meta description"
              />
            </div>

            {/* Meta Keywords */}
            <div className="col-span-2">
              <Label>Meta Keywords</Label>
              <Textarea
                {...register("meta_keywords")}
                placeholder="Enter meta keywords"
              />
            </div>
          </div>

          <div className="!mt-6 text-end">
            <Button className="" disabled={isButtonLoading}>
              Submit
              {isButtonLoading && (
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
