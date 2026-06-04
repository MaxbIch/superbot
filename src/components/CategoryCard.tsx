import { Link } from "react-router-dom";

interface Props {
    title: string;
    description: string;
    icon: string;
    path: string;
}

export default function CategoryCard({
                                         title,
                                         description,
                                         icon,
                                         path,
                                     }: Props) {
    return (
        <Link to={path}>
            <div
                className="
          bg-white
          rounded-3xl
          p-4
          shadow-sm
          hover:shadow-lg
          transition
          h-full
        "
            >
                <div className="flex gap-4">
                    <div className="text-4xl">
                        {icon}
                    </div>

                    <div>
                        <h3 className="font-bold">
                            {title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}