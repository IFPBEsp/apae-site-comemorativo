import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

const baloo2 = Baloo_2({
	subsets: ["latin"],
});

const nunito = Nunito({
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${nunito.className} ${baloo2.className}`}>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
