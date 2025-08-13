import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Layout from "@/components/Layout";
import { Inter, Playfair_Display } from 'next/font/google';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata = {
  title: "ICF Community",
  description: "A community hub for UIUC ICF.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
