import React from "react";

interface ModalProps {
  isOpen: boolean; // Відкритий стан модального вікна
  title: string; // Заголовок модального вікна
  message: string; // Повідомлення, яке відображається в модальному вікні
  onClose: () => void; // Функція для закриття модального вікна
  onConfirm: () => void; // Функція для підтвердження дії
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null; // Якщо модальне вікно не відкрите, нічого не відображаємо
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Закриваємо модальне вікно, якщо клікнули на затемнену зону
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOverlayClick} // Обробник кліка на затемненій зоні
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>{" "}
        {/* Вирівняний текст заголовка */}
        <p className="mb-6 text-center">{message}</p>{" "}
        {/* Вирівняний текст повідомлення */}
        <div className="flex justify-center space-x-4">
          {" "}
          {/* Вирівнюємо кнопки по центру */}
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-full"
          >
            Скасувати
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-full"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
