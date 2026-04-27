import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import SectionEditor from "@/components/admin/SectionEditor";

export const dynamic = "force-dynamic";

export default async function EditSection({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const section = await prisma.section.findUnique({
    where: { id },
    include: { blocks: { orderBy: { key: "asc" } } },
  });
  if (!section) notFound();
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Link href="/admin/sections" className="admin-nav-link">
          ← Back to sections
        </Link>
      </div>
      <h2 className="admin-h2">
        Edit: {section.type.toUpperCase()}
      </h2>
      <SectionEditor
        sectionId={section.id}
        type={section.type}
        blocks={section.blocks.map((b) => ({ key: b.key, value: b.value }))}
      />
    </div>
  );
}
