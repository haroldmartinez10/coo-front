"use client";

import * as React from "react";
import { createTheme, styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider, Navigation, Router } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { TOOLPAD_THEME_CONFIG } from "@/shared/constants/theme";
import { useAppSelector } from "@/shared/hooks/reduxHooks";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "quotes",
    title: "Cotización",
    icon: <DashboardIcon />,
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
    pattern: "orders{/:id}*",
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme(TOOLPAD_THEME_CONFIG);

function useNextRouter(): Router {
  const pathname = usePathname();
  const router = useRouter();

  const nextRouter = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => {
        router.push(String(path));
      },
    };
  }, [pathname, router]);

  return nextRouter;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useNextRouter();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  const BRANDING = {
    logo: <Image src="/coo-logo.svg" alt="COO Logo" width={150} height={150} />,
    title: "",
  };

  const AUTHENTICATION = {
    signIn: () => {},
    signOut: handleSignOut,
  };

  const user = useAppSelector((state) => {
    return state.auth.user?.name;
  });

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={BRANDING}
      authentication={AUTHENTICATION}
      session={{ user: { name: user || "" } }}
    >
      <DashboardLayout>{children}</DashboardLayout>
    </AppProvider>
  );
}
