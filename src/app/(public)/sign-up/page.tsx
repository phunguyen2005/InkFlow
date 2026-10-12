import { AuthForm } from "@/features/account/auth-form";
import { LibraryShell } from "@/features/library/components/navigation/site-header";

export default function SignUpPage() {
  return (
    <LibraryShell>
      <main id="main" className="page-width auth-page">
        <AuthForm mode="sign-up" />
      </main>
    </LibraryShell>
  );
}
