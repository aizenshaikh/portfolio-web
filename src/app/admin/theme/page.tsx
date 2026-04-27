import { requireAdmin } from "@/lib/session";
import { getTheme } from "@/lib/content";
import ThemeEditor from "@/components/admin/ThemeEditor";

export const dynamic = "force-dynamic";

export default async function ThemePage() {
  await requireAdmin();
  const theme = await getTheme();
  return (
    <div>
      <h2 className="admin-h2">Theme</h2>
      <ThemeEditor theme={theme} />
    </div>
  );
}
