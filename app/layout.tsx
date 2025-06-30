import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { MaterialThemeProvider } from "@/shared/providers/MaterialThemeProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { AuthProvider } from "@/shared/providers/AuthProvider";
import { ReduxProvider } from "@/shared/providers/ReduxProvider";
import { QueryProvider } from "@/shared/providers/QueryProvider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coordinadora App",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body
        cz-shortcut-listen="true"
        suppressHydrationWarning
        className={`${roboto.variable} antialiased`}
      >
        <ReduxProvider>
          <QueryProvider>
            <SessionProvider session={session}>
              <AuthProvider session={session}>
                <MaterialThemeProvider>{children}</MaterialThemeProvider>
              </AuthProvider>
            </SessionProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
