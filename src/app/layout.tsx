import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Calculadora Boletim UNIRP",
	description: "Uma aplicação simples desenvolvida utilizando Next.js, TypeScript e a biblioteca ShadcnUI, de componentes. Retorna a nota mínima para \"fechar o semestre\" ao inserir 2 outras notas.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
