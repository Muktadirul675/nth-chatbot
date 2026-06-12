import { ADMIN_ROLE, MODERATOR_ROLE, SETTINGS_MODERATOR_PASS_PREFIX, SETTINGS_PASSWORD_KEY, SETTINGS_USERNAME_KEY } from "@/lib/globals";
import bcrypt from "bcryptjs";
import { getSetting } from "./settings";
import { prisma } from "@/lib/prisma";

export async function verifyUser(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { username: username },
        select:{
            password: true,
            role: true, 
            username: true,
            id: true,
        }
    })
    if(!user){
        throw new Error("User Not Found")
    }
    const isPassValid = await bcrypt.compare(password, user.password)
    if(!isPassValid){
        throw new Error("Invalid Credentials")
    }
    return {
        id:user.id,
        name: user.username
    }
}

