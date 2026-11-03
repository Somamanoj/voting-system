import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchElections } from "../services/api"; // Import the fetchElections service

const ElectionSection = () => {
  const [elections, setElections] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardRef = useRef(null);

  // Animation variants (same as before)
  const headingVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  const carouselVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Fetch elections on component mount
  useEffect(() => {
    const loadElections = async () => {
      try {
        setIsLoading(true);
        const fetchedElections = await fetchElections();
        setElections(fetchedElections);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    loadElections();
  }, []);

  // Card width calculation useEffect (same as before)
  useEffect(() => {
    const updateCardWidth = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth;
        const gap = 24;
        setCardWidth(width + gap);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Carousel auto-advance useEffect (same as before)
  useEffect(() => {
    if (!isPaused && cardWidth > 0 && elections.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % elections.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isPaused, cardWidth, elections.length]);

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + elections.length) % elections.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % elections.length);
  };

  // Loading and error states
  if (isLoading) {
    return (
      <section className="relative py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">Loading elections...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">Error loading elections: {error.message}</p>
        </div>
      </section>
    );
  }

  if (elections.length === 0) {
    return (
      <section className="relative py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">No Ongoing elections found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl flex flex-wrap items-baseline justify-center md:text-5xl font-bold text-gray-900"
            variants={headingVariants}
          >
            <span className="inline-block">Ongoing </span>
            <span className="inline-block font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent px-4 leading-relaxed py-1">
              Elections
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            variants={textVariants}
          >
            Stay informed about the latest electoral developments and candidates
          </motion.p>
        </motion.div>

        <motion.div
          className="relative"
          variants={carouselVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="relative h-[500px] md:px-12">
            <div className="h-full flex items-center overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: -currentIndex * cardWidth,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                {elections.concat(elections.slice(0, 2)).map((election, index) => (
                  <motion.div
                    key={`election-${election._id || index}`}
                    ref={index === 0 ? cardRef : null}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="flex-shrink-0 w-full md:w-auto"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ElectionCard election={election} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="absolute inset-0 flex items-center justify-between pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={handlePrevious}
                className="pointer-events-auto z-20 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors transform -translate-x-1/2"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={handleNext}
                className="pointer-events-auto z-20 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors transform translate-x-1/2"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-0 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex justify-center gap-2">
              {elections.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => {
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-emerald-600" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ElectionCard = ({ election }) => {
  // Ensure candidates exist and sort them
  const sortedCandidates = election.candidates ?
    election.candidates.sort((a, b) => b.votesCount - a.votesCount)
    : [];

  const totalVotes = sortedCandidates.reduce((sum, candidate) => sum + candidate.votesCount, 0);

  return (
    <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-emerald-100 transition-all duration-500 hover:shadow-md flex flex-col w-96">
      <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden">
        <img
          src={election.image || "/placeholder-election.jpg"}
          alt={election.title || "Election Image"}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {election.title || 'Untitled Election'}
      </h3>
      <p className="text-gray-600 mb-4 flex-grow line-clamp-4 h-[4.5rem]">
        {election.description || 'No description available.'}
      </p>

      <div className="mb-4">
        <h4 className="text-md font-semibold text-emerald-600 mb-2">Top Candidates</h4>
        <div className="flex space-x-2 h-16">
          {(sortedCandidates.length > 0 ? sortedCandidates.slice(0, 3) : [{ name: 'N/A' }, { name: 'N/A' }, { name: 'N/A' }]).map((candidate, index) => (
            <div
              key={candidate._id || index}
              className="flex flex-col items-center"
              title={`${candidate.name} - ${candidate.partyName || 'Unknown Party'}`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                {candidate.logo ? (
                  <img
                    src={candidate.logo}
                    alt={candidate.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-emerald-600 font-bold text-sm">
                    {candidate.name ? candidate.name.charAt(0) : '?'}
                  </span>
                )}
              </div>
              {/* <span className="text-xs text-gray-600 mt-1">
                {totalVotes > 0 && candidate.votesCount
                  ? ((candidate.votesCount / totalVotes) * 100).toFixed(1)
                  : '0.0'}%
              </span> */}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex justify-between text-sm text-gray-500">
        <div>
          <span className="font-medium text-emerald-600">Location:</span> {election.location || 'Not Specified'}
        </div>
        <div>
          <span className="font-medium text-emerald-600">Date:</span>{" "}
          {election.startDate
            ? new Date(election.startDate).toLocaleDateString()
            : 'TBA'}
        </div>
      </div>
    </div>
  );
};


export default ElectionSection;