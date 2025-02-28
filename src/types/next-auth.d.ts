import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Agrega el token a la sesión
  }
}