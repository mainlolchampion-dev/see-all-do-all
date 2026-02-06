import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// L2J uses Base64(SHA1(password)) format
async function encodeL2Password(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = new Uint8Array(hashBuffer);
  return encodeBase64(hashArray);
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Not authenticated" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid authentication" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6 || newPassword.length > 16) {
      return new Response(
        JSON.stringify({ success: false, error: "Password must be 6-16 characters" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Determine the L2 login: from user metadata or email lookup
    const l2Login = user.user_metadata?.l2_login;
    const userEmail = user.email;

    if (!l2Login && !userEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "No linked L2 account found" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get MySQL config
    const host = Deno.env.get('L2_MYSQL_HOST');
    const port = parseInt(Deno.env.get('L2_MYSQL_PORT') || '3306');
    const database = Deno.env.get('L2_MYSQL_DATABASE');
    const username = Deno.env.get('L2_MYSQL_USER');
    const dbPassword = Deno.env.get('L2_MYSQL_PASSWORD');

    if (!host || !database || !username || !dbPassword) {
      throw new Error('Missing MySQL configuration');
    }

    const CONNECT_TIMEOUT_MS = 5000;
    const QUERY_TIMEOUT_MS = 5000;

    const client = new Client();
    await withTimeout(
      client.connect({
        hostname: host,
        port,
        db: database,
        username,
        password: dbPassword,
      }),
      CONNECT_TIMEOUT_MS,
      "MySQL connect"
    );

    try {
      // Find the L2 account - by login name or email
      let accountLogin: string | null = null;

      if (l2Login) {
        const rows = await withTimeout(
          client.query(`SELECT login FROM accounts WHERE login = ? LIMIT 1`, [l2Login.toLowerCase()]),
          QUERY_TIMEOUT_MS,
          "Find account by login"
        );
        if (rows.length > 0) {
          accountLogin = rows[0].login;
        }
      }

      if (!accountLogin && userEmail) {
        const rows = await withTimeout(
          client.query(`SELECT login FROM accounts WHERE email = ? LIMIT 1`, [userEmail.toLowerCase()]),
          QUERY_TIMEOUT_MS,
          "Find account by email"
        );
        if (rows.length > 0) {
          accountLogin = rows[0].login;
        }
      }

      if (!accountLogin) {
        await client.close();
        return new Response(
          JSON.stringify({ success: false, error: "No L2 account found linked to your web account" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // Encode the new password in L2J format (SHA1 + Base64)
      const encodedPassword = await encodeL2Password(newPassword);

      // Update the password
      await withTimeout(
        client.execute(
          `UPDATE accounts SET password = ? WHERE login = ?`,
          [encodedPassword, accountLogin]
        ),
        QUERY_TIMEOUT_MS,
        "Update password"
      );

      console.log(`Updated L2 password for account: ${accountLogin}`);

      await client.close();

      return new Response(
        JSON.stringify({ success: true, message: "L2 game password updated successfully" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );

    } catch (queryError) {
      console.error("Query error:", queryError);
      try { await client.close(); } catch {}
      throw queryError;
    }

  } catch (error: unknown) {
    console.error('Update L2 password error:', error);
    const errorMessage = error instanceof Error ? error.message : "Error updating L2 password";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
