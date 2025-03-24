import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
export const DEFAULT_REDIRECT = "/workspaces";
export const publicRoutes = ["/", "/forgot-password", "/reset-password"];
export const authRoutes = ["/sign-in", "/sign-up"];
export const protectedRoutes = ["/workspaces"];
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      if (account && profile) {
        if (account.provider === "google") {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/callback`,
            {
              email: profile.email,
              firstName: profile.given_name,
              lastName: profile.family_name,
              imageUrl: profile.picture,
              provider: "google",
            }
          );
          const { result } = await response.data;
          token.user = result;
        }

        if (account.provider === "github") {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/callback`,
            {
              email: profile.email,
              firstName: profile.name,
              lastName: profile.name,
              imageUrl: profile.avatar_url,
              provider: "github",
            }
          );
          const { result } = await response.data;
          token.user = result;
        }
      } else if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }) {
      // Check if the user is exist
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-me`,
        {
          headers: {
            Authorization: `Bearer ${(token?.user as any)?.accessToken}`,
          },
        }
      );
      const { result } = await response.data;
      if (token && result) {
        (session as any).user = token.user;
      }
      console.log({ session });

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          return null;
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/sign-in`,
            {
              email,
              password,
            },
            {
              withCredentials: true,
            }
          );
          const { result } = await response.data;
          return result;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});
