import { useQuery } from "@tanstack/react-query";
import { loadVisitorStats } from "../api/visitor";

export function useVisitorStats() {
  return useQuery({
    queryKey: ["visitors", "stats"],
    queryFn: loadVisitorStats,
    staleTime: 60_000,
    retry: false,
    meta: { handlesErrorLocally: true },
  });
}
