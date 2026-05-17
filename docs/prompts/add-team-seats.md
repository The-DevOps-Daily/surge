# Prompt: Add team seats

Turn the single-user model into a team-with-seats model.

```
Convert the "family" tier into a real team-with-seats model. The team
owner has billing + admin rights. Members have access to the shared
workspace but can't change the plan.

Plan:
1. Add a Workspace model to schema.prisma (id, name, ownerId, plan,
   stripeCustomerId, stripeSubscriptionId, seatLimit, createdAt). One
   workspace per Stripe subscription.
2. Add a WorkspaceMember join model (id, workspaceId, userId, role:
   "owner" | "admin" | "member", invitedAt, acceptedAt). Indexed on
   both workspaceId and userId.
3. Migrate existing free/pro users into single-member workspaces with
   ownerId = userId. Show me the migration SQL — I'll run it.
4. Add /workspace/settings page (only owners see billing controls).
5. Add /workspace/members page with invite-by-email flow. Email sent
   via lib/email.ts using emailLayout.
6. Wire api/stripe/webhook to update workspace.plan, not user.tier, on
   subscription events. Backwards-compat: keep user.tier mirrored from
   workspace.plan for now.
7. Update tier-gated pages: tier comes from session.workspace.plan,
   not session.user.tier.
8. Update api/user/delete to handle the case where the user is a
   workspace owner (transfer ownership or delete the workspace?).

Ask me to decide on the ownership-transfer behavior before writing
that part.
```

## Why this is a big change

This rewires the central abstraction from User-as-customer to
Workspace-as-customer. Every tier-gated route needs touching. Don't try
to do it in one sitting — the prompt asks Claude to *plan* first and
ask before the destructive transfer-ownership decision. That's the
right shape for a refactor this size.
