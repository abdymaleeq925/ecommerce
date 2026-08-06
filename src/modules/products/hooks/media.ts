import type { Media } from "@/payload-types";

export const getMediaUrl = (
  media: string | null | undefined | Media,
  fallback = "/placeholder.png"
): string => {
  if (!media || typeof media === "string") return fallback;
  return media.url ?? fallback;
};