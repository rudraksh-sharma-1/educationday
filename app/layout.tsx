import "./globals.css";
import { Navbar } from "@/components/navbar";
import  Footer  from "@/components/footer"
import Hero from "@/components/hero-section"
/* import { footer } from "motion/react-client"; */
import { Toaster } from 'sonner';


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
        <Hero/>
        <main className="pt-20">{children}</main>
        <Footer/>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
