import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DownloadMirror {
  id: string;
  download_id: string | null;
  name: string;
  url: string;
  sort_order: number | null;
}

export interface DownloadItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: string | null;
  icon: string | null;
  download_type: string;
  is_primary: boolean | null;
  sort_order: number | null;
  mirrors: DownloadMirror[];
}

export function useDownloads() {
  return useQuery<DownloadItem[]>({
    queryKey: ["downloads"],
    queryFn: async () => {
      const { data: downloads, error } = await supabase
        .from("downloads")
        .select("*")
        .order("is_primary", { ascending: false })
        .order("sort_order", { ascending: true });

      if (error) {
        throw error;
      }

      const downloadIds = (downloads || []).map((d) => d.id);
      let mirrors: DownloadMirror[] = [];

      if (downloadIds.length > 0) {
        const { data: mirrorRows, error: mirrorError } = await supabase
          .from("download_mirrors")
          .select("*")
          .in("download_id", downloadIds)
          .order("sort_order", { ascending: true });

        if (mirrorError) {
          throw mirrorError;
        }

        mirrors = mirrorRows || [];
      }

      const mirrorsById = new Map<string, DownloadMirror[]>();
      mirrors.forEach((mirror) => {
        if (!mirror.download_id) return;
        const list = mirrorsById.get(mirror.download_id) || [];
        list.push(mirror);
        mirrorsById.set(mirror.download_id, list);
      });

      return (downloads || []).map((download) => ({
        ...download,
        mirrors: mirrorsById.get(download.id) || [],
      }));
    },
    staleTime: 60 * 1000,
  });
}
