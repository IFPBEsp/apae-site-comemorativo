import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import VLibras from "./components/vlibras/VLibras";
import DonationButtonWrapper from "./components/DonationButtonWrapper";
import { Toaster } from "react-hot-toast";

const baloo2 = Baloo_2({
    subsets: ["latin"],
});

const nunito = Nunito({
    subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "APAE Esperança",
    template: "%s | APAE",
    description: "Conheça a APAE de Esperança e descubra como apoiamos pessoas com deficiência com amor, respeito e inclusão."
  },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${nunito.className} ${baloo2.className}`}>
                <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
                <Header />
                <main id="main-content-wrapper" className="content">
                    {children}
                    <Footer />
                </main>
                <DonationButtonWrapper />
                <VLibras />
            </body>
        </html>
    );
}
