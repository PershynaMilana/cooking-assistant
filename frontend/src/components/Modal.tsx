import React from "react";

interface ModalProps {
  isOpen: boolean; // Modal open state
  title: string; // Modal title
  message: string; // Message displayed in the modal
  onClose: () => void; // Function to close the modal
  onConfirm: () => void; // Function to confirm the action
}

const Modal: React.FC<ModalProps> = ({
                                       isOpen,
                                       title,
                                       message,
                                       onClose,
                                       onConfirm,
                                     }) => {
  if (!isOpen) {
    return null; // If modal is not open, render nothing
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close modal if clicking on overlay
    }
  };

  return (
      <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOverlayClick} // Click handler for overlay
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-lg font-semibold font-montserratRegular mb-4 text-center">{title}</h2>{" "}
          {/* Centered title text */}
          <p className="mb-6 text-center">{message}</p>{" "}
          {/* Centered message text */}
          <div className="flex justify-center space-x-4">
            {" "}
            {/* Center-align buttons */}
            <button
                onClick={onClose}
                className="bg-gray-400 text-white px-4 py-2 rounded-full"
            >
              Cancel
            </button>
            <button
                onClick={onConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded-full"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
  );
};

export default Modal;
