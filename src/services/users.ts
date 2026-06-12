import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function createUser(username: string, pass: string, role: UserRole) {
    const password = await bcrypt.hash(pass, 10)
    const user = await prisma.user.create({
        data: {
            username: username,
            password: password,
            role: role
        },
        select: { id: true }
    })
    return user;
}

export async function isSuperAdmin(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            role: true
        }
    })
    if(user?.role === UserRole.SUPER_ADMIN){
        return true;
    }
    return false;
}

export async function updateUserPassword(id: string, pass: string) {
    const password = await bcrypt.hash(pass, 10)
    const user = await prisma.user.update({
        where: { id },
        data: {
            password,
        },
        select: { id: true }
    })
    return user;
}
