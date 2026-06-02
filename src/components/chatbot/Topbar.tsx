import { TiTimes } from "react-icons/ti";

export default function Topbar(){
    function handleClose() {
        window.parent.postMessage(
          { type: "CLOSE_CHAT" },
          "*"
        );
    }

    return <div className="w-full p-3 bg-slate-50 border-b border-gray-300 flex items-center gap-2">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="User Avatar" className="w-10 h-10 rounded-full" />
        <h3 className="font-semibold">
            NTH Assistant
        </h3>
        <div className="ms-auto"></div>
        <button className="p-1 rounded bg-slate-100 hover:bg-slate-200" onClick={handleClose}>
            <TiTimes size={20}/>
        </button>
    </div>
}