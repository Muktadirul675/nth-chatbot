import { getAllSettings } from "@/services/settings";
import SettingsForm from "./form";

export default async function SettingsPage() {
    const allSettings = await getAllSettings()
    return <SettingsForm settings={allSettings}/>
}