"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { LuLock, LuLoader, LuLogIn, LuUser } from "react-icons/lu";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const session = useSession(

    )
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            const result = await signIn("credentials", {
                username,
                password,
                redirect: false, // Prevents hard page reloads
            });

            console.log(JSON.stringify(result, null, 2))

            // 🚨 NEXTAUTH V5 CHECK: Ensure result exists and is marked as 'ok'
            if (!result || result.error || !result.ok) {
                console.error("Auth status failed:", result);
                toast.error("Invalid username or password");
                return;
            }
            console.log(`Session: ${JSON.stringify(session, null, 2)}`)
            toast.success("Login Successful");

            // Give NextAuth a brief millisecond to register the client cookie before moving
            router.refresh();
            router.push("/dashboard");

        } catch (error) {
            console.error("Catch block triggered:", error);
            toast.error("Failed to sign in");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
            <Toaster />

            <div className="w-full max-w-md bg-[#fcfcfc] border border-[#eef0f1] rounded-xl shadow-sm">

                {/* Header */}
                <div className="px-6 py-5 border-b border-[#eef0f1]">
                    <h1 className="text-xl font-semibold text-[#1c1c1c] tracking-tight">
                        NTH Chatbot
                    </h1>

                    <p className="mt-1 text-sm text-[#687076]">
                        Sign in to access the administration dashboard.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">

                    <div className="space-y-5">

                        {/* Username */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[#687076] uppercase tracking-wider flex items-center gap-1.5">
                                <LuUser className="w-3.5 h-3.5" />
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                disabled={loading}
                                required
                                className="w-full px-3 py-2.5 text-sm bg-white border border-[#dcdede] rounded-md text-[#1c1c1c] placeholder-[#a0a0a0] shadow-sm transition-colors focus:outline-none focus:border-[#df2a34] focus:ring-1 focus:ring-[#df2a34] disabled:opacity-60 disabled:bg-[#f5f5f5]"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[#687076] uppercase tracking-wider flex items-center gap-1.5">
                                <LuLock className="w-3.5 h-3.5" />
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                disabled={loading}
                                required
                                className="w-full px-3 py-2.5 text-sm bg-white border border-[#dcdede] rounded-md text-[#1c1c1c] placeholder-[#a0a0a0] shadow-sm transition-colors focus:outline-none focus:border-[#df2a34] focus:ring-1 focus:ring-[#df2a34] disabled:opacity-60 disabled:bg-[#f5f5f5]"
                            />
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-5 mt-5 border-t border-[#eef0f1]">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#df2a34] hover:bg-[#c8212a] rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <LuLoader className="w-4 h-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <LuLogIn className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}