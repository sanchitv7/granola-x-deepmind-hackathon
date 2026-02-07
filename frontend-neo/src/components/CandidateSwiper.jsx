import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import CandidateCard from './CandidateCard';
import SwipeControls from './SwipeControls';
import StatsPanel from './StatsPanel';
import PitchModal from './PitchModal';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

const CandidateSwiper = () => {
  const {
    currentCandidate,
    stats,
    loading,
    pitch,
    fetchNextCandidate,
    acceptCandidate,
    rejectCandidate,
    sourceMoreCandidates
  } = useApp();

  const [showPitch, setShowPitch] = useState(false);
  const [sourcing, setSourcing] = useState(false);

  useEffect(() => {
    // Initial fetch
    fetchNextCandidate();
  }, []);

  useEffect(() => {
    // Show pitch modal when pitch is generated
    if (pitch) {
      setShowPitch(true);
    }
  }, [pitch]);

  const handleAccept = async () => {
    if (!currentCandidate || loading) return;
    try {
      await acceptCandidate(currentCandidate.candidate.id);
    } catch (error) {
      alert('Error accepting candidate: ' + error.message);
    }
  };

  const handleReject = async () => {
    if (!currentCandidate || loading) return;
    try {
      await rejectCandidate(currentCandidate.candidate.id);
    } catch (error) {
      alert('Error rejecting candidate: ' + error.message);
    }
  };

  const handleSourceMore = async () => {
    setSourcing(true);
    try {
      const result = await sourceMoreCandidates();
      alert(result.message);
    } catch (error) {
      alert('Error sourcing candidates: ' + error.message);
    } finally {
      setSourcing(false);
    }
  };

  const handleNextAfterAccept = async () => {
    setShowPitch(false);
    await fetchNextCandidate();
  };

  // Keyboard shortcuts
  useKeyboardShortcuts(handleReject, handleAccept, loading || showPitch);

  if (loading && !currentCandidate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="w-20 h-20 border-8 border-black border-b-neo-yellow animate-spin shadow-neo mb-8"></div>
        <h2 className="text-4xl font-black text-black uppercase italic mb-2 tracking-tighter">Summoning Talent...</h2>
        <p className="font-bold text-black uppercase">The swarm is scouring the internet. 30-60s remaining.</p>
      </div>
    );
  }

  if (!currentCandidate) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-8">
        <StatsPanel stats={stats} />
        <div className="bg-white border-4 border-black shadow-neo p-8 max-w-2xl w-full text-center transform -rotate-1">
          <h2 className="text-4xl font-black text-black mb-4 uppercase italic">OUT OF CANDIDATES!</h2>
          <p className="font-bold text-black mb-6 uppercase">You've exhausted the current batch. Need more fuel?</p>
          <button
            onClick={handleSourceMore}
            disabled={sourcing}
            className="w-full bg-neo-yellow text-black font-black text-2xl py-5 border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:bg-gray-400 uppercase"
          >
            {sourcing ? 'SOURCING...' : '🔄 CALL THE AGENTS AGAIN'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-8 pb-20">
      {/* Stats Panel */}
      <StatsPanel stats={stats} />

      {/* Source More Button (appears when running low) */}
      {stats.pending < 5 && (
        <button
          onClick={handleSourceMore}
          disabled={sourcing || loading}
          className="bg-neo-blue text-black font-black py-3 px-8 border-3 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:bg-gray-400 uppercase text-sm"
        >
          {sourcing ? 'Sourcing More...' : '⚡ Need more? Click to Source 25 more'}
        </button>
      )}

      {/* Candidate Card */}
      <CandidateCard
        candidate={currentCandidate.candidate}
        match={currentCandidate.match}
      />

      {/* Swipe Controls */}
      <SwipeControls
        onReject={handleReject}
        onAccept={handleAccept}
        disabled={loading}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 backdrop-blur-[2px]">
          <div className="bg-neo-yellow border-4 border-black p-8 shadow-neo text-center transform rotate-2">
            <div className="w-12 h-12 border-4 border-black border-b-neo-pink animate-spin mx-auto mb-4"></div>
            <p className="font-black text-black uppercase tracking-widest">Processing Fit...</p>
          </div>
        </div>
      )}

      {/* Pitch Modal */}
      <PitchModal
        pitch={pitch}
        onClose={() => setShowPitch(false)}
        onNext={handleNextAfterAccept}
      />

      {/* Keyboard Shortcuts Help */}
      <div className="bg-black text-white px-4 py-2 font-bold uppercase text-xs tracking-widest transform -rotate-1">
        SHORTCUTS: ← REJECT | → ACCEPT | ENTER ACCEPT
      </div>
    </div>
  );
};

export default CandidateSwiper;