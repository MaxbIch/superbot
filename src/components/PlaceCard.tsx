interface Props {
    title: string;
    image: string;
    description: string;
    onOpen: () => void;
}

export default function PlaceCard({
                                      title,
                                      image,
                                      description,
                                      onOpen,
                                  }: Props) {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow">
            <img
                src={image}
                alt={title}
                className="w-full h-56 object-cover"
            />

            <div className="p-4">
                <h3 className="font-bold text-lg">
                    {title}
                </h3>

                <p className="text-gray-600 mt-2">
                    {description}
                </p>

                <button
                    onClick={onOpen}
                    className="
            mt-4
            text-green-600
            font-semibold
          "
                >
                    Узнать больше →
                </button>
            </div>
        </div>
    );
}