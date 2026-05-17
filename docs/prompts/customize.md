# Prompt: Brand swap

Use this when you've just cloned the starter and want to make it yours.

```
Run /customize. My product is called "Quill". The tagline is "AI-native
note-taking for writers." Accent color: amber. Support email:
hello@quill.app. Domain: quill.app. I want the full walkthrough — brand,
commerce, content. Skip the data model for now; I'll come back to that
once I've decided on the schema.
```

## What happens

`/customize` reads `.claude/skills/customize/SKILL.md` and walks you through:

1. Replaces "SaaS App"/"Surge"/"Your SaaS App" everywhere with "Quill"
2. Updates the favicon + manifest + icon SVGs to the amber accent
3. Updates support email + domain across robots.txt, llms.txt, sitemap
4. Asks for pricing tier names + prices, rewrites `lib/pricing.ts`
5. Diffs your `.env.local` vs `.env.example`, flags missing keys
6. Asks for landing-page copy (hero, subhead, three feature bullets), rewrites the landing page
7. Commits in three logical chunks: `chore(customize): brand swap`, `chore(customize): pricing`, `chore(customize): landing copy`

## Variants

For a quick brand-only pass with no questions:

```
Run /customize --quick. Product: Quill, tagline: AI-native notes,
accent: amber, support: hello@quill.app, domain: quill.app.
```

This skips commerce/content/data steps and only touches the brand layer.
