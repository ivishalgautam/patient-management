"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "../Spinner";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import Image from "next/image";
import useFileHandler from "@/hooks/use-file-handler";
import { bannerSchema } from "@/validation-schemas/banner";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { fetchBanner } from "@/server/banner";

export default function BannerForm({
  type = "create",
  id,
  updateMutation,
  createMutation,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: { url: "", type: "", is_featured: false },
  });
  const [rerender, setRerender] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchBanner(id),
    queryKey: [`banner-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const onSubmit = (data) => {
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
      setValue("url", data.url);
      setValue("is_featured", data.is_featured);
      setValue("type", data.type);
      setImage(data.url);
      setRerender(true);
    }
  }, [data, setValue, setImage, setRerender, rerender]);
  //
  const isButtonLoading =
    (type === "create" && createMutation.isLoading) ||
    (type === "edit" && updateMutation.isLoading);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mx-auto flex items-center justify-start">
        <div className="w-full space-y-8">
          <div className="grid grid-cols-2 gap-4 space-y-4">
            {/* image */}
            <div className="col-span-2 space-y-4">
              <div className="flex flex-col items-center justify-center">
                <Input
                  type="file"
                  placeholder="Select Image"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      "url",
                      setValue,
                      type === "edit" ? updateMutation.mutate : null,
                      type,
                    )
                  }
                  multiple={false}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className={`max-w-56`}
                />
                {errors.url && (
                  <span className="text-sm text-red-500">
                    {errors.url.message}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-8">
                {image ? (
                  <figure className="relative size-64">
                    {watch("type") === "banner" ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`}
                        width={200}
                        height={200}
                        alt="image"
                        className="h-full w-full"
                        priority={true}
                        onError={() => {
                          setImage(null);
                        }}
                      />
                    ) : (
                      <video
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${image}`}
                        controls
                        width={640}
                        height={480}
                      ></video>
                    )}
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

            {/* featured */}
            <div>
              <Label>Is Featured?</Label>
              <Controller
                control={control}
                name="is_featured"
                render={({ field }) => (
                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2">
                    <div>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                    <div className="space-y-1 leading-none">
                      <Label>Featured</Label>
                    </div>
                  </div>
                )}
              />

              {errors.is_featured && (
                <span className="text-red-500">
                  {errors.is_featured.message}
                </span>
              )}
            </div>

            {/* type */}
            <div>
              <Label>Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <span className="text-red-500">{errors.type.message}</span>
              )}
            </div>
          </div>

          <div className="mt-6! text-end">
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
