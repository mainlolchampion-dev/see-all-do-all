import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYPAL-ORDER] ${step}${detailsStr}`);
};

// Starter Pack definitions
const STARTER_PACK_ITEMS: Record<string, { itemId: number; name: string; priceAmount: number }> = {
  basic: { itemId: 600623, name: "Basic Starter Pack", priceAmount: 999 },
  improved: { itemId: 600624, name: "Improved Starter Pack", priceAmount: 1499 },
  premium: { itemId: 600625, name: "Premium Starter Pack", priceAmount: 1999 },
  elite: { itemId: 600626, name: "Elite Starter Pack", priceAmount: 2499 },
};

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const secret = Deno.env.get("PAYPAL_SECRET");

  if (!clientId || !secret) {
    throw new Error("PayPal credentials not configured");
  }

  const baseUrl = "https://api-m.sandbox.paypal.com";

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

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    const body = await req.json();
    const { type, characterName, accountName } = body;

    if (!characterName || !characterName.trim()) {
      throw new Error("Character name is required");
    }

    // Validate account ownership
    const linkedLogin = (user.user_metadata?.l2_login || "").toString().toLowerCase();
    if (linkedLogin && accountName && accountName.toLowerCase() !== linkedLogin) {
      throw new Error("Character does not belong to your account");
    }

    const origin = req.headers.get("origin") || "https://see-all-do-all.lovable.app";
    let description: string;
    let amountValue: string;
    let customId: string;

    if (type === "starter_pack") {
      const { packId } = body;
      const packInfo = STARTER_PACK_ITEMS[packId];
      if (!packInfo) throw new Error(`Invalid pack ID: ${packId}`);

      description = `${packInfo.name} for character: ${characterName}`;
      amountValue = (packInfo.priceAmount / 100).toFixed(2);
      customId = JSON.stringify({
        user_id: user.id,
        type: "starter_pack",
        pack_id: packId,
        item_id: packInfo.itemId,
        character_name: characterName.trim(),
        account_name: accountName || "",
      });

      logStep("Starter pack order", { packId, packInfo, characterName });
    } else {
      // Donation coins
      const { coins, amount, premiumItemId, premiumDays, treasureItemId, treasureCount } = body;

      if (!coins || coins < 100) throw new Error("Minimum 100 coins required");
      if (!amount || amount < 100) throw new Error("Minimum amount is 1 EUR");

      const bonusCoins = Math.floor(coins * 0.10);
      const totalCoins = coins + bonusCoins;

      description = `${totalCoins.toLocaleString()} Donation Coins (${coins.toLocaleString()} + ${bonusCoins.toLocaleString()} bonus) for: ${characterName}`;
      amountValue = (amount / 100).toFixed(2);
      customId = JSON.stringify({
        user_id: user.id,
        type: "donation_coins",
        coins: totalCoins,
        base_coins: coins,
        bonus_coins: bonusCoins,
        character_name: characterName.trim(),
        account_name: accountName || "",
        bonus_item_id: "100111",
        bonus_item_count: "1",
        premium_item_id: premiumItemId || "",
        premium_days: premiumDays?.toString() || "",
        treasure_item_id: treasureItemId || "",
        treasure_count: treasureCount?.toString() || "",
      });

      logStep("Coin order", { coins, totalCoins, amount: amountValue, characterName });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    logStep("PayPal access token obtained");

    const baseUrl = "https://api-m.sandbox.paypal.com";

    // Build return/cancel URLs
    const returnUrl = type === "starter_pack"
      ? `${origin}/ucp?tab=starter-packs&paypal_success=true`
      : `${origin}/ucp?tab=donate&paypal_success=true`;
    const cancelUrl = type === "starter_pack"
      ? `${origin}/ucp?tab=starter-packs&paypal_canceled=true`
      : `${origin}/ucp?tab=donate&paypal_canceled=true`;

    // Create PayPal order
    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          description: description.substring(0, 127),
          custom_id: customId.substring(0, 255),
          amount: {
            currency_code: "EUR",
            value: amountValue,
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            brand_name: "L2 AllStars",
            locale: "en-US",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
        },
      },
    };

    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      throw new Error(`PayPal order creation failed [${orderResponse.status}]: ${errorText}`);
    }

    const orderData = await orderResponse.json();
    const approvalLink = orderData.links?.find((l: any) => l.rel === "payer-action")?.href
      || orderData.links?.find((l: any) => l.rel === "approve")?.href;

    logStep("PayPal order created", { orderId: orderData.id, approvalLink });

    return new Response(JSON.stringify({ 
      orderId: orderData.id, 
      approvalUrl: approvalLink 
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
