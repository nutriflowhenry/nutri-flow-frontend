import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
      params: { scope: "openid email profile" }, // Ensure "openid" is included
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Guardamos el id token de Google cuando el usuario inicia sesión
      if (account) {
        token.id_token = account.id_token; // Store id_token
      }
      return token;
    },
    async session({ session, token }) {
    
      return {
        ...session,
        accessToken: token.id_token as string | undefined,
      };
    },
    async redirect({ baseUrl }) {
      // Evitar redirecciones automáticas
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };