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
};
