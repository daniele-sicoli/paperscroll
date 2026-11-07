# PaperScroll

A phone-friendly feed for doomscrolling research papers on the topics you care about.

**Live app:** https://daniele-sicoli.github.io/paperscroll/

## What it does

- Type topics or keywords; each is searched on [OpenAlex](https://openalex.org), [Semantic Scholar](https://www.semanticscholar.org), [Crossref](https://www.crossref.org) and optionally [Europe PMC](https://europepmc.org) — arXiv preprints plus journals — with duplicates merged. Sources are toggleable.
- Swipe through one paper per screen: venue, date, citations, authors, abstract, with **Open** / **PDF** / **Save** / **Copy**.
- Keyword variants are matched automatically (thermosphere ≈ thermospheric) and papers are kept only when the keywords appear close together in the title or abstract. Quotes and AND / OR / NOT give you exact control.
- Sort by newest, most cited, or relevance; mix topics or view one at a time.
- Infinite scroll, skips what you've already seen, and a saved list — all stored locally in your browser. Nothing is sent anywhere except the search queries to OpenAlex.

## OpenAlex quota

OpenAlex gives each connection roughly 100 free searches per day without a key (resets at midnight UTC). Each topic page is one search, and results are cached for 3 hours, so normal use fits comfortably. Heavy users can paste a free OpenAlex API key (≈1,000 searches/day) under **Topics → OpenAlex API key**; it never leaves their device.

## Use it on your phone

Open the link in Safari or Chrome → Share → **Add to Home Screen**.

## Run your own copy

It's a single `index.html` with no build step. Fork the repo, enable GitHub Pages (Settings → Pages → Source: GitHub Actions), and the included workflow deploys it.

## Pro tier & accounts

Optional sign-in, cross-device sync and a paid Pro tier (unlimited topics) run on Supabase + Stripe. See [SETUP.md](SETUP.md).

## License

[MIT](LICENSE)
