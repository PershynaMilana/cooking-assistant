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

  // Перевірка валідності дат
  const validateDates = (start: string, end: string) => {
    console.log("Перевірка дат", { start, end });
    setDateError(null);

    // Перевірка, чи не є початкова дата пізнішою за кінцеву
    if (start && end && new Date(start) > new Date(end)) {
      setDateError("Початкова дата не може бути пізніше кінцевої дати.");
      return;
    }

    // Перевірка, чи обрані дати не перевищують сьогоднішню
    const today = new Date();
    if ((start && new Date(start) > today) || (end && new Date(end) > today)) {
      setDateError("Оберіть валідний проміжок часу.");
    }
  };

  // Обробник зміни початкової дати
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    validateDates(e.target.value, endDate);
  };

  // Обробник зміни кінцевої дати
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    validateDates(startDate, e.target.value);
  };

  // Перевірка дат при відкритті меню
  useEffect(() => {
    if (isOpen) {
      validateDates(startDate, endDate);
    }
  }, [isOpen, startDate, endDate]);

  // Скидання фільтрів
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setDateError(null); // Очищення повідомлення про помилку при скиданні фільтрів
    setIsOpen(false);
  };

  return (
    <div ref={filterRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white p-2 rounded-lg"
      >
        Сортувати за датами
      </button>
      {isOpen && (
        <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-700">
              Початкова дата:
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
              Кінцева дата:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              className="border rounded p-2 w-full"
            />
          </div>

          {/* Повідомлення про помилку */}
          {dateError && <div className="text-red-500 mb-4">{dateError}</div>}

          <button
            onClick={resetFilters}
            className="text-purple-600 hover:underline w-full"
          >
            Скинути фільтри
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilterDropdown;
