import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const AnimatedEllipsis = () => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        repeatType: "reverse"
      }}
    >
      ...
    </motion.span>
  );
};

const PitchModal = ({ pitch, onClose, onNext, isOpen }) => {
  const { sendOutreach } = useApp();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [step, setStep] = useState('edit'); // edit | sending | sent

  useEffect(() => {
    if (pitch) {
      setSubject(pitch.subject);
      setBody(pitch.body);
      setStep('edit');
    }
  }, [pitch]);

  if (!pitch || !isOpen) return null;

  const handleSend = async () => {
    setStep('sending');
    try {
      await sendOutreach(pitch.outreachId, subject, body);
      setStep('sent');
    } catch (error) {
      alert('Failed to send email: ' + error.message);
      setStep('edit');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        
        {step === 'edit' && (
          <>
            <h2 className="text-3xl font-black text-black mb-6 uppercase italic tracking-tighter">EDIT AI PITCH</h2>

            <div className="mb-6 border-3 border-black p-4 bg-neo-yellow shadow-neo-hover">
              <h3 className="font-black text-black uppercase text-sm mb-1">Subject:</h3>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-transparent border-b-2 border-black font-bold text-black focus:outline-none"
              />
            </div>

            <div className="mb-6 border-3 border-black p-4 bg-white shadow-neo-hover">
              <h3 className="font-black text-black uppercase text-sm mb-1">Email Body:</h3>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                className="w-full bg-transparent font-bold text-black whitespace-pre-wrap leading-relaxed text-sm focus:outline-none resize-none"
                style={{ lineHeight: '1.6' }}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleSend}
                className="flex-1 bg-neo-green text-black font-black py-4 px-6 border-4 border-black shadow-neo hover:border-green-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase"
              >
                Send Email
              </button>
              <button
                onClick={onClose}
                className="bg-white text-black font-black py-4 px-8 border-4 border-black shadow-neo hover:border-gray-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {step === 'sending' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-black uppercase">
              Bribing the SMTP server<AnimatedEllipsis />
            </h2>
            <p className="font-bold uppercase text-xs mt-4">Consulting with the Outreach Agent</p>
          </div>
        )}

        {step === 'sent' && (
          <>
            <h2 className="text-3xl font-black text-black mb-6 uppercase italic tracking-tighter">SENT!</h2>
            
            <div className="bg-neo-green border-3 border-black p-4 mb-8 shadow-neo-hover">
              <p className="text-black font-black uppercase text-lg">🚀 MISSION ACCOMPLISHED!</p>
              <p className="text-black font-bold text-sm">Outreach agent has dispatched the message.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={onNext}
                className="flex-1 bg-neo-blue text-black font-black py-4 px-6 border-4 border-black shadow-neo hover:border-blue-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase"
              >
                Next Target →
              </button>
              <button
                onClick={onClose}
                className="bg-white text-black font-black py-4 px-8 border-4 border-black shadow-neo hover:border-gray-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase"
              >
                Close
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PitchModal;