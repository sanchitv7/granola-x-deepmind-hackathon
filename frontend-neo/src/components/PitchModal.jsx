const PitchModal = ({ pitch, onClose, onNext }) => {
  if (!pitch) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <h2 className="text-3xl font-black text-black mb-6 uppercase italic tracking-tighter">AI PITCH GENERATED!</h2>

        <div className="mb-6 border-3 border-black p-4 bg-neo-yellow shadow-neo-hover">
          <h3 className="font-black text-black uppercase text-sm mb-1">Subject:</h3>
          <p className="font-bold text-black">{pitch.subject}</p>
        </div>

        <div className="mb-6 border-3 border-black p-4 bg-white shadow-neo-hover">
          <h3 className="font-black text-black uppercase text-sm mb-1">Email Body:</h3>
          <div className="font-bold text-black whitespace-pre-wrap leading-tight">
            {pitch.body}
          </div>
        </div>

        <div className="bg-neo-green border-3 border-black p-4 mb-8 shadow-neo-hover">
          <p className="text-black font-black uppercase text-lg">🚀 MISSION ACCOMPLISHED!</p>
          <p className="text-black font-bold text-sm">Outreach agent has dispatched the message. (Check console logs)</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={onNext}
            className="flex-1 bg-neo-blue text-black font-black py-4 px-6 border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase"
          >
            Next Target →
          </button>
          <button
            onClick={onClose}
            className="bg-white text-black font-black py-4 px-8 border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default PitchModal;