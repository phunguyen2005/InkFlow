import type { Metadata } from "next";
import { StudioProvider } from "@/features/studio/shared/studio-provider";
import { StudioShell } from "@/features/studio/shared/studio-shell";
export const metadata: Metadata = {
  title: {
    default: "Your stories | InkFlow Studio",
    template: "%s | InkFlow Studio",
  },
  description: "A focused space for endless worlds.",
  robots: { index: false, follow: false },
};
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioProvider>
      <StudioShell>{children}</StudioShell>
    </StudioProvider>
  );
}
