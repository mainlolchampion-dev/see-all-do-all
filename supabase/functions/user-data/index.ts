import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Character {
  char_name: string;
  classid: number;
  level: number;
  online: boolean;
  pvpkills: number;
  pkkills: number;
  pvpflag: number;
  karma: number;
}

interface AccountData {
  login: string;
  characters: Character[];
  characterCount: number;
  donationCoins: number;
}

// L2J Class ID to Class Name mapping (High Five)
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
  38: "Dark Elven Mystic", 39: "Dark Wizard", 40: "Spellhowler",
  41: "Phantom Summoner", 42: "Shillien Oracle", 43: "Shillien Elder",
  44: "Orc Fighter", 45: "Orc Raider", 46: "Destroyer", 47: "Orc Monk",
  48: "Tyrant", 49: "Orc Mystic", 50: "Orc Shaman", 51: "Overlord",
  52: "Warcryer", 53: "Dwarven Fighter", 54: "Scavenger", 55: "Bounty Hunter",
  56: "Artisan", 57: "Warsmith", 88: "Duelist", 89: "Dreadnought",
  90: "Phoenix Knight", 91: "Hell Knight", 92: "Sagittarius", 93: "Adventurer",
  94: "Archmage", 95: "Soultaker", 96: "Arcana Lord", 97: "Cardinal",
  98: "Hierophant", 99: "Eva's Templar", 100: "Sword Muse", 101: "Wind Rider",
  102: "Moonlight Sentinel", 103: "Mystic Muse", 104: "Elemental Master",
  105: "Eva's Saint", 106: "Shillien Templar", 107: "Spectral Dancer",
  108: "Ghost Hunter", 109: "Ghost Sentinel", 110: "Storm Screamer",
  111: "Spectral Master", 112: "Shillien Saint", 113: "Titan",
  114: "Grand Khavatari", 115: "Dominator", 116: "Doomcryer",
  117: "Fortune Seeker", 118: "Maestro",
  123: "Male Soldier", 124: "Female Soldier", 125: "Trooper", 126: "Warder",
  127: "Berserker", 128: "Male Soulbreaker", 129: "Female Soulbreaker",
  130: "Arbalester", 131: "Doombringer", 132: "Male Soulhound",
  133: "Female Soulhound", 134: "Trickster", 135: "Inspector", 136: "Judicator"
};

function getClassName(classId: number): string {
  return classNames[classId] || `Class ${classId}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: number | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  }) as Promise<T>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { login, email } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase configuration");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;
    const userEmail = (user.email || "").toLowerCase();
    const linkedLogin = (user.user_metadata?.l2_login || "").toString().toLowerCase();

    const requestedLogin = login?.toLowerCase();
    const requestedEmail = (email || userEmail || "").toLowerCase();

    if (!requestedLogin && !requestedEmail) {
      return new Response(
        JSON.stringify({ error: 'Login or email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const host = Deno.env.get('L2_MYSQL_HOST');
    const port = parseInt(Deno.env.get('L2_MYSQL_PORT') || '3306');
    const database = Deno.env.get('L2_MYSQL_DATABASE');
    const username = Deno.env.get('L2_MYSQL_USER');
    const password = Deno.env.get('L2_MYSQL_PASSWORD');

    if (!host || !database || !username || !password) {
      throw new Error('Missing MySQL configuration');
    }

    const CONNECT_TIMEOUT_MS = 3000;
    const QUERY_TIMEOUT_MS = 3000;

    const client = new Client();
    await withTimeout(
      client.connect({
        hostname: host,
        port: port,
        db: database,
        username: username,
        password: password,
      }),
      CONNECT_TIMEOUT_MS,
      "MySQL connect"
    );

    // Determine which L2 login is allowed for this user
    let allowedLogin = linkedLogin;

    if (!allowedLogin && userEmail) {
      try {
        const accountResult = await withTimeout(
          client.query(
            `SELECT login FROM accounts WHERE email = ? LIMIT 1`,
            [userEmail]
          ),
          QUERY_TIMEOUT_MS,
          "MySQL query account by email"
        );
        allowedLogin = accountResult[0]?.login?.toLowerCase() || "";
      } catch (emailQueryError) {
        console.error("Email lookup error:", emailQueryError);
      }
    }

    if (requestedEmail && userEmail && requestedEmail !== userEmail) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "Email does not match authenticated user", notLinked: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    if (!allowedLogin && requestedLogin) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "Account is not linked to this user", notLinked: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    let accountLogin = requestedLogin || allowedLogin;

    if (!accountLogin) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "No L2 account linked to this email", notLinked: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    if (allowedLogin && accountLogin.toLowerCase() !== allowedLogin) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "Requested account is not linked to this user", notLinked: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Query characters for this account
    const characters: Character[] = [];
    
    try {
      const result = await withTimeout(
        client.query(
          `SELECT char_name, classid, level, online, pvpkills, pkkills, pvpflag, karma 
           FROM characters 
           WHERE account_name = ? 
           ORDER BY level DESC`,
          [accountLogin]
        ),
        QUERY_TIMEOUT_MS,
        "MySQL query characters"
      );

      for (const row of result) {
        characters.push({
          char_name: row.char_name,
          classid: row.classid,
          level: row.level,
          online: row.online === 1,
          pvpkills: row.pvpkills || 0,
          pkkills: row.pkkills || 0,
          pvpflag: row.pvpflag || 0,
          karma: row.karma || 0,
        });
      }
    } catch (queryError) {
      console.error("Characters query error:", queryError);
    }

    // Try to get donation coins if the table exists
    let donationCoins = 0;
    try {
      // Common donation table names in L2J
      const donationResult = await withTimeout(
        client.query(
          `SELECT SUM(amount) as total FROM donations WHERE account_name = ?`,
          [accountLogin]
        ),
        QUERY_TIMEOUT_MS,
        "MySQL query donations"
      );
      donationCoins = donationResult[0]?.total || 0;
    } catch {
      // Donation table might not exist, try alternative
      try {
        const coinsResult = await withTimeout(
          client.query(
            `SELECT donate_points FROM accounts WHERE login = ?`,
            [accountLogin]
          ),
          QUERY_TIMEOUT_MS,
          "MySQL query account coins"
        );
        donationCoins = coinsResult[0]?.donate_points || 0;
      } catch {
        // No donation system found, leave at 0
        console.log("No donation coins column found");
      }
    }

    try {
      await client.close();
    } catch {
      // ignore close errors
    }

    // Transform characters with class names
    const transformedCharacters = characters.map(char => ({
      name: char.char_name,
      class: getClassName(char.classid),
      classId: char.classid,
      level: char.level,
      online: char.online,
      pvpkills: char.pvpkills,
      pkkills: char.pkkills,
      pvpflag: char.pvpflag,
      karma: char.karma,
    }));

    const accountData: AccountData = {
      login: accountLogin,
      characters: transformedCharacters as any,
      characterCount: characters.length,
      donationCoins: donationCoins,
    };

    return new Response(JSON.stringify(accountData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    console.error('User data error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user data', details: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
