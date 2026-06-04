interface Props {
    tabs: string[];
    active: string;
    onChange: (tab: string) => void;
}

export default function Tabs({
                                 tabs,
                                 active,
                                 onChange,
                             }: Props) {
    return (
        <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`
            px-4 py-2 rounded-xl
            ${
                        active === tab
                            ? "bg-green-500 text-white"
                            : "bg-white"
                    }
          `}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}