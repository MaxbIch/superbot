import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <div className="min-h-dvh safe-bottom">
            <div className="mx-auto w-full max-w-lg px-4 py-5 sm:max-w-2xl sm:px-6 sm:py-8">
                {children}
            </div>
        </div>
    );
}
