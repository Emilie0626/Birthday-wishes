# Birthday Wishes App

## Stack
- **Frontend**: Vue 3, Vite, PocketBase JS SDK
- **Backend**: PocketBase hosted on Railway (Singapore), dev + prod environments
- **No local backend needed**: local dev points `.env` at the Railway dev PocketBase URL

The only file that interacts with PocketBase is `src/data/birthdayStore.js`. The client singleton is in `src/lib/pb.js`.

## PocketBase Schema Management

**Schema is managed manually via the PocketBase admin UI by @danendz. There are no code migrations.**

When a feature requires a new collection or new fields on an existing collection:

1. Do NOT write frontend code that assumes the new schema already exists.
2. Stop and tell the developer exactly what is needed:
   - Collection name (new or existing)
   - Each field: name, type (text/bool/number/etc.), required or optional, any constraints (max length, etc.)
   - API rules: who should be able to list / view / create / update / delete
   - Whether the change is needed in dev, prod, or both environments
3. The developer will pass this spec to @danendz to apply in the PocketBase admin UI.
4. Only after the schema is confirmed as updated should you write the frontend code.

## Current Schema

**Collections: `wishes` (prod) and `wishes_dev` (dev) — identical schema, selected via `VITE_PB_COLLECTION` env var**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `message` | Text | Yes | Max 200 chars |
| `name` | Text | No | Max 20 chars |
| `is_public` | Bool | No | — |

API rules: List ✓  View ✓  Create ✓  Update ✗  Delete ✗

PocketBase auto-adds `id`, `created`, `updated` to every record.

**Field name mapping** (handled in `mapWish` inside `src/data/birthdayStore.js`):
- `is_public` → `isPublic`
- `created` → `createdAt`

All Vue components use the mapped camelCase names. Only `birthdayStore.js` uses the raw PocketBase field names.
