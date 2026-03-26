import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const normalizedEmail = credentials.email.trim().toLowerCase();
        let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        // Auto-upgrade role based on email domain
        if (normalizedEmail.endsWith("@realty.com") && user.role === "buyer") {
          user = await prisma.user.update({
            where: { email: normalizedEmail },
            data: { role: "agent" },
          });
        }
        // Upgrade admin email to full admin role
        else if (normalizedEmail === "nehabr.2302@gmail.com" && user.role !== "admin") {
          user = await prisma.user.update({
            where: { email: normalizedEmail },
            data: { role: "admin" },
          });
        }

        return { id: user.id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { 
        token.role = user.role; 
        token.id = user.id; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token) { 
        session.user.role = token.role; 
        session.user.id = token.id; 
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
