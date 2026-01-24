import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CastleData {
  id: number;
  name: string;
  owner: string | null;
  taxPercent: number;
  siegeDate: string | null;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: number;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

// Castle ID to name mapping (standard L2J castle IDs)
const castleNames: Record<number, string> = {
  1: "Gludio",
  2: "Dion",
  3: "Giran",
  4: "Oren",
  5: "Aden",
  6: "Innadril",
  7: "Goddard",
  8: "Rune",
  9: "Schuttgart"
};

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
      // Query castle data with clan owners
      const castleQuery = `
        SELECT 
          c.id,
          c.name,
          c.taxPercent,
          c.siegeDate,
          cl.clan_name
        FROM castle c
        LEFT JOIN clan_data cl ON c.id = cl.hasCastle
        ORDER BY c.id
      `;

      const castleResult = await withTimeout(
        client.query(castleQuery),
        5000,
        "Castle query"
      );

      const castles: CastleData[] = castleResult.map((row: any) => ({
        id: row.id,
        name: row.name || castleNames[row.id] || `Castle ${row.id}`,
        owner: row.clan_name || null,
        taxPercent: row.taxPercent || 0,
        siegeDate: row.siegeDate ? new Date(row.siegeDate).toISOString() : null
      }));

      await client.close();

      return new Response(
        JSON.stringify({
          success: true,
          castles: castles
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (queryError) {
      await client.close();
      throw queryError;
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Castle data error:", errorMessage);
    
    // Return default castles with no owners on error
    const defaultCastles: CastleData[] = Object.entries(castleNames).map(([id, name]) => ({
      id: parseInt(id),
      name,
      owner: null,
      taxPercent: 0,
      siegeDate: null
    }));
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        castles: defaultCastles
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
