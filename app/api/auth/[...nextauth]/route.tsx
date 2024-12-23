import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: "",
      clientSecret: "",
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
