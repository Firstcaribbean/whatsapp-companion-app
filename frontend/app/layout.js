import "./globals.css";
export const metadata = { title: "Web WhatsApp Companion" };
export default function RootLayout({ children }) {
  return ( <html lang="en"><body className="antialiased">{children}</body></html> );
}
