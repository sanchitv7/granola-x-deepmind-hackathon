const CandidateCard = ({ candidate, match }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-neo-green';
    if (score >= 60) return 'bg-neo-yellow';
    return 'bg-neo-pink';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Weak Match';
  };

  return (
    <div className="bg-white border-4 border-black shadow-neo p-8 max-w-2xl w-full">
      {/* Score Badge */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-4xl font-black text-black uppercase tracking-tight">{candidate.name}</h2>
          <p className="text-xl font-bold text-black mt-1 uppercase italic">
            {candidate.current_role} @ {candidate.current_company}
          </p>
        </div>
        <div className="text-right">
          <div className={`${getScoreColor(match.score)} border-4 border-black text-black px-4 py-2 font-black text-3xl shadow-neo`}>
            {match.score}
          </div>
          <p className="text-sm font-black text-black mt-2 uppercase">{getScoreLabel(match.score)}</p>
        </div>
      </div>

      {/* Experience and Location */}
      <div className="flex gap-4 mb-6 text-black">
        <div className="bg-neo-blue border-3 border-black px-3 py-1 font-bold shadow-neo-hover">
          📅 {candidate.years_experience} YEARS
        </div>
        <div className="bg-neo-yellow border-3 border-black px-3 py-1 font-bold shadow-neo-hover">
          📍 {candidate.location}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="font-black text-black mb-2 uppercase italic">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-white border-2 border-black px-3 py-1 font-bold text-sm uppercase"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* LinkedIn Summary */}
      <div className="mb-6">
        <h3 className="font-black text-black mb-2 uppercase italic">Background</h3>
        <p className="font-bold text-black leading-relaxed border-l-4 border-black pl-4">{candidate.linkedin_summary}</p>
      </div>

      {/* Key Highlights */}
      <div className="mb-6">
        <h3 className="font-black text-black mb-3 uppercase italic">Why They Fit</h3>
        <ul className="space-y-2">
          {match.key_highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="bg-neo-green border-2 border-black px-1 font-black leading-none">✓</span>
              <span className="font-bold text-black">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fit Reasoning */}
      <div className="bg-neo-blue/20 border-3 border-black p-4">
        <h3 className="font-black text-black mb-2 uppercase">Assessment</h3>
        <p className="font-bold text-black leading-relaxed italic">"{match.fit_reasoning}"</p>
      </div>
    </div>
  );
};

export default CandidateCard;