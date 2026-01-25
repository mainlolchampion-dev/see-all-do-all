import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-CHARACTER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { characterName } = await req.json();
    
    if (!characterName || characterName.trim().length === 0) {
      return new Response(JSON.stringify({ 
        valid: false, 
        error: "Character name is required" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const trimmedName = characterName.trim();
    
    // Validate character name format (allow letters, numbers, spaces, and common L2 special chars like {}, [], etc.)
    // Max 35 characters to accommodate longer names with titles
    if (trimmedName.length > 35 || trimmedName.length < 1) {
      return new Response(JSON.stringify({ 
        valid: false, 
        error: "Character name must be 1-35 characters" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Validating character", { characterName: trimmedName });

    // Connect to L2 MySQL database
    const host = Deno.env.get('L2_MYSQL_HOST');
    const port = parseInt(Deno.env.get('L2_MYSQL_PORT') || '3306');
    const database = Deno.env.get('L2_MYSQL_DATABASE');
    const username = Deno.env.get('L2_MYSQL_USER');
    const password = Deno.env.get('L2_MYSQL_PASSWORD');

    if (!host || !database || !username || !password) {
      throw new Error('Missing MySQL configuration');
    }

    const client = new Client();
    
    try {
      await client.connect({
        hostname: host,
        port: port,
        db: database,
        username: username,
        password: password,
      });

      logStep("Connected to MySQL");

      // Check if character exists in the characters table
      const result = await client.query(
        `SELECT char_name, account_name FROM characters WHERE char_name = ? LIMIT 1`,
        [trimmedName]
      );

      await client.close();
      logStep("Database connection closed");

      if (result.length > 0) {
        logStep("Character found", { charName: result[0].char_name, accountName: result[0].account_name });
        return new Response(JSON.stringify({ 
          valid: true, 
          characterName: result[0].char_name,
          accountName: result[0].account_name
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else {
        logStep("Character not found", { searchedName: trimmedName });
        return new Response(JSON.stringify({ 
          valid: false, 
          error: "Ο χαρακτήρας δεν βρέθηκε στον server" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
    } catch (dbError) {
      try {
        await client.close();
      } catch {
        // ignore close errors
      }
      throw dbError;
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      valid: false, 
      error: "Database connection error" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
