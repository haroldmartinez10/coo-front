"use client";

import * as React from "react";
import { createTheme } from "@mui/material/styles";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { Map } from "@mui/icons-material";

import { AppProvider, Navigation, Router } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { TOOLPAD_THEME_CONFIG } from "@/shared/constants/theme";
import { useAppSelector } from "@/shared/hooks/reduxHooks";

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

  const userRole = useAppSelector((state) => state.auth.user?.role);

  const NAVIGATIONUSER: Navigation = [
    {
      kind: "header",
      title: "Menu",
    },
    {
      segment: "quotes",
      title: "Cotización",
      icon: <DashboardIcon />,
    },
    {
      segment: "orders",
      title: "Mis órdenes",
      icon: <ShoppingCartIcon />,
      pattern: "orders{/:id}*",
    },
    {
      segment: "state-of-order",
      title: "Estado actual de mi orden",
      icon: <Map />,
      pattern: "state-of-order{/:id}*",
    },
  ];

  const NAVIGATIONADMIN: Navigation = [
    {
      segment: "orders",
      title: "Administrar ordenes",
      icon: <ShoppingCartIcon />,
      pattern: "orders{/:id}*",
    },
  ];

  const getNavigation = (): Navigation => {
    if (!userRole) {
      return [];
    }

    return userRole === "admin" ? NAVIGATIONADMIN : NAVIGATIONUSER;
  };

  return (
    <AppProvider
      navigation={getNavigation()}
      router={router}
      theme={demoTheme}
      branding={BRANDING}
      authentication={AUTHENTICATION}
      session={{ user: { name: `${user} (${userRole})` || "" } }}
    >
      <DashboardLayout>{children}</DashboardLayout>
    </AppProvider>
  );
}
