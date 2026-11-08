# PaperScroll

A phone-friendly feed for doomscrolling research papers on the topics you care about.

**Live app:** https://daniele-sicoli.github.io/paperscroll/

## What it does

- Type topics or keywords; each is searched on [OpenAlex](https://openalex.org), [Semantic Scholar](https://www.semanticscholar.org), [Crossref](https://www.crossref.org) and optionally [Europe PMC](https://europepmc.org) and [NASA ADS](https://ui.adsabs.harvard.edu) (free token) — arXiv preprints plus journals — with duplicates merged. Sources are toggleable.
- Swipe through one paper per screen: venue, date, citations, authors, abstract, with **Open** / **PDF** / **Save** / **Copy**.
- Keyword variants are matched automatically (thermosphere ≈ thermospheric) and papers are kept only when the keywords appear close together in the title or abstract. Quotes and AND / OR / NOT give you exact control.
- Follow journals, authors or institutions: `journal:Nature`, `author:Daniele Sicoli`, `institution:MIT`, or filter inside one with `journal:Nature | space weather`.
- **Landscape** (📊): for any topic, a one-screen map of the field — publication trend, most-cited papers of all time and of the last 3 years, recent reviews, leading authors and institutions (tap to follow), and related keywords (tap to add).
- Sort by newest, most cited, or relevance.
- ▶︎ Play all reads abstracts one after another, advancing the feed like a podcast; swipe to skip. 🔊 Listen reads the abstract aloud with the phone's voice; 🎧 Full paper sends the PDF to a reader app of your choice (ElevenLabs Reader, Speechify, NotebookLM…) via the share sheet.
- Infinite scroll, skips what you've already seen, and a saved list — all stored locally in your browser. Export saved papers as BibTeX (for Zotero) or as a JSON backup you can import on another device. Nothing is sent anywhere except the search queries to OpenAlex.

## OpenAlex quota

OpenAlex gives each connection roughly 100 free searches per day without a key (resets at midnight UTC). Each topic page is one search, and results are cached for 3 hours, so normal use fits comfortably. Heavy users can paste a free OpenAlex API key (≈1,000 searches/day) under **Topics → OpenAlex API key**; it never leaves their device.

## Use it on your phone

Open the link in Safari or Chrome → Share → **Add to Home Screen**.

## Run your own copy

It's a single `index.html` with no build step. Fork the repo, enable GitHub Pages (Settings → Pages → Source: GitHub Actions), and the included workflow deploys it.

## Accounts & sync (optional, free)

Sign-in and cross-device sync run on Supabase (free tier). See [SETUP.md](SETUP.md). Without it the app works fully, storing everything in the browser.

## Being a good API citizen

Everything is free for users; the only limits are there to avoid stressing the public APIs: up to 12 topics, results cached for 3 hours, refresh at most every 20 s, and at most 6 concurrent requests.

## License

[MIT](LICENSE)
