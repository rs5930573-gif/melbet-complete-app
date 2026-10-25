import "./globals.css";

export const metadata = {
  title: "Melbet App",
  description: "Complete betting app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
