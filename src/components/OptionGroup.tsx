interface Props {
    title: string;
    options: string[];
    value?: string;
    onChange: (value: string) => void;
}

export default function OptionGroup({
                                        title,
                                        options,
                                        value,
                                        onChange,
                                    }: Props) {
    return (
        <div className="mb-6">
            <h3 className="font-semibold mb-3">
                {title}
            </h3>

            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onChange(option)}
                        className={`
              px-4 py-2 rounded-xl border transition
              ${
                            value === option
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-white border-gray-200"
                        }
            `}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}