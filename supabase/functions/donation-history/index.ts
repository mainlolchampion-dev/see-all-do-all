import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DonationRecord {
  id: string;
  date: string;
  amount: number;
  coins: number;
  status: string;
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
    const { login } = await req.json();

    if (!login) {
      return new Response(
        JSON.stringify({ success: false, error: "Login required", donations: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
      let donations: DonationRecord[] = [];

      // Try different table structures for donation history
      const tableQueries = [
        // Standard donations table
        {
          query: `SELECT id, created_at, amount, coins, status FROM donations WHERE account_name = ? ORDER BY created_at DESC LIMIT 50`,
          mapper: (row: any) => ({
            id: `#${row.id}`,
            date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'Unknown',
            amount: row.amount || 0,
            coins: row.coins || 0,
            status: row.status || 'Completed'
          })
        },
        // Alternative: custom_donates table
        {
          query: `SELECT id, date, amount, coins FROM custom_donates WHERE account = ? ORDER BY date DESC LIMIT 50`,
          mapper: (row: any) => ({
            id: `#${row.id}`,
            date: row.date ? new Date(row.date).toISOString().split('T')[0] : 'Unknown',
            amount: row.amount || 0,
            coins: row.coins || 0,
            status: 'Completed'
          })
        },
        // Alternative: donation_log table
        {
          query: `SELECT id, timestamp, eur_amount, coins FROM donation_log WHERE login = ? ORDER BY timestamp DESC LIMIT 50`,
          mapper: (row: any) => ({
            id: `#${row.id}`,
            date: row.timestamp ? new Date(row.timestamp).toISOString().split('T')[0] : 'Unknown',
            amount: row.eur_amount || 0,
            coins: row.coins || 0,
            status: 'Completed'
          })
        }
      ];

      for (const tableQuery of tableQueries) {
        try {
          const result = await withTimeout(
            client.query(tableQuery.query, [login]),
            3000,
            "Donation query"
          );
          
          if (result && result.length > 0) {
            donations = result.map(tableQuery.mapper);
            break;
          }
        } catch (tableError) {
          // Table doesn't exist or different schema, try next
          console.log("Donation table query failed, trying next:", tableError);
        }
      }

      await client.close();

      return new Response(
        JSON.stringify({
          success: true,
          donations: donations
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (queryError) {
      await client.close();
      throw queryError;
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Donation history error:", errorMessage);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        donations: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
