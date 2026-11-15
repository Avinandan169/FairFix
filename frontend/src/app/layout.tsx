import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'FairFix — Independent Laptop Value & Repair Decision Utility',
  description: 'Understand your laptop’s estimated market value, explore potential faults, evaluate repair quotes, and make informed repair-versus-replace decisions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#fbfbfd] text-slate-900 flex flex-col font-sans antialiased selection:bg-slate-200 selection:text-slate-900">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
