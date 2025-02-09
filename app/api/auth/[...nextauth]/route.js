import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email, image } = user;
        const allowedDomains = ["mlrit.ac.in", "mlrinstitutions.ac.in"];
        const userDomain = email.split("@")[1];

        // Reject sign-in if the domain is not allowed
        if (!allowedDomains.includes(userDomain)) {
          console.log(`Sign-in blocked: ${email} is not from an allowed domain.`);
          return false;
        }

        try {
          await connectMongoDB();
          let existingUser = await User.findOne({ email });

          if (!existingUser) {
            // If the user does not exist, create a new user
            const res = await fetch("http://localhost:3000/api/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
                email,
                image,
                onboard: false, // Default onboarding status
              }),
            });

            if (res.ok) {
              existingUser = await res.json(); // Fetch the created user
            }
          }

          return true; // Allow the user to sign in
        } catch (error) {
          console.log("Sign-in error:", error);
          return false;
        }
      }
      return true; // Allow other providers to sign in
    },

    async jwt({ token, user }) {
      // Attach `onboard` field to the JWT token
      if (user) {
        await connectMongoDB();
        const dbUser = await User.findOne({ email: user.email });
        token.onboard = dbUser?.onboard || false; // Default to `false` if not set
      }
      return token;
    },

    async session({ session, token }) {
      // Attach `onboard` field to the session
      if (token) {
        session.user.onboard = token.onboard;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
