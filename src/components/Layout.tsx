import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#eef8f3] to-[#6dc89a]">
            <div className="container mx-auto px-4 py-6">
                {children}
            </div>
        </div>
    );
}