import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Vote } from 'lucide-react';

const HeroSection = () => {
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

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative pt-14 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4">
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-200 bg-white/50 backdrop-blur-sm mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Vote size={16} className="text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-800">
              Transforming Democratic Participation
            </span>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center mb-8"
            variants={containerVariants}
          >
            <motion.span
              className="text-5xl md:text-7xl font-bold tracking-tight"
              variants={itemVariants}
            >
              Empower Your
            </motion.span>
            <motion.div className="relative">
              <motion.span
                className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-4"
                variants={itemVariants}
              >
                Democratic
              </motion.span>
            </motion.div>
            <motion.span
              className="text-5xl md:text-7xl font-bold tracking-tight"
              variants={itemVariants}
            >
              Voice
            </motion.span>
          </motion.div>

          <motion.p
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-12"
            variants={itemVariants}
          >
            Secure, transparent, and accessible digital voting platform that
            makes civic engagement easier and more meaningful than ever before.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={containerVariants}
          >
            <motion.button
              className="group flex justify-center items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/elections'}
            >
              Explore Elections
              <ArrowRight
                size={24}
                strokeWidth={2}
                className="ml-2 transform transition-all duration-300 ease-in-out group-hover:translate-x-2 group-hover:[stroke-width:2.5]"
              />
            </motion.button>
            <motion.button
              className="flex justify-center items-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-full hover:bg-gray-50 transition-colors border border-gray-200"
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;