interface Props {
    value: string;
    onChange: (value: string) => void;
}

import { currencies } from "../data/currencies";

export default function CurrencySelector({
                                             value,
                                             onChange,
                                         }: Props) {
    return (
        <select
            value={value}
            onChange={(e) =>
                onChange(e.target.value)
            }
            className="
        w-full
        bg-transparent
        text-lg
        font-semibold
        outline-none
      "
        >
            {currencies.map((item) => (
                <option
                    key={item.code}
                    value={item.code}
                >
                    {item.flag} {item.code}
                </option>
            ))}
        </select>
    );
}