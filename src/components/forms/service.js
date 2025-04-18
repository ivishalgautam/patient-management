"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "../Spinner";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Large, Muted } from "../ui/typography";
import { Plus, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import useFileHandler from "@/hooks/use-file-handler";
import { serviceSchema } from "@/validation-schemas/service";
import { TagInput } from "emblor";
import useFetchProcedures from "@/hooks/use-fetch-procedures";
import ReactSelect from "react-select";
import { fetchService } from "@/server/service";

const defaultValues = {
  custom_points: [],
  // custom_points: [{ heading: "", body: [] }],
  main_points: [],
  image: "",
  name: "",
  is_featured: false,
  // actual_price: null,
  // discounted_price: null,
};

function deleteAndShift(obj, index) {
  delete obj[index];

  let keys = Object.keys(obj).map(Number);
  keys.sort((a, b) => a - b);

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] > index) {
      obj[keys[i] - 1] = obj[keys[i]];
      delete obj[keys[i]];
    }
  }
}

export default function ServiceForm({
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
    resolver: zodResolver(serviceSchema),
    defaultValues,
  });

  console.log({ errors });
  const [customPoints, setCustomPoints] = useState({});
  const [mainPoints, setMainPoints] = useState([]);
  const {
    fields: customPointsFields,
    remove: removeCustomPointField,
    append: appendCustomPointField,
  } = useFieldArray({
    control,
    name: "custom_points",
  });

  const { data: procedures, isLoading: isProceduresLoading } =
    useFetchProcedures();

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchService(id),
    queryKey: [`procedure-${id}`],
    enabled: !!id && !!(type === "edit"),
  });

  const onSubmit = (data) => {
    const payload = { ...data, procedure_id: data.procedure.value };
    if (type === "edit") {
      updateMutation.mutate(payload);
    }
    if (type === "create") {
      createMutation.mutate(payload);
    }
  };
  const { handleFileChange, deleteFile, image, setImage } = useFileHandler();
  useEffect(() => {
    if (data && procedures) {
      setValue("name", data.name);
      setValue("image", data.image);
      setValue("is_featured", data.is_featured);
      setValue(
        "procedure",
        procedures.find((so) => so.value === data.procedure_id),
      );
      // setValue("actual_price", data.actual_price);
      // setValue("discounted_price", data.discounted_price);

      setValue("main_points", data.main_points);

      setMainPoints(data.main_points.map((item) => ({ id: item, text: item })));
      setCustomPoints(() => {
        const obj = {};
        for (let i = 0; i < data.custom_points.length; i++) {
          obj[i] = data.custom_points[i].body.map((tag) => ({
            id: Math.floor(Math.random() * 9999999),
            text: tag,
          }));
        }
        return obj;
      });
      removeCustomPointField();
      data.custom_points &&
        data.custom_points.forEach((item) => {
          appendCustomPointField(item);
        });
      setValue("meta_title", data.meta_title);
      setValue("meta_description", data.meta_description);
      setValue("meta_keywords", data.meta_keywords);
      setImage(data.image);
    }
  }, [
    data,
    setValue,
    setImage,
    procedures,
    appendCustomPointField,
    removeCustomPointField,
  ]);

  const isButtonLoading =
    (type === "create" && createMutation.isLoading) ||
    (type === "edit" && updateMutation.isLoading);

  if (type === "edit" && isLoading) return <Spinner />;
  if (type === "edit" && isError) return error?.message ?? "error";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mx-auto flex items-center justify-start">
        <div className="w-full space-y-8">
          {/* basinc info */}
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
                      src={`${process.env.NEXT_PUBLIC_DRDIPTI_IMAGE_DOMAIN}/${image}`}
                      width={500}
                      height={500}
                      alt="image"
                      className="h-full w-full"
                      priority={true}
                      onError={() => {
                        setImage(null);
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteFile(image)}
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

            {/* Name */}
            <div>
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Enter name" />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            {/* procedure */}
            <div>
              <Label>Procedure</Label>
              <Controller
                control={control}
                name="procedure"
                rules={{ required: "required*" }}
                render={({ field }) => (
                  <ReactSelect
                    options={procedures}
                    value={field.value}
                    onChange={field.onChange}
                    instanceId="asfasf"
                    placeholder="Select procedure"
                    isLoading={isProceduresLoading}
                    menuPortalTarget={
                      typeof document !== "undefined" && document.body
                    }
                  />
                )}
              />
            </div>

            {/* actual price */}
            {/* <div>
              <Label>Actual price</Label>
              <Input
                type="number"
                {...register("actual_price", { valueAsNumber: true })}
                placeholder="Enter actual price"
              />
              {errors.actual_price && (
                <span className="text-red-500">
                  {errors.actual_price.message}
                </span>
              )}
            </div> */}

            {/* discounted price */}
            {/* <div>
              <Label>Discounted price</Label>
              <Input
                type="number"
                {...register("discounted_price", { valueAsNumber: true })}
                placeholder="Enter discounted price"
              />
              {errors.discounted_price && (
                <span className="text-red-500">
                  {errors.discounted_price.message}
                </span>
              )}
            </div> */}

            {/* Is Featured */}
            <div className="col-span-2 flex items-center space-x-2">
              <Controller
                control={control}
                name="is_featured"
                render={({ field }) => (
                  <div className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-3">
                    <div>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                    <div className="space-y-1 leading-none">
                      <Label>Featured</Label>
                      <Muted>Mark this service as featured.</Muted>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          {/* main points */}
          <div className="space-y-2">
            <Large>Main points</Large>
            <div>
              <Label>Points</Label>
              <Controller
                name={`main_points`}
                control={control}
                render={({ field }) => (
                  <TagInput
                    {...field}
                    placeholder="Enter Main points"
                    tags={mainPoints}
                    setTags={(newTags) => {
                      setMainPoints(newTags);
                      const formatted = newTags.map((i) => i.text);
                      setValue(`main_points`, formatted);
                    }}
                    styleClasses={{
                      tag: {
                        body: "pl-3",
                      },
                    }}
                  />
                )}
              />

              {errors.main_points && (
                <span className="text-red-500">
                  {errors.main_points.message}
                </span>
              )}
            </div>
          </div>

          {/* custom points */}
          <div className="space-y-2">
            <Large>Custom points</Large>
            <div className="space-y-8">
              {customPointsFields.map((field, ind) => (
                <div
                  key={ind}
                  className="relative rounded border bg-gray-100 p-4"
                >
                  {customPointsFields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-3 -right-3"
                      onClick={() => {
                        deleteAndShift(customPoints, ind);
                        removeCustomPointField(ind);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  )}
                  <div>
                    <Label>Heading</Label>
                    <Input
                      {...register(`custom_points.${ind}.heading`)}
                      placeholder="Enter heading"
                    />
                    {errors.custom_points?.[ind]?.heading && (
                      <span className="text-red-500">
                        {errors.custom_points?.[ind]?.heading?.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <Label>Points</Label>
                    <Controller
                      name={`custom_points.${ind}.body`}
                      control={control}
                      render={({ field }) => (
                        <TagInput
                          {...field}
                          variant=""
                          size="sm"
                          shape="rounded"
                          animation="slideIn"
                          placeholder="Enter points"
                          tags={customPoints?.[ind] ?? []}
                          setTags={(newTags) => {
                            setCustomPoints((prev) => ({
                              ...prev,
                              [ind]: newTags,
                            }));
                            const formatted = newTags.map((i) => i.text);
                            setValue(`custom_points.${ind}.body`, formatted);
                          }}
                          styleClasses={{
                            tag: {
                              body: "pl-3",
                            },
                          }}
                        />
                      )}
                    />

                    {errors.custom_points?.[ind]?.body && (
                      <span className="text-red-500">
                        {errors.custom_points?.[ind]?.body?.message}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-2 text-right">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendCustomPointField({ heading: "", body: [] })
                  }
                >
                  <Plus /> Add Points
                </Button>
              </div>
            </div>
          </div>

          {/* seo */}
          <div className="space-y-2">
            <Large>Seo</Large>
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
