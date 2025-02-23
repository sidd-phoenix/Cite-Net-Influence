import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "Cite-Net Influence",
  description: "AI-powered citation network analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body> 
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
