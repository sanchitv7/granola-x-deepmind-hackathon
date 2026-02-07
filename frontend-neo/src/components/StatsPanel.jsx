import { motion, AnimatePresence } from 'framer-motion';

const StatsPanel = ({ stats, expandedStatus, onStatClick, candidates, onCandidateClick }) => {
  const statusColors = {
    'accepted': 'bg-neo-green',
    'rejected': 'bg-neo-pink',
    'contacted': 'bg-neo-blue',
    'pending': 'bg-neo-yellow',
    'viewed': 'bg-white'
  };

  const isExpanded = (status) => expandedStatus === status;

  return (
    <div className="w-full max-w-6xl">
      {/* Stats Grid */}
      <div className="bg-white border-4 border-black shadow-neo p-3">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <button
            onClick={() => onStatClick('total')}
            className="bg-white border-3 border-black p-2 text-center shadow-neo hover:border-gray-600 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <div className="text-xl font-black text-black">{stats.total}</div>
            <div className="text-[9px] font-black uppercase text-black">Sourced</div>
          </button>
          <button
            onClick={() => onStatClick('accepted')}
            className={`bg-neo-green border-3 border-black p-2 text-center shadow-neo hover:border-green-700 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${isExpanded('accepted') ? 'ring-2 ring-black' : ''}`}
          >
            <div className="text-xl font-black text-black">{stats.accepted}</div>
            <div className="text-[9px] font-black uppercase text-black">Accepted {isExpanded('accepted') ? '▼' : ''}</div>
          </button>
          <button
            onClick={() => onStatClick('rejected')}
            className={`bg-neo-pink border-3 border-black p-2 text-center shadow-neo hover:border-red-600 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${isExpanded('rejected') ? 'ring-2 ring-black' : ''}`}
          >
            <div className="text-xl font-black text-black">{stats.rejected}</div>
            <div className="text-[9px] font-black uppercase text-black">Rejected {isExpanded('rejected') ? '▼' : ''}</div>
          </button>
          <button
            onClick={() => onStatClick('contacted')}
            className={`bg-neo-blue border-3 border-black p-2 text-center shadow-neo hover:border-blue-700 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${isExpanded('contacted') ? 'ring-2 ring-black' : ''}`}
          >
            <div className="text-xl font-black text-black">{stats.contacted}</div>
            <div className="text-[9px] font-black uppercase text-black">Contacted {isExpanded('contacted') ? '▼' : ''}</div>
          </button>
          <button
            onClick={() => onStatClick('pending')}
            className={`bg-neo-yellow border-3 border-black p-2 text-center shadow-neo hover:border-yellow-600 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${isExpanded('pending') ? 'ring-2 ring-black' : ''}`}
          >
            <div className="text-xl font-black text-black">{stats.pending}</div>
            <div className="text-[9px] font-black uppercase text-black">Queue {isExpanded('pending') ? '▼' : ''}</div>
          </button>
          <button
            onClick={() => onStatClick('viewed')}
            className={`bg-white border-3 border-black p-2 text-center shadow-neo hover:border-gray-600 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${isExpanded('viewed') ? 'ring-2 ring-black' : ''}`}
          >
            <div className="text-xl font-black text-black">{stats.viewed}</div>
            <div className="text-[9px] font-black uppercase text-black">Viewed {isExpanded('viewed') ? '▼' : ''}</div>
          </button>
        </div>
      </div>

      {/* Dropdown List */}
      <AnimatePresence>
        {expandedStatus && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`${statusColors[expandedStatus] || 'bg-white'} border-4 border-t-0 border-black shadow-neo p-3 max-h-60 overflow-y-auto`}>
              {candidates.length === 0 ? (
                <div className="text-center py-6">
                  <p className="font-black text-sm uppercase opacity-60">No candidates in this category</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {candidates.map((candidate) => (
                    <button
                      key={candidate.id}
                      onClick={() => onCandidateClick(candidate.id)}
                      className="w-full border-3 border-black bg-white p-2 shadow-neo hover:border-gray-600 active:translate-y-[1px] active:shadow-none transition-all text-left"
                    >
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-sm truncate">{candidate.name}</div>
                          <div className="text-[10px] font-bold opacity-70 truncate">{candidate.current_role}</div>
                        </div>
                        <div className={`${candidate.score >= 80 ? 'bg-neo-green' : candidate.score >= 60 ? 'bg-neo-yellow' : 'bg-neo-pink'} border-2 border-black px-2 py-1 font-black text-sm shrink-0`}>
                          {candidate.score}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatsPanel;