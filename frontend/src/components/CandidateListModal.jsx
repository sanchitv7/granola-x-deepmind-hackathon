import { motion, AnimatePresence } from 'framer-motion';

const CandidateListModal = ({ isOpen, onClose, candidates, statusType, onCandidateClick }) => {
  const statusColors = {
    'accepted': 'bg-neo-green',
    'rejected': 'bg-neo-pink',
    'contacted': 'bg-neo-blue',
    'pending': 'bg-neo-yellow',
    'viewed': 'bg-white'
  };

  const statusColor = statusColors[statusType] || 'bg-neo-yellow';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`${statusColor} border-4 border-black shadow-neo w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b-4 border-black bg-black text-white">
              <h2 className="font-black text-2xl uppercase tracking-tight">
                {statusType} ({candidates.length})
              </h2>
              <button
                onClick={onClose}
                className="bg-neo-pink border-3 border-white px-4 py-2 font-black text-xl hover:border-red-400 active:scale-95 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Candidate list - scrollable */}
            <div className="overflow-y-auto p-6 space-y-3 flex-1">
              {candidates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-black text-xl uppercase opacity-60">No candidates in this category</p>
                </div>
              ) : (
                candidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    onClick={() => onCandidateClick(candidate.id)}
                    className="w-full border-3 border-black bg-white p-4 shadow-neo hover:border-gray-600 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all text-left"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="font-black text-lg mb-1">{candidate.name}</div>
                        <div className="text-sm font-bold opacity-80">{candidate.current_role}</div>
                        <div className="text-xs font-bold opacity-60">{candidate.current_company}</div>
                      </div>
                      <div className="text-right">
                        <div className={`${candidate.score >= 80 ? 'bg-neo-green' : candidate.score >= 60 ? 'bg-neo-yellow' : 'bg-neo-pink'} border-2 border-black px-3 py-1 font-black text-xl`}>
                          {candidate.score}
                        </div>
                        <div className="text-[10px] font-black mt-1 uppercase">Score</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CandidateListModal;
