import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    template: '%s | CM Dashboard',
    default: 'CM Dashboard',
  },
  description: 'The official CM web app',
  metadataBase: new URL(process.env?.NEXTAUTH_URL||'http://localhost:8502'),  
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* <SessionProvider> */} {/* </SessionProvider>  */}
       
        {children}
       
        
        
        </body>
    </html>
  );
}
