import "./globals.css";

export const metadata = {
  title: "Techcombank Mobile — AI-First Redesign",
  description: "Design Challenge Round 3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="font-sans">{children}</body>
    </html>
  );
}
