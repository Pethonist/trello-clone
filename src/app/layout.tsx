import { Navbar } from '@/components';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trello Clone',
  description: 'Trello clone build with Next.js and Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='dark bg-gray-900'>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
