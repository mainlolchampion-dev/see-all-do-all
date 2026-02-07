import { useServerSettings } from "@/hooks/useServerSettings";
import { defaultServerSettings, type StarterPackConfig } from "@/lib/serverSettings";

export function useStarterPacks() {
  const { data: settings, isLoading } = useServerSettings();

  const packs: StarterPackConfig[] =
    settings?.starter_packs && Array.isArray(settings.starter_packs) && settings.starter_packs.length > 0
      ? settings.starter_packs
      : defaultServerSettings.starter_packs;

  return { packs, isLoading };
}
