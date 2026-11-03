import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2,
  X,
  PlusCircle,
  Trash2,
  Save,
  User,
  Flag,
  ImageIcon,
  Calendar,
  MapPin
} from 'lucide-react';
import { updateElection } from '../services/api';

const UpdateElectionModal = ({
  isOpen,
  onClose,
  election,
  onUpdateSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    image: '',
    candidates: []
  });

  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (election) {
      setFormData({
        title: election.title || '',
        description: election.description || '',
        location: election.location || '',
        startDate: election.startDate ? new Date(election.startDate).toISOString().split('T')[0] : '',
        endDate: election.endDate ? new Date(election.endDate).toISOString().split('T')[0] : '',
        image: election.image || '',
        candidates: election.candidates || []
      });

      setCandidates(election.candidates.map(candidate => ({
        name: candidate.name,
        partyName: candidate.partyName,
        logo: candidate.logo,
        manifesto: candidate.manifesto || ''
      })));
    }
  }, [election]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index][field] = value;
    setCandidates(updatedCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, {
      name: '',
      partyName: '',
      logo: '',
      manifesto: ''
    }]);
  };

  const removeCandidate = (index) => {
    const updatedCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(updatedCandidates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        candidates: candidates.map(candidate => ({
          // Preserve existing ID if available
          ...(candidate._id && { _id: candidate._id }),
          name: candidate.name,
          partyName: candidate.partyName,
          logo: candidate.logo,
          manifesto: candidate.manifesto
        }))
      };

      const response = await updateElection(election._id, payload);
      onUpdateSuccess(response.election);
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Edit2 size={24} />
            <h2 className="text-2xl font-bold">Update Election</h2>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <User size={16} className="mr-2" /> Title
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <MapPin size={16} className="mr-2" /> Location
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
              <Edit2 size={16} className="mr-2" /> Description
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              required
              rows="3"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <ImageIcon size={16} className="mr-2" /> Image URL
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <Calendar size={16} className="mr-2" /> Start Date
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <Calendar size={16} className="mr-2" /> End Date
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Flag size={16} className="mr-2" /> Candidates
              </h3>
              <motion.button
                type="button"
                onClick={addCandidate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center text-xs md:text-md px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <PlusCircle size={16} className="mr-2" /> Add Candidate
              </motion.button>
            </div>
            <AnimatePresence>
              {candidates.map((candidate, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-4 p-4 border rounded-lg bg-white shadow-sm"
                >
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      placeholder="Candidate Name"
                      value={candidate.name}
                      onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      placeholder="Party Name"
                      value={candidate.partyName}
                      onChange={(e) => handleCandidateChange(index, 'partyName', e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                    <div className="flex space-x-2">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        placeholder="Logo URL"
                        value={candidate.logo}
                        onChange={(e) => handleCandidateChange(index, 'logo', e.target.value)}
                        className="flex-grow px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all mr-2"
                      />
                      <motion.button
                        type="button"
                        onClick={() => removeCandidate(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Manifesto</label>
                    <motion.textarea
                      whileFocus={{ scale: 1.02 }}
                      placeholder="Candidate Manifesto"
                      value={candidate.manifesto}
                      onChange={(e) => handleCandidateChange(index, 'manifesto', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                      rows="3"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} className="mr-2" /> Update Election
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateElectionModal;