/**
 * Create or reset the admin login WITHOUT touching any site content.
 * (Unlike `npm run db:seed`, which wipes and re-seeds every section.)
 *
 * Usage:
 *   DATABASE_URL="<neon-url>" ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="new-strong-password" \
 *     npx tsx scripts/reset-admin.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  // Login matches the email exactly, so store it exactly as you'll type it.
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD.");
  }
  if (password.length < 10) {
    throw new Error("Use a password of at least 10 characters.");
  }

  const prisma = new PrismaClient();
  try {
    const existing = await prisma.user.findMany({ select: { email: true } });
    console.log("Admin accounts currently in the database:", existing.map((u) => u.email).join(", ") || "(none)");

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.upsert({
      where: { email },
      update: { password: hash },
      create: { email, password: hash, role: "admin" },
    });
    console.log(`Done — you can now sign in as ${email}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
