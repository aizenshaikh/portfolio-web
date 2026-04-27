import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthSessionProvider from "@/components/admin/SessionProvider";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <AuthSessionProvider>
      <AdminShell email={session?.user?.email ?? null}>{children}</AdminShell>
    </AuthSessionProvider>
  );
}
