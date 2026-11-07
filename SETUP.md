# Turning on accounts, sync and the Pro tier

The app runs fine with no backend (everything stays in the browser). To enable sign-in, cross-device sync and paid Pro, you need two free accounts — **Supabase** (login + database) and **Stripe** (payments) — and about 30 minutes. Nothing here costs money until someone pays you.

## 1. Supabase (login + database)

1. Create a project at https://supabase.com (free tier). Pick a region near your users.
2. **SQL Editor** → New query → paste the contents of `supabase/schema.sql` → Run.
3. **Authentication → Providers → Email**: keep *Enable email provider* on. Turn **off** *Confirm email* if you want one-tap magic links without a separate confirmation step (optional).
4. **Authentication → URL Configuration**:
   - Site URL: `https://daniele-sicoli.github.io/paperscroll/`
   - Redirect URLs: add the same URL.
5. **Project Settings → API**: copy the **Project URL** and the **anon public** key.
6. Put both into `config.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) and push. The anon key is designed to be public; row-level security in the schema keeps users' data private.

At this point sign-in and sync work. The free plan caps at 3 topics.

## 2. Stripe (payments)

1. Create an account at https://stripe.com and complete the business/payout details (needed before live payments).
2. **Product catalog → Add product**: "PaperScroll Pro", one-time price (e.g. $4.99). A monthly subscription also works — the webhook handles both.
3. **Payment Links → New** → choose the product. Under *After payment*, choose **Don't show confirmation page** → redirect to:
   `https://daniele-sicoli.github.io/paperscroll/#pro-success`
   Keep *Collect customers' email* on.
4. Copy the link (`https://buy.stripe.com/...`) into `config.js` as `STRIPE_PAYMENT_LINK`, and set `PRO_PRICE_LABEL` to match.

The app appends `client_reference_id=<user id>` to the link, which is how the webhook knows whom to upgrade.

## 3. Webhook (connects Stripe to Supabase)

You need the Supabase CLI once: https://supabase.com/docs/guides/cli (`brew install supabase/tap/supabase` on a Mac).

```bash
supabase login
supabase link --project-ref <your-project-ref>      # from the project URL
supabase functions deploy stripe-webhook --no-verify-jwt
```

Then in Stripe → **Developers → Webhooks → Add endpoint**:
- URL: `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `charge.refunded` (and `customer.subscription.deleted` if you sell a subscription)
- Copy the **Signing secret** (`whsec_...`).

Back in the terminal, give the function its secrets (Stripe → Developers → API keys for the secret key):

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_... STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Test it

1. Use Stripe **test mode** first: create a test Payment Link and test webhook the same way, put the test link in `config.js`, and pay with card `4242 4242 4242 4242`.
2. After paying you land back on the app; within a few seconds the 👤 sheet should show **PRO** and the topic limit disappears.
3. Switch the link, secret key and webhook secret to live mode when ready.

## Optional

- `OPENALEX_MAILTO` in `config.js`: put your email to join OpenAlex's "polite pool" — faster, more predictable responses. It is sent only to OpenAlex.
- Refunding a payment in Stripe automatically revokes Pro.
- Costs: Supabase free tier covers tens of thousands of users for this data volume; Stripe takes 2.9% + 30¢ per payment.
