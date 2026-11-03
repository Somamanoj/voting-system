import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Vote, Clock, MapPin } from 'lucide-react';
import { fetchElections } from '../services/api';

// Variants for animations
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

// Elections List Page
export default function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await fetchElections();
        setElections(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch elections', error);
        setLoading(false);
      }
    };

    loadElections();
  }, []);

  const handleElectionClick = (electionId) => {
    navigate(`/elections/${electionId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 mt-14">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold text-gray-900 mb-2"
          >
            <span className="inline-block">Ongoing </span>
            <span className="inline-block font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent px-4 leading-relaxed py-1">
              Elections
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Explore and participate in Ongoing elections across various regions.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {elections.map((election) => (
            <motion.div
              key={election._id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="relative">
                <img
                  src={election.image || '/placeholder-election.jpg'}
                  alt={election.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-800">
                  <Vote size={16} className="inline mr-2 text-blue-600" />
                  Election
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {election.title}
                </h2>

                <div className="flex items-center text-gray-600 mb-2">
                  <Clock size={18} className="mr-2 text-blue-500" />
                  <span>
                    {new Date(election.startDate).toLocaleDateString()}
                    {' - '}
                    {new Date(election.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin size={18} className="mr-2 text-blue-500" />
                  <span>{election.location}</span>
                </div>

                <p className="text-gray-500 mb-6 line-clamp-3">
                  {election.description}
                </p>

                <button
                  onClick={() => handleElectionClick(election._id)}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  View Candidates
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

