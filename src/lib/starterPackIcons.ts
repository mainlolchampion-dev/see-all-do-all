// Starter Pack Badge Icons
import basicBadge from "@/assets/starter-packs/basic-badge.png";
import improvedBadge from "@/assets/starter-packs/improved-badge.png";
import premiumBadge from "@/assets/starter-packs/premium-badge.png";
import eliteBadge from "@/assets/starter-packs/elite-badge.png";

// Item Icons
import weaponIcon from "@/assets/starter-packs/items/weapon-icon.png";
import armorIcon from "@/assets/starter-packs/items/armor-icon.png";
import jewelIcon from "@/assets/starter-packs/items/jewel-icon.png";
import pveIcon from "@/assets/starter-packs/items/pve-icon.png";
import agathionIcon from "@/assets/starter-packs/items/agathion-icon.png";
import premiumAccountIcon from "@/assets/starter-packs/items/premium-icon.png";
import enchantIcon from "@/assets/starter-packs/items/enchant-icon.png";
import lovePotionIcon from "@/assets/starter-packs/items/love-potion-icon.png";
import generosityRuneIcon from "@/assets/starter-packs/items/generosity-rune-icon.png";

// Icon registry mapping keys to imported assets
export const ITEM_ICON_REGISTRY: Record<string, { src: string; label: string }> = {
  weapon: { src: weaponIcon, label: "Weapon" },
  armor: { src: armorIcon, label: "Armor" },
  jewel: { src: jewelIcon, label: "Jewel" },
  pve: { src: pveIcon, label: "PvE" },
  agathion: { src: agathionIcon, label: "Agathion" },
  premium: { src: premiumAccountIcon, label: "Premium Account" },
  enchant: { src: enchantIcon, label: "Enchant" },
  love_potion: { src: lovePotionIcon, label: "Love Potion" },
  generosity_rune: { src: generosityRuneIcon, label: "Generosity Rune" },
};

export const BADGE_REGISTRY: Record<string, string> = {
  basic: eliteBadge,
  improved: improvedBadge,
  premium: premiumBadge,
  elite: basicBadge,
};

export function getItemIconSrc(key: string): string {
  return ITEM_ICON_REGISTRY[key]?.src || weaponIcon;
}

export function getBadgeSrc(packId: string): string {
  return BADGE_REGISTRY[packId] || eliteBadge;
}

// Value color options for admin selection
export const VALUE_COLOR_OPTIONS = [
  { key: "text-primary", label: "Gold (Primary)" },
  { key: "text-emerald-500", label: "Green (Duration)" },
  { key: "text-crimson", label: "Red (Quantity)" },
  { key: "text-foreground", label: "White (Default)" },
];
