import React from "react";
import { Link } from "react-router-dom";

interface OwnerActionsProps {
    editTo: string;
    onDelete: () => void;
    editLabel: string;
    deleteLabel: string;
}

export const OwnerActions: React.FC<OwnerActionsProps> = ({
    editTo,
    onDelete,
    editLabel,
    deleteLabel,
}) => (
    <>
        <Link to={editTo}>
            <button className="mt-6 mr-[1vw] bg-yellow-500 text-white py-2 px-4 rounded-full">
                {editLabel}
            </button>
        </Link>
        <button
            onClick={onDelete}
            className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full"
        >
            {deleteLabel}
        </button>
    </>
);
