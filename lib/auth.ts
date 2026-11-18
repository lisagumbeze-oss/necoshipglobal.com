import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/lib/env";
import {
  authenticateUser,
  findUserByEmail,
  mapRoleToAppRole
} from "@/lib/repository/users";
import { writeAuditLog } from "@/lib/services/audit";
import { verifyTotp } from "@/lib/totp";

export type AppRole = "guest" | "customer" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: AppRole;
      /** Trusted persisted Prisma UserRole — never client-supplied. */
      staffRole?: string | null;
      twoFactorEnabled?: boolean;
    };
  }

  interface User {
    id: string;
    role: AppRole;
    staffRole?: string | null;
    twoFactorEnabled?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AppRole;
    staffRole?: string | null;
    twoFactorEnabled?: boolean;
  }
}

const withGoogle =
  env.googleClientId && env.googleClientSecret
    ? [
        GoogleProvider({
          clientId: env.googleClientId,
          clientSecret: env.googleClientSecret
        })
      ]
    : [];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  secret: env.nextAuthSecret,
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email + Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password?.trim();
        const otp = credentials?.otp?.trim();
        if (!email || !password) return null;

        const user = await authenticateUser(email, password);
        if (!user) return null;

        if ("twoFactorEnabled" in user && user.twoFactorEnabled && user.twoFactorSecret) {
          if (!otp) {
            throw new Error("TWO_FACTOR_REQUIRED");
          }
          const validTotp = verifyTotp(otp, user.twoFactorSecret);
          const validBackup =
            Array.isArray(user.backupCodes) && user.backupCodes.includes(otp.toUpperCase());
          if (!validTotp && !validBackup) return null;
        }

        const staffRole = String(user.role);
        const role = mapRoleToAppRole(staffRole);
        await writeAuditLog({
          userId: user.id,
          action: "auth.login",
          entityType: "User",
          entityId: user.id
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role,
          staffRole,
          twoFactorEnabled: Boolean(user.twoFactorEnabled)
        };
      }
    }),
    ...withGoogle
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await findUserByEmail(user.email);
        if (!existing) {
          // Google users are created lazily as customers via credentials API in production;
          // allow sign-in and map as customer.
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.twoFactorEnabled = user.twoFactorEnabled;

        if (user.staffRole) {
          token.staffRole = user.staffRole;
        } else if (user.email) {
          // Enrich from trusted persisted User.role — never from client claims.
          try {
            const existing = await findUserByEmail(user.email);
            if (existing) {
              token.id = existing.id;
              token.staffRole = String(existing.role);
              token.role = mapRoleToAppRole(String(existing.role));
            } else {
              token.staffRole = "CUSTOMER";
              token.role = token.role === "admin" ? "admin" : "customer";
            }
          } catch {
            // Fail closed: no trusted staff role claim.
            token.staffRole = null;
          }
        } else {
          // AppRole alone is insufficient for fine-grained permissions.
          token.staffRole = null;
        }
      } else if (!token.role && account?.provider === "google") {
        token.role = "customer";
        token.staffRole = "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role === "admin" ? "admin" : "customer";
      session.user.staffRole = token.staffRole ?? null;
      session.user.twoFactorEnabled = token.twoFactorEnabled;
      return session;
    }
  }
};
