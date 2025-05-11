import type { Metadata } from "next";
import { Inter} from "next/font/google";
import  '@/assets/styles/globals.css'
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { Toaster } from 'sonner';
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Script from "next/script";
const inter = Inter({subsets:['latin']})


export const metadata: Metadata = {
  title: {
    template:`%s | IK Store`,
    default:APP_NAME
  },
  description: APP_DESCRIPTION,
  metadataBase:new URL(SERVER_URL),
  // icons:'/images/sulina.svg'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderWrapper>
    <html lang="en" suppressContentEditableWarning>
   
      <body
        className={`${inter.className} antialiased `}
      >
        {children}
        <Toaster   />
        
        <Script src="https://cdn.jsdelivr.net/npm/finisher-header/dist/finisher-header.min.js" />
      </body>
    </html>
     </SessionProviderWrapper>
  );
}
