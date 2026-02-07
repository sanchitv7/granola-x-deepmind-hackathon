const SwipeControls = ({ onReject, onAccept, disabled }) => {
  return (
    <div className="flex justify-center gap-8 mt-12">
      <button
        onClick={onReject}
        disabled={disabled}
        className="group relative bg-neo-pink border-4 border-black text-black font-black py-4 px-10 shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:bg-gray-400 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
      >
        <span className="text-5xl block transform group-hover:rotate-12 transition-transform">✗</span>
        <span className="block text-lg uppercase mt-1">REJECT</span>
        <span className="block text-xs uppercase opacity-70">(Left Arrow)</span>
      </button>
      
      <button
        onClick={onAccept}
        disabled={disabled}
        className="group relative bg-neo-green border-4 border-black text-black font-black py-4 px-10 shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:bg-gray-400 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
      >
        <span className="text-5xl block transform group-hover:-rotate-12 transition-transform">✓</span>
        <span className="block text-lg uppercase mt-1">ACCEPT</span>
        <span className="block text-xs uppercase opacity-70">(Right Arrow)</span>
      </button>
    </div>
  );
};

export default SwipeControls;