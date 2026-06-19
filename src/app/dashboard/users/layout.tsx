import { auth } from "@/auth";
import { UserRole } from "@/generated/prisma/enums";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata : Metadata = {
    title: "Users"
}

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
    // const session = await auth()
    // if (!session || !session.user) {
    //     redirect("/login")
    // }
    // const role: string = (session.user as any).role as string
    // const isSuperAdmin = role === UserRole.SUPER_ADMIN
    // if(!isSuperAdmin){
    //     redirect("/dashboard")
    // }
    return children;
}