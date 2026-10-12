import type { Metadata } from "next";
import {
  Anton,
  Cormorant_Garamond,
  Inter,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";
import { AccountProvider } from "@/features/account/account-provider";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const editorial = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});
const ui = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});
const prose = Source_Serif_4({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-prose",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "InkFlow Library | Stories beyond imagination",
    template: "%s | InkFlow",
  },
  description:
    "Discover original serial fiction. Find your next world in the InkFlow demo catalog.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${editorial.variable} ${ui.variable} ${prose.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <AccountProvider>{children}</AccountProvider>
      </body>
    </html>
  );
}
