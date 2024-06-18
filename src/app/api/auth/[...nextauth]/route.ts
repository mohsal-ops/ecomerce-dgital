
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import db from '@/db/db';


interface ExtendedSession extends Session {
  user: {
    id: string | undefined;
    email: string;
    name: string;
    image: string;
  };
}

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {

      (session.user as ExtendedSession["user"]).id = token.id as string
      const User = await db.user.findUnique({where : { email : session.user.email}})

      session.user.id = User?.id

      return session;
    },
    async signIn({ profile }) {
      try {
        //check if user already exists
        const isUserExists = await db.user.findUnique({
          where: { email: profile?.email }
        })
        // if not, create a new document and save user in MongoDB
        if (!isUserExists) {
          const newUser = await db.user.create({
            data: {
              email: profile?.email as string,

            }
          }).then(() => console.log("user has been created "))





        }
      } catch (error) {
        console.log("error while trying to create a user ")
        return false
      }
      return true
    },

  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(options);

export { handler as GET, handler as POST };


