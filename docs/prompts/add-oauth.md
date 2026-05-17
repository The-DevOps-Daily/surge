# Prompt: Add OAuth login

Adds Google or GitHub sign-in alongside the existing credentials provider.

```
Add Google OAuth login to the existing NextAuth setup. Keep the
credentials provider for users who registered with email/password.

Plan:
1. Add @auth/core's GoogleProvider to src/lib/auth.ts.
2. Add the env vars to .env.example (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET).
3. Add a "Continue with Google" button to /login and /register, styled
   with the existing primitives. Below an "or" divider.
4. On first OAuth signup, create the User row with tier: "free", role:
   "user", and a generated random password (they'll never use it but
   the schema requires it).
5. Wire the auth() callback so the session.user.id is set for OAuth
   users (not just credentials).
6. Update the docs/auth.md doc with setup instructions for the Google
   Cloud Console.

Show me the redirect URI I'll need to register in Google Cloud.
```

## Notes

- The schema has `password` as required (`String`, not `String?`). For OAuth users, generate a random bcrypt hash they'll never use, or relax the field to nullable in a migration (preferred long-term).
- NextAuth v5 doesn't auto-link accounts by email. Decide upfront: do you want users with the same email on Google + credentials to be the same user (link) or different users (separate)? Most SaaSes link.
- If you also want GitHub, add `GithubProvider` the same way. Same env var pattern.
