import { SETTINGS_PASSWORD_KEY, SETTINGS_USERNAME_KEY } from "@/lib/globals";
import { getSetting } from "./settings";

export async function verifyUser(username: string, password: string): Promise<boolean> {
    const dbUsername = await getSetting(SETTINGS_USERNAME_KEY) ?? ""
    const dbPassword = await getSetting(SETTINGS_PASSWORD_KEY) ?? ""
    if (dbUsername === username && dbPassword === password) return true;
    return false;
}