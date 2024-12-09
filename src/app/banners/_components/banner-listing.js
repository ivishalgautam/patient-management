"use client";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/table/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { deleteBanner, fetchBanners, updateBanner } from "@/server/banner";
import { BannerDeleteDialog } from "./delete-dialog";

export default function BannerListing() {
  const [isModal, setIsModal] = useState(false);
  const [bannerId, setBannerId] = useState(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryFn: () => fetchBanners(searchParamStr),
    queryKey: ["banners", searchParamStr],
    enabled: !!searchParamStr,
  });

  const deleteMutation = useMutation(deleteBanner, {
    onSuccess: () => {
      toast.success("Banner deleted.");
      queryClient.invalidateQueries(["banners"]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? error?.message ?? "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateBanner(bannerId, data),
    onSuccess: () => {
      toast.success("Updated.");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? error?.message ?? "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["banners"]);
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id });
  };
  const handleUpdate = async (data) => {
    updateMutation.mutate(data);
  };
  const handleBannerFeaturedStatus = async (data) => {
    updateMutation.mutate(data);
  };

  useEffect(() => {
    if (!searchParamStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamStr, router]);

  if (isLoading || isFetching)
    return <DataTableSkeleton columnCount={5} rowCount={10} />;

  if (isError) error?.message ?? "error";

  return (
    <div className="rounded-lg border-input">
      <DataTable
        columns={columns(openModal, setBannerId, handleBannerFeaturedStatus)}
        data={data.banners}
        totalItems={data.total}
      />
      <BannerDeleteDialog
        isOpen={isModal}
        setIsOpen={setIsModal}
        handleDelete={() => handleDelete(bannerId)}
      />
    </div>
  );
}
