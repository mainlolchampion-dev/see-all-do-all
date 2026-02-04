import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAdmin = supabaseUrl && serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
      : null;

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // If webhook secret is configured, verify signature
    if (webhookSecret && signature) {
      try {
        // Deno uses WebCrypto which is async; Stripe requires constructEventAsync in this environment.
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
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
      const purchaseType = session.metadata?.type || "donation_coins";
      const characterName = session.metadata?.character_name;
      const accountName = session.metadata?.account_name;
      const customerEmail = session.customer_email || session.customer_details?.email;

      logStep("Processing payment", { userId, purchaseType, characterName, accountName, customerEmail, paymentStatus: session.payment_status });

      if (session.payment_status === "paid") {
        if (purchaseType === "starter_pack") {
          // Handle Starter Pack purchase
          const packId = session.metadata?.pack_id;
          const itemId = parseInt(session.metadata?.item_id || "0", 10);
          const amountTotal = session.amount_total || 0; // Amount in cents
          
          if (itemId > 0) {
            try {
              await addItemToCharacter(characterName, accountName, itemId, 1);
              logStep("Starter pack delivered successfully", { characterName, packId, itemId });
              
              // Update starter pack metrics
              if (supabaseAdmin && packId) {
                const { error } = await supabaseAdmin.rpc("increment_starter_pack_sale", { 
                  _pack_id: packId, 
                  _amount: amountTotal 
                });
                if (error) {
                  logStep("Failed to update starter pack metrics", { error: error.message });
                } else {
                  logStep("Starter pack metrics updated", { packId, amountTotal });
                }
              }
            } catch (dbError: unknown) {
              const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
              logStep("Database error delivering starter pack", { error: errorMessage });
            }
          }
        } else {
          // Handle donation coins purchase (default)
          const coins = parseInt(session.metadata?.coins || "0", 10);
          const bonusItemId = parseInt(session.metadata?.bonus_item_id || "0", 10);
          const bonusItemCount = parseInt(session.metadata?.bonus_item_count || "0", 10);
          const premiumItemId = parseInt(session.metadata?.premium_item_id || "0", 10);
          const treasureItemId = parseInt(session.metadata?.treasure_item_id || "0", 10);
          const treasureCount = parseInt(session.metadata?.treasure_count || "0", 10);
          
          if (coins > 0) {
            try {
              // Add donation coins
              await addItemToCharacter(characterName, accountName, DONATE_COIN_ITEM_ID, coins);
              logStep("Coins added successfully", { characterName, accountName, coins });
              
              // Add bonus item (Random Skin Box) if specified
              if (bonusItemId > 0 && bonusItemCount > 0) {
                await addItemToCharacter(characterName, accountName, bonusItemId, bonusItemCount);
                logStep("Bonus item added successfully", { characterName, bonusItemId, bonusItemCount });
              }
              
              // Add premium account item if specified (for packages 1500+)
              if (premiumItemId > 0) {
                await addItemToCharacter(characterName, accountName, premiumItemId, 1);
                logStep("Premium account item added successfully", { characterName, premiumItemId });
              }
              
              // Add Treasures Antharas if specified (for packages 10000+)
              if (treasureItemId > 0 && treasureCount > 0) {
                await addItemToCharacter(characterName, accountName, treasureItemId, treasureCount);
                logStep("Treasures Antharas added successfully", { characterName, treasureItemId, treasureCount });
              }
            } catch (dbError: unknown) {
              const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
              logStep("Database error", { error: errorMessage });
            }

            if (supabaseAdmin) {
              const { error } = await supabaseAdmin.rpc("increment_donation_coins", { _amount: coins });
              if (error) {
                logStep("Failed to increment donation metrics", { error: error.message });
              } else {
                logStep("Donation metrics updated", { coins });
              }
            } else {
              logStep("SUPABASE_SERVICE_ROLE_KEY not configured - metrics not updated");
            }
          }
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

// Donate Coin Item ID in L2
const DONATE_COIN_ITEM_ID = 100108;

async function addItemToCharacter(
  characterName: string | null | undefined, 
  accountName: string | null | undefined, 
  itemId: number,
  count: number
) {
  if (!characterName) {
    throw new Error("No character name provided");
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

    // Get character's charId (object_id)
    const charResult = await client.query(
      `SELECT charId, account_name FROM characters WHERE char_name = ? LIMIT 1`,
      [characterName]
    );

    if (charResult.length === 0) {
      throw new Error(`Character ${characterName} not found`);
    }

    const charId = charResult[0].charId;
    const charAccountName = charResult[0].account_name;
    logStep("Found character", { characterName, charId, accountName: charAccountName });

    // Check if character already has this item in inventory (for stackable items)
    const existingItem = await client.query(
      `SELECT object_id, count FROM items WHERE owner_id = ? AND item_id = ? AND loc = 'INVENTORY' LIMIT 1`,
      [charId, itemId]
    );

    if (existingItem.length > 0) {
      // Update existing item count
      const newCount = existingItem[0].count + count;
      await client.execute(
        `UPDATE items SET count = ? WHERE object_id = ?`,
        [newCount, existingItem[0].object_id]
      );
      logStep("Updated existing item", { charId, itemId, objectId: existingItem[0].object_id, oldCount: existingItem[0].count, newCount });
    } else {
      // Generate a new unique object_id for the item
      const maxIdResult = await client.query(
        `SELECT COALESCE(MAX(object_id), 268435456) + 1 AS next_id FROM items`
      );
      const newObjectId = maxIdResult[0].next_id;

      // Insert new item into character's inventory
      await client.execute(
        `INSERT INTO items (owner_id, object_id, item_id, count, enchant_level, loc, loc_data, custom_type1, custom_type2, mana_left, time) 
         VALUES (?, ?, ?, ?, 0, 'INVENTORY', 0, 0, 0, -1, -1)`,
        [charId, newObjectId, itemId, count]
      );
      logStep("Created new item", { charId, objectId: newObjectId, itemId, count });
    }

    await client.close();
    logStep("Database connection closed - Item added to character inventory!");
    
  } catch (error) {
    try {
      await client.close();
    } catch {
      // ignore close errors
    }
    throw error;
  }
}
