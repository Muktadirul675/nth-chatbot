"use client"

import { useRouter } from "next/navigation"
import { BiArrowBack } from "react-icons/bi"

export default function BackButton({ size = 15 }: { size?: number }) {
    const router = useRouter()
    function handleClick() {
        router.back()
    }
    return <button onClick={handleClick} className="p-1 text-blue-500 hover:text-blue-600">
        <BiArrowBack size={size} />
    </button>
}