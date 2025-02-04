"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [inputPage, setInputPage] = useState(currentPage.toString());

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const ellipsis = (
      <Button variant="ghost" size="icon" disabled>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    );

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>,
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(i)}
            >
              {i}
            </Button>,
          );
        }
        pageNumbers.push(ellipsis);
        pageNumbers.push(
          <Button
            key={totalPages}
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>,
        );
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          <Button
            key={1}
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>,
        );
        pageNumbers.push(ellipsis);
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(i)}
            >
              {i}
            </Button>,
          );
        }
      } else {
        pageNumbers.push(
          <Button
            key={1}
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>,
        );
        pageNumbers.push(ellipsis);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(i)}
            >
              {i}
            </Button>,
          );
        }
        pageNumbers.push(ellipsis);
        pageNumbers.push(
          <Button
            key={totalPages}
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>,
        );
      }
    }

    return pageNumbers;
  };

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const page = Number.parseInt(inputPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setInputPage(currentPage.toString());
    }
  };

  return (
    <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <form
        onSubmit={handleInputSubmit}
        className="flex items-center space-x-2"
      >
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          className="w-16 rounded border px-2 py-1 text-sm"
        />
        <span>of {totalPages}</span>
        <Button type="submit" variant="outline" size="sm">
          Go
        </Button>
      </form>
    </div>
  );
}
