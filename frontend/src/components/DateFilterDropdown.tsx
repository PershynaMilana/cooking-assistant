import React, { useState, useEffect, useRef } from "react";

interface DateFilterDropdownProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

const DateFilterDropdown: React.FC<DateFilterDropdownProps> = ({
                                                                 startDate,
                                                                 endDate,
                                                                 setStartDate,
                                                                 setEndDate,
                                                               }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
          filterRef.current &&
          !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validate dates
  const validateDates = (start: string, end: string) => {
    console.log("Validating dates", { start, end });
    setDateError(null);

    // Check if start date is after end date
    if (start && end && new Date(start) > new Date(end)) {
      setDateError("Start date cannot be later than end date.");
      return;
    }

    // Check if selected dates are not in the future
    const today = new Date();
    if ((start && new Date(start) > today) || (end && new Date(end) > today)) {
      setDateError("Please select a valid date range.");
    }
  };

  // Handle start date change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    validateDates(e.target.value, endDate);
  };

  // Handle end date change
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    validateDates(startDate, e.target.value);
  };

  // Validate dates when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      validateDates(startDate, endDate);
    }
  }, [isOpen, startDate, endDate]);

  // Reset filters
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setDateError(null); // Clear error message when resetting filters
    setIsOpen(false);
  };

  return (
      <div ref={filterRef} className="relative">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-purple-600 text-white p-2 rounded-lg"
        >
          Sort by dates
        </button>
        {isOpen && (
            <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-gray-700">
                  Start date:
                </label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="border rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endDate" className="block text-gray-700">
                  End date:
                </label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="border rounded p-2 w-full"
                />
              </div>

              {/* Error message */}
              {dateError && <div className="text-red-500 mb-4">{dateError}</div>}

              <button
                  onClick={resetFilters}
                  className="text-purple-600 hover:underline w-full"
              >
                Reset filters
              </button>
            </div>
        )}
      </div>
  );
};

export default DateFilterDropdown;
