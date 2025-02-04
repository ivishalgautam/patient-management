import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export function useTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [username, setUsername] = useQueryState(
    "username",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1),
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setUsername(null);

    setPage(1);
  }, [setUsername, setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!username;
  }, [searchQuery, username]);

  return {
    searchQuery,
    setSearchQuery,
    username,
    setUsername,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
