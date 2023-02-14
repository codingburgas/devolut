import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
        id: number,
        dTag: string,
        email: string,
        password: string,
        firstName: string,
        middleName: string,
        lastName: string,
        dateOfBirth: Date,
        country: string,
        address: string,
        postCode: string,
        city: string,
        region: string,
        phoneNumber: string,
        balance: number,
        avatarSrc: string
    }
  }
}