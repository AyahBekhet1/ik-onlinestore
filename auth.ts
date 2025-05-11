import { cookies } from 'next/headers';
import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import {PrismaAdapter} from '@auth/prisma-adapter'
import { prisma } from './db/prisma'

import { compareSync } from 'bcrypt-ts-edge'
import GoogleProvider from "next-auth/providers/google"

import { NextResponse } from 'next/server'

export const config ={
    pages:{
        signIn:'/sign-in',
        error:'/sign-in',
    },
    session :{
        strategy:'jwt',
        maxAge: 60 * 24 * 60 * 60,

    },
    adapter:PrismaAdapter(prisma),
    providers:[
        CredentialsProvider({
            credentials:{
                email:{type:'email'} ,
                password:{type:'password'}
            },
            async authorize(credentials){
                if(credentials == null) return null

                //find user in database
                const user = await prisma.user.findFirst({
                    where:{
                        email:credentials.email as string
                    }
                })

                //check if the user exist and if password matches
                if(user && user.password){
                    const isMatch = compareSync(credentials.password as string, user.password)

                    //check if pass is correct , return the user
                    if(isMatch){
                      return{
                          id:user.id,
                          name:user.name,
                          email:user.email,
                          role:user.role
                      }
                    }
                }
                //if user doesnt exist or password doesnt match
                return null
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID! as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET! as  string,
            // allowDangerousEmailAccountLinking: true,
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }}
          })
          
    ],
    // secret: process.env.NEXTAUTH_SECRET,

    callbacks:{
        async session({ session , user,trigger , token } : any) {
            //set the user id from the token
            session.user.id= token.sub;
            session.user.role = token.role
            session.user.name = token.name
                        
            //if there is update , set the user name
            if(trigger === 'update'){
                session.user.name = user.name
            }

            return session
          },
          async jwt ({token , user , trigger , session}:any){
            //assign user fields to token
            if(user){
                token.id=user.id
                token.role = user.role

                //if user has no name then use the email
                if(user.name === 'NO_NAME'){
                    token.name = user.email!.split('@')[0];

                    //update database to reflect the token name
                    await prisma.user.update({
                        where:{id:user.id},
                        data:{name:token.name}
                    })
                }

                if(trigger === 'signIn' || trigger === 'signUp'){
                    const cookiesObject = await cookies()
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value

                    if(sessionCartId){
                        const sessionCart = await prisma.cart.findFirst({
                            where:{sessionCartId}
                        })

                        if (sessionCart){
                            //delete current user cart 
                            await prisma.cart.deleteMany({
                                where:{userId :user.id}
                            })

                            //assign new cart
                            await prisma.cart.update({
                                where:{id:sessionCart.id},
                                data:{userId:user.id}
                            })
                        }
                    }
                }
            }

            //handle session updates
            if(session?.user?.name && trigger ==='update'){
                token.name = session.user.name;
            }
            return token
          },
          async signIn({ account, profile }:any) {
            if (account?.provider === "google") {
              return true
            }
            return true // Do different verification for other providers that don't have `email_verified`
          },
          authorized({request, auth}:any){
            //array of regex patterns of paths we want to protect
            const protectedPaths = [
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ]

            //get pathname from the req url object
            const {pathname}=request.nextUrl
        

            //check if user not authenticated and accessing a protecting path
            //!auth tell us the user is a guest not logged in
            if(!auth && protectedPaths.some((p)=>p.test(pathname))) return false

            // check for session cart cookie
            if(!request.cookies.get('sessionCartId')){
                //generate new session cart id cookie
                const sessionCartId=crypto.randomUUID()
                //clone the req headers
                const newRequestHeaders = new Headers(request.headers)

                //create new response and add the new headers
                const response = NextResponse.next({
                    request:{
                        headers:newRequestHeaders
                    }
                });
                //set newly generated sessionCartId in the response cookies
                response.cookies.set('sessionCartId', sessionCartId)
                // Return the response with the sessionCartId set
                return response
            }else{
                return true
            }
          }
    }
} satisfies NextAuthConfig

export const {handlers , auth , signIn , signOut} = NextAuth(config)