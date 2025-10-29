import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import VLibras from "./components/vlibras/VLibras";
import DonationButtonWrapper from "./components/DonationButtonWrapper";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

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
		description:
			"Conheça a APAE de Esperança e descubra como apoiamos pessoas com deficiência com amor, respeito e inclusão.",
	},
};

/**
 * Defines the application's root HTML layout, wrapping page content with authentication, header, footer, and accessibility/donation widgets.
 *
 * @param children - The page content to render inside the main content area
 * @returns A JSX element representing the full HTML page layout
 */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className={`${nunito.className} ${baloo2.className}`}>
				<AuthProvider>
					<Toaster position="top-center" toastOptions={{ duration: 4000 }} />
					<Header />
					<main id="main-content-wrapper" className="content">
						{children}
					</main>
					<Footer />
					<DonationButtonWrapper />
					<VLibras />
				</AuthProvider>
			</body>
		</html>
	);
}