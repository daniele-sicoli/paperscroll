# Turning on accounts and sync

The app runs fine with no backend (everything stays in the browser). To enable sign-in and cross-device sync you need a free **Supabase** project and about 15 minutes.

## 1. Supabase (login + database)

1. Create a project at https://supabase.com (free tier). Pick a region near your users.
2. **SQL Editor** → New query → paste the contents of `supabase/schema.sql` → Run.
3. **Authentication → Providers → Email**: keep *Enable email provider* on. Turn **off** *Confirm email* if you want one-tap magic links without a separate confirmation step (optional).
4. **Authentication → URL Configuration**:
   - Site URL: `https://daniele-sicoli.github.io/paperscroll/`
   - Redirect URLs: add the same URL.
5. **Project Settings → API**: copy the **Project URL** and the **anon public** key.
6. Put both into `config.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) and push. The anon key is designed to be public; row-level security in the schema keeps users' data private.

At this point sign-in and sync work.

## 2. Payments (not enabled)

The app is fully free. The Stripe webhook in `supabase/functions/stripe-webhook/` and the `profiles.is_pro` column are kept for the future and are unused; nothing in the app references them.
