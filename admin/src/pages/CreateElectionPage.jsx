import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Calendar,
  MapPin,
  FileText,
  Image,
  Save,
  X
} from 'lucide-react';
import CandidateForm from '../components/CandidateForm';
import { createElection } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateElectionPage = () => {
  const [electionDetails, setElectionDetails] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    image: null
  });
  const [candidates, setCandidates] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleElectionDetailsChange = (e) => {
    const { name, value } = e.target;
    setElectionDetails(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleAddCandidate = (candidate) => {
    setCandidates(prev => [...prev, candidate]);
  };

  const handleRemoveCandidate = (index) => {
    setCandidates(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};

    if (!electionDetails.title) errors.title = 'Election title is required';
    if (!electionDetails.location) errors.location = 'Location is required';
    if (!electionDetails.startDate) errors.startDate = 'Start date is required';
    if (!electionDetails.endDate) errors.endDate = 'End date is required';

    if (candidates.length === 0) errors.candidates = 'At least one candidate is required';

    // Date validation
    if (electionDetails.startDate && electionDetails.endDate) {
      if (new Date(electionDetails.startDate) > new Date(electionDetails.endDate)) {
        errors.endDate = 'End date must be after start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const completeElectionData = {
        ...electionDetails,
        candidates
      };

      const response = await createElection(completeElectionData);
      console.log('Election created successfully:', response);

      // Reset form
      setElectionDetails({
        title: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        image: null
      });
      setCandidates([]);
      navigate('/');
    } catch (error) {
      console.error('Error creating election:', error);
      alert('Failed to create election');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-8 text-center text-gray-800"
      >
        Create New Election
      </motion.h1>

      <div className="flex justify-center align-center w-full">
        {/* Election Details Form */}
        <motion.form
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 w-[50vw] bg-white p-8 rounded-xl shadow-2xl order-1 lg:order-1"
        >
          {/* Title Input */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="mr-2 text-indigo-500" size={20} />
              Election Title *
            </label>
            <input
              type="text"
              name="title"
              value={electionDetails.title}
              onChange={handleElectionDetailsChange}
              className={`block w-full rounded-md border ${formErrors.title
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'
                } shadow-sm focus:ring focus:ring-opacity-50 border border-gray-500 p-2`}
            />
            {formErrors.title && (
              <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="mr-2 text-indigo-500" size={20} />
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={electionDetails.description}
              onChange={handleElectionDetailsChange}
              className="block w-full rounded-mdshadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-gray-500 p-2"
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="mr-2 text-indigo-500" size={20} />
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={electionDetails.location}
              onChange={handleElectionDetailsChange}
              className={`block w-full rounded-md border ${formErrors.location
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'
                } shadow-sm focus:ring focus:ring-opacity-50 border border-gray-500 p-2`}
            />
            {formErrors.location && (
              <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
            )}
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="mr-2 text-indigo-500" size={20} />
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={electionDetails.startDate}
                onChange={handleElectionDetailsChange}
                className={`block w-full rounded-md border ${formErrors.startDate
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'
                  } shadow-sm focus:ring focus:ring-opacity-50 border border-gray-500 p-2`}
              />
              {formErrors.startDate && (
                <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="mr-2 text-indigo-500" size={20} />
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={electionDetails.endDate}
                onChange={handleElectionDetailsChange}
                className={`block w-full rounded-md border ${formErrors.endDate
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'
                  } shadow-sm focus:ring focus:ring-opacity-50 border border-gray-500 p-2`}
              />
              {formErrors.endDate && (
                <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>
              )}
            </div>
          </div>

          {/* Image URL Input */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Image className="mr-2 text-indigo-500" size={20} />
              Election Image (Optional)
            </label>
            <input
              type="url"
              name="image"
              value={electionDetails.image || ''}
              onChange={handleElectionDetailsChange}
              placeholder="https://example.com/image.jpg"
              className="block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-gray-500 p-2"
            />
          </div>
        </motion.form>
      </div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-6 order-2 lg:order-2"
      >
        <CandidateForm onAddCandidate={handleAddCandidate} />

        {/* Candidate List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-2xl"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Plus className="mr-2 text-green-500" size={24} />
            Added Candidates
          </h2>

          {formErrors.candidates && (
            <p className="text-red-500 text-xs mb-4">{formErrors.candidates}</p>
          )}

          <AnimatePresence>
            {candidates.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center"
              >
                No candidates added yet
              </motion.p>
            ) : (
              <ul className="space-y-3">
                {candidates.map((candidate, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-md"
                  >
                    <span className="flex-grow">{candidate.name} - {candidate.partyName}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCandidate(index)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-102"
        >
          <Save className="mr-2" size={24} />
          Create Election
        </button>
      </motion.div>
    </motion.div>
  );
};

export default CreateElectionPage;