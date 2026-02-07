const CandidateCard = ({ candidate, match }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Weak Match';
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
      {/* Score Badge */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{candidate.name}</h2>
          <p className="text-lg text-gray-600 mt-1">
            {candidate.current_role} at {candidate.current_company}
          </p>
        </div>
        <div className="text-right">
          <div className={`${getScoreColor(match.score)} text-white px-4 py-2 rounded-lg font-bold text-xl`}>
            {match.score}
          </div>
          <p className="text-sm text-gray-600 mt-1">{getScoreLabel(match.score)}</p>
        </div>
      </div>

      {/* Experience and Location */}
      <div className="flex gap-4 mb-6 text-gray-700">
        <div className="flex items-center gap-2">
          <span className="font-semibold">📅</span>
          <span>{candidate.years_experience} years experience</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">📍</span>
          <span>{candidate.location}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* LinkedIn Summary */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Background</h3>
        <p className="text-gray-700 leading-relaxed">{candidate.linkedin_summary}</p>
      </div>

      {/* Key Highlights */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Why They're a Good Fit</h3>
        <ul className="space-y-2">
          {match.key_highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span className="text-gray-700">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fit Reasoning */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Overall Assessment</h3>
        <p className="text-gray-700 leading-relaxed">{match.fit_reasoning}</p>
      </div>
    </div>
  );
};

export default CandidateCard;
