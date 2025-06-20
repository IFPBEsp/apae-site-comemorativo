"use client";

import { useEffect } from "react";

export default function VLibras() {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
        script.async = true;

		script.onload = () => {
			// @ts-expect-error: Unreachable code error
			if (window.VLibras && window.VLibras.Widget) {
				// @ts-expect-error: Unreachable code error
				new window.VLibras.Widget("https://vlibras.gov.br/app");
				// @ts-expect-error: Unreachable code error
                window.onload();
			} else {
				console.log("[ERRO]: VLibras não foi carregado corretamente.");
			}
		};

		document.body.appendChild(script);
	}, []);

	return (
		// @ts-expect-error: Unreachable code error
		<div vw="true" className="enabled">
			<div vw-access-button="true" className="active"></div>
			<div vw-plugin-wrapper="true">
				<div className="vw-plugin-top-wrapper"></div>
			</div>
		</div>
	);
}
