import NextAuth, { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    CredentialsProvider({
        name: 'Credentials',

        credentials: {
          email: { label: "Email", type: "email" },
          password: {  label: "Password", type: "password" }
        },

        async authorize(credentials, req) {
          const res = await fetch(process.env.BACKEND_URL + "/user/auth", {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          })

          if (!res.ok) return null;
          
          const user = await res.json()

          if (res.ok && user) return user;

          return null;
        }
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',

    maxAge: 1 * 24 * 60 * 60
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async session({ session, token }: { session: Session, token: any }) { 
      session.user = token.user
      return session
    },

    async jwt({ token, user }) { 
      user && (token.user = user)
        return token
    }
  },

  debug: false,
})