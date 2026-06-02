import fs from "fs";
import path from "path";

const systemPrompt = fs.readFileSync(path.join(process.cwd(), "src", "lib", "ai", "system-prompt.txt"), "utf-8");

export async function getSystemPrompt(chat_session_id : string) {
    const system = `
        ${systemPrompt}

        ADDITIONAL INFO:
            The active Chat Session ID is - ${chat_session_id}
    `
    return system;
}