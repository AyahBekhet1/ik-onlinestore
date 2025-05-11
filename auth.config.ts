import type { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from "next/server";


export const authConfig ={
    providers:[],
    callbacks:{
        authorized({request, auth}:{ request: NextRequest; auth: any }){
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
                const sessionCartId = Array.from(crypto.getRandomValues(new Uint8Array(16)))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
              
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
}satisfies NextAuthConfig