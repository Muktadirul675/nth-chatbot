"use client";

import Inbox from "@/components/chatbot/Inbox";
import InputBox from "@/components/chatbot/Inputbox";
import Topbar from "@/components/chatbot/Topbar";
import TrackUID from "@/components/chatbot/TrackUID";

export default function ChatbotPage(){
    
    return <div className="flex flex-col h-screen">
        <TrackUID/>
        <Topbar/>
        <Inbox/>
        <InputBox/>
    </div>
}