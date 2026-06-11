import { ChatbotSetting, SETTINGS_MODERATOR_PASS_PREFIX, SETTINGS_PASSWORD_KEY } from "@/lib/globals";
import { redis } from "@/lib/redis";
import bcrypt from 'bcryptjs'

export async function getAllSettings(): Promise<ChatbotSetting[]> {
    const keys = await redis.keys("settings:*");

    if (!keys.length) return [];

    const values = await redis.mget(...keys);

    return keys.map((key, i) => ({
        key,
        value: values[i] ?? "", // ✅ fix here
    }));
}

export async function updateAllSettings(settings: ChatbotSetting[]) {
    if (!settings.length) return;

    for (let i = 0; i < settings.length; i++) {
        if (settings[i].key === SETTINGS_PASSWORD_KEY) {
            const pass = settings[i].value;
            const hashed = await bcrypt.hash(pass, 10);
            settings[i].value = hashed;
            break;
        }
    }

    const pipeline = redis.pipeline();

    settings.forEach(({ key, value }) => {
        pipeline.set(key, `${value}`);
    });

    await pipeline.exec();
    return (await getAllSettings())
}

export async function getSetting(key: string): Promise<string | null> {
    const val = await redis.get(key)
    return val;
}

export async function addModerator(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10)
    const moderatorSetting: ChatbotSetting = { key: `${SETTINGS_MODERATOR_PASS_PREFIX}${username}`, value: hashed }
    await updateAllSettings([moderatorSetting])
    return { success: true }
}

export async function deleteModerator(username: string) {
    await redis.del(`${SETTINGS_MODERATOR_PASS_PREFIX}${username}`)
    return { success: true }
}

