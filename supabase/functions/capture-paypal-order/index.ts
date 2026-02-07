import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CAPTURE-PAYPAL-ORDER] ${step}${detailsStr}`);
};

const DONATE_COIN_ITEM_ID = 100108;

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const secret = Deno.env.get("PAYPAL_SECRET");

  if (!clientId || !secret) {
    throw new Error("PayPal credentials not configured");
  }

  const baseUrl = "https://api-m.paypal.com";

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${secret}`)}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal auth failed [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function addItemToCharacter(
  characterName: string,
  accountName: string | null | undefined,
  itemId: number,
  count: number
) {
  const host = Deno.env.get("L2_MYSQL_HOST");
  const port = parseInt(Deno.env.get("L2_MYSQL_PORT") || "3306");
  const database = Deno.env.get("L2_MYSQL_DATABASE");
  const username = Deno.env.get("L2_MYSQL_USER");
  const password = Deno.env.get("L2_MYSQL_PASSWORD");

  if (!host || !database || !username || !password) {
    throw new Error("Missing MySQL configuration");
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

    const charResult = await client.query(
      `SELECT charId, account_name FROM characters WHERE char_name = ? LIMIT 1`,
      [characterName]
    );

    if (charResult.length === 0) {
      throw new Error(`Character ${characterName} not found`);
    }

    const charId = charResult[0].charId;
    logStep("Found character", { characterName, charId });

    const existingItem = await client.query(
      `SELECT object_id, count FROM items WHERE owner_id = ? AND item_id = ? AND loc = 'INVENTORY' LIMIT 1`,
      [charId, itemId]
    );

    if (existingItem.length > 0) {
      const newCount = existingItem[0].count + count;
      await client.execute(
        `UPDATE items SET count = ? WHERE object_id = ?`,
        [newCount, existingItem[0].object_id]
      );
      logStep("Updated existing item", { charId, itemId, newCount });
    } else {
      const maxIdResult = await client.query(
        `SELECT COALESCE(MAX(object_id), 268435456) + 1 AS next_id FROM items`
      );
      const newObjectId = maxIdResult[0].next_id;

      await client.execute(
        `INSERT INTO items (owner_id, object_id, item_id, count, enchant_level, loc, loc_data, custom_type1, custom_type2, mana_left, time) 
         VALUES (?, ?, ?, ?, 0, 'INVENTORY', 0, 0, 0, -1, -1)`,
        [charId, newObjectId, itemId, count]
      );
      logStep("Created new item", { charId, objectId: newObjectId, itemId, count });
    }

    await client.close();
    logStep("Item delivered successfully!");
  } catch (error) {
    try { await client.close(); } catch { /* ignore */ }
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Authenticate user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: userData.user.id });

    const { orderId } = await req.json();
    if (!orderId) throw new Error("Order ID is required");

    logStep("Capturing order", { orderId });

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    const baseUrl = "https://api-m.paypal.com";

    // Capture the order
    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      throw new Error(`PayPal capture failed [${captureResponse.status}]: ${errorText}`);
    }

    const captureData = await captureResponse.json();
    logStep("Order captured", { status: captureData.status });

    if (captureData.status !== "COMPLETED") {
      throw new Error(`Payment not completed. Status: ${captureData.status}`);
    }

    // Parse custom_id from the purchase unit
    const customIdStr = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id
      || captureData.purchase_units?.[0]?.custom_id;

    if (!customIdStr) {
      throw new Error("No metadata found in order");
    }

    let metadata: any;
    try {
      metadata = JSON.parse(customIdStr);
    } catch {
      throw new Error("Failed to parse order metadata");
    }

    logStep("Order metadata", metadata);

    const characterName = metadata.character_name;
    const accountName = metadata.account_name;

    // Initialize Supabase admin for metrics
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAdmin = supabaseUrl && serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
      : null;

    if (metadata.type === "starter_pack") {
      const itemId = metadata.item_id;
      const packId = metadata.pack_id;

      if (itemId > 0) {
        await addItemToCharacter(characterName, accountName, itemId, 1);
        logStep("Starter pack delivered", { characterName, packId, itemId });

        // Update metrics
        if (supabaseAdmin && packId) {
          const amountCents = Math.round(
            parseFloat(captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || "0") * 100
          );
          await supabaseAdmin.rpc("increment_starter_pack_sale", {
            _pack_id: packId,
            _amount: amountCents,
          });
          logStep("Starter pack metrics updated");
        }
      }
    } else {
      // Donation coins
      const coins = parseInt(metadata.coins || "0", 10);
      const bonusItemId = parseInt(metadata.bonus_item_id || "0", 10);
      const bonusItemCount = parseInt(metadata.bonus_item_count || "0", 10);
      const premiumItemId = parseInt(metadata.premium_item_id || "0", 10);
      const treasureItemId = parseInt(metadata.treasure_item_id || "0", 10);
      const treasureCount = parseInt(metadata.treasure_count || "0", 10);

      if (coins > 0) {
        await addItemToCharacter(characterName, accountName, DONATE_COIN_ITEM_ID, coins);
        logStep("Coins delivered", { characterName, coins });

        if (bonusItemId > 0 && bonusItemCount > 0) {
          await addItemToCharacter(characterName, accountName, bonusItemId, bonusItemCount);
          logStep("Bonus item delivered", { bonusItemId, bonusItemCount });
        }

        if (premiumItemId > 0) {
          await addItemToCharacter(characterName, accountName, premiumItemId, 1);
          logStep("Premium item delivered", { premiumItemId });
        }

        if (treasureItemId > 0 && treasureCount > 0) {
          await addItemToCharacter(characterName, accountName, treasureItemId, treasureCount);
          logStep("Treasures delivered", { treasureItemId, treasureCount });
        }

        // Update donation metrics
        if (supabaseAdmin) {
          await supabaseAdmin.rpc("increment_donation_coins", { _amount: coins });
          logStep("Donation metrics updated");
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      status: "COMPLETED",
      orderId: captureData.id 
    }), {
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
