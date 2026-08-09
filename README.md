# Portfolio

Next.js 15 + Prisma + NextAuth portfolio CMS with admin panel and gallery.

## Local development

```bash
npm install
cp .env.example .env   # then fill in real values
npm run db:seed        # creates admin user + initial sections
npm run dev
```

Open http://localhost:3000 — admin panel at `/admin/login`.

> **Local dev currently runs on SQLite** (`prisma/dev.db`, `DATABASE_URL="file:./dev.db"` in `.env`), and `prisma/schema.prisma`'s datasource `provider` is set to `"sqlite"` to match.

## Deploying to Vercel + Neon

This app needs Postgres. Free tier of Neon + Vercel covers it.

> ⚠️ **Before deploying**: `prisma/schema.prisma` must have `provider = "postgresql"`, not `"sqlite"`. The `vercel-build` script runs `prisma db push` against the Postgres `DATABASE_URL` set in Vercel — if the schema still says `sqlite`, that push (and the whole build) fails. Flip the provider back to `postgresql` right before pushing to the branch Vercel deploys from, then back to `sqlite` to keep developing locally.

### 1. Create a Neon Postgres database
1. Go to https://neon.tech and sign up with GitHub
2. Create a new project (any region close to you)
3. Copy the **connection string** (starts with `postgresql://...?sslmode=require`)

### 2. Import the repo on Vercel
1. Go to https://vercel.com and sign up with GitHub
2. **Import Project** → pick `aizenshaikh/portfolio-web`
3. Framework preset: **Next.js** (auto-detected)
4. **Root Directory**: leave as repo root
5. Add Environment Variables (all five):

| Name              | Value                                                              |
|-------------------|--------------------------------------------------------------------|
| `DATABASE_URL`    | (paste the Neon connection string)                                 |
| `NEXTAUTH_SECRET` | (run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `NEXTAUTH_URL`    | `https://<your-vercel-url>.vercel.app` (set after first deploy)    |
| `ADMIN_EMAIL`     | your email                                                         |
| `ADMIN_PASSWORD`  | a strong password                                                  |

6. Click **Deploy** — first build runs `prisma db push` which creates all tables in Neon.

### 3. Seed the admin user (one-time)
After the first deploy, run locally to create the admin user in Neon:

```bash
DATABASE_URL="<neon-url>" \
ADMIN_EMAIL="<your-email>" \
ADMIN_PASSWORD="<your-password>" \
npm run db:seed
```

### 4. Update `NEXTAUTH_URL`
Once Vercel gives you the live URL, update `NEXTAUTH_URL` in Vercel project settings to match it, then redeploy. Otherwise admin login will fail.

## Known limitations on Vercel

- **Uploads via admin panel are ephemeral** — `public/uploads/` is wiped on every deploy. For production media, switch to Vercel Blob, Cloudinary, or S3 (in `src/app/api/media/route.ts`).
