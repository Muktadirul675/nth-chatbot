import UpdateInformationForm from "./form";
import { getInformation } from "@/services/informations";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const information = await getInformation((await params).id);
    if (!information) {
        return <div className="p-6 max-w-6xl mx-auto my-5">Information not found</div>
    }
    return (
        <UpdateInformationForm information={information} />
    );
}