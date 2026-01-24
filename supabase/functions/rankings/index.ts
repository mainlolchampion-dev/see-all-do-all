import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TopPlayer {
  rank: number;
  name: string;
  class: string;
  level: number;
  pvp: number;
  pk: number;
  clan: string;
}

interface TopClan {
  rank: number;
  name: string;
  leader: string;
  level: number;
  members: number;
  reputation: number;
}

interface Hero {
  name: string;
  class: string;
  count: number;
}

// Class name mapping
const classNames: Record<number, string> = {
  0: "Human Fighter", 1: "Warrior", 2: "Gladiator", 3: "Warlord",
  4: "Human Knight", 5: "Paladin", 6: "Dark Avenger", 7: "Rogue",
  8: "Treasure Hunter", 9: "Hawkeye", 10: "Human Mystic", 11: "Human Wizard",
  12: "Sorceror", 13: "Necromancer", 14: "Warlock", 15: "Cleric",
  16: "Bishop", 17: "Prophet", 18: "Elven Fighter", 19: "Elven Knight",
  20: "Temple Knight", 21: "Swordsinger", 22: "Elven Scout", 23: "Plains Walker",
  24: "Silver Ranger", 25: "Elven Mystic", 26: "Elven Wizard", 27: "Spellsinger",
  28: "Elemental Summoner", 29: "Elven Oracle", 30: "Elven Elder",
  31: "Dark Elven Fighter", 32: "Palus Knight", 33: "Shillien Knight",
  34: "Bladedancer", 35: "Assassin", 36: "Abyss Walker", 37: "Phantom Ranger",
  38: "Dark Elven Mystic", 39: "Dark Elven Wizard", 40: "Spellhowler",
  41: "Phantom Summoner", 42: "Shillien Oracle", 43: "Shillien Elder",
  44: "Orc Fighter", 45: "Orc Raider", 46: "Destroyer", 47: "Orc Monk",
  48: "Tyrant", 49: "Orc Mystic", 50: "Orc Shaman", 51: "Overlord",
  52: "Warcryer", 53: "Dwarven Fighter", 54: "Dwarven Scavenger", 55: "Bounty Hunter",
  56: "Dwarven Artisan", 57: "Warsmith",
  88: "Duelist", 89: "Dreadnought", 90: "Phoenix Knight", 91: "Hell Knight",
  92: "Sagittarius", 93: "Adventurer", 94: "Archmage", 95: "Soultaker",
  96: "Arcana Lord", 97: "Cardinal", 98: "Hierophant",
  99: "Eva's Templar", 100: "Sword Muse", 101: "Wind Rider", 102: "Moonlight Sentinel",
  103: "Mystic Muse", 104: "Elemental Master", 105: "Eva's Saint",
  106: "Shillien Templar", 107: "Spectral Dancer", 108: "Ghost Hunter",
  109: "Ghost Sentinel", 110: "Storm Screamer", 111: "Spectral Master",
  112: "Shillien Saint", 113: "Titan", 114: "Grand Khavatari",
  115: "Dominator", 116: "Doomcryer", 117: "Fortune Seeker", 118: "Maestro",
  123: "Male Soldier", 124: "Female Soldier", 125: "Trooper", 126: "Warder",
  127: "Berserker", 128: "Male Soulbreaker", 129: "Female Soulbreaker",
  130: "Arbalester", 131: "Doombringer", 132: "Male Soulhound",
  133: "Female Soulhound", 134: "Trickster", 135: "Inspector", 136: "Judicator"
};

function getClassName(classId: number): string {
  return classNames[classId] || `Class ${classId}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: number;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const host = Deno.env.get("L2_MYSQL_HOST");
    const port = parseInt(Deno.env.get("L2_MYSQL_PORT") || "3306");
    const database = Deno.env.get("L2_MYSQL_DATABASE");
    const username = Deno.env.get("L2_MYSQL_USER");
    const password = Deno.env.get("L2_MYSQL_PASSWORD");

    if (!host || !database || !username || !password) {
      throw new Error("Missing database configuration");
    }

    const client = await withTimeout(
      new Client().connect({
        hostname: host,
        port: port,
        db: database,
        username: username,
        password: password,
      }),
      3000,
      "Database connection"
    );

    try {
      // Fetch top players by PvP kills
      const playersQuery = `
        SELECT 
          c.char_name,
          c.classid,
          c.level,
          c.pvpkills,
          c.pkkills,
          COALESCE(cl.clan_name, '-') as clan_name
        FROM characters c
        LEFT JOIN clan_data cl ON c.clanid = cl.clan_id
        WHERE c.accesslevel = 0
        ORDER BY c.pvpkills DESC
        LIMIT 50
      `;
      
      const playersResult = await withTimeout(
        client.query(playersQuery),
        5000,
        "Players query"
      );

      const topPlayers: TopPlayer[] = playersResult.map((row: any, index: number) => ({
        rank: index + 1,
        name: row.char_name,
        class: getClassName(row.classid),
        level: row.level,
        pvp: row.pvpkills || 0,
        pk: row.pkkills || 0,
        clan: row.clan_name || '-'
      }));

      // Fetch top clans by reputation
      const clansQuery = `
        SELECT 
          cl.clan_name,
          cl.clan_level,
          cl.reputation_score,
          c.char_name as leader_name,
          (SELECT COUNT(*) FROM characters WHERE clanid = cl.clan_id) as member_count
        FROM clan_data cl
        LEFT JOIN characters c ON cl.leader_id = c.charId
        ORDER BY cl.reputation_score DESC
        LIMIT 20
      `;

      let topClans: TopClan[] = [];
      try {
        const clansResult = await withTimeout(
          client.query(clansQuery),
          5000,
          "Clans query"
        );

        topClans = clansResult.map((row: any, index: number) => ({
          rank: index + 1,
          name: row.clan_name,
          leader: row.leader_name || 'Unknown',
          level: row.clan_level || 0,
          members: row.member_count || 0,
          reputation: row.reputation_score || 0
        }));
      } catch (clanError) {
        console.error("Clan query failed:", clanError);
      }

      // Fetch heroes
      let heroes: Hero[] = [];
      try {
        const heroesQuery = `
          SELECT 
            c.char_name,
            c.classid,
            h.count
          FROM heroes h
          JOIN characters c ON h.charId = c.charId
          ORDER BY h.count DESC
          LIMIT 10
        `;
        
        const heroesResult = await withTimeout(
          client.query(heroesQuery),
          5000,
          "Heroes query"
        );

        heroes = heroesResult.map((row: any) => ({
          name: row.char_name,
          class: getClassName(row.classid),
          count: row.count || 1
        }));
      } catch (heroError) {
        console.error("Heroes query failed, trying alternative:", heroError);
        
        // Try alternative: get top PvP players as "heroes"
        try {
          const altHeroesQuery = `
            SELECT char_name, classid, pvpkills
            FROM characters
            WHERE accesslevel = 0
            ORDER BY pvpkills DESC
            LIMIT 3
          `;
          
          const altResult = await withTimeout(
            client.query(altHeroesQuery),
            3000,
            "Alt heroes query"
          );

          heroes = altResult.map((row: any) => ({
            name: row.char_name,
            class: getClassName(row.classid),
            count: row.pvpkills || 0
          }));
        } catch (altError) {
          console.error("Alt heroes query also failed:", altError);
        }
      }

      await client.close();

      return new Response(
        JSON.stringify({
          success: true,
          players: topPlayers,
          clans: topClans,
          heroes: heroes
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (queryError) {
      await client.close();
      throw queryError;
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Rankings error:", errorMessage);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        players: [],
        clans: [],
        heroes: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
