"use client";

import { useChatbot } from "@/contexts/chatbot";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function TrackUID(){
    const sParams = useSearchParams()

    useEffect(()=>{
        const uid = sParams.get('uid') ?? crypto.randomUUID();
        console.log("UID",uid)
        // chatbot.setUid(uid)
    },[])

    return null;
}
