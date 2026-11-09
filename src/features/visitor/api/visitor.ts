import { z } from "zod";
import { apiRequest } from "../../../core/lib/api-client.ts";

export const visitorStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  today: z.number().int().nonnegative(),
  yesterday: z.number().int().nonnegative(),
});
export type VisitorStatsData = z.infer<typeof visitorStatsSchema>;

export function recordVisit(): Promise<null> {
  return apiRequest("/api/visitors", { method: "POST" }, z.null());
}

export function fetchVisitorStats(): Promise<VisitorStatsData> {
  return apiRequest("/api/visitors", { method: "GET" }, visitorStatsSchema);
}

// Share the pending write across StrictMode mounts and multiple UI consumers.
// The server remains responsible for visitor identity and daily deduplication.
export function createVisitorStatsLoader() {
  let recordedDay: string | null = null;
  let pending: Promise<null> | null = null;
  const dayFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  });

  return async (): Promise<VisitorStatsData> => {
    const day = dayFormatter.format(new Date());
    if (recordedDay !== day) {
      if (!pending) {
        pending = recordVisit()
          .then((result) => {
            recordedDay = day;
            return result;
          })
          .finally(() => {
            pending = null;
          });
      }
      await pending;
    }
    return fetchVisitorStats();
  };
}

export const loadVisitorStats = createVisitorStatsLoader();
