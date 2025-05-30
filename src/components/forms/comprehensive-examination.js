"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import useMultiFileHandler from "@/hooks/use-multi-file-handler";
import Image from "next/image";
import config from "@/config";
import { Trash } from "lucide-react";
import { useEffect } from "react";
import {
  paths,
  svgFill,
  svgSelectedFill,
  svgStroke,
} from "@/data/dental-chart";
import { comprehensiveExaminationSchema } from "@/validation-schemas/comprehensive-examination";
// import { ExaminationContext } from "@/store/examination-context";

export default function ComprehensiveExaminationForm({
  type = "create",
  patientId,
  createMutation,
  updateMutation,
  defaultValues = {},
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    setError,
  } = useForm({
    resolver: zodResolver(comprehensiveExaminationSchema),
    defaultValues: {
      patient_id: patientId,
      chief_complaint: "",
      medical_history: "",
      dental_history: "",
      examination: "",
      gallery: [],
      affected_tooths: [],
    },
  });

  const { handleFileChange, deleteFile, images, setImages } =
    useMultiFileHandler("gallery");

  useEffect(() => {
    const gallery =
      typeof window !== "undefined" && localStorage.getItem("gallery")
        ? JSON.parse(localStorage.getItem("gallery")) ?? []
        : [];

    if (gallery) {
      setValue("gallery", gallery);
    }
  }, [setValue]);

  const affectedTooth = watch("affected_tooths");
  const handleSelectTeeth = (id) => {
    if (!id) return toast.warning("Please select a teeth.");

    const toothsToSet = affectedTooth.includes(id)
      ? affectedTooth.filter((item) => item !== id)
      : [...affectedTooth, id];

    setValue("affected_tooths", toothsToSet);
  };
  const onSubmit = (data) => {
    // if (!images.length) {
    //   return setError("gallery", {
    //     type: "custom",
    //     message: "Please select gallery",
    //   });
    // }

    const payload = {
      ...data,
      gallery: images,
      affected_tooths: affectedTooth,
    };

    if (type === "create") {
      createMutation.mutate(payload);
    }
    if (type === "edit") {
      updateMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (type === "edit") {
      setValue("chief_complaint", defaultValues.chief_complaint);
      setValue("medical_history", defaultValues.medical_history);
      setValue("dental_history", defaultValues.dental_history);
      setValue("examination", defaultValues.examination);
      setValue("gallery", defaultValues.gallery);
      setImages(defaultValues.gallery);
      setValue("affected_tooths", defaultValues.affected_tooths);
    }
  }, [type, defaultValues, setValue, setImages]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      {/* Affected tooth */}
      <div className="mx-auto w-56">
        <svg
          id="svg68"
          version="1.1"
          viewBox="0 0 450 750"
          xmlns="http://www.w3.org/2000/svg"
        >
          {paths.map((item) => {
            const isSelected = affectedTooth.includes(item.id);
            return (
              <path
                key={item.id}
                {...item.path}
                strokeWidth="3"
                stroke={svgStroke}
                fill={isSelected ? svgSelectedFill : svgFill}
                onClick={() => handleSelectTeeth(item.id)}
                className="relative h-full w-full cursor-pointer transition-colors"
              />
            );
          })}
        </svg>
        {errors.affected_tooths && (
          <span className="text-sm text-red-500">
            {errors.affected_tooths.message}
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Chief Complaint */}
        <div>
          <Label>Chief Complaint</Label>
          <Textarea
            {...register("chief_complaint")}
            placeholder="Enter Chief Complaint"
          />
          {errors.chief_complaint && (
            <span className="text-sm text-red-500">
              {errors.chief_complaint.message}
            </span>
          )}
        </div>

        {/* Medical History */}
        <div>
          <Label>Medical History</Label>
          <Textarea
            {...register("medical_history")}
            placeholder="Enter Medical History"
          />
          {errors.medical_history && (
            <span className="text-sm text-red-500">
              {errors.medical_history.message}
            </span>
          )}
        </div>

        {/* Dental History */}
        <div>
          <Label>Dental History</Label>
          <Textarea
            {...register("dental_history")}
            placeholder="Enter Dental History"
          />
          {errors.dental_history && (
            <span className="text-sm text-red-500">
              {errors.dental_history.message}
            </span>
          )}
        </div>

        {/* Examination */}
        <div>
          <Label>Examination</Label>
          <Textarea
            {...register("examination")}
            placeholder="Enter Examination Details"
          />
          {errors.examination && (
            <span className="text-sm text-red-500">
              {errors.examination.message}
            </span>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <Label>Gallery</Label>
        <Input
          type="file"
          {...register("gallery")}
          multiple
          onChange={(e) =>
            handleFileChange(e, "gallery", setValue, null, "create")
          }
        />

        {errors.gallery && (
          <span className="text-sm text-red-500">{errors.gallery.message}</span>
        )}

        <div className="justify-startx mt-4 flex min-h-20 flex-wrap items-center gap-4 rounded-lg border border-dashed bg-gray-50 p-8">
          {images?.length ? (
            images.map((image, ind) => (
              <figure
                key={image}
                className="relative rounded-lg border border-dashed p-2"
              >
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 size-7"
                  onClick={() => deleteFile(image)}
                >
                  <Trash size={10} />
                </Button>
                <Image
                  width={100}
                  height={100}
                  src={`${config.file_base}/${image}`}
                  alt={`gallery-${ind}`}
                  className="rounded-lg"
                />
              </figure>
            ))
          ) : (
            <p>No file selected!</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-end">
        <Button type="submit" disabled={createMutation.isLoading}>
          Submit
          {createMutation.isLoading && (
            <span className="ml-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
          )}
        </Button>
      </div>
    </form>
  );
}
