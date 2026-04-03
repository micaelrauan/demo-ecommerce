import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import {
  createCustomer,
  findCustomerByEmail,
  savePasswordHash,
  upsertCustomer,
  verifyPassword,
} from "@/lib/nuvemshop-customers";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Nome", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        mode: { label: "Modo", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        const mode = credentials?.mode;
        const name = credentials?.name?.trim() || "Cliente";

        if (!email || !password) {
          return null;
        }

        const customer = await findCustomerByEmail(email);

        if (mode === "register") {
          if (customer) {
            throw new Error("Email ja cadastrado");
          }

          const created = await createCustomer(name, email);
          await savePasswordHash(created.id, password);

          return {
            id: String(created.id),
            name: created.name,
            email: created.email,
            nuvemshopId: String(created.id),
          };
        }

        if (!customer) {
          return null;
        }

        const valid = await verifyPassword(customer, password);
        if (!valid) {
          return null;
        }

        return {
          id: String(customer.id),
          name: customer.name,
          email: customer.email,
          nuvemshopId: String(customer.id),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const customer = await upsertCustomer(
            user.name ?? "Usuario Google",
            user.email!,
          );
          (user as any).nuvemshopId = String(customer.id);
        } catch (err) {
          console.error("Nuvemshop upsert failed for Google user:", err);
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        if ((user as any).nuvemshopId) {
          token.nuvemshopId = (user as any).nuvemshopId;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.nuvemshopId = token.nuvemshopId as string | undefined;
      }

      return session;
    },
  },
};
