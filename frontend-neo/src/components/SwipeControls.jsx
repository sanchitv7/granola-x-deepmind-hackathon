const SwipeControls = ({ onReject, onAccept, disabled }) => {
  return (
    <div className="flex justify-center gap-6 px-4">
      <button
        onClick={onReject}
        disabled={disabled}
        className="group relative bg-neo-pink border-4 border-black text-black font-black py-3 px-8 shadow-neo hover:border-red-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:bg-gray-400 disabled:shadow-none"
      >
        <span className="text-3xl block">✗</span>
        <span className="block text-xs uppercase mt-1">REJECT (←)</span>
      </button>

      <button
        onClick={onAccept}
        disabled={disabled}
        className="group relative bg-neo-green border-4 border-black text-black font-black py-3 px-8 shadow-neo hover:border-green-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:bg-gray-400 disabled:shadow-none"
      >
        <span className="text-3xl block">✓</span>
        <span className="block text-xs uppercase mt-1">ACCEPT (→)</span>
      </button>
    </div>
  );
};

export default SwipeControls;