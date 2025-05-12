import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth: middleware } = NextAuth(authConfig);

// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';

// export default NextAuth(authConfig);;

// export const config = {
//   matcher: [
//     '/shipping-address',
//     '/payment-method',
//     '/place-order',
//     '/profile',
//     '/user/:path*',
//     '/order/:path*',
//     '/admin/:path*',
//   ],
// };
