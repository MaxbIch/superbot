import Button from "./Button";
import { openTelegramChat } from "../lib/telegram";

interface Props {
    message?: string;
    label?: string;
}

export default function ContactButton({
    message,
    label = "Связаться с нами",
}: Props) {
    return (
        <Button
            fullWidth
            size="lg"
            icon="💬"
            onClick={() => openTelegramChat(message)}
        >
            {label}
        </Button>
    );
}
