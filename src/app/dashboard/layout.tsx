import { auth, signOut } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { BiChat, BiHome, BiLogOut } from "react-icons/bi";
import { BsGear } from "react-icons/bs";
import { IoInformation } from "react-icons/io5";

export default async function DashboradLayout({ children }: { children: ReactNode }) {
    const session = await auth()
    if (!session) {
        redirect("/login")
    }
    return <div className="flex items-start">
        <Toaster />
        <div className="w-fit sticky top-0 flex flex-col p-3 border-r border-slate-800 h-screen bg-primary text-white">
            <h3 className="text-lg font-semibold px-2">
                {session.user?.name}
            </h3>
            <div className="my-2"></div>
            <Link href={'/dashboard'} className="flex mt-5 items-center gap-2 rounded p-2 hover:bg-slate-100 text-uppercase text-white hover:text-black">
                <BiHome className="text-lg" />
                Dashboard
            </Link>
            <Link href={'/dashboard/informations'} className="flex mt-5 items-center gap-2 rounded p-2 hover:bg-slate-100 text-uppercase text-white hover:text-black">
                <IoInformation className="text-lg" />
                Information
            </Link>
            <Link href={'/dashboard/leads'} className="flex mt-5 items-center gap-2 rounded p-2 hover:bg-slate-100 text-uppercase text-white hover:text-black">
                <BiChat className="text-lg" />
                Leads
            </Link>
            <Link href={'/dashboard/chats'} className="flex mt-5 items-center gap-2 rounded p-2 hover:bg-slate-100 text-uppercase text-white hover:text-black">
                <BiChat className="text-lg" />
                Chat Sessions
            </Link>
            <Link href={'/dashboard/settings'} className="flex mt-5 items-center gap-2 rounded p-2 hover:bg-slate-100 text-uppercase text-white hover:text-black">
                <BsGear className="text-lg" />
                Settings
            </Link>
            <form action={async ()=>{
                "use server";
                await signOut()
            }}>
                <button type="submit" className="flex mt-5 items-center gap-2 rounded p-2 hover:bg-slate-100 text-uppercase text-white hover:text-black">
                    <BiLogOut className="text-lg" />
                    Logout
                </button>
            </form>
        </div>
        <div className="flex-1">
            {children}
        </div>
    </div>
}