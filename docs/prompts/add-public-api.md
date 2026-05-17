# Prompt: Add a public API + API keys

Let your users programmatically access your app. Common ask for any B2B SaaS.

```
Add a programmatic API tier:

1. Add ApiKey model: id, userId, prefix, hashedKey (bcrypt), name,
   lastUsedAt, createdAt, revokedAt. Index on prefix (8 chars, for
   fast lookup) and userId.
2. Add /settings/api-keys page where Pro+ users can create, name, copy,
   and revoke keys. Show the plaintext key once on creation only —
   storage is the bcrypt hash.
3. Add /api/v1/* namespace with a getApiAuth(req) helper that reads
   Authorization: Bearer sk_..., looks up the prefix, bcrypt-compares,
   updates lastUsedAt, returns the userId. Rate-limit by key, not IP
   (paid users get higher caps).
4. First v1 endpoints: /api/v1/me (returns user info, free), /api/v1/...
   (your real resource — add via /add-api-route).
5. Add OpenAPI spec entries for v1 routes. The /api/openapi.json route
   already auto-generates from filesystem; just make sure the v1
   handlers export a description comment.
6. Add docs/api.md with curl examples for the v1 endpoints.

Convention: prefix sk_live_ for prod keys, sk_test_ for test keys
(switch on NODE_ENV).
```

## Why prefix-then-hash

If you bcrypt the full key, looking up the row requires comparing against every key in the DB. With a 8-char prefix index, you can fetch the candidate row in O(log n) and then bcrypt-verify just that one. Stripe and most other SaaSes use this pattern.

## Notes

- Don't log the full Authorization header in error paths. Don't ship the key in URL query strings — header-only.
- Free tier shouldn't get API keys at all (or get heavily rate-limited test-only keys). Gate the creation flow on `isPaid`.
