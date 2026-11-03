import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { fetchElections } from '../services/api';
import UpdateElectionModal from '../components/UpdateElectionModal';
import DeleteElectionModal from '../components/DeleteElectionModal';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchData, setFetchData] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await fetchElections();
        setElections(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch elections:', error);
        setLoading(false);
      }
    };

    loadElections();
  }, [fetchData]);

  const handleUpdateClick = (election) => {
    setSelectedElection(election);
    setFetchData(prev => !prev);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (election) => {
    setSelectedElection(election);
    setFetchData(prev => !prev);
    setDeleteModalOpen(true);
  };

  const handleElectionClick = (electionId) => {
    navigate(`/elections/${electionId}`);
  };

  const handleUpdateSuccess = (updatedElection) => {
    setElections(prevElections =>
      prevElections.map(election =>
        election._id === updatedElection._id ? updatedElection : election
      )
    );
    setFetchData(prev => !prev);
    setUpdateModalOpen(false);
  };

  const handleDeleteSuccess = (deletedElectionId) => {
    setElections(prevElections =>
      prevElections.filter(election => election._id !== deletedElectionId)
    );
    setFetchData(prev => !prev);
    setDeleteModalOpen(false);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center h-screen bg-gray-50"
      >
        <motion.div
          animate={{
            rotate: 360,
            transition: {
              repeat: Infinity,
              duration: 1,
              ease: "linear"
            }
          }}
          className="p-4 bg-blue-500 rounded-full"
        >
          <RefreshCw size={48} color="white" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-8 text-gray-800 flex items-center"
      >
        Election Dashboard
      </motion.h1>

      {elections.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center text-gray-500 bg-white p-8 rounded-xl shadow-md"
        >
          <Users size={64} className="mx-auto mb-4 text-blue-500" />
          <p className="text-xl">No elections found. Create your first election!</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {elections.map((election) => (
              <motion.div
                key={election._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.12)"
                }}
                className="bg-white shadow-lg rounded-xl overflow-hidden relative cursor-pointer group"
                onClick={() => handleElectionClick(election._id)}
              >
                {election.image && (
                  <div className="relative">
                    <img
                      src={election.image}
                      alt={election.title}
                      className="w-full h-48 object-cover group-hover:brightness-90 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center justify-between">
                    {election.title}
                    <ChevronRight className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="text-gray-600 mb-3 line-clamp-2">{election.description}</p>

                  <div className="flex items-center text-gray-500 mb-3 space-x-2">
                    <MapPin size={16} />
                    <span>{election.location}</span>
                  </div>

                  <div className="flex items-center text-gray-500 mb-4 space-x-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(election.startDate).toLocaleDateString()} -
                      {new Date(election.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Users size={16} className="mr-2" /> Candidates
                    </h3>
                    {election.candidates && election.candidates.length > 0 ? (
                      <ul className="space-y-2">
                        {election.candidates.slice(0, 3).map((candidate, index) => (
                          <li
                            key={candidate._id || `candidate-${index}`}
                            className="flex items-center space-x-2"
                          >
                            {candidate.logo ? (
                              <img
                                src={candidate.logo}
                                alt={candidate.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users size={16} className="text-gray-500" />
                              </div>
                            )}
                            <span className="text-sm">
                              {candidate.name || 'N/A'} {candidate.partyName ? `- ${candidate.partyName}` : ''}
                            </span>
                          </li>
                        ))}
                        {election.candidates.length > 3 && (
                          <li className="text-gray-500 text-xs">
                            +{election.candidates.length - 3} more
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No candidates</p>
                    )}
                  </div>

                  <div className="flex justify-between mt-4 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateClick(election);
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <Edit2 size={16} className="mr-2" /> Update
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(election);
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Update Election Modal */}
      {selectedElection && updateModalOpen && (
        <UpdateElectionModal
          isOpen={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          election={selectedElection}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete Election Modal */}
      {selectedElection && deleteModalOpen && (
        <DeleteElectionModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          election={selectedElection}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </motion.div>
  );
};

export default DashboardPage;