const PitchModal = ({ pitch, onClose, onNext }) => {
  if (!pitch) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Personalized Pitch Generated</h2>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Subject:</h3>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{pitch.subject}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Email Body:</h3>
          <div className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {pitch.body}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-semibold">✓ Email sent successfully!</p>
          <p className="text-green-700 text-sm mt-1">Check your console/logs to see the email content.</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onNext}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Next Candidate →
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PitchModal;
