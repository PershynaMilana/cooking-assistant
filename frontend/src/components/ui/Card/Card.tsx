import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
    title: string;
    to: string;
    actionLabel: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    title,
    to,
    actionLabel,
    children,
}) => (
    <div className="bg-pale-beige h-[25vh] p-4 rounded-xl mb-4 flex flex-col justify-between">
        <div>
            <h2 className="text-xl font-bold font-kharkiv my-3">{title}</h2>
            {children}
        </div>
        <Link
            to={to}
            className="mt-4 block w-full bg-dark-purple font-montserratRegular text-white py-2 px-4 rounded-full text-center"
        >
            {actionLabel}
        </Link>
    </div>
);
