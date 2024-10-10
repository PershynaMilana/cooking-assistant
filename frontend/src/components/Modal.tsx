// components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Закрываем модальное окно, если кликнули на затемнённую зону
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
      onClick={handleOverlayClick} // Обработчик клика на затемнённой зоне
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2> {/* Выровненный текст заголовка */}
        <p className="mb-6 text-center">{message}</p> {/* Выровненный текст сообщения */}
        <div className="flex justify-center space-x-4"> {/* Выравниваем кнопки по центру */}
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
