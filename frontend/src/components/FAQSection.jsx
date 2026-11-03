import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Mock FAQ Data for Online Voting Platform
const faqs = [
  {
    category: 'Voting Process',
    question: 'How do I register to vote online?',
    answer: 'To register to vote online, visit our official website and complete the digital registration form. You\'ll need to provide your personal information, proof of citizenship, and verify your identity through our secure authentication process.'
  },
  {
    category: 'Voting Process',
    question: 'What are the eligibility requirements for voting?',
    answer: 'To be eligible to vote, you must be a registered citizen, at least 18 years old on election day, and meet your jurisdiction\'s residency requirements. Some locations may have additional specific criteria.'
  },
  {
    category: 'Election Security',
    question: 'How secure is online voting?',
    answer: 'Our online voting platform uses end-to-end encryption, multi-factor authentication, and blockchain technology to ensure the highest level of security. Each vote is anonymized and verified through a rigorous verification process.'
  },
  {
    category: 'Election Security',
    question: 'Can I be sure my vote is counted correctly?',
    answer: 'Yes. Our system provides a unique verification code for each vote. You can independently verify that your vote was recorded accurately without compromising the anonymity of your ballot.'
  },
  {
    category: 'Accessibility',
    question: 'Are there accommodations for voters with disabilities?',
    answer: 'Our platform is fully accessible, with screen reader compatibility, high-contrast modes, and assistive technology support to ensure all eligible voters can participate easily and independently.'
  },
  {
    category: 'Voting Process',
    question: 'What if I miss the voter registration deadline?',
    answer: 'If you miss the standard registration deadline, check if your jurisdiction offers same-day voter registration. Alternatively, you may be able to cast a provisional ballot or register for upcoming elections.'
  },
  {
    category: 'Election Information',
    question: 'How do I find information about candidates?',
    answer: 'Our platform provides comprehensive candidate profiles, including their background, political platforms, previous experience, and stance on key issues. You can compare candidates side-by-side to make an informed decision.'
  }
];

export default function VotingFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));
  const filteredFaqs = selectedCategory ? faqs.filter(faq => faq.category === selectedCategory) : faqs;

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <section className="relative min-h-screen py-24 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl flex flex-wrap justify-center md:text-5xl font-bold text-gray-900 mb-4">
            <span>Voting</span>
            <span className="font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-4">Questions</span>
            <span>Answered</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get clarity on voting processes, security, and your rights as a voter
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4 items-center"
          >
            <div className="w-full overflow-x-auto pb-2 -mb-2">
              <div className="flex pt-2 gap-3 min-w-min px-4 md:justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border border-blue-100
                    ${!selectedCategory
                      ? 'border border-blue-600 shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  All
                </button>
                {categories.map((category, index) => (
                  <button
                    type="button"
                    key={`category-${index}`}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border border-blue-100
                      ${selectedCategory === category
                        ? 'border border-blue-600 shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={`faq-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                layout
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-blue-600 shrink-0"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </motion.span>
                </button>

                {/* Answer container */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.3 }, opacity: { duration: 0.2 } }}
                      layout
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 mt-2 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}