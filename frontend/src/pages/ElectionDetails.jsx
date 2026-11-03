import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Vote } from 'lucide-react';
import { fetchElectionById } from '../services/api.js';
import VoteModal from '../components/VoteModal.jsx';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../store/userSlice.js';

export default function ElectionDetails() {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector((state) => state.user.user);
  const electionId = window.location.pathname.split('/').pop();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    const loadElectionDetails = async () => {
      try {
        const data = await fetchElectionById(electionId);
        console.log(data)
        setElection(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch election details', error);
        setLoading(false);
      }
    };

    loadElectionDetails();
  }, [electionId]);

  const handleVoteTrigger = (candidate) => {
    if (!isLoggedIn || !user) {
      navigate('/login');
      return;
    }

    setSelectedCandidate(candidate);
    setIsVoteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 mt-14">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {election.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {election.description}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {election.candidates.map((candidate) => (
            <motion.div
              key={candidate._id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="relative">
                <img
                  src={candidate.logo || '/placeholder-candidate.jpg'}
                  alt={candidate.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-800">
                  {candidate.partyName}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {candidate.name}
                </h2>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Manifesto
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {candidate.manifesto}
                  </p>
                </div>

                <button
                  onClick={() => handleVoteTrigger(candidate)}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  <Vote size={20} className="mr-2" />
                  Vote Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {isVoteModalOpen && selectedCandidate && (
        <VoteModal
          candidate={selectedCandidate}
          electionId={electionId}
          isOpen={isVoteModalOpen}
          onClose={() => setIsVoteModalOpen(false)}
        />
      )}
    </div>
  );
}