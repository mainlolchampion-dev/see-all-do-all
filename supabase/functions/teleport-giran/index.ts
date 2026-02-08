import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Giran Town coordinates (L2J High Five)
const GIRAN_X = 82698;
const GIRAN_Y = 148638;
const GIRAN_Z = -3473;

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { charName } = await req.json();

    if (!charName || typeof charName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Character name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Authenticate user
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

    // Connect to MySQL
    const host = Deno.env.get('L2_MYSQL_HOST');
    const port = parseInt(Deno.env.get('L2_MYSQL_PORT') || '3306');
    const database = Deno.env.get('L2_MYSQL_DATABASE');
    const username = Deno.env.get('L2_MYSQL_USER');
    const password = Deno.env.get('L2_MYSQL_PASSWORD');

    if (!host || !database || !username || !password) {
      throw new Error('Missing MySQL configuration');
    }

    const client = new Client();
    await withTimeout(
      client.connect({ hostname: host, port, db: database, username, password }),
      3000,
      "MySQL connect"
    );

    // Determine allowed account name
    let allowedLogin = linkedLogin;
    if (!allowedLogin && userEmail) {
      try {
        const accountResult = await withTimeout(
          client.query(`SELECT login FROM accounts WHERE email = ? LIMIT 1`, [userEmail]),
          3000,
          "MySQL query account by email"
        );
        allowedLogin = accountResult[0]?.login?.toLowerCase() || "";
      } catch (e) {
        console.error("Email lookup error:", e);
      }
    }

    if (!allowedLogin) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "No L2 account linked" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Verify the character belongs to this account and check status
    const charResult = await withTimeout(
      client.query(
        `SELECT char_name, account_name, online, pvpflag, karma FROM characters WHERE char_name = ? LIMIT 1`,
        [charName]
      ),
      3000,
      "MySQL query character"
    );

    if (!charResult || charResult.length === 0) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "Character not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    const char = charResult[0];

    // Verify ownership
    if (char.account_name.toLowerCase() !== allowedLogin) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "This character does not belong to your account" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Check if online
    if (char.online === 1) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "Character must be offline to teleport. Please disconnect first." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check PvP flag
    if (char.pvpflag === 1) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "Cannot teleport while PvP flagged. Wait for the flag to expire." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check karma (PK status)
    if (char.karma > 0) {
      await client.close();
      return new Response(
        JSON.stringify({ error: "Cannot teleport with karma. Remove your karma first." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Teleport: update coordinates to Giran
    await withTimeout(
      client.query(
        `UPDATE characters SET x = ?, y = ?, z = ? WHERE char_name = ?`,
        [GIRAN_X, GIRAN_Y, GIRAN_Z, charName]
      ),
      3000,
      "MySQL update position"
    );

    try {
      await client.close();
    } catch {
      // ignore close errors
    }

    return new Response(
      JSON.stringify({ success: true, message: `${charName} will appear in Giran on next login.` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: unknown) {
    console.error('Teleport error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to teleport character', details: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
