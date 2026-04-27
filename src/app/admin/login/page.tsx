import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <h2 className="admin-h2" style={{ marginBottom: 4 }}>
          AMIN<span style={{ color: "var(--accent)" }}>.</span> CMS
        </h2>
        <p style={{ color: "var(--grey)", fontSize: 14, marginBottom: 24 }}>
          Sign in to manage your portfolio.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
