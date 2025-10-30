import "./globals.css";
import { Navbar } from "@/app/components/navbar";
import  Footer  from "@/app/components/footer"
import { footer } from "motion/react-client";

export const metadata = {
  title: "Educational Day",
  description: "Educational Day Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black transition-colors duration-300">
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
