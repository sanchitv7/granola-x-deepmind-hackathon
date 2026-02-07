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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600 text-lg">AI is sourcing candidates...</p>
        <p className="mt-2 text-gray-500 text-sm">This may take 30-60 seconds</p>
      </div>
    );
  }

  if (!currentCandidate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <StatsPanel stats={stats} />
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No More Candidates</h2>
          <p className="text-gray-600 mb-6">You've reviewed all available candidates.</p>
          <button
            onClick={handleSourceMore}
            disabled={sourcing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {sourcing ? 'Sourcing...' : 'Source More Candidates'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      {/* Stats Panel */}
      <StatsPanel stats={stats} />

      {/* Source More Button (appears when running low) */}
      {stats.pending < 5 && (
        <button
          onClick={handleSourceMore}
          disabled={sourcing || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {sourcing ? 'Sourcing New Candidates...' : '🔄 Source More Candidates'}
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">Processing...</p>
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
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Keyboard shortcuts: ← or X to reject | → or Enter to accept</p>
      </div>
    </div>
  );
};

export default CandidateSwiper;
