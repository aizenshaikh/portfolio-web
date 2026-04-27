import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SectionRow from "@/components/admin/SectionRow";
import NewSectionForm from "@/components/admin/NewSectionForm";

export const dynamic = "force-dynamic";

export default async function SectionsList() {
  await requireAdmin();
  const sections = await prisma.section.findMany({
    orderBy: { order: "asc" },
  });
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 className="admin-h2" style={{ margin: 0 }}>
          Sections
        </h2>
        <Link href="/" className="admin-btn admin-btn-secondary">
          Preview site
        </Link>
      </div>
      <div className="admin-card">
        <NewSectionForm />
      </div>
      {sections.map((s, i) => (
        <SectionRow
          key={s.id}
          id={s.id}
          type={s.type}
          isVisible={s.isVisible}
          order={s.order}
          isFirst={i === 0}
          isLast={i === sections.length - 1}
        />
      ))}
    </div>
  );
}
