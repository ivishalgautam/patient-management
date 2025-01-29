import ExaminationProvider from "@/store/examination-context";
import React from "react";

export default function DetailsLayout({ children, params: { id } }) {
  return <ExaminationProvider id={id}>{children}</ExaminationProvider>;
}
