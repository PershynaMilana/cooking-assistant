import React, { useEffect, useId, useRef } from "react";

const SIZE_CLASSNAMES = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
} as const;

interface BaseModalProps {
    onClose: () => void;
    size?: keyof typeof SIZE_CLASSNAMES;
    title?: string;
    children: React.ReactNode;
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
}

// structural modal shell: overlay, sizing, escape/overlay close, focus and
// body scroll-lock. Knows nothing about redux/domains - visibility is owned
// by the caller (mounted = open).
export const BaseModal: React.FC<BaseModalProps> = ({
    onClose,
    size = "sm",
    title,
    children,
    closeOnOverlay = true,
    closeOnEscape = true,
}) => {
    const titleId = useId();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!closeOnEscape) {
            return undefined;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [closeOnEscape, onClose]);

    useEffect(() => {
        containerRef.current?.focus();
    }, []);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            role="presentation"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleOverlayClick}
        >
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                tabIndex={-1}
                className={`bg-white p-6 rounded-lg shadow-lg w-full ${SIZE_CLASSNAMES[size]}`}
            >
                {title && (
                    <h2
                        id={titleId}
                        className="text-lg font-semibold font-montserratRegular mb-4 text-center"
                    >
                        {title}
                    </h2>
                )}
                {children}
            </div>
        </div>
    );
};
