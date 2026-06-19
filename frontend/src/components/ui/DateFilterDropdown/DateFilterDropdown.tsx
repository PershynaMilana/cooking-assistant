import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useClickOutside } from "hooks/useClickOutside";

import { getDateRangeError } from "utils/dateRange";

interface DateFilterDropdownProps {
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
}

export const DateFilterDropdown: React.FC<DateFilterDropdownProps> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dateError, setDateError] = useState<string | null>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const startId = useId();
    const endId = useId();
    const { t } = useTranslation();

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    useClickOutside(filterRef, close);

    const validateDates = useCallback(
        (start: string, end: string) => {
            const error = getDateRangeError(start, end, new Date());

            setDateError(error ? t(`dateFilter.${error}`) : null);
        },
        [t],
    );

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        validateDates(e.target.value, endDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        validateDates(startDate, e.target.value);
    };

    // validate dates when dropdown is opened
    useEffect(() => {
        if (isOpen) {
            validateDates(startDate, endDate);
        }
    }, [isOpen, startDate, endDate, validateDates]);

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setDateError(null);
        setIsOpen(false);
    };

    return (
        <div ref={filterRef} className="relative">
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
                className="bg-purple-600 text-white p-2 rounded-lg"
            >
                {t("dateFilter.sortByDates")}
            </button>
            {isOpen && (
                <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
                    <div className="mb-4">
                        <label
                            htmlFor={startId}
                            className="block text-gray-700"
                        >
                            {t("dateFilter.startDate")}
                        </label>
                        <input
                            type="date"
                            id={startId}
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor={endId} className="block text-gray-700">
                            {t("dateFilter.endDate")}
                        </label>
                        <input
                            type="date"
                            id={endId}
                            value={endDate}
                            onChange={handleEndDateChange}
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    {dateError && (
                        <div className="text-red-500 mb-4">{dateError}</div>
                    )}

                    <button
                        onClick={resetFilters}
                        className="text-purple-600 hover:underline w-full"
                    >
                        {t("dateFilter.reset")}
                    </button>
                </div>
            )}
        </div>
    );
};
