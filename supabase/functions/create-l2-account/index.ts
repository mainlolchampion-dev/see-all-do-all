import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateAccountRequest {
  login: string;
  password: string;
  email: string;
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

// L2J uses Base64 encoded passwords
function encodeL2Password(password: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  return encodeBase64(data);
}

// Validate login name (alphanumeric, 4-14 characters)
function validateLogin(login: string): { valid: boolean; error?: string } {
  if (login.length < 4 || login.length > 14) {
    return { valid: false, error: "Το username πρέπει να είναι 4-14 χαρακτήρες" };
  }
  if (!/^[a-zA-Z0-9]+$/.test(login)) {
    return { valid: false, error: "Το username πρέπει να περιέχει μόνο γράμματα και αριθμούς" };
  }
  return { valid: true };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { login, password, email }: CreateAccountRequest = await req.json();

    // Validate required fields
    if (!login || !password || !email) {
      return new Response(
        JSON.stringify({ success: false, error: "Λείπουν απαραίτητα πεδία" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate login format
    const loginValidation = validateLogin(login);
    if (!loginValidation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: loginValidation.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6 || password.length > 16) {
      return new Response(
        JSON.stringify({ success: false, error: "Ο κωδικός πρέπει να είναι 6-16 χαρακτήρες" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Μη έγκυρο email" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
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

    // Connect to MySQL
    const client = new Client();
    await withTimeout(
      client.connect({
        hostname: host,
        port: port,
        db: database,
        username: username,
        password: dbPassword,
      }),
      CONNECT_TIMEOUT_MS,
      "MySQL connect"
    );

    try {
      // Check if login already exists
      const existingLogin = await withTimeout(
        client.query(`SELECT login FROM accounts WHERE login = ? LIMIT 1`, [login.toLowerCase()]),
        QUERY_TIMEOUT_MS,
        "Check existing login"
      );

      if (existingLogin.length > 0) {
        await client.close();
        return new Response(
          JSON.stringify({ success: false, error: "Αυτό το username υπάρχει ήδη" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        );
      }

      // Check if email already exists
      const existingEmail = await withTimeout(
        client.query(`SELECT login FROM accounts WHERE email = ? LIMIT 1`, [email.toLowerCase()]),
        QUERY_TIMEOUT_MS,
        "Check existing email"
      );

      if (existingEmail.length > 0) {
        await client.close();
        return new Response(
          JSON.stringify({ success: false, error: "Αυτό το email χρησιμοποιείται ήδη" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        );
      }

      // Encode password for L2J (Base64)
      const encodedPassword = encodeL2Password(password);

      // Insert new account
      // Standard L2J accounts table structure
      await withTimeout(
        client.execute(
          `INSERT INTO accounts (login, password, email, accessLevel) VALUES (?, ?, ?, 0)`,
          [login.toLowerCase(), encodedPassword, email.toLowerCase()]
        ),
        QUERY_TIMEOUT_MS,
        "Insert account"
      );

      console.log(`Created L2 account: ${login}`);

      await client.close();

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Ο λογαριασμός δημιουργήθηκε επιτυχώς!",
          login: login.toLowerCase()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
      );

    } catch (queryError) {
      console.error("Query error:", queryError);
      try { await client.close(); } catch {}
      throw queryError;
    }

  } catch (error: unknown) {
    console.error('Create L2 account error:', error);
    
    const errorMessage = error instanceof Error ? error.message : "Σφάλμα κατά τη δημιουργία λογαριασμού";
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
