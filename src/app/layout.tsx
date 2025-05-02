import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Email Form',
  description: 'A simple email entry form',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
