import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs/promises";

// Vercel's filesystem is ephemeral in production, so real deploys need
// Blob storage. Locally there's usually no BLOB_READ_WRITE_TOKEN, so fall
// back to writing into public/uploads/ for a working dev experience.
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  const alt = (form.get("alt") as string) || "";
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (10MB max)" }, { status: 400 });
  }
  const ext = path.extname(file.name) || ".bin";
  const safeExt = ext.replace(/[^.a-zA-Z0-9]/g, "");
  const filename = `${crypto.randomBytes(8).toString("hex")}${safeExt}`;
  const type = file.type.startsWith("video/") ? "video" : "image";

  let url: string;
  if (useBlob) {
    const blob = await put(`uploads/${filename}`, file, {
      access: "public",
      contentType: file.type || undefined,
    });
    url = blob.url;
  } else {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadsDir, filename), bytes);
    url = `/uploads/${filename}`;
  }

  const media = await prisma.media.create({
    data: { url, alt, type },
  });
  return NextResponse.json({ media });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Delete the underlying file first, then the DB record
  if (media.url.startsWith("/uploads/")) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", media.url));
    } catch {
      // File may already be gone — continue with DB delete
    }
  } else {
    try {
      await del(media.url);
    } catch {
      // Blob may not exist (e.g. external URL) — continue with DB delete
    }
  }
  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
