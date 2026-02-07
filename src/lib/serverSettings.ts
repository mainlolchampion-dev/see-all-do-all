export interface StarterPackItemConfig {
  iconKey: string;
  name: string;
  value: string;
  valueColor: string;
}

export interface StarterPackConfig {
  id: string;
  items: StarterPackItemConfig[];
  originalPrice: string;
  salePrice: string;
  priceAmount: number;
  itemId: number;
}

export interface ServerSettings {
  rates: {
    xp: number;
    sp: number;
    adena: number;
    drop: number;
    spoil: number;
    quest_drop: number;
    seal_stones: number;
    raid_drop: number;
    epic_drop: number;
  };
  features: {
    max_enchant: string;
    safe_enchant: string;
    max_level: number;
    subclass_without_quest: boolean;
    free_teleport: boolean;
    global_gk: boolean;
    auto_learn_skills: boolean;
    custom_weapons: boolean;
    custom_armors: boolean;
  };
  discord: {
    invite_url: string;
    widget_id: string;
  };
  siege: {
    schedule: string;
  };
  launch: {
    date: string;
    enabled: boolean;
  };
  hero: {
    subtitle: string;
  };
  starter_packs: StarterPackConfig[];
}

export const defaultServerSettings: ServerSettings = {
  rates: {
    xp: 50,
    sp: 50,
    adena: 50,
    drop: 5,
    spoil: 5,
    quest_drop: 5,
    seal_stones: 5,
    raid_drop: 1,
    epic_drop: 1,
  },
  features: {
    max_enchant: "+25",
    safe_enchant: "+4",
    max_level: 85,
    subclass_without_quest: true,
    free_teleport: true,
    global_gk: true,
    auto_learn_skills: true,
    custom_weapons: true,
    custom_armors: true,
  },
  discord: {
    invite_url: "",
    widget_id: "",
  },
  siege: {
    schedule: "Every Sunday 20:00 GMT+2",
  },
  launch: {
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
  hero: {
    subtitle: "x1000 PvP Server",
  },
  starter_packs: [
    {
      id: "basic",
      items: [
        { iconKey: "weapon", name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
        { iconKey: "armor", name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
        { iconKey: "jewel", name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
        { iconKey: "generosity_rune", name: "Generosity Rune", value: "5 Pcs.", valueColor: "text-crimson" },
      ],
      originalPrice: "€20.00",
      salePrice: "€9.99",
      priceAmount: 999,
      itemId: 600623,
    },
    {
      id: "improved",
      items: [
        { iconKey: "weapon", name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
        { iconKey: "armor", name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
        { iconKey: "jewel", name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
        { iconKey: "pve", name: "PvE Damage +15%", value: "7 Days", valueColor: "text-emerald-500" },
        { iconKey: "agathion", name: "Agathion Helper", value: "7 Days", valueColor: "text-emerald-500" },
        { iconKey: "generosity_rune", name: "Generosity Rune", value: "10 Pcs.", valueColor: "text-crimson" },
      ],
      originalPrice: "€30.00",
      salePrice: "€14.99",
      priceAmount: 1499,
      itemId: 600624,
    },
    {
      id: "premium",
      items: [
        { iconKey: "weapon", name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
        { iconKey: "armor", name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
        { iconKey: "jewel", name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
        { iconKey: "pve", name: "PvE Damage +15%", value: "7 Days", valueColor: "text-emerald-500" },
        { iconKey: "agathion", name: "Agathion Helper", value: "7 Days", valueColor: "text-emerald-500" },
        { iconKey: "premium", name: "Premium Account 100%", value: "7 Days", valueColor: "text-emerald-500" },
        { iconKey: "enchant", name: "Enchant Bonus +10%", value: "7 Days", valueColor: "text-emerald-500" },
        { iconKey: "generosity_rune", name: "Generosity Rune", value: "15 Pcs.", valueColor: "text-crimson" },
      ],
      originalPrice: "€40.00",
      salePrice: "€19.99",
      priceAmount: 1999,
      itemId: 600625,
    },
    {
      id: "elite",
      items: [
        { iconKey: "weapon", name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
        { iconKey: "armor", name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
        { iconKey: "jewel", name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
        { iconKey: "pve", name: "PvE Damage +15%", value: "21 Days", valueColor: "text-emerald-500" },
        { iconKey: "agathion", name: "Agathion Helper", value: "21 Days", valueColor: "text-emerald-500" },
        { iconKey: "premium", name: "Premium Account 100%", value: "21 Days", valueColor: "text-emerald-500" },
        { iconKey: "enchant", name: "Enchant Bonus +10%", value: "21 Days", valueColor: "text-emerald-500" },
        { iconKey: "love_potion", name: "Love Potions", value: "100 Pcs.", valueColor: "text-crimson" },
        { iconKey: "generosity_rune", name: "Generosity Rune", value: "25 Pcs.", valueColor: "text-crimson" },
      ],
      originalPrice: "€50.00",
      salePrice: "€24.99",
      priceAmount: 2499,
      itemId: 600626,
    },
  ],
};
