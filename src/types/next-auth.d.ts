// import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: number;
      name: string;
      email: string;
      image: string;
    };
  }
}

export declare module 'next-auth' {}
