import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dhruvit Maniya | Sr. Software Engineer",
  description: "Sr. Software Engineer at Growder, crafting immersive digital experiences with cutting-edge technology and design.",
  keywords: ["developer", "portfolio", "web development", "creative", "design", "Growder", "Inpackaging", "MoodMe", "VRSist", "Software Engineer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
