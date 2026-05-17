# Prompt: Add outbound webhooks

Let your users subscribe to webhook deliveries for app events.

```
Add an outbound-webhooks feature so my users can register endpoint URLs
that we POST to when their data changes. Pro and above only.

Plan:
1. Add WebhookSubscription model: id, userId, url, events (string[]),
   signingSecret, active, createdAt. Index on userId.
2. Add WebhookDelivery model: id, subscriptionId, event, payload (json),
   statusCode, attemptCount, deliveredAt, nextRetryAt. Index on
   subscriptionId.
3. Create lib/webhooks.ts with a deliver(subscriptionId, event, payload)
   helper that signs the payload with HMAC-SHA256 using signingSecret
   and POSTs to url with X-Webhook-Signature header.
4. Add retry logic: exponential backoff up to 5 attempts. Failed
   deliveries scheduled for nextRetryAt; a cron route hits them.
5. Add /api/webhooks CRUD route for users to manage their subscriptions
   (gated to paid tiers).
6. Add /settings/webhooks page with list + add/remove modal +
   regenerate-secret action.
7. Wire user/delete to cascade WebhookSubscription and WebhookDelivery
   rows.
8. Add tests for the HMAC signing helper (pure function, easy to test).

Use the /add-api-route skill for the CRUD route. Use the
admin-table-page.tsx pattern for the management UI.
```

## Notes

- Don't deliver synchronously inside the triggering request — that adds latency and can fail under retry. Queue the delivery and let the cron worker handle it. For local dev a setTimeout is fine; for prod, switch to a real queue (BullMQ, Inngest, or QStash).
- The HMAC signing is the security guarantee. The signingSecret is per-subscription. If a customer's endpoint is compromised, they regenerate the secret and old deliveries become unverifiable.
