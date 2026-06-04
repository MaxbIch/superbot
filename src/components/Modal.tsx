interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({
                                  open,
                                  onClose,
                                  title,
                                  children,
                              }: Props) {
    if (!open) return null;

    return (
        <div
            className="
        fixed inset-0 z-50
        bg-black/50
        flex items-center justify-center
        p-4
      "
        >
            <div
                className="
          bg-white
          rounded-3xl
          w-full
          max-w-xl
          max-h-[90vh]
          overflow-auto
          p-6
        "
            >
                <div className="flex justify-between mb-4">
                    <h2 className="font-bold text-xl">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl"
                    >
                        ✕
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}