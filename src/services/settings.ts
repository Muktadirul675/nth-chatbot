import { ChatbotSetting } from "@/lib/globals";
import { redis } from "@/lib/redis";

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

