import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ServerStatus {
  loginServer: {
    status: "online" | "offline";
    players: number;
  };
  gameServer: {
    status: "online" | "offline";
    players: number;
  };
  maxPlayers: number;
  uptime: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const host = Deno.env.get('L2_MYSQL_HOST');
    const port = parseInt(Deno.env.get('L2_MYSQL_PORT') || '3306');
    const database = Deno.env.get('L2_MYSQL_DATABASE');
    const username = Deno.env.get('L2_MYSQL_USER');
    const password = Deno.env.get('L2_MYSQL_PASSWORD');

    if (!host || !database || !username || !password) {
      throw new Error('Missing MySQL configuration');
    }

    // Connect to MySQL
    const client = await new Client().connect({
      hostname: host,
      port: port,
      db: database,
      username: username,
      password: password,
    });

    // Query for online players count
    // This query is typical for L2J/L2OFF servers - adjust table/column names as needed
    let onlinePlayers = 0;
    let loginStatus = "online" as "online" | "offline";
    let gameStatus = "online" as "online" | "offline";

    try {
      // Try common L2 database table names
      // L2J High Five typically uses 'characters' table with 'online' column
      const result = await client.query(
        `SELECT COUNT(*) as count FROM characters WHERE online = 1`
      );
      onlinePlayers = result[0]?.count || 0;
      gameStatus = "online";
    } catch (queryError) {
      console.error("Query error, trying alternative table:", queryError);
      
      try {
        // Alternative: some servers use 'accounts' or different structure
        const result = await client.query(
          `SELECT COUNT(*) as count FROM accounts WHERE lastactive > DATE_SUB(NOW(), INTERVAL 5 MINUTE)`
        );
        onlinePlayers = result[0]?.count || 0;
        gameStatus = "online";
      } catch (altError) {
        console.error("Alternative query also failed:", altError);
        gameStatus = "offline";
      }
    }

    await client.close();

    const serverStatus: ServerStatus = {
      loginServer: {
        status: loginStatus,
        players: onlinePlayers,
      },
      gameServer: {
        status: gameStatus,
        players: onlinePlayers,
      },
      maxPlayers: 5000,
      uptime: "99.9%",
    };

    return new Response(JSON.stringify(serverStatus), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Server status error:', error);
    
    // Return offline status if connection fails
    const offlineStatus: ServerStatus = {
      loginServer: { status: "offline", players: 0 },
      gameServer: { status: "offline", players: 0 },
      maxPlayers: 5000,
      uptime: "N/A",
    };

    return new Response(JSON.stringify(offlineStatus), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});
