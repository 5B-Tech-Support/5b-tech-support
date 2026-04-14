# 5B Tech Support

A tutorial platform that helps non-tech-savvy people with Windows tech issues through organized written guides and email support.

**Stack:** Next.js 16 (App Router), TypeScript, Supabase (auth + Postgres), Stripe, Tailwind CSS, deployed on Vercel.

## Getting Started

```bash
cp .env.example .env.local   # fill in your keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [`.env.example`](.env.example) for all required values. Key ones:

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page, "anon / public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page, "service_role" key (keep secret) |
| `STRIPE_SECRET_KEY` | Stripe dashboard > Developers > API keys |
| `STRIPE_PRICE_PRO` | Stripe dashboard > Products > Pro plan price ID |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard > Developers > Webhooks |
| `NEXT_PUBLIC_APP_URL` | Your production URL (e.g. `https://5btechsupport.com`) |

## Supabase Auth Setup

For email verification and password reset to work:

1. In **Supabase Dashboard > Authentication > URL Configuration**:
   - **Site URL:** `https://your-domain.com` (or `http://localhost:3000` for dev)
   - **Redirect URLs:** add `https://your-domain.com/api/auth/callback` and `http://localhost:3000/api/auth/callback`

2. Run the database schema against your Supabase project:
   - Go to **SQL Editor** in your Supabase dashboard
   - Paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql)

3. Create a **Supabase Storage bucket** called `support-attachments` (for ticket file uploads).

## Stripe Setup

1. Create a product with a recurring $3.99/month price in Stripe.
2. Copy the price ID to `STRIPE_PRICE_PRO`.
3. Set up a webhook endpoint pointing to `https://your-domain.com/api/billing/webhook` listening for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

## Deploy

Push to GitHub and import to [Vercel](https://vercel.com). Framework preset: **Next.js** (auto-detected). Set environment variables in Vercel project settings.
