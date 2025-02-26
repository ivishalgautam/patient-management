import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString,
  gender: parseAsString,
  categories: parseAsString,
  role: parseAsString,
  type: parseAsString,
  method: parseAsString,
  tid: parseAsString,
  start_date: parseAsString,
  end_date: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
