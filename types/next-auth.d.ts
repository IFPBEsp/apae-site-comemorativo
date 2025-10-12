import { DefaultSession } from "next-auth";
import { TypeUser } from "@/generated/prisma";

declare module "next-auth" {
	interface Session {
		user: {
			id: number;
			typeUser: TypeUser;
		} & DefaultSession["user"];
	}

	interface User {
		typeUser: TypeUser;
	}
}


declare module "next-auth/jwt" {
	interface JWT {
		id: number;
		typeUser: TypeUser;
	}
}