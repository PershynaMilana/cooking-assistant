interface ToggleButtonGroupProps<T> {
    label: string;
    items: T[];
    selectedIds: number[];
    onToggle: (item: T) => void;
    getKey: (item: T) => number;
    getLabel: (item: T) => string;
    selectedClassName: string;
    unselectedClassName: string;
    errorMessage?: string | null;
}

export const ToggleButtonGroup = <T,>({
    label,
    items,
    selectedIds,
    onToggle,
    getKey,
    getLabel,
    selectedClassName,
    unselectedClassName,
    errorMessage,
}: ToggleButtonGroupProps<T>) => (
    <div>
        <p className="block text-sm font-medium text-gray-700">{label}</p>
        <div className="flex flex-wrap gap-2">
            {items.map((item) => {
                const key = getKey(item);

                return (
                    <button
                        key={key}
                        type="button"
                        onClick={() => {
                            onToggle(item);
                        }}
                        className={
                            selectedIds.includes(key)
                                ? selectedClassName
                                : unselectedClassName
                        }
                    >
                        {getLabel(item)}
                    </button>
                );
            })}
        </div>
        {errorMessage && (
            <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
        )}
    </div>
);
