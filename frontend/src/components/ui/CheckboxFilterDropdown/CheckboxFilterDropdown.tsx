import { useCallback, useRef, useState } from "react";

import { useClickOutside } from "hooks/useClickOutside";

interface CheckboxFilterDropdownProps<T> {
    items: T[];
    selected: number[];
    onChange: (selected: number[]) => void;
    getKey: (item: T) => number;
    getLabel: (item: T) => string;
    buttonLabel: string;
    resetLabel: string;
}

// generic checkbox-filter dropdown: a toggle button revealing a checkbox list plus a
// reset action, closing on outside click. The recipe-type and menu-category filters
// are thin adapters that supply their item shape, key/label getters and i18n labels.
export const CheckboxFilterDropdown = <T,>({
    items,
    selected,
    onChange,
    getKey,
    getLabel,
    buttonLabel,
    resetLabel,
}: CheckboxFilterDropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    useClickOutside(filterRef, close);

    const toggle = (id: number) => {
        onChange(
            selected.includes(id)
                ? selected.filter((value) => value !== id)
                : [...selected, id],
        );
    };

    const reset = () => {
        onChange([]);
        setIsOpen(false);
    };

    return (
        <div ref={filterRef} className="relative">
            <button
                className="bg-purple-600 text-white p-2 rounded-lg"
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                {buttonLabel}
            </button>
            {isOpen && (
                <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
                    {items.map((item) => {
                        const key = getKey(item);
                        const inputId = `filter-checkbox-${key}`;

                        return (
                            <div key={key} className="flex items-center">
                                <input
                                    id={inputId}
                                    type="checkbox"
                                    checked={selected.includes(key)}
                                    onChange={() => {
                                        toggle(key);
                                    }}
                                />
                                <label htmlFor={inputId} className="ml-2">
                                    {getLabel(item)}
                                </label>
                            </div>
                        );
                    })}
                    <button
                        onClick={reset}
                        className="mt-2 text-purple-600 hover:underline"
                    >
                        {resetLabel}
                    </button>
                </div>
            )}
        </div>
    );
};
