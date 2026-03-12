"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, FileText, ChevronDown } from "lucide-react";

export default function VisitNotes({ visits = [], isHeaderDetails = false }) {
  const [expandedVisits, setExpandedVisits] = useState({});

  const toggleVisit = (visitId) => {
    setExpandedVisits((prev) => ({
      ...prev,
      [visitId]: !prev[visitId],
    }));
  };

  const sortedVisits = [...visits].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="">
      {/* Timeline */}
      <div className="space-y-4">
        {sortedVisits.map((visit) => {
          const isExpanded = expandedVisits[visit.id] === true;

          return (
            <Card
              key={visit.id}
              className="border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              {/* Collapsible Header */}
              <button onClick={() => toggleVisit(visit.id)} className="w-full">
                <div className="space-y-1 p-6">
                  <div className="flex w-full items-center justify-between transition-colors hover:bg-slate-50">
                    <div className="flex flex-1 items-center gap-4">
                      <Calendar className="h-5 w-5 flex-shrink-0 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-900">
                        {format(
                          new Date(visit.created_at),
                          "EEEE, MMMM d, yyyy",
                        )}
                      </span>
                      <span className="text-sm text-slate-500">
                        {format(new Date(visit.created_at), "h:mm a")}
                      </span>
                      <div className="ml-auto flex-shrink-0 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        {visit.visit_notes.length} note
                        {visit.visit_notes.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <ChevronDown
                      className={`ml-4 h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${
                        isExpanded ? "rotate-180 transform" : ""
                      }`}
                    />
                  </div>
                  {isHeaderDetails && (
                    <div className="flex gap-4 pl-9">
                      {visit.service_name && (
                        <p className="text-xs text-slate-500">
                          Service:{" "}
                          <span className="font-medium text-slate-700 capitalize">
                            {visit.service_name}
                          </span>
                        </p>
                      )}
                      {visit.added_by && (
                        <p className="text-xs text-slate-500">
                          Added by:{" "}
                          <span className="font-medium text-slate-700 capitalize">
                            {visit.added_by}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <>
                  <div className="border-t border-slate-100" />
                  <div className="p-6">
                    {/* Visit Notes */}
                    <div className="space-y-3">
                      <div className="mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-slate-900">
                          Notes
                        </span>
                      </div>

                      {/* Notes List */}
                      <div className="space-y-2 rounded-lg bg-slate-50 p-4">
                        {visit.visit_notes.map((visitNote, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                              {index + 1}
                            </div>
                            <p className="pt-0.5 text-slate-700">
                              {visitNote.note}
                            </p>
                          </div>
                        ))}
                      </div>

                      {!isHeaderDetails && (
                        <div className="mt-4 space-y-1 border-t border-slate-100 pt-4">
                          {visit.service_name && (
                            <p className="text-xs text-slate-500">
                              Service:{" "}
                              <span className="font-medium text-slate-700 capitalize">
                                {visit.service_name}
                              </span>
                            </p>
                          )}
                          {visit.added_by && (
                            <p className="text-xs text-slate-500">
                              Added by:{" "}
                              <span className="font-medium text-slate-700 capitalize">
                                {visit.added_by}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedVisits.length === 0 && (
        <Card className="border border-slate-200 bg-white">
          <div className="p-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="text-lg text-slate-600">No visits recorded yet</p>
          </div>
        </Card>
      )}
    </div>
  );
}
