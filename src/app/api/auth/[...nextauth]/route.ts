import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: {label: "Email", type: "text"},
				password: {label: "Password", type: "password"},
			},

			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Por favor, forneça seu Email e senha.");
				}

				const user = await prisma.User.findUnique({
					where: {email: credentials.email},
				});

				if (!user || !user.password) {
					throw new Error("Nenhum usuário encontrado com este Email;");
				}

				const isPasswordCorrect = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isPasswordCorrect) {
					throw new Error("Senha incorreta.");
				}

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					typeUser: user.typeUser,
				};
			},
		}),
	],

	callbacks: {
		jwt({token, user}) {
			if (user) {
				token.id = Number(user.id);
				token.typeUser = user.typeUser;
			}

			return token;
		},

		session({session, token}) {
			session.user.id = token.id as number;
			session.user.typeUser = token.typeUser;

			return session;
		},
	},

	session: {
		strategy: "jwt",
	},

	secret: process.env.NEXTAUTH_SECRET,

	debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};