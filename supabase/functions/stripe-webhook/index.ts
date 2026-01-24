import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // If webhook secret is configured, verify signature
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Signature verified");
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logStep("Signature verification failed", { error: errorMessage });
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
    } else {
      // For testing without webhook secret
      event = JSON.parse(body);
      logStep("Processing without signature verification (test mode)");
    }

    logStep("Event type", { type: event.type });

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Get metadata
      const userId = session.metadata?.user_id;
      const coins = parseInt(session.metadata?.coins || "0", 10);
      const customerEmail = session.customer_email || session.customer_details?.email;

      logStep("Processing payment", { userId, coins, customerEmail, paymentStatus: session.payment_status });

      if (session.payment_status === "paid" && coins > 0) {
        // Connect to L2 MySQL database and add coins
        try {
          await addCoinsToAccount(customerEmail, coins);
          logStep("Coins added successfully", { email: customerEmail, coins });
        } catch (dbError: unknown) {
          const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
          logStep("Database error", { error: errorMessage });
          // Don't return error - we still want to acknowledge the webhook
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function addCoinsToAccount(email: string | null | undefined, coins: number) {
  if (!email) {
    throw new Error("No email provided");
  }

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

    // First, find the account by email
    const accountResult = await client.query(
      `SELECT login FROM accounts WHERE email = ? LIMIT 1`,
      [email]
    );

    if (accountResult.length === 0) {
      logStep("Account not found by email, trying to create donation record anyway");
      
      // Try to insert into donations table directly with email
      try {
        await client.execute(
          `INSERT INTO donations (email, coins, created_at, status) VALUES (?, ?, NOW(), 'completed')`,
          [email, coins]
        );
        logStep("Donation record created with email");
      } catch {
        logStep("Donations table might not exist with this schema");
      }
      
      await client.close();
      return;
    }

    const accountLogin = accountResult[0].login;
    logStep("Found account", { login: accountLogin });

    // Try to add coins - first attempt: donate_points column in accounts
    try {
      await client.execute(
        `UPDATE accounts SET donate_points = COALESCE(donate_points, 0) + ? WHERE login = ?`,
        [coins, accountLogin]
      );
      logStep("Updated donate_points in accounts table");
    } catch {
      logStep("donate_points column doesn't exist, trying alternative methods");
      
      // Alternative: Insert into donations table
      try {
        await client.execute(
          `INSERT INTO donations (account_name, coins, created_at, status) VALUES (?, ?, NOW(), 'completed')`,
          [accountLogin, coins]
        );
        logStep("Inserted into donations table");
      } catch {
        // Alternative: Try custom_donates table (common in L2J)
        try {
          await client.execute(
            `INSERT INTO custom_donates (account_name, coins, date) VALUES (?, ?, NOW())`,
            [accountLogin, coins]
          );
          logStep("Inserted into custom_donates table");
        } catch {
          logStep("Could not find suitable table for coins. Manual intervention required.");
          throw new Error("No suitable coins table found");
        }
      }
    }

    await client.close();
    logStep("Database connection closed");
    
  } catch (error) {
    try {
      await client.close();
    } catch {
      // ignore close errors
    }
    throw error;
  }
}
