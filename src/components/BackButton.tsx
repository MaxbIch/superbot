import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="
                mb-5 inline-flex items-center gap-1
                text-sm font-medium text-brand-800
                hover:text-brand-900 transition-colors
                -ml-1 px-2 py-1.5 rounded-lg hover:bg-white/50
            "
        >
            <ChevronLeft className="w-5 h-5" />
            Назад
        </button>
    );
}
