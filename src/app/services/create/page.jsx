"use client";
import ReviewForm from "@/components/forms/review";
import { useQueryState } from "nuqs";
import React from "react";

export default function Page() {
  const [businessId, setBusinessId] = useQueryState("businessId");
  const [businessLink, setBusinessLink] = useQueryState("businessLink");

  return <ReviewForm businessId={businessId} businessLink={businessLink} />;
}
