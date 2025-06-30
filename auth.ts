import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginService } from "@/features/auth/login/services/loginService";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken: string;
    role: string;
    name?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await loginService(
            credentials.email as string,
            credentials.password as string
          );

          if (!response?.token || !response?.user) return null;

          return {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            role: response.user.role,
            accessToken: response.token,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.email = token.email!;
      session.user.name = token.name!;
      session.user.role = token.role!;
      session.accessToken = token.accessToken!;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true,
});
