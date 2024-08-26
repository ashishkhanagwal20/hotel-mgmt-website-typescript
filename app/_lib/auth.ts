import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { SessionType, SessionUserType } from "../interfacetype";
import { createGuest, getGuest } from "./data-service";
import { User } from "next-auth";

const authConfig: any = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }: { auth: any; request: any }) {
      return !!auth?.user;
    },
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: any;
      profile: any;
    }) {
      try {
        const existingGuest = await getGuest(user.email!);
        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });
        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }: { session: SessionType; user: any }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    },
    pages: {
      signIn: "/login",
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
