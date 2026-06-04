export default function ContactButton() {
    const handleClick = () => {
        window.open(
            "https://t.me/YOUR_USERNAME",
            "_blank"
        );
    };

    return (
        <button
            onClick={handleClick}
            className="w-full bg-green-600 text-white rounded-2xl py-4 font-semibold"
        >
            Связаться с нами
        </button>
    );
}