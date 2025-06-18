import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Script from "next/script";

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
			<head>
				<Script src="https://vlibras.gov.br/app/vlibras-plugin.js"></Script>
			</head>
			<body className={`${nunito.className} ${baloo2.className}`}>
				<Header />
				{children}
				<Footer />
				<div
					dangerouslySetInnerHTML={{
						__html: `
						<div vw class="enabled">
							<div vw-access-button class="active"></div>
							<div vw-plugin-wrapper>
							<div class="vw-plugin-top-wrapper"></div>
							</div>
						</div>
						<script>
							new window.VLibras.Widget('https://vlibras.gov.br/app');
						</script>
						`,
					}}
				/>
			</body>
		</html>
	);
}
