import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   display: "swap",
//   fallback: ["Arial", "sans-serif"], // Provide fallback fonts here
// });

export const metadata: Metadata = {
  title: "Water Billing",
  description: "Water Billing System ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  );
}
