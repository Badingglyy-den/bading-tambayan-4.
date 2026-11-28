# Bading Tambayan chat push setup

The website-side push subscription and service-worker handlers are ready. True notifications while the app is fully closed require the Supabase database table and Edge Function below. GitHub Pages cannot deploy these backend resources.

## 1. Create the subscription table

In Supabase Dashboard → SQL Editor → New query, paste and run the contents of:

`supabase/migrations/202611280001_chat_push_subscriptions.sql`

This creates a private per-user subscription table with row-level security. It does not modify player progress, stars, inventory, chat messages, or room membership.

## 2. Deploy the Edge Function

In Supabase Dashboard → Edge Functions, create a function named `send-chat-push`. Use the source from:

`supabase/functions/send-chat-push/index.ts`

Keep JWT verification enabled. The function validates the signed-in sender and room membership before sending alerts to other room members who opted in.

## 3. Add Edge Function secrets

In Supabase Dashboard → Edge Functions → Secrets, add:

- `VAPID_PUBLIC_KEY`: the public key shown in the website's `multiplayer.js` as `PUSH_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`: the matching private key supplied by the project owner; keep it secret and never commit it to GitHub
- `VAPID_SUBJECT`: `https://badingglyy-den.github.io/bading-tambayan-4./`

Supabase provides the project URL, anon key, and service-role key to Edge Functions automatically.

## 4. Enable on each device

After the SQL migration and function are deployed, open Bading Tambayan, sign in, open Online Tambayan, and tap **Enable chat notifications**.

On iPhone, first add the website to the Home Screen in Safari, then launch the installed Bading Tambayan icon and enable notifications from inside Online Tambayan. iOS web push requires iOS/iPadOS 16.4 or later and a Home Screen web app.

## Notes

- Each friend must opt in on each device.
- Notifications are sent for new text messages and photo messages in rooms they belong to.
- Push delivery requires an internet connection and permission from the device/browser.
- Existing in-page unread counts and foreground chat remain available.
- If the backend setup is not complete, the push button can register a subscription but messages cannot be delivered while the app is closed.
