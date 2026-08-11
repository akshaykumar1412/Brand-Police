import "./globals.css";

export const metadata = {
  title: "Brand Police | Brandy",
  description: "Detect, review, and resolve brand misuse.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
