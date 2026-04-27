import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import path from "node:path";
import crypto from "node:crypto";

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
  const name = `uploads/${crypto.randomBytes(8).toString("hex")}${safeExt}`;
  const blob = await put(name, file, {
    access: "public",
    contentType: file.type || undefined,
  });
  const type = file.type.startsWith("video/") ? "video" : "image";
  const media = await prisma.media.create({
    data: { url: blob.url, alt, type },
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
  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
