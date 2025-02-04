import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export function useTableFilters() {
  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1),
  );

  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const [typeFilter, setTypeFilter] = useQueryState(
    "type",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const [methodFilter, setMethodFilter] = useQueryState(
    "method",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setMethodFilter(null);
    setTypeFilter(null);

    setPage(1);
  }, [setSearchQuery, setPage, setMethodFilter, setTypeFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!methodFilter || !!typeFilter;
  }, [searchQuery, methodFilter, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    methodFilter,
    setMethodFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
