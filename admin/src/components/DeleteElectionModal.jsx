import React from 'react';
import { deleteElection } from '../services/api';

const DeleteElectionModal = ({
  isOpen,
  onClose,
  election,
  onDeleteSuccess
}) => {
  const handleDelete = async () => {
    try {
      await deleteElection(election._id);
      onDeleteSuccess(election._id);
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-red-600">Delete Election</h2>
        <p className="mb-4 text-gray-600">
          Are you absolutely sure you want to delete the election "{election.title}"?
          This action cannot be undone and will permanently remove the election and all its associated candidates.
        </p>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete Election
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteElectionModal;