// Stripe → Supabase webhook: marks a user as Pro after a successful checkout.
// Deploy:  supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_... STRIPE_WEBHOOK_SECRET=whsec_...
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.)

import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-12-18.acacia" });
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(body, sig, Deno.env.get("STRIPE_WEBHOOK_SECRET")!);
  } catch (err) {
    return new Response(`bad signature: ${(err as Error).message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.client_reference_id;
        if (!userId) break;
        const { error } = await supabase.from("profiles").upsert({
          user_id: userId,
          is_pro: true,
          stripe_customer_id: typeof s.customer === "string" ? s.customer : s.customer?.id ?? null,
          stripe_session_id: s.id,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
        break;
      }
      // Only relevant if you sell Pro as a subscription instead of a one-time purchase.
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const { error } = await supabase.from("profiles")
          .update({ is_pro: false, updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customer);
        if (error) throw error;
        break;
      }
      // Refund of a one-time purchase → revoke Pro.
      case "charge.refunded": {
        const ch = event.data.object as Stripe.Charge;
        const customer = typeof ch.customer === "string" ? ch.customer : ch.customer?.id;
        if (customer) {
          const { error } = await supabase.from("profiles")
            .update({ is_pro: false, updated_at: new Date().toISOString() })
            .eq("stripe_customer_id", customer);
          if (error) throw error;
        }
        break;
      }
    }
  } catch (err) {
    console.error(err);
    return new Response("handler error", { status: 500 });
  }
  return new Response(JSON.stringify({ received: true }), { headers: { "content-type": "application/json" } });
});
