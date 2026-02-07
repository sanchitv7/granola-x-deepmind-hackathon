const SwipeControls = ({ onReject, onAccept, disabled }) => {
  return (
    <div className="flex justify-center gap-8 mt-8">
      <button
        onClick={onReject}
        disabled={disabled}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span className="text-3xl">✗</span>
        <span className="block text-sm mt-1">Reject (←)</span>
      </button>
      <button
        onClick={onAccept}
        disabled={disabled}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span className="text-3xl">✓</span>
        <span className="block text-sm mt-1">Accept (→)</span>
      </button>
    </div>
  );
};

export default SwipeControls;
