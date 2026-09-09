import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { saveUser } from "@/lib/saveUser";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        await saveUser({
          id: account.providerAccountId,
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }

      return true;
    },
  },
});