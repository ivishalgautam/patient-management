"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { comprehensiveExaminationSchema } from "@/validation-schemas/comprehensive-examination";
import { Checkbox } from "../ui/checkbox";
import useMultiFileHandler from "@/hooks/use-multi-file-handler";
import Image from "next/image";
import config from "@/config";
import { Trash } from "lucide-react";
import { useEffect } from "react";
// import { ExaminationContext } from "@/store/examination-context";

export default function ComprehensiveExaminationForm({
  type = "create",
  treatmentId,
  createMutation,
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
      treatment_id: treatmentId,
      chief_complaint: "",
      medical_history: "",
      dental_history: "",
      examination: "",
      treatment_advice: [],
      gallery: [],
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

  const onSubmit = (data) => {
    if (!images.length) {
      return setError("gallery", {
        type: "custom",
        message: "Please select gallery",
      });
    }
    const payload = {
      ...data,
      gallery: images,
    };
    createMutation.mutate(payload);
  };
  const selectedTreatmentAdvices = watch("treatment_advice");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
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

      {/* Treatment Advice */}
      <div>
        <Label>Treatment Advice</Label>
        <div className="flex items-center justify-start gap-4">
          {["OPG", "CBCT", "5D Scan"].map((item, id) => (
            <div
              key={id}
              className="border-input has-[[data-state=checked]]:border-primary relative flex cursor-pointer items-center gap-2 rounded-lg border p-2 px-3 shadow-sm shadow-black/5"
            >
              <div className="flex justify-between gap-2">
                <Checkbox
                  id={`${id}-${item}`}
                  value={item}
                  className="order-1 after:absolute after:inset-0"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue("treatment_advice", [
                        ...selectedTreatmentAdvices,
                        item,
                      ]);
                    } else {
                      setValue(
                        "treatment_advice",
                        selectedTreatmentAdvices.filter((ele) => ele !== item),
                      );
                    }
                  }}
                  checked={selectedTreatmentAdvices.includes(item)}
                />
              </div>
              <Label htmlFor={`${id}-${item}`}>{item}</Label>
            </div>
          ))}
        </div>
        {errors.treatment_advice && (
          <span className="text-sm text-red-500">
            {errors.treatment_advice.message}
          </span>
        )}
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
