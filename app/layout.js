import "./globals.css";

export const metadata = {
  title: "Brand Police | Brandy",
  description: "Discover and review where your brand assets appear online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
