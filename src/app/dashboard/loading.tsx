export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
            <div className="flex flex-col items-center gap-3">

                {/* Animated dots */}
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-[#df2a34] rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-[#df2a34] rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-2.5 h-2.5 bg-[#df2a34] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                {/* Text */}
                <p className="text-sm text-[#687076] font-medium tracking-wide">
                    Loading dashboard...
                </p>
                {/* Sub text */}
                <p className="text-xs text-[#a0a0a0]">
                    Please wait a moment
                </p>
            </div>
        </div>
    );
}