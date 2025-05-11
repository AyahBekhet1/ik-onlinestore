import { Session } from './../node_modules/.prisma/client/index.d';
import { DefaultSession } from "next-auth";

declare module 'next-auth'{
    export interface Session{
        user:{
            role:string;
        }& DefaultSession['user']
    }
}





