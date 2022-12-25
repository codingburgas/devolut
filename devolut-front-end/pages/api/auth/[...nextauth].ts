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
          const res = await fetch("http://localhost:8080/user/read", {
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
    strategy: 'jwt'
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  pages: {

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

  events: {},

  debug: false,
})