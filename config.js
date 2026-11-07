// PaperScroll deployment config.
// Leave the Supabase values empty to run without accounts (local-only mode).
window.PAPERSCROLL_CONFIG = {
  SUPABASE_URL: "",          // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: "",     // Supabase → Project Settings → API → anon public key (safe to expose)
  STRIPE_PAYMENT_LINK: "",   // e.g. "https://buy.stripe.com/xxxx"
  PRO_PRICE_LABEL: "$4.99 once",
  OPENALEX_MAILTO: ""         // optional: your email → OpenAlex "polite pool" (faster, more reliable responses)
};
