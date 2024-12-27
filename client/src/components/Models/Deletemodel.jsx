import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const DeleteModal = ({ isOpen, onRequestClose, onConfirmDelete, projectToDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Delete"
      className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
      {projectToDelete && (
        <p className="mb-6">
          Are you sure you want to delete the project "<strong>{projectToDelete.name}</strong>"?
        </p>
      )}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onRequestClose}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={onConfirmDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
